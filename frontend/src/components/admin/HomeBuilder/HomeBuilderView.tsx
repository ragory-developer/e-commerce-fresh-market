"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
import {
  ArrowLeft,
  Eye,
  LayoutTemplate,
  Loader2,
  Plus,
  Rocket,
  Save,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
} from "lucide-react";
import EditableSection from "@/components/admin/HomeBuilder/wrappers/EditableSection";
import { InputField, SegmentedControl, TextAreaField, MediaPickerField } from "@/page-builder/editors";
import { availableSections, resolveSectionProps, sectionRegistry } from "@/page-builder/registry";
import type { BuilderPageDocument, BuilderSection } from "@/page-builder/types";
import { usePageBuilderStore } from "@/store/pageBuilderStore";
import { resolveStyleClasses } from "@/page-builder/styleTokens";

type DragEventLike = {
  operation?: {
    source?: { id?: unknown; index?: number } | null;
    target?: { id?: unknown; index?: number } | null;
  };
};

function authHeaders() {
  const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function createFallbackDocument(key: string, title: string, slug: string): BuilderPageDocument {
  return {
    schemaVersion: 1,
    page: {
      key,
      slug,
      title,
    },
    sections: [],
  };
}

function normalizeCategories(categories: unknown[]) {
  return categories.map((item) => {
    const category = item as { id?: string; _id?: string; name?: string };
    return {
      id: category.id || category._id,
      name: category.name,
    };
  }).filter((category): category is { id: string; name: string } => Boolean(category.id && category.name));
}

export default function HomeBuilderView({
  pageKey,
  pageTitle = "Page",
  pageSlug = `/${pageKey}`,
  allProducts = [],
}: {
  pageKey: string;
  pageTitle?: string;
  pageSlug?: string;
  allProducts?: unknown[];
}) {
  const {
    draft,
    draftVersionId,
    selectedSectionId,
    activeDragId,
    dirty,
    previewMode,
    hydrate,
    applyTemplate,
    setSelectedSectionId,
    setActiveDragId,
    setPreviewMode,
    addSection,
    removeSection,
    reorderSections,
    updateSectionProps,
    updateSectionStyles,
    markSaved,
    markPublished,
  } = usePageBuilderStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [activeSectionTab, setActiveSectionTab] = useState<"content" | "design">("content");
  const previousSectionIdsRef = useRef<Set<string> | null>(null);

  const fetchBuilderPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/builder/pages/${pageKey}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || `Failed to load ${pageTitle} builder page`);
      }
      
      const hydratedDraft = json.data.draft || {
        id: "",
        version: 0,
        status: "draft",
        document: createFallbackDocument(pageKey, pageTitle, pageSlug),
        createdAt: new Date().toISOString(),
      };

      hydrate({
        draft: hydratedDraft,
        published: json.data.published,
      });
    } catch (error: unknown) {
      hydrate({
        draft: {
          id: "",
          version: 0,
          status: "draft",
          document: createFallbackDocument(pageKey, pageTitle, pageSlug),
          createdAt: new Date().toISOString(),
        },
        published: null,
      });
      toast.error(error instanceof Error ? error.message : `Failed to load ${pageTitle} builder`);
    } finally {
      setLoading(false);
    }
  }, [hydrate]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories?limit=100`);
      const json = await res.json();
      if (json.success) {
        setCategories(normalizeCategories(json.data || []));
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  useEffect(() => {
    fetchBuilderPage();
    fetchCategories();
  }, [fetchBuilderPage, fetchCategories]);

  const handleSaveDraft = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/builder/pages/${pageKey}/draft`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ document: draft }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save draft");
      }
      markSaved(json.data.draft.id);
      toast.success("Draft saved");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!draft) return;
    setPublishing(true);
    try {
      let versionId = draftVersionId;
      if (dirty || !versionId) {
        const saveRes = await fetch(`${API_URL}/api/builder/pages/${pageKey}/draft`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ document: draft }),
        });
        const saveJson = await saveRes.json();
        if (!saveRes.ok || !saveJson.success) {
          throw new Error(saveJson.message || "Failed to save draft before publishing");
        }
        versionId = saveJson.data.draft.id;
        if (typeof versionId !== "string") {
          throw new Error("Draft save did not return a version id");
        }
        markSaved(versionId);
      }

      const publishRes = await fetch(`${API_URL}/api/builder/pages/${pageKey}/publish`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ draftVersionId: versionId }),
      });
      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.success) {
        throw new Error(publishJson.message || "Failed to publish page");
      }

      markPublished(publishJson.data.published.id, publishJson.data.published.document);
      toast.success(`${pageTitle} published`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to publish page");
    } finally {
      setPublishing(false);
    }
  };

  const activeSection = useMemo(
    () => draft?.sections.find((section) => section.id === selectedSectionId) || null,
    [draft, selectedSectionId],
  );

  const activeDefinition = activeSection ? sectionRegistry[activeSection.type] : null;
  const activeDragSection = draft?.sections.find((section) => section.id === activeDragId) || null;
  const sectionGroups = useMemo(() => (
    availableSections.reduce<Record<string, typeof availableSections>>((groups, definition) => {
      groups[definition.category] = [...(groups[definition.category] || []), definition];
      return groups;
    }, {})
  ), []);

  useEffect(() => {
    if (!selectedSectionId) return;
    setActiveSectionTab("content");

    const timer = window.setTimeout(() => {
      const editor = document.querySelector(`[data-section-editor="${selectedSectionId}"]`);
      const firstInput = editor?.querySelector<HTMLElement>("[data-builder-input]");
      firstInput?.focus();
      firstInput?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [selectedSectionId]);

  useEffect(() => {
    const sectionIds = new Set(draft?.sections.map((section) => section.id) || []);
    const previousSectionIds = previousSectionIdsRef.current;
    const selectedSectionWasJustAdded = Boolean(
      selectedSectionId
        && sectionIds.has(selectedSectionId)
        && previousSectionIds
        && !previousSectionIds.has(selectedSectionId),
    );

    previousSectionIdsRef.current = sectionIds;

    if (!selectedSectionWasJustAdded) return;

    const timer = window.setTimeout(() => {
      document
        .querySelector<HTMLElement>(`[data-section-id="${selectedSectionId}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [draft?.sections, selectedSectionId]);

  const renderSectionContent = (section: BuilderSection) => {
    const definition = sectionRegistry[section.type];
    const props = resolveSectionProps(section, { allProducts });
    if (!definition || !props) {
      return (
        <div className="p-8 text-center text-sm font-semibold text-gray-500">
          Unknown section: {section.type}
        </div>
      );
    }

    const Renderer = definition.Renderer;
    const styleClasses = resolveStyleClasses(section.styles);
    const customClass = section.styles?.customClass || "";
    const combinedClass = [styleClasses, customClass].filter(Boolean).join(" ");

    const inlineStyles: React.CSSProperties = {};
    if (section.styles?.customBgColor) {
      inlineStyles.backgroundColor = section.styles.customBgColor;
    }
    if (section.styles?.customBgImage) {
      inlineStyles.backgroundImage = `url(${section.styles.customBgImage})`;
      inlineStyles.backgroundSize = "cover";
      inlineStyles.backgroundPosition = "center";
      inlineStyles.backgroundRepeat = "no-repeat";
    }
    if (section.styles?.customTextColor) {
      inlineStyles.color = section.styles.customTextColor;
    }
    if (section.styles?.customPadding) {
      inlineStyles.padding = section.styles.customPadding;
    }
    if (section.styles?.customAlignment) {
      inlineStyles.textAlign = section.styles.customAlignment;
    }

    if (combinedClass || Object.keys(inlineStyles).length > 0) {
      return (
        <div className={combinedClass} style={inlineStyles}>
          <Renderer {...props} />
        </div>
      );
    }
    return <Renderer {...props} />;
  };

  const handleDragStart = (event: DragEventLike) => {
    const sourceId = event.operation?.source?.id;
    if (typeof sourceId === "string") setActiveDragId(sourceId);
  };

  const handleDragEnd = (event: DragEventLike) => {
    setActiveDragId(null);
    const operation = event.operation;
    if (!operation || !isSortableOperation(operation as Parameters<typeof isSortableOperation>[0])) return;
    const { source, target } = operation;
    if (!source || !target || source.id === target.id || typeof source.index !== "number" || typeof target.index !== "number") return;
    reorderSections(source.index, target.index);
  };

  const canvasWidth = {
    desktop: "max-w-[1440px]",
    tablet: "max-w-[820px]",
    mobile: "max-w-[420px]",
  }[previewMode];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-emerald-500" size={34} />
      </div>
    );
  }

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden bg-gray-200">
        <aside className="relative z-50 flex w-[336px] shrink-0 flex-col border-r border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-200 bg-gray-950 px-4 py-3 text-white">
            <div className="mb-3 flex items-center gap-2 text-lg font-black">
              <LayoutTemplate className="text-emerald-400" />
              {pageTitle} Builder
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || !dirty}
                className={`flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  dirty && !saving
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing || !draft}
                className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {publishing ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                Publish
              </button>
            </div>
            <div className="mt-3 text-xs font-semibold text-gray-400">
              {dirty ? "Unsaved draft changes" : "Draft is saved"}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!activeSection || !activeDefinition ? (
              <div className="p-4">
                <>
                  <h3 className="mb-1 text-lg font-black text-gray-900">Component Library</h3>
                    <p className="mb-5 text-sm leading-5 text-gray-500">Choose a polished storefront block. Newly added sections are selected automatically for editing.</p>
                    <div className="space-y-5">
                      {Object.entries(sectionGroups).map(([category, definitions]) => (
                        <div key={category}>
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">{category}</h4>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-black text-gray-400">{definitions.length}</span>
                          </div>
                          <div className="space-y-2">
                            {definitions.map((definition) => (
                              <button
                                key={definition.type}
                                type="button"
                                onClick={() => addSection(definition.type)}
                                className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-500/10"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition group-hover:bg-emerald-500 group-hover:text-white">
                                  <LayoutTemplate size={17} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-black text-gray-800">{definition.label}</span>
                                  <span className="mt-0.5 block line-clamp-2 text-xs font-medium leading-4 text-gray-500">
                                    {definition.description || "Reusable storefront section"}
                                  </span>
                                </span>
                                <Plus className="shrink-0 text-emerald-500 opacity-0 transition group-hover:opacity-100" size={16} />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                </>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 p-4 pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(null)}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-gray-900"
                    title="Back to component library"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-gray-900">{activeDefinition.label}</div>
                    <div className="truncate text-xs font-semibold text-gray-500">{activeSection.type}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(activeSection.id)}
                    className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                    title="Delete section"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex border-b border-gray-200 bg-gray-50/50 px-4 py-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveSectionTab("content")}
                    className={`flex-1 rounded-md py-1.5 text-xs font-black transition ${
                      activeSectionTab === "content"
                        ? "bg-white text-emerald-600 shadow-sm border border-gray-200/50"
                        : "text-gray-500 hover:text-gray-955"
                    }`}
                  >
                    Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSectionTab("design")}
                    className={`flex-1 rounded-md py-1.5 text-xs font-black transition ${
                      activeSectionTab === "design"
                        ? "bg-white text-emerald-600 shadow-sm border border-gray-200/50"
                        : "text-gray-500 hover:text-gray-955"
                    }`}
                  >
                    Design & Style
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5" data-section-editor={activeSection.id}>
                  {activeSectionTab === "content" ? (
                    activeDefinition.Editor ? (
                      <activeDefinition.Editor
                        section={activeSection}
                        props={activeSection.props}
                        categories={categories}
                        onChange={(patch) => updateSectionProps(activeSection.id, patch)}
                      />
                    ) : (
                      <div className="text-sm font-semibold text-gray-400 text-center py-8">
                        This component has no configurable content settings.
                      </div>
                    )
                  ) : (
                    <div className="space-y-5 text-sm">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Background Design</h4>
                        
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                            Background Color Theme
                          </span>
                          <select
                            value={activeSection.styles?.customBgColor || "transparent"}
                            onChange={(e) => updateSectionStyles(activeSection.id, { customBgColor: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          >
                            <option value="transparent">Transparent / Default</option>
                            <option value="#ffffff">Pure White</option>
                            <option value="#090d16">Sleek Dark</option>
                            <option value="#f0fdf4">Fresh Organic Green</option>
                            <option value="#fffbeb">Warm Sunset Gold</option>
                            <option value="#f0f9ff">Clear Ocean Blue</option>
                            <option value="#f9fafb">Soft Cozy Gray</option>
                            <option value="#fef2f2">Festive Soft Red</option>
                          </select>
                        </label>

                        <MediaPickerField
                          label="Background Image"
                          value={activeSection.styles?.customBgImage || ""}
                          onChange={(customBgImage) => updateSectionStyles(activeSection.id, { customBgImage })}
                        />
                      </div>
 
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Layout & Sizing</h4>
                        
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                            Section Padding
                          </span>
                          <select
                            value={activeSection.styles?.customPadding || "0px"}
                            onChange={(e) => updateSectionStyles(activeSection.id, { customPadding: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          >
                            <option value="0px">None (0px)</option>
                            <option value="24px 16px">Small (24px V, 16px H)</option>
                            <option value="48px 32px">Medium (48px V, 32px H)</option>
                            <option value="80px 48px">Large (80px V, 48px H)</option>
                            <option value="120px 64px">Extra Large (120px V, 64px H)</option>
                          </select>
                        </label>

                        <SegmentedControl
                          label="Text Alignment"
                          value={activeSection.styles?.customAlignment || "left"}
                          options={[
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                          ]}
                          onChange={(customAlignment) => updateSectionStyles(activeSection.id, { customAlignment: customAlignment as any })}
                        />

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                            Text Color
                          </span>
                          <select
                            value={activeSection.styles?.customTextColor || "inherit"}
                            onChange={(e) => updateSectionStyles(activeSection.id, { customTextColor: e.target.value })}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          >
                            <option value="inherit">Default / Inherit</option>
                            <option value="#1f2937">Dark Charcoal</option>
                            <option value="#6b7280">Muted Gray</option>
                            <option value="#ffffff">Pure White</option>
                            <option value="#15803d">Forest Green</option>
                          </select>
                        </label>
                      </div>
 
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Predefined Framework Spacing</h4>
                        <SegmentedControl
                          label="Spacing Top"
                          value={activeSection.styles?.spacingTop || "none"}
                          options={[
                            { label: "None", value: "none" },
                            { label: "SM", value: "sm" },
                            { label: "MD", value: "md" },
                            { label: "LG", value: "lg" },
                            { label: "XL", value: "xl" },
                          ]}
                          onChange={(spacingTop) => updateSectionStyles(activeSection.id, { spacingTop: spacingTop as any })}
                        />
                        <SegmentedControl
                          label="Spacing Bottom"
                          value={activeSection.styles?.spacingBottom || "none"}
                          options={[
                            { label: "None", value: "none" },
                            { label: "SM", value: "sm" },
                            { label: "MD", value: "md" },
                            { label: "LG", value: "lg" },
                            { label: "XL", value: "xl" },
                          ]}
                          onChange={(spacingBottom) => updateSectionStyles(activeSection.id, { spacingBottom: spacingBottom as any })}
                        />
                        <SegmentedControl
                          label="Container Width"
                          value={activeSection.styles?.container || "full"}
                          options={[
                            { label: "Full Width", value: "full" },
                            { label: "Contained", value: "contained" },
                            { label: "Narrow", value: "narrow" },
                          ]}
                          onChange={(container) => updateSectionStyles(activeSection.id, { container: container as any })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4 shadow-sm">
            <div className="flex items-center gap-2">
              {[
                { mode: "desktop" as const, icon: Eye, label: "Desktop" },
                { mode: "tablet" as const, icon: Tablet, label: "Tablet" },
                { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
              ].map((item) => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setPreviewMode(item.mode)}
                  title={item.label}
                  className={`rounded-lg p-2 transition ${
                    previewMode === item.mode
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon size={18} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={fetchBuilderPage}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
            >
              <Undo2 size={16} />
              Reload
            </button>
          </div>

          <div className="flex-1 overflow-auto px-4 py-6 sm:px-6" onClick={() => setSelectedSectionId(null)}>
            {!draft?.sections.length ? (
              <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 px-6 text-center text-gray-500">
                <LayoutTemplate size={56} className="mb-4 opacity-20" />
                <h2 className="mb-2 text-2xl font-black text-gray-700">Your canvas is empty</h2>
                <p className="text-sm font-medium">Add components from the library to build the homepage.</p>
              </div>
            ) : (
              <div className={`builder-preview-canvas mx-auto min-h-full overflow-visible bg-white shadow-2xl ring-1 ring-black/5 transition-all ${canvasWidth}`}>
                {draft.sections.map((section, index) => {
                  const definition = sectionRegistry[section.type];
                  return (
                    <EditableSection
                      key={section.id}
                      sectionId={section.id}
                      index={index}
                      name={definition?.label || section.type}
                      isEditing
                      isActive={selectedSectionId === section.id}
                      onClick={setSelectedSectionId}
                      onDelete={removeSection}
                    >
                      {renderSectionContent(section)}
                    </EditableSection>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <DragOverlay>
        {activeDragSection ? (
          <div className="w-full max-w-[1440px] overflow-hidden rounded-2xl border-2 border-emerald-500 bg-white opacity-90 shadow-2xl">
            {renderSectionContent(activeDragSection)}
          </div>
        ) : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
