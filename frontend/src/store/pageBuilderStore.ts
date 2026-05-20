import { create } from "zustand";
import type { BuilderPageDocument, BuilderSection, BuilderPageVersion } from "@/page-builder/types";
import { createSection, migrateDeprecatedSections } from "@/page-builder/registry";

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

interface PageBuilderState {
  draft: BuilderPageDocument | null;
  published: BuilderPageDocument | null;
  draftVersionId: string | null;
  publishedVersionId: string | null;
  selectedSectionId: string | null;
  activeDragId: string | null;
  dirty: boolean;
  previewMode: "desktop" | "tablet" | "mobile";
  hydrate: (payload: {
    draft?: BuilderPageVersion | null;
    published?: BuilderPageVersion | null;
  }) => void;
  applyTemplate: (document: BuilderPageDocument) => void;
  setSelectedSectionId: (id: string | null) => void;
  setActiveDragId: (id: string | null) => void;
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void;
  addSection: (type: string) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  updateSectionProps: (id: string, patch: Record<string, unknown>) => void;
  updateSectionStyles: (id: string, patch: Partial<BuilderSection["styles"]>) => void;
  updateSectionVariant: (id: string, variant: string, defaultProps?: Record<string, unknown>) => void;
  addCustomSection: (section: BuilderSection) => void;
  markSaved: (draftVersionId: string) => void;
  markPublished: (publishedVersionId: string, document: BuilderPageDocument) => void;
}

export const usePageBuilderStore = create<PageBuilderState>((set) => ({
  draft: null,
  published: null,
  draftVersionId: null,
  publishedVersionId: null,
  selectedSectionId: null,
  activeDragId: null,
  dirty: false,
  previewMode: "desktop",

  hydrate: ({ draft, published }) => {
    let draftDocument = draft?.document || published?.document || null;
    let publishedDocument = published?.document || null;
    let migrated = false;

    if (draftDocument?.sections) {
      const result = migrateDeprecatedSections(draftDocument.sections);
      if (result.migrated) {
        draftDocument = { ...draftDocument, sections: result.sections };
        migrated = true;
      }
    }

    if (publishedDocument?.sections) {
      const result = migrateDeprecatedSections(publishedDocument.sections);
      if (result.migrated) {
        publishedDocument = { ...publishedDocument, sections: result.sections };
      }
    }

    set({
      draft: draftDocument,
      published: publishedDocument,
      draftVersionId: draft?.id || published?.id || null,
      publishedVersionId: published?.id || null,
      selectedSectionId: null,
      activeDragId: null,
      dirty: migrated || draft?.id !== published?.id,
    });
  },

  applyTemplate: (document) => set({
    draft: document,
    selectedSectionId: null,
    dirty: true,
  }),

  setSelectedSectionId: (selectedSectionId) => set({ selectedSectionId }),
  setActiveDragId: (activeDragId) => set({ activeDragId }),
  setPreviewMode: (previewMode) => set({ previewMode }),

  addSection: (type) => set((state) => {
    if (!state.draft) return state;
    const section = createSection(type);
    return {
      draft: {
        ...state.draft,
        sections: [...state.draft.sections, section],
      },
      selectedSectionId: section.id,
      dirty: true,
    };
  }),

  removeSection: (id) => set((state) => {
    if (!state.draft) return state;
    return {
      draft: {
        ...state.draft,
        sections: state.draft.sections.filter((section) => section.id !== id),
      },
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
      dirty: true,
    };
  }),

  reorderSections: (fromIndex, toIndex) => set((state) => {
    if (!state.draft || fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return state;
    return {
      draft: {
        ...state.draft,
        sections: reorder<BuilderSection>(state.draft.sections, fromIndex, toIndex),
      },
      dirty: true,
    };
  }),

  updateSectionProps: (id, patch) => set((state) => {
    if (!state.draft) return state;
    return {
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) => (
          section.id === id
            ? { ...section, props: { ...section.props, ...patch } }
            : section
        )),
      },
      dirty: true,
    };
  }),

  updateSectionStyles: (id, patch) => set((state) => {
    if (!state.draft) return state;
    return {
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) => (
          section.id === id
            ? { ...section, styles: { ...section.styles, ...patch } }
            : section
        )),
      },
      dirty: true,
    };
  }),

  updateSectionVariant: (id, variant, defaultProps = {}) => set((state) => {
    if (!state.draft) return state;
    return {
      draft: {
        ...state.draft,
        sections: state.draft.sections.map((section) => (
          section.id === id
            ? { ...section, variant, props: { ...defaultProps, ...section.props } }
            : section
        )),
      },
      dirty: true,
    };
  }),

  addCustomSection: (section) => set((state) => {
    if (!state.draft) return state;
    return {
      draft: {
        ...state.draft,
        sections: [...state.draft.sections, section],
      },
      selectedSectionId: section.id,
      dirty: true,
    };
  }),

  markSaved: (draftVersionId) => set({ draftVersionId, dirty: false }),

  markPublished: (publishedVersionId, document) => set({
    publishedVersionId,
    draftVersionId: publishedVersionId,
    published: document,
    draft: document,
    dirty: false,
  }),
}));
