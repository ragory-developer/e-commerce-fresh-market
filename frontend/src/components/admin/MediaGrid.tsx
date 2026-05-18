"use client";
import { API_URL } from "@/lib/config";


interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  altText: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
  urlThumbnail: string;
  urlMedium: string;
  urlFull: string;
  createdAt: string;
}

interface MediaGridProps {
  items: MediaItem[];
  selectedIds?: string[];
  onSelect: (item: MediaItem) => void;
  loading?: boolean;
}

export type { MediaItem };

export default function MediaGrid({
  items,
  selectedIds = [],
  onSelect,
  loading = false,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 p-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">No media found</p>
        <p className="text-xs mt-1">Upload images to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 p-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
            selectedIds.includes(item.id)
              ? "border-blue-500 ring-2 ring-blue-500/30 scale-[0.96]"
              : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${API_URL}${item.urlThumbnail}`}
            alt={item.altText || item.title || ""}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {selectedIds.includes(item.id) && (
            <div className="absolute top-1.5 right-1.5 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </button>
      ))}
    </div>
  );
}
