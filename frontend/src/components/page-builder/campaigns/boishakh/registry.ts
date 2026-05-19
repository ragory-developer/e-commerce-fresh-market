import BoishakhSpecialBanner from "./BoishakhSpecialBanner";
import { StaticSectionEditor } from "@/page-builder/editors";
import { SectionDefinition } from "@/page-builder/types";

export const boishakhRegistry: Record<string, SectionDefinition> = {
  BoishakhSpecialBanner: {
    type: "BoishakhSpecialBanner",
    label: "Boishakhi Banner",
    category: "Marketing",
    defaultProps: {
      title: "Boishakh Special Festive Deals",
    },
    Renderer: BoishakhSpecialBanner,
    Editor: StaticSectionEditor,
  },
};
