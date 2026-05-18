import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  // Use BDT format with Taka symbol ৳
  return `৳${amount.toFixed(2)}`;
}

/**
 * Calculates the active price for a product or variant,
 * taking into account special prices and active date ranges.
 */
export function getActivePrice(item: any): number {
  if (!item) return 0;
  
  const now = new Date();
  const price = item.price || 0;
  const specialPrice = item.specialPrice;
  const start = item.specialPriceStart ? new Date(item.specialPriceStart) : null;
  const end = item.specialPriceEnd ? new Date(item.specialPriceEnd) : null;

  const isActive = 
    specialPrice !== undefined && 
    specialPrice !== null && 
    (start === null || start <= now) && 
    (end === null || end >= now);

  return isActive ? specialPrice : price;
}
