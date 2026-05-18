"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { availableSections, resolveSectionProps, sectionRegistry } from "@/page-builder/registry";
import type { BuilderPageDocument, BuilderSection } from "@/page-builder/types";
import { usePageBuilderStore } from "@/store/pageBuilderStore";

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

function createFallbackDocument(): BuilderPageDocument {
  return {
    schemaVersion: 1,
    page: {
      key: "home",
      slug: "/",
      title: "Home",
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

export default function HomeBuilderView({ allProducts = [] }: { allProducts?: unknown[] }) {
  const {
    draft,
    draftVersionId,
    selectedSectionId,
    activeDragId,
    dirty,
    previewMode,
    hydrate,
    setSelectedSectionId,
    setActiveDragId,
    setPreviewMode,
    addSection,
    removeSection,
    reorderSections,
    updateSectionProps,
    markSaved,
    markPublished,
  } = usePageBuilderStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  const fetchBuilderPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/builder/pages/home`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load builder page");
      }
      hydrate({
        draft: json.data.draft,
        published: json.data.published,
      });
    } catch (error: unknown) {
      hydrate({
        draft: {
          id: "",
          version: 0,
          status: "draft",
          document: createFallbackDocument(),
          createdAt: new Date().toISOString(),
        },
        published: null,
      });
      toast.error(error instanceof Error ? error.message : "Failed to load home builder");
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
      const res = await fetch(`${API_URL}/api/builder/pages/home/draft`, {
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
        const saveRes = await fetch(`${API_URL}/api/builder/pages/home/draft`, {
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

      const publishRes = await fetch(`${API_URL}/api/builder/pages/home/publish`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ draftVersionId: versionId }),
      });
      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.success) {
        throw new Error(publishJson.message || "Failed to publish page");
      }

      markPublished(publishJson.data.published.id, publishJson.data.published.document);
      toast.success("Homepage published");
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
        <aside className="relative z-50 flex w-[340px] shrink-0 flex-col border-r border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-200 bg-gray-950 p-4 text-white">
            <div className="mb-4 flex items-center gap-2 text-lg font-black">
              <LayoutTemplate className="text-emerald-400" />
              Home Builder
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || !dirty}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition ${
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
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
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
              <div className="p-5">
                <h3 className="mb-1 text-lg font-black text-gray-900">Component Library</h3>
                <p className="mb-4 text-sm text-gray-500">Add reusable storefront sections to the homepage.</p>
                <div className="space-y-2">
                  {availableSections.map((definition) => (
                    <button
                      key={definition.type}
                      type="button"
                      onClick={() => addSection(definition.type)}
                      className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-bold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      <span>
                        {definition.label}
                        <span className="mt-0.5 block text-xs font-semibold text-gray-400">{definition.category}</span>
                      </span>
                      <Plus className="text-emerald-500 opacity-0 transition group-hover:opacity-100" size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 p-4">
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
                <div className="flex-1 overflow-y-auto p-5">
                  {activeDefinition.Editor ? (
                    <activeDefinition.Editor
                      section={activeSection}
                      props={activeSection.props}
                      categories={categories}
                      onChange={(patch) => updateSectionProps(activeSection.id, patch)}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-300 bg-white px-4">
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

          <div className="flex-1 overflow-auto px-4 py-8" onClick={() => setSelectedSectionId(null)}>
            {!draft?.sections.length ? (
              <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-xl flex-col items-center justify-center text-center text-gray-500">
                <LayoutTemplate size={64} className="mb-4 opacity-20" />
                <h2 className="mb-2 text-2xl font-black">Your canvas is empty</h2>
                <p>Add components from the library to build the homepage.</p>
              </div>
            ) : (
              <div className={`mx-auto min-h-full bg-white shadow-2xl transition-all ${canvasWidth}`}>
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
