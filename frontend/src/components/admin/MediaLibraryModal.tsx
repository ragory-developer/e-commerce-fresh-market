"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Trash2,
  Save,
  Loader2,
  Search,
} from "lucide-react";
import { createPortal } from "react-dom";
import MediaGrid, { MediaItem } from "./MediaGrid";
import { API_URL } from "@/lib/config";

const API = `${API_URL}/api/media`;

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: any, sizeUrl: any) => void;
  /** Which size URL to return on select: 'thumbnail' | 'medium' | 'full' */
  preferredSize?: "thumbnail" | "medium" | "full";
  title?: string;
  multiple?: boolean;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  preferredSize = "medium",
  title = "Media Library",
  multiple = false,
}: MediaLibraryModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detail editing
  const [editAlt, setEditAlt] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch media
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`${API}?${params}`);
      const json = await res.json();
      if (json.success) setItems(json.data || []);
    } catch (e) {
      console.error("Failed to fetch media:", e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedItems([]);
    }
  }, [isOpen, fetchMedia]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle selection
  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      setSelectedItems((prev) => {
        const isSelected = prev.find((i) => i.id === item.id);
        const newItems = isSelected
          ? prev.filter((i) => i.id !== item.id)
          : [...prev, item];
        
        if (newItems.length === 1) {
          setEditAlt(newItems[0].altText || "");
          setEditTitle(newItems[0].title || "");
          setEditCaption(newItems[0].caption || "");
        } else {
          setEditAlt("");
          setEditTitle("");
          setEditCaption("");
        }
        return newItems;
      });
    } else {
      setSelectedItems([item]);
      setEditAlt(item.altText || "");
      setEditTitle(item.title || "");
      setEditCaption(item.caption || "");
    }
    setTab("library");
  };

  // Upload handler
  const handleUpload = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    let completed = 0;
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(`${API}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json();
          console.error("Upload failed:", err.message);
        }
        completed++;
        setUploadProgress(Math.round((completed / files.length) * 100));
      } catch (e) {
        console.error("Upload failed:", e);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    setTab("library");
    fetchMedia();
  };

  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"] },
    maxSize: 10 * 1024 * 1024,
    onDrop: handleUpload,
  });

  // Save attributes
  const handleSaveAttributes = async () => {
    if (selectedItems.length !== 1) return;
    const selected = selectedItems[0];
    setSaving(true);
    try {
      const res = await fetch(`${API}/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: editAlt,
          title: editTitle,
          caption: editCaption,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setSelectedItems([json.data]);
        setItems((prev) =>
          prev.map((i) => (i.id === json.data.id ? json.data : i))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (selectedItems.length === 0 || !confirm("Delete selected images permanently?")) return;
    try {
      for (const item of selectedItems) {
        await fetch(`${API}/${item.id}`, { method: "DELETE" });
      }
      setSelectedItems([]);
      fetchMedia();
    } catch (e) {
      console.error(e);
    }
  };

  // Insert selected
  const handleInsert = () => {
    if (selectedItems.length === 0) return;
    if (multiple) {
      const urls = selectedItems.map((item) => {
        const urlMap = {
          thumbnail: item.urlThumbnail,
          medium: item.urlMedium,
          full: item.urlFull,
        };
        return `${API_URL}${urlMap[preferredSize]}`;
      });
      onSelect(selectedItems, urls);
    } else {
      const selected = selectedItems[0];
      const urlMap = {
        thumbnail: selected.urlThumbnail,
        medium: selected.urlMedium,
        full: selected.urlFull,
      };
      onSelect(selected, `${API_URL}${urlMap[preferredSize]}`);
    }
    onClose();
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-4 md:inset-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-[10000] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">
                  {title}
                </h2>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-0.5">
                  <button
                    onClick={() => setTab("library")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === "library"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Media Library
                  </button>
                  <button
                    onClick={() => setTab("upload")}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      tab === "upload"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 min-h-0">
              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0">
                {tab === "library" ? (
                  <>
                    {/* Search bar */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                      <div className="relative max-w-md">
                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search media..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto">
                      <MediaGrid
                        items={items}
                        selectedIds={selectedItems.map((i) => i.id)}
                        onSelect={handleSelect}
                        loading={loading}
                      />
                    </div>
                  </>
                ) : (
                  /* Upload Tab */
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div
                      {...getRootProps()}
                      className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-750"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {uploading ? (
                        <div className="space-y-4">
                          <Loader2
                            size={48}
                            className="mx-auto text-blue-500 animate-spin"
                          />
                          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                            Uploading... {uploadProgress}%
                          </p>
                          <div className="w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Upload
                              size={32}
                              className="text-blue-500"
                            />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                              Drop files to upload
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              or click to select files
                            </p>
                          </div>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF, WebP up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Sidebar */}
              {selectedItems.length > 0 && tab === "library" && (() => {
                const selected = selectedItems[0];
                const isMultiple = selectedItems.length > 1;
                return (
                  <div className="w-[320px] border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0 bg-gray-50 dark:bg-gray-900/50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">
                        {isMultiple ? `${selectedItems.length} items selected` : "Attachment Details"}
                      </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {isMultiple ? (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                              <img
                                src={`${API_URL}${item.urlThumbnail}`}
                                alt={item.altText || ""}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {/* Preview */}
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`${API_URL}${selected.urlMedium}`}
                              alt={selected.altText || ""}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          {/* File info */}
                          <div className="text-xs space-y-1.5 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="flex justify-between">
                              <span className="font-medium">File:</span>
                              <span className="truncate ml-2 text-gray-700 dark:text-gray-300 max-w-[180px]">
                                {selected.originalName}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="font-medium">Type:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {selected.fileType}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="font-medium">Size:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {formatSize(selected.fileSize)}
                              </span>
                            </p>
                            {selected.width && selected.height && (
                              <p className="flex justify-between">
                                <span className="font-medium">Dimensions:</span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {selected.width} × {selected.height}
                                </span>
                              </p>
                            )}
                            <p className="flex justify-between">
                              <span className="font-medium">Uploaded:</span>
                              <span className="text-gray-700 dark:text-gray-300">
                                {new Date(selected.createdAt).toLocaleDateString()}
                              </span>
                            </p>
                          </div>

                          {/* Attribute Editing */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                                Alt Text <span className="text-gray-400 font-normal">(SEO)</span>
                              </label>
                              <input
                                type="text"
                                value={editAlt}
                                onChange={(e) => setEditAlt(e.target.value)}
                                placeholder="Describe this image for accessibility"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                                Caption
                              </label>
                              <textarea
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white resize-none"
                              />
                            </div>
                          </div>

                          {/* Insert by Size */}
                          <div className="text-xs space-y-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                              Insert Image
                            </p>
                            {(["thumbnail", "medium", "full"] as const).map((size) => {
                              const urlMap = {
                                thumbnail: selected.urlThumbnail,
                                medium: selected.urlMedium,
                                full: selected.urlFull,
                              };
                              const labels: Record<string, string> = {
                                thumbnail: "150px",
                                medium: "300px",
                                full: "Original",
                              };
                              const isPreferred = size === preferredSize;
                              return (
                                <button
                                  key={size}
                                  onClick={() => {
                                    onSelect(selected, `${API_URL}${urlMap[size]}`);
                                    onClose();
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${
                                    isPreferred
                                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold"
                                      : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  <span className="capitalize font-medium">{size}</span>
                                  <span className="text-gray-400 dark:text-gray-500 text-[11px]">{labels[size]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {/* Common Actions (Save & Delete) */}
                      <div className="flex gap-2 mt-4">
                        {!isMultiple && (
                          <button
                            onClick={handleSaveAttributes}
                            disabled={saving}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                          >
                            <Save size={14} /> {saving ? "Saving..." : "Save"}
                          </button>
                        )}
                        <button
                          onClick={handleDelete}
                          className={`px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isMultiple ? 'flex-1 inline-flex items-center justify-center gap-1.5' : ''}`}
                        >
                          <Trash2 size={14} /> {isMultiple ? 'Delete All' : ''}
                        </button>
                      </div>
                    </div>

                    {/* Footer: Insert */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                      <button
                        onClick={handleInsert}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                      >
                        Insert {isMultiple ? `${selectedItems.length} images` : `image`}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
