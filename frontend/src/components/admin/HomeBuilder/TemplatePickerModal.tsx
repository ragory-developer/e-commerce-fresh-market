"use client";

import { useEffect, useState, useMemo } from "react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import {
  X,
  Search,
  LayoutTemplate,
  Sparkles,
  Check,
  AlertTriangle,
  Loader2,
  Layers,
  Info,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Trash2
} from "lucide-react";
import { sectionRegistry } from "@/page-builder/registry";
import type { BuilderPageDocument, BuilderSection } from "@/page-builder/types";

function authHeaders() {
  const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface Template {
  id: string;
  key: string;
  name: string;
  scope: string;
  pageType: string;
  themeKey: string | null;
  thumbnail: string | null;
  document: any; // Can be BuilderPageDocument or a single BuilderSection
  isSystem: boolean;
  createdAt: string;
}

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplied: () => void;
  onBlocksChanged?: () => void;
  pageKey: string;
}

// Preset decorative styles/gradients for themes to make them look premium
const THEME_VISUALS: Record<string, { bg: string; text: string; accent: string; icon: string; desc: string }> = {
  ramadan: {
    bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    text: "text-amber-400",
    accent: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    icon: "🌙",
    desc: "A serene night theme with rich green variants and customized features for holy Ramadan.",
  },
  eid: {
    bg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    text: "text-emerald-300",
    accent: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    icon: "🕌",
    desc: "Bright, festive layout featuring custom banners, green colorways, and special holiday badges.",
  },
  puja: {
    bg: "linear-gradient(135deg, #881337 0%, #9f1239 100%)",
    text: "text-rose-200",
    accent: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    icon: "🪔",
    desc: "Joyous aesthetic with bold crimson accents, festive headers, and special Durga Puja discount sections.",
  },
  boishakh: {
    bg: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
    text: "text-yellow-200",
    accent: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    icon: "☀️",
    desc: "Traditional red-and-white accents paired with sunny yellows to celebrate the Bengali New Year.",
  },
  blackfriday: {
    bg: "linear-gradient(135deg, #111827 0%, #030712 100%)",
    text: "text-red-500",
    accent: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: "🏷️",
    desc: "Dark high-contrast theme focused on bold deal timers, high-impact product badges, and sleek styling.",
  },
  christmas: {
    bg: "linear-gradient(135deg, #7f1d1d 0%, #14532d 100%)",
    text: "text-red-200",
    accent: "bg-red-500/10 text-red-300 border-red-500/30",
    icon: "🎄",
    desc: "Cozy holiday layouts with warm green-red split styles, routine calendars, and cozy family gifting vibes.",
  },
};

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onApplied,
  onBlocksChanged,
  pageKey,
}: TemplatePickerModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"starters" | "themes" | "my-blocks">("starters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [applying, setApplying] = useState(false);

  // Fetch templates from the backend
  useEffect(() => {
    if (!isOpen) return;

    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/builder/templates`, {
          headers: authHeaders(),
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTemplates(json.data);
          
          // Select default starter or first template by default if available
          const starters = json.data.filter((t: Template) => t.scope === "page" && !t.themeKey);
          if (starters.length > 0) {
            setSelectedTemplateId(starters[0].id);
          } else if (json.data.length > 0) {
            setSelectedTemplateId(json.data[0].id);
          }
        } else {
          toast.error("Failed to load templates");
        }
      } catch (error) {
        console.error("Templates fetch error", error);
        toast.error("Error connecting to template store");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
    setIsConfirming(false);
  }, [isOpen]);

  // Reset confirmation state when changing selection
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    setIsConfirming(false);
  };

  // Filter and group templates
  const filteredStarters = useMemo(() => {
    return templates
      .filter((t) => (t.scope === "page" || t.scope === "starter") && !t.themeKey)
      .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [templates, searchQuery]);

  const filteredThemes = useMemo(() => {
    return templates
      .filter((t) => t.themeKey !== null)
      .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [templates, searchQuery]);

  const filteredBlocks = useMemo(() => {
    return templates
      .filter((t) => t.scope === "block")
      .filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [templates, searchQuery]);

  // Find the selected template object
  const selectedTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedTemplateId) || null;
  }, [templates, selectedTemplateId]);

  // Handle template deletion
  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this custom block? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${API_URL}/api/builder/templates/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete template");
      }
      toast.success("Custom block deleted successfully");
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selectedTemplateId === id) {
        setSelectedTemplateId(null);
      }
      if (onBlocksChanged) {
        onBlocksChanged();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error deleting block");
    }
  };

  // Handle Apply Template execution
  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;
    setApplying(true);
    try {
      const res = await fetch(`${API_URL}/api/builder/pages/${pageKey}/apply-template`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ templateId: selectedTemplate.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to apply template");
      }
      
      toast.success(`Successfully applied "${selectedTemplate.name}" layout`);
      onApplied(); // Refresh main editor state
      onClose();   // Close modal
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error applying template");
    } finally {
      setApplying(false);
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-6xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-950 text-white shrink-0">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-black tracking-tight">Layout & Theme Picker</h2>
              <p className="text-xs font-semibold text-gray-400">Instantly switch layout presets or apply festival designs</p>
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

        {/* Modal Main Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Area (Templates List) */}
          <div className="w-[60%] flex flex-col border-r border-gray-100 bg-gray-50/50 overflow-hidden">
            
            {/* Navigation tabs & Search bar */}
            <div className="p-4 border-b border-gray-100 bg-white space-y-3 shrink-0">
              <div className="flex border-b border-gray-200">
                {[
                  { id: "starters" as const, label: "Starters", icon: LayoutTemplate },
                  { id: "themes" as const, label: "Festive Themes", icon: Sparkles },
                  { id: "my-blocks" as const, label: "My Blocks", icon: Layers },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-black border-b-2 transition ${
                        isActive
                          ? "border-emerald-500 text-emerald-600 font-black"
                          : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${
                    activeTab === "my-blocks"
                      ? "saved custom blocks"
                      : activeTab === "starters"
                        ? "starter templates"
                        : "themed templates"
                  }...`}
                  className="w-full pl-9 pr-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition"
                />
              </div>
            </div>

            {/* Scrollable Templates Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse flex flex-col justify-between p-5 rounded-xl border-2 border-gray-150 bg-white h-40">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === "starters" ? (
                filteredStarters.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <LayoutTemplate className="w-12 h-12 opacity-30 mb-2" />
                    <span className="text-sm font-bold">No starter templates found</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredStarters.map((template) => {
                      const isSelected = selectedTemplateId === template.id;
                      return (
                        <div
                          key={template.id}
                          onClick={() => handleSelectTemplate(template.id)}
                          className={`group relative flex flex-col justify-between p-5 rounded-xl border-2 cursor-pointer transition bg-white ${
                            isSelected
                              ? "border-emerald-500 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                                Starter Layout
                              </span>
                              {isSelected && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-black text-gray-800 leading-snug group-hover:text-emerald-600 transition">
                              {template.name}
                            </h3>
                            <p className="mt-1.5 text-xs text-gray-500 font-medium leading-relaxed">
                              Clean foundation layout. Highly modular, standard blocks prepared for custom branding.
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                            <span>{((template.document as BuilderPageDocument)?.sections || []).length} Sections</span>
                            <span className="flex items-center gap-1 group-hover:text-emerald-500 transition font-bold">
                              Preview <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : activeTab === "themes" ? (
                filteredThemes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Sparkles className="w-12 h-12 opacity-30 mb-2" />
                    <span className="text-sm font-bold">No theme templates found</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredThemes.map((template) => {
                      const isSelected = selectedTemplateId === template.id;
                      const visual = THEME_VISUALS[template.themeKey || ""] || {
                        bg: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                        text: "text-white",
                        accent: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
                        icon: "🎁",
                        desc: "Festive campaign home configuration.",
                      };
                      return (
                        <div
                          key={template.id}
                          onClick={() => handleSelectTemplate(template.id)}
                          className={`group relative flex flex-col justify-between rounded-xl overflow-hidden border-2 cursor-pointer transition bg-white ${
                            isSelected
                              ? "border-emerald-500 shadow-md ring-1 ring-emerald-500"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                          }`}
                        >
                          {/* Festive Header Background */}
                          <div
                            className="px-5 py-4 text-white"
                            style={{ background: visual.bg }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded border ${visual.accent}`}>
                                Theme Pack
                              </span>
                              <span className="text-xl leading-none">{visual.icon}</span>
                            </div>
                            <h3 className="text-sm font-black tracking-tight leading-snug">
                              {template.name}
                            </h3>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                              {visual.desc}
                            </p>

                            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                              <span>{((template.document as BuilderPageDocument)?.sections || []).length} Sections</span>
                              <span className="flex items-center gap-1 group-hover:text-emerald-600 transition font-bold text-gray-500">
                                Preview <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* My Blocks Tab */
                filteredBlocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4 shadow-inner">
                      <Layers className="w-7 h-7 animate-bounce" />
                    </div>
                    <h3 className="text-base font-black text-gray-800">My Blocks Library</h3>
                    <p className="mt-1.5 text-sm text-gray-500 font-medium leading-relaxed">
                      Your custom saved block sections will appear here. Insert them onto any layout from the editor's left library accordion.
                    </p>
                    <div className="mt-4 p-3 rounded-lg border border-dashed border-emerald-100 bg-emerald-50/30 text-xs font-semibold text-emerald-600 flex items-start gap-2 max-w-sm">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                      <span>Highlight any section inside the active editor, click "Save as Reusable Block", and type a custom name.</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredBlocks.map((template) => {
                      const isSelected = selectedTemplateId === template.id;
                      const sect = template.document as any;
                      const label = sectionRegistry[sect?.type]?.label || sect?.type || "Block";
                      return (
                        <div
                          key={template.id}
                          onClick={() => handleSelectTemplate(template.id)}
                          className={`group relative flex flex-col justify-between p-5 rounded-xl border-2 cursor-pointer transition bg-white ${
                            isSelected
                              ? "border-emerald-500 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                Saved Block
                              </span>
                              <div className="flex items-center gap-2">
                                {!template.isSystem && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                                    className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                    title="Delete custom block"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                {isSelected && (
                                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {template.thumbnail ? (
                              <div className="h-24 w-full rounded-lg bg-gray-100 border border-gray-100 overflow-hidden mb-3.5 relative">
                                <img
                                  src={template.thumbnail}
                                  alt={template.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                              </div>
                            ) : (
                              <div className="h-24 w-full rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 flex flex-col items-center justify-center text-indigo-400 mb-3.5">
                                <Layers className="w-6 h-6 mb-1.5 opacity-60 shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">No Thumbnail</span>
                              </div>
                            )}

                            <h3 className="text-sm font-black text-gray-800 leading-snug group-hover:text-emerald-600 transition">
                              {template.name}
                            </h3>
                            <span className="mt-1 block text-xs font-bold text-gray-400">
                              Base Type: {label}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
                            <span>Saved {new Date(template.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 group-hover:text-emerald-500 transition font-bold text-gray-500">
                              Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Area (Live Preview Outline Panel) */}
          <div className="w-[40%] flex flex-col bg-white overflow-hidden">
            {selectedTemplate ? (
              <div className="flex flex-col h-full overflow-hidden">
                
                {/* Preview Header */}
                <div className="p-5 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {selectedTemplate.scope}
                    </span>
                    {selectedTemplate.themeKey && (
                      <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {selectedTemplate.themeKey} theme
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-gray-900 leading-snug">{selectedTemplate.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    Template Key: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800 text-[10px]">{selectedTemplate.key}</code>
                  </p>
                </div>

                {/* Section Stack Outline */}
                <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30 space-y-4">
                  {selectedTemplate.scope === "block" ? (
                    <>
                      <span className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                        Block Structure
                      </span>

                      <div className="relative pl-4 border-l border-gray-200 space-y-4 ml-2">
                        {(() => {
                          const sect = selectedTemplate.document as any;
                          if (!sect) return null;
                          const def = sectionRegistry[sect.type];
                          const label = def?.label || sect.type;
                          const activeVariant = sect.variant || def?.defaultVariant || "default";
                          const titleProp = sect.props?.title ? String(sect.props.title) : "";
                          const hasBadges = Boolean(sect.props?.badges || sect.props?.testimonials);

                          return (
                            <div className="relative group">
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white" />
                              <div className="p-3.5 rounded-xl border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-black text-gray-800">{label}</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                    {activeVariant}
                                  </span>
                                </div>
                                {titleProp && (
                                  <div className="mt-1 text-[11px] font-semibold text-gray-500 truncate">
                                    Title: <span className="text-gray-700 italic">"{titleProp}"</span>
                                  </div>
                                )}
                                {hasBadges && (
                                  <div className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Custom nested collection included
                                  </div>
                                )}
                                <span className="mt-1.5 block text-[9px] font-semibold text-gray-400">
                                  Type: {sect.type}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                        Section Architecture ({((selectedTemplate.document as BuilderPageDocument)?.sections || []).length} Blocks)
                      </span>

                      <div className="relative pl-4 border-l border-gray-200 space-y-4 ml-2">
                        {((selectedTemplate.document as BuilderPageDocument)?.sections || []).map((sect: BuilderSection, idx: number) => {
                          const def = sectionRegistry[sect.type];
                          const label = def?.label || sect.type;
                          const activeVariant = sect.variant || def?.defaultVariant || "default";
                          const titleProp = sect.props?.title ? String(sect.props.title) : "";
                          const hasBadges = Boolean(sect.props?.badges || sect.props?.testimonials);

                          return (
                            <div key={sect.id || idx} className="relative group">
                              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white group-hover:bg-emerald-500 transition-colors" />
                              <div className="p-3.5 rounded-xl border border-gray-200/80 bg-white shadow-sm hover:border-gray-300 hover:shadow-md transition">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-black text-gray-800">{label}</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                    {activeVariant}
                                  </span>
                                </div>
                                {titleProp && (
                                  <div className="mt-1 text-[11px] font-semibold text-gray-500 truncate">
                                    Title: <span className="text-gray-700 italic">"{titleProp}"</span>
                                  </div>
                                )}
                                {hasBadges && (
                                  <div className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Custom nested collection included
                                  </div>
                                )}
                                <span className="mt-1.5 block text-[9px] font-semibold text-gray-400">
                                  Type: {sect.type}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Apply Actions Panel */}
                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                  {selectedTemplate.scope === "block" ? (
                    <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start gap-2.5 text-xs font-semibold text-indigo-700 leading-relaxed animate-slide-up">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                      <div>
                        <span className="font-black block mb-0.5">Reusable Block Template</span>
                        <span>This block is ready to go! Insert copies of it directly on your draft layout from the <strong>"Saved Blocks"</strong> panel in the Left Sidebar Component Library.</span>
                      </div>
                    </div>
                  ) : !isConfirming ? (
                    <button
                      type="button"
                      onClick={() => setIsConfirming(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 text-sm transition shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      Apply Selected Template
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3.5 animate-slide-up">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-black text-amber-800">Apply Layout Confirmation</h4>
                          <p className="text-[11px] leading-relaxed text-amber-700 mt-0.5 font-medium">
                            This replaces your current draft. Previous draft versions are kept in history, so you can easily restore later.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={applying}
                          onClick={handleApplyTemplate}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 text-xs transition disabled:opacity-50"
                        >
                          {applying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                          Yes, Apply Template
                        </button>
                        <button
                          type="button"
                          disabled={applying}
                          onClick={() => setIsConfirming(false)}
                          className="px-4 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-2.5 text-xs transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400 bg-gray-50/20">
                <LayoutTemplate className="w-12 h-12 opacity-20 mb-3" />
                <h4 className="text-sm font-black text-gray-600">No template selected</h4>
                <p className="text-xs max-w-[240px] leading-relaxed mt-1 font-medium text-gray-400">
                  Select a starter layout, festive theme, or custom saved block from the left library list to view its architecture outline.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
