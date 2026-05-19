import ChristmasSpecialBanner from "./ChristmasSpecialBanner";
import { StaticSectionEditor } from "@/page-builder/editors";
import { SectionDefinition } from "@/page-builder/types";

export const christmasRegistry: Record<string, SectionDefinition> = {
  ChristmasSpecialBanner: {
    type: "ChristmasSpecialBanner",
    label: "Christmas Festive Banner",
    category: "Marketing",
    defaultProps: {
      title: "Merry Christmas & Happy New Year Offers",
    },
    Renderer: ChristmasSpecialBanner,
    Editor: StaticSectionEditor,
  },
};
