# Home Page Builder — Agent Skill Playbook (`skill.md`)

This playbook defines specific, actionable "skills" (technical procedures, command sequences, and code patterns) required to implement the Home Page Builder refactoring. Any agent working on this repository should refer to these skills to ensure correctness and architectural alignment.

---

## Skill 1: Prisma Schema Migration & Database Seeding

Use this skill when making changes to the database structure (e.g., in Phase 1) or seeding default/campaign templates.

### 1.1 Modifying `schema.prisma`
- Open `backend/prisma/schema.prisma`.
- Locate or add the `BuilderTemplate` model. Ensure the fields align with the architecture specification:
  - `scope`: `"page" | "block" | "theme"` (default: `"page"`)
  - `pageType`: target page (default: `"home"`)
  - `themeKey`: optional campaign identifier (`"ramadan" | "eid" | "puja" | "boishakh" | "blackfriday" | "christmas"`)
  - `thumbnail`: optional URL string
  - `document`: JSON representing the template layout or section data
  - `isSystem`: boolean (default: `false`)
  - `createdById`: optional creator ID
- Add proper index combinations:
  ```prisma
  @@index([scope, pageType])
  @@index([themeKey])
  ```

### 1.2 Running Prisma Migrations
Always run Prisma commands from the `backend/` directory:
```powershell
# From backend/
npx prisma migrate dev --name add_template_metadata_and_variants
```
*Note: Ensure your local database is running and accessible via `.env` configurations.*

### 1.3 Seeding the Database
- Open `backend/prisma/seed.ts`.
- Locate the main seed execution loop or create helper functions for seeding:
  - `seedDefaultHomeTemplate()`: Seeds `BuilderTemplate{ key: "default-home", scope: "page", isSystem: true }` with the result of `createDefaultHomeDocument()`.
  - `seedCampaignTemplates()`: Seeds the 6 theme templates (`ramadan-home`, `eid-home`, `puja-home`, `boishakh-home`, `blackfriday-home`, `christmas-home`) with stubbed documents.
- Run the seed script:
  ```powershell
  # From backend/
  npm run seed
  # OR directly with ts-node:
  npx ts-node prisma/seed.ts
  ```

---

## Skill 2: Zod Schema Extension (Backend & Frontend Sync)

Use this skill when adding section style fields or layout props. The validation schemas must be synced between backend and frontend.

### 2.1 Extending Zod Schemas on Backend
- Open `backend/src/modules/builder/schema.ts`.
- Find `BuilderSectionStyles` (or similar Zod schema) and extend it to include:
  - `bgColor`: `z.string().optional()` (Hex values)
  - `bgGradient`: `z.string().optional()` (Tailwind classes or custom CSS)
  - `bgImage`: `z.string().optional()` (Media URL)
  - `bgOverlay`: `z.number().min(0).max(100).optional()` (Overlay opacity)
  - `textColor`: `z.string().optional()` (Hex values)
  - `borderRadius`: `z.enum(["none", "sm", "md", "lg", "xl", "full"]).optional()`
  - `paddingX`: `z.number().optional()`
  - `paddingY`: `z.number().optional()`
- Find `builderSectionSchema` and ensure it accepts `variant`: `z.string().optional()`.

### 2.2 Re-generating or Syncing Zod Types on Frontend
If frontend uses shared Zod validators or generated TypeScript types:
- Sync changes to `frontend/src/page-builder/types.ts` (or the equivalent frontend schema file).
- Ensure the TypeScript interfaces match the Prisma/Zod structures exactly to avoid compilation errors.

---

## Skill 3: Frontend Component Variant Refactoring

Use this skill in Phase 3 to refactor the component registry and individual sections to support the new variant system without breaking backwards compatibility.

