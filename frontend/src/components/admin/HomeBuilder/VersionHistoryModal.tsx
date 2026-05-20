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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-black tracking-tight font-display">Version History</h2>
              <p className="text-xs font-semibold text-gray-400">Revert or review past editor drafts and published layouts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-900 text-gray-400 hover:text-white transition hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main List */}
          <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                /* Skeleton Loader */
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between h-28">
                      <div className="space-y-3 w-2/3">
                        <div className="flex gap-2">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : versions.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                    <History className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-black text-gray-800">No versions found</h3>
                  <p className="mt-1.5 text-xs text-gray-500 font-semibold leading-relaxed">
                    This page has not generated any history records yet. Save your first draft or publish to start tracking revisions.
                  </p>
                </div>
              ) : (
                /* Versions Timeline/List */
                <div className="space-y-4">
                  {versions.map((ver) => {
                    const isDraft = ver.id === draftVersionId;
                    const isPublished = ver.id === publishedVersionId;
                    const sections = (ver.document as any)?.sections || [];

                    return (
                      <div
                        key={ver.id}
                        className={`group relative bg-white rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-gray-300 hover:shadow-md ${
                          isDraft ? "border-emerald-500/30 ring-1 ring-emerald-500/10" : "border-gray-200"
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-emerald-600 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50">
                              Version #{ver.version}
                            </span>
                            {isPublished && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500 text-white">
                                Active Published
                              </span>
                            )}
                            {isDraft && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white">
                                Current Draft
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(ver.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                            {ver.createdById && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                Admin (ID: {ver.createdById.slice(-6)})
                              </span>
                            )}
                          </div>

                          <div className="flex items-start gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-extrabold block text-gray-700 text-[10px] uppercase tracking-wide mb-0.5">
                                Layout Structure ({sections.length} sections)
                              </span>
                              <div className="truncate text-gray-500">
                                {sections.length > 0
                                  ? sections.map((s: any) => s.type).join(" → ")
                                  : "Empty canvas"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center md:justify-end">
                          {isDraft ? (
                            <span className="text-xs font-extrabold text-emerald-600 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200/50">
                              Current Workspace
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmingVersion(ver)}
                              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 px-4 py-2 text-xs font-extrabold text-gray-700 transition"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Restore Layout
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
        </div>

        {/* Confirmation Modal Overlay */}
        {confirmingVersion && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border border-gray-100 animate-scale-in">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Restore Layout Version?</h3>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-500">
                    This will load **Version #{confirmingVersion.version}** into your active editor canvas.
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-rose-500">
                    Warning: Any unsaved changes on your current workspace will be permanently overwritten.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmingVersion(null)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleRestore(confirmingVersion)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition"
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
