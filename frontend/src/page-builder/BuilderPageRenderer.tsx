"use client";

import type { BuilderPageDocument, SectionRenderContext } from "./types";
import { resolveSectionProps, sectionRegistry } from "./registry";
import { resolveStyleClasses } from "./styleTokens";

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
            <div key={section.id} className={combinedClass} style={inlineStyles}>
              <Renderer {...props} />
            </div>
          );
        }
        
        return <Renderer key={section.id} {...props} />;
      })}
    </div>
  );
}
