import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  name: string;
  imageSrc: string;
  itemCount?: number;
  href: string;
  color?: string; // Tailwind color class for hover effect
}

export default function CategoryCard({ name, imageSrc, itemCount, href, color = "group-hover:text-primary" }: CategoryCardProps) {
  return (
    <Link href={href} className="group flex flex-col items-center gap-4 text-center">
      <div className="w-full aspect-square rounded-[2rem] bg-white dark:bg-gray-800 flex items-center justify-center p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent dark:from-gray-700/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-full h-full">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
        </div>
      </div>
      <div>
        <h3 className={`font-black text-lg text-gray-900 dark:text-white transition-colors ${color}`}>{name}</h3>
        {itemCount !== undefined && (
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{itemCount} items</p>
        )}
      </div>
    </Link>
  );
}