### 3.1 Updating the Component Registry
- Open `frontend/src/page-builder/registry.tsx`.
- Update `SectionDefinition` and `VariantDef` interfaces to support variant mapping.
- Refactor the existing components to follow this structure:
  ```tsx
  // Example Registry Entry Refactor
  export const sectionRegistry: Record<string, SectionDefinition> = {
    HeroBanner: {
      type: "HeroBanner",
      label: "Hero Banner",
      category: "Hero",
      contentKind: "static",
      defaultVariant: "classic",
      variants: {
        classic: {
          label: "Classic Hero",
          defaultProps: {
            title: "Fresh Organic Vegetables",
            subtitle: "Get up to 30% off",
            imageUrl: "/images/hero-classic.jpg"
          },
          Renderer: HeroClassicRenderer
        },
        minimal: {
          label: "Minimal Hero",
          defaultProps: {
            title: "Minimal Design",
            subtitle: "Clean and simple",
            imageUrl: "/images/hero-minimal.jpg"
          },
          Renderer: HeroMinimalRenderer
        }
      },
      Editor: HeroBannerEditor
    }
  };
  ```

### 3.2 Maintaining Legacy Campaign Components (Backward Compatibility)
To prevent runtime crashes when loading pages created with old campaign components:
- Do **not** delete the old files (e.g., `EidSpecialBanner.tsx`) immediately.
- Map the old component keys in the registry to point to the new consolidated components with the correct variant.
- Log a deprecation warning in the console when a legacy component is rendered or edited:
  ```ts
  console.warn(`[Deprecation] Section type "${oldType}" is deprecated. It will be migrated to "${newType}" with variant "${variant}" upon next save.`);
  ```

---

## Skill 4: Style Resolution and Class Mapping

Use this skill when resolving DB-saved styles into CSS classes or inline styles.

### 4.1 Modifying `resolveStyleClasses`
- Open the style resolver utility (typically in `frontend/src/page-builder/utils.ts` or `styles.ts`).
- Update `resolveStyleClasses(styles)` to return both a list of Tailwind classes and an inline style object:
  ```typescript
  export function resolveSectionStyles(styles: BuilderSectionStyles) {
    const classes: string[] = [];
    const inlineStyles: React.CSSProperties = {};

    // Standard properties mapping to Tailwind
    if (styles.container === "contained") classes.push("container mx-auto px-4");
    if (styles.container === "narrow") classes.push("max-w-4xl mx-auto px-4");
    if (styles.container === "full") classes.push("w-full");

    // Dynamic properties mapping to inline CSS
    if (styles.bgColor) {
      inlineStyles.backgroundColor = styles.bgColor;
    }
    if (styles.textColor) {
      inlineStyles.color = styles.textColor;
    }
    if (styles.bgImage) {
      inlineStyles.backgroundImage = `url(${styles.bgImage})`;
      inlineStyles.backgroundSize = "cover";
      inlineStyles.backgroundPosition = "center";
    }
    if (styles.paddingX !== undefined) {
      inlineStyles.paddingLeft = `${styles.paddingX}px`;
      inlineStyles.paddingRight = `${styles.paddingX}px`;
    }
    if (styles.paddingY !== undefined) {
      inlineStyles.paddingTop = `${styles.paddingY}px`;
      inlineStyles.paddingBottom = `${styles.paddingY}px`;
    }
    if (styles.borderRadius) {
      const radiusMap = {
        none: "0px",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      };
      inlineStyles.borderRadius = radiusMap[styles.borderRadius];
    }

    return { classes: classes.join(" "), inlineStyles };
  }
  ```

---

## Skill 5: Verification & API Testing

Use this skill to verify backend and frontend functionality throughout the implementation phases.

### 5.1 Backend REST API Verification
- Create manual test scripts or use a tool (like Postman or curl) to hit endpoints.
- Verification script template (`backend/scripts/test-templates-api.ts`):
  ```typescript
  async function testTemplates() {
    const res = await fetch("http://localhost:5000/api/builder/templates");
    const data = await res.json();
    console.log("Templates list:", data);
  }
  testTemplates();
  ```
- Run the script with `npx ts-node`.

### 5.2 Frontend Builder Smoke Test Checklist
1. **Fresh DB Check**: Delete drafts/published database rows, open the `/admin/home-builder` page, and verify the `default-home` template seeds and clones correctly.
2. **Template Switch Check**: Click "Apply Theme", select "Ramadan Theme", verify draft is replaced, and inspect the DB to ensure version history is preserved.
3. **Variant Change Check**: Swap a section's variant (e.g., from `classic` to `minimal`) and verify shared text props are kept intact.
4. **Style Update Check**: Adjust padding, background color, and border-radius using the editor controls, click save, and confirm public page matches the new styles.
