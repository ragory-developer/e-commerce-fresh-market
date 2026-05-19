import type { BuilderSectionStyles } from "./types";

export const spacingTopMap: Record<NonNullable<BuilderSectionStyles["spacingTop"]>, string> = {
  none: "pt-0",
  sm: "pt-4 sm:pt-6",
  md: "pt-8 sm:pt-12",
  lg: "pt-16 sm:pt-20",
  xl: "pt-24 sm:pt-32",
};

export const spacingBottomMap: Record<NonNullable<BuilderSectionStyles["spacingBottom"]>, string> = {
  none: "pb-0",
  sm: "pb-4 sm:pb-6",
  md: "pb-8 sm:pb-12",
  lg: "pb-16 sm:pb-20",
  xl: "pb-24 sm:pb-32",
};

export const backgroundMap: Record<NonNullable<BuilderSectionStyles["background"]>, string> = {
  white: "bg-white text-gray-900",
  gray: "bg-gray-50 text-gray-900",
  brand: "bg-emerald-50 text-gray-900",
  dark: "bg-gray-900 text-white",
};

export const containerMap: Record<NonNullable<BuilderSectionStyles["container"]>, string> = {
  full: "w-full",
  contained: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
  narrow: "mx-auto w-full max-w-3xl px-4 sm:px-6",
};

export function resolveStyleClasses(styles?: BuilderSectionStyles): string {
  if (!styles) return "";
  
  const classes: string[] = [];
  
  if (styles.spacingTop && spacingTopMap[styles.spacingTop]) {
    classes.push(spacingTopMap[styles.spacingTop]);
  }
  if (styles.spacingBottom && spacingBottomMap[styles.spacingBottom]) {
    classes.push(spacingBottomMap[styles.spacingBottom]);
  }
  if (styles.background && backgroundMap[styles.background]) {
    classes.push(backgroundMap[styles.background]);
  }
  if (styles.container && containerMap[styles.container]) {
    classes.push(containerMap[styles.container]);
  }
  
  return classes.join(" ");
}
