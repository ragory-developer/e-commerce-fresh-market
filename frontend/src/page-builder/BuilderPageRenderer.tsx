"use client";

import type { BuilderPageDocument, SectionRenderContext } from "./types";
import { resolveSectionProps, sectionRegistry, migrateDeprecatedSections } from "./registry";
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
  const rawSections = document?.sections?.filter((section) => !section.settings?.hidden) || [];
  const { sections } = migrateDeprecatedSections(rawSections);

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

        const variantName = section.variant || definition.defaultVariant;
        const variantDef = definition.variants[variantName] || definition.variants[definition.defaultVariant];
        if (!variantDef) return null;

        const Renderer = variantDef.Renderer;
        const styleClasses = resolveStyleClasses(section.styles);
        const customClass = section.styles?.customClass || "";
        const combinedClass = [styleClasses, customClass].filter(Boolean).join(" ");
        
        const inlineStyles: React.CSSProperties = {
          position: "relative" as const,
        };
        const styles = section.styles || {};
        
        if (styles.bgColor) {
          inlineStyles.backgroundColor = styles.bgColor;
        } else if (styles.customBgColor) {
          inlineStyles.backgroundColor = styles.customBgColor;
        }

        if (styles.bgGradient) {
          inlineStyles.background = styles.bgGradient;
        }

        const bgImg = styles.bgImage || styles.customBgImage;
        if (bgImg) {
          inlineStyles.backgroundImage = `url(${bgImg})`;
          inlineStyles.backgroundSize = "cover";
          inlineStyles.backgroundPosition = "center";
          inlineStyles.backgroundRepeat = "no-repeat";
        }

        if (styles.textColor) {
          inlineStyles.color = styles.textColor;
        } else if (styles.customTextColor) {
          inlineStyles.color = styles.customTextColor;
        }

        if (styles.paddingX !== undefined || styles.paddingY !== undefined) {
          const px = styles.paddingX !== undefined ? `${styles.paddingX}px` : "0px";
          const py = styles.paddingY !== undefined ? `${styles.paddingY}px` : "0px";
          inlineStyles.padding = `${py} ${px}`;
        } else if (styles.customPadding) {
          inlineStyles.padding = styles.customPadding;
        }

        if (styles.customAlignment) {
          inlineStyles.textAlign = styles.customAlignment;
        }

        const hasOverlay = styles.bgOverlay !== undefined && styles.bgOverlay > 0;

        if (combinedClass || Object.keys(inlineStyles).length > 0 || hasOverlay) {
          return (
            <div key={section.id} className={combinedClass} style={inlineStyles}>
              {hasOverlay && (
                <div 
                  className="absolute inset-0 bg-black pointer-events-none" 
                  style={{ opacity: styles.bgOverlay! / 100, zIndex: 0 }} 
                />
              )}
              {hasOverlay ? (
                <div className="relative z-10 w-full h-full">
                  <Renderer {...props} />
                </div>
              ) : (
                <Renderer {...props} />
              )}
            </div>
          );
        }
        
        return <Renderer key={section.id} {...props} />;
      })}
    </div>
  );
}
