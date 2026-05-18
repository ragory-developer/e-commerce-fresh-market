"use client";

import type { BuilderPageDocument, SectionRenderContext } from "./types";
import { resolveSectionProps, sectionRegistry } from "./registry";

export default function BuilderPageRenderer({
  document,
  context = {},
  emptyFallback,
}: {
  document: BuilderPageDocument | null;
  context?: SectionRenderContext;
  emptyFallback?: React.ReactNode;
}) {
  const sections = document?.sections?.filter((section) => !section.settings?.hidden) || [];

  if (sections.length === 0) {
    return emptyFallback || null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {sections.map((section) => {
        const definition = sectionRegistry[section.type];
        const props = resolveSectionProps(section, context);

        if (!definition || !props) {
          return null;
        }

        const Renderer = definition.Renderer;
        return <Renderer key={section.id} {...props} />;
      })}
    </div>
  );
}
