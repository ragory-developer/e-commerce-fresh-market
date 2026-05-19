import PujaSpecialBanner from "./PujaSpecialBanner";
import { StaticSectionEditor } from "@/page-builder/editors";
import { SectionDefinition } from "@/page-builder/types";

export const pujaRegistry: Record<string, SectionDefinition> = {
  PujaSpecialBanner: {
    type: "PujaSpecialBanner",
    label: "Puja Festive Banner",
    category: "Marketing",
    defaultProps: {
      title: "Happy Durga Puja Special Offer",
    },
    Renderer: PujaSpecialBanner,
    Editor: StaticSectionEditor,
  },
};
