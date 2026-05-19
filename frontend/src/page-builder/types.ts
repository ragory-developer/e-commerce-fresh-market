import type { ComponentType } from "react";

export type BuilderPageKey = "home" | string;

export interface BuilderPageDocument {
  schemaVersion: 1;
  page: {
    key: BuilderPageKey;
    slug: string;
    title: string;
  };
  sections: BuilderSection[];
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface BuilderSectionStyles {
  spacingTop?: "none" | "sm" | "md" | "lg" | "xl";
  spacingBottom?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "brand" | "dark";
  container?: "full" | "contained" | "narrow";
  customClass?: string;
  customBgColor?: string;
  customBgImage?: string;
  customTextColor?: string;
  customPadding?: string;
  customAlignment?: "left" | "center" | "right";
}

export interface BuilderSection {
  id: string;
  type: string;
  props: Record<string, unknown>;
  styles?: BuilderSectionStyles;
  settings?: {
    hidden?: boolean;
    container?: "full" | "contained";
  };
}

export interface SectionEditorProps<TProps extends Record<string, unknown> = Record<string, unknown>> {
  section: BuilderSection;
  props: TProps;
  categories: Array<{ id: string; name: string }>;
  onChange: (patch: Partial<TProps>) => void;
}

export interface SectionRenderContext {
  allProducts?: unknown[];
  dbComponents?: any[];
}

export interface SectionDefinition<TProps extends Record<string, unknown> = Record<string, unknown>> {
  type: string;
  label: string;
  description?: string;
  category: "Hero" | "Commerce" | "Marketing" | "Content";
  defaultProps: TProps;
  Renderer: ComponentType<Record<string, unknown>>;
  Editor?: ComponentType<SectionEditorProps<TProps>>;
  resolveProps?: (props: TProps, context: SectionRenderContext) => Record<string, unknown>;
}

export interface BuilderPageVersion {
  id: string;
  version: number;
  status: "draft" | "published" | "archived" | string;
  document: BuilderPageDocument;
  publishedAt?: string | null;
  createdAt: string;
}
