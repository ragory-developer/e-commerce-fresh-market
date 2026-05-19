import BlackFridaySpecialBanner from "./BlackFridaySpecialBanner";
import { StaticSectionEditor } from "@/page-builder/editors";
import { SectionDefinition } from "@/page-builder/types";

export const blackfridayRegistry: Record<string, SectionDefinition> = {
  BlackFridaySpecialBanner: {
    type: "BlackFridaySpecialBanner",
    label: "Black Friday Banner",
    category: "Marketing",
    defaultProps: {
      title: "Black Friday Mega Clearance",
    },
    Renderer: BlackFridaySpecialBanner,
    Editor: StaticSectionEditor,
  },
};
