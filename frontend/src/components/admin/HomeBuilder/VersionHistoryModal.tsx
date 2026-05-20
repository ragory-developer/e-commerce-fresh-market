"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import {
  X,
  History,
  Clock,
  RotateCcw,
  Loader2,
  User,
  FileText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import type { BuilderPageVersion } from "@/page-builder/types";

function authHeaders() {
  const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string;
  onRestore: (version: BuilderPageVersion) => void;
  draftVersionId: string | null;
  publishedVersionId: string | null;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  pageKey,
  onRestore,
  draftVersionId,
  publishedVersionId,
}: VersionHistoryModalProps) {
  const [versions, setVersions] = useState<BuilderPageVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmingVersion, setConfirmingVersion] = useState<BuilderPageVersion | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, pageKey]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/builder/pages/${pageKey}/versions`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load version history");
      }
      setVersions(json.data || []);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error loading version history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (version: BuilderPageVersion) => {
    onRestore(version);
    setConfirmingVersion(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-2xl md:max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-slide-up p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gray-950 text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-black tracking-tight truncate">Version History</h2>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate hidden sm:block">Revert or review past editor drafts and published layouts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 sm:p-1.5 rounded-lg bg-gray-900 text-gray-400 hover:text-white transition hover:bg-gray-800 shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50/50">
            {loading ? (
              /* Skeleton Loader */
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-9 bg-gray-200 rounded w-28 mt-2"></div>
                  </div>
                ))}
              </div>
            ) : versions.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center max-w-sm mx-auto px-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                  <History className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-sm sm:text-base font-black text-gray-800">No versions found</h3>
                <p className="mt-1.5 text-xs text-gray-500 font-semibold leading-relaxed">
                  This page has not generated any history records yet. Save your first draft or publish to start tracking revisions.
                </p>
              </div>
            ) : (
              /* Versions Timeline/List */
              <div className="space-y-3 sm:space-y-4">
                {versions.map((ver) => {
                  const isDraft = ver.id === draftVersionId;
                  const isPublished = ver.id === publishedVersionId;
                  const sections = (ver.document as any)?.sections || [];

                  return (
                    <div
                      key={ver.id}
                      className={`group relative bg-white rounded-xl border p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4 transition hover:border-gray-300 hover:shadow-md ${
                        isDraft ? "border-emerald-500/30 ring-1 ring-emerald-500/10" : "border-gray-200"
                      }`}
                    >
                      {/* Top row: badges */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-emerald-50">
                          v{ver.version}
                        </span>
                        {isPublished && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-blue-500 text-white">
                            Published
                          </span>
                        )}
                        {isDraft && (
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-amber-500 text-white">
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          {new Date(ver.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        {ver.createdById && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate max-w-[120px]">Admin ({ver.createdById.slice(-6)})</span>
                          </span>
                        )}
                      </div>

                      {/* Layout structure */}
                      <div className="flex items-start gap-1.5 text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-50/50 p-2 sm:p-2.5 rounded-lg border border-gray-100 overflow-hidden">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-gray-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold block text-gray-700 text-[9px] sm:text-[10px] uppercase tracking-wide mb-0.5">
                            Layout ({sections.length} sections)
                          </span>
                          <div className="text-gray-500 truncate text-[10px] sm:text-xs">
                            {sections.length > 0
                              ? sections.map((s: any) => s.type).join(" → ")
                              : "Empty canvas"}
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="flex items-center">
                        {isDraft ? (
                          <span className="text-[10px] sm:text-xs font-extrabold text-emerald-600 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-50 rounded-lg border border-emerald-200/50">
                            Current Workspace
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingVersion(ver)}
                            className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-extrabold text-gray-700 transition active:scale-[0.97]"
                          >
                            <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Restore
                            <ChevronRight className="w-3 h-3 sm:hidden" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal Overlay */}
        {confirmingVersion && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-100 animate-scale-in">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-gray-900">Restore Layout Version?</h3>
                  <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs font-semibold leading-relaxed text-gray-500">
                    This will load <strong>Version #{confirmingVersion.version}</strong> into your active editor canvas.
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs font-semibold leading-relaxed text-rose-500">
                    Warning: Any unsaved changes on your current workspace will be permanently overwritten.
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmingVersion(null)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 sm:py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRestore(confirmingVersion)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 sm:py-2 text-xs font-bold text-white transition w-full sm:w-auto"
                >
                  Confirm Restore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
