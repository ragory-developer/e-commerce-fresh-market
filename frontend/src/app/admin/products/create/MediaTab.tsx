"use client";
import { useState } from "react";
import { ProductFormData } from "./page";
import { Image as ImageIcon, Link as LinkIcon, ImagePlus, X } from "lucide-react";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface MediaTabProps {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

export default function MediaTab({ formData, onChange }: MediaTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<"main" | "gallery" | null>(null);

  const update = (field: keyof ProductFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  // Parse gallery images from newline-separated string
  const galleryImages: string[] = formData.images
    ? formData.images.split("\n").map((u) => u.trim()).filter(Boolean)
    : [];

  const handleMediaSelect = (media: any, url: string | string[]) => {
    if (activeTarget === "main") {
      update("image", Array.isArray(url) ? url[0] : url);
    } else if (activeTarget === "gallery") {
      const incoming = Array.isArray(url) ? url : [url];
      const combined = [...galleryImages, ...incoming];
      update("images", combined.join("\n"));
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    const updated = galleryImages.filter((_, i) => i !== indexToRemove);
    update("images", updated.join("\n"));
  };

  const openModal = (target: "main" | "gallery") => {
    setActiveTarget(target);
    setModalOpen(true);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Product Media</h2>

        <div className="space-y-8">
          {/* ── Main Image ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Main Product Image <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 shrink-0 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden relative">
                {formData.image ? (
                  <img src={formData.image} alt="Main" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-gray-400 mb-2" size={24} />
                    <span className="text-xs text-gray-500 font-medium">No Image</span>
                  </>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => update("image", e.target.value)}
                      placeholder="Paste external URL here..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => openModal("main")}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <ImagePlus size={16} /> Library
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Provide a high quality image URL or select one from your library for the primary display.
                </p>
              </div>
            </div>
          </div>

          {/* ── Gallery Images ── */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Gallery Images
                </label>
                <p className="text-xs text-gray-500">
                  {galleryImages.length > 0
                    ? `${galleryImages.length} image${galleryImages.length > 1 ? "s" : ""} selected`
                    : "Add additional images to the product gallery."}
                </p>
              </div>
              <button
                onClick={() => openModal("gallery")}
                className="shrink-0 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <ImagePlus size={16} /> Add from Library
              </button>
            </div>

            {galleryImages.length === 0 ? (
              /* Empty state */
              <button
                onClick={() => openModal("gallery")}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-10 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                <ImagePlus size={28} />
                <span className="text-sm font-medium">Click to add gallery images</span>
              </button>
            ) : (
              /* Image grid */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      title="Remove image"
                    >
                      <X size={12} />
                    </button>
                    {/* Index badge */}
                    <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                      {idx + 1}
                    </div>
                  </div>
                ))}
                {/* Add more tile */}
                <button
                  onClick={() => openModal("gallery")}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <ImagePlus size={20} />
                  <span className="text-[10px] font-semibold">Add More</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleMediaSelect}
        preferredSize="full"
        multiple={activeTarget === "gallery"}
      />
    </div>
  );
}
