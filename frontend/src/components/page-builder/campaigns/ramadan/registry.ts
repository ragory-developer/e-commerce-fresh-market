import RamadanSpecialBanner from "./RamadanSpecialBanner";
import { StaticSectionEditor } from "@/page-builder/editors";
import { SectionDefinition } from "@/page-builder/types";

export const ramadanRegistry: Record<string, SectionDefinition> = {
  RamadanSpecialBanner: {
    type: "RamadanSpecialBanner",
    label: "Ramadan Banner",
    category: "Marketing",
    defaultProps: {
      title: "Ramadan Mubarak Special Deals",
    },
    Renderer: RamadanSpecialBanner,
    Editor: StaticSectionEditor,
  },
};
