import EidSpecialBanner from "./EidSpecialBanner";
import { StaticSectionEditor } from "@/page-builder/editors";
import { SectionDefinition } from "@/page-builder/types";

export const eidRegistry: Record<string, SectionDefinition> = {
  EidSpecialBanner: {
    type: "EidSpecialBanner",
    label: "Eid Celebration Banner",
    category: "Marketing",
    defaultProps: {
      title: "Eid Mubarak Special Offer",
    },
    Renderer: EidSpecialBanner,
    Editor: StaticSectionEditor,
  },
};
