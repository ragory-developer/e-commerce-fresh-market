# Home Page Builder — Architecture

**Status:** Design doc for refactoring FreshCart's existing `BuilderPage` system into a themeable, variant-driven, template-pack-capable page builder.
**Audience:** Implementing AI agent + reviewing senior developer.
**Scope:** `/home` page only for v1, but data model and patterns are page-agnostic.

---

## 0. Working assumptions (confirm before building)

These were picked because they're the scalable choice. Flag any that's wrong.

| # | Decision | Picked |
|---|----------|--------|
| 1 | Theme apply behaviour | **Replace** the section list with the pack's layout (not merge) |
| 2 | Component variants | **One section type**, `variant` prop switches internal layout |
| 3 | Block library scope | **Single configured section** saved as reusable preset |
| 4 | Dynamic component editability | Card **chrome** only (cols, gap, radius, badge style, show/hide bits) — not card internals |
| 5 | Default template source | Seeded `BuilderTemplate` row, cloned to draft on first admin visit |
| 6 | Theme packs are also `BuilderTemplate` rows | Yes — themes and "starter templates" are the same primitive |

---

## 1. Mental model

Three primitives. Don't conflate them.

**Component (section type)** — code. `HeroBanner`, `ProductShowcase`, `PromoBadgeGrid`. One file, one renderer, internally branches on `variant`.

**Section (instance)** — JSON node in a page document. `{ id, type: "HeroBanner", variant: "festive-v2", props: {...}, styles: {...} }`. Lives in `BuilderPageVersion.document.sections[]`.

**Template** — a pre-built `sections[]` array. Themes (Ramadan, Eid), starter layouts, and saved blocks are all templates — they differ only by `scope`: `page` vs `block`.

```
Component  →  defines what's possible (code)
Section    →  a placed, configured instance (JSON)
Template   →  a saved arrangement of sections (JSON in DB)
```

---

## 2. Static vs dynamic components

Every component declares its content class. Drives what the editor exposes.

**Static** — content stored in `section.props`. Editor surfaces text, media-picker, alignment, padding, bg color/gradient/image.
> `HeroBanner`, `HeroSlider`, `SpecialOffersBanner`, `ConsultationBanner`, `RoutineBanner`, `PromoBadgeGrid`, `TestimonialSection`, `PromoBanner`, `SectionWrapper`

**Dynamic** — content pulled from live DB (products, categories). Editor surfaces only display config (cols, gap, card variant, show rating, show badge, sort, limit, source filter). Content is *never* embedded in props.
> `ProductShowcase`, `HotDealsSection`, `NewArrivalsSection`, `CategoryPills`, `CategoryCard`

**Hybrid** — static heading + dynamic body. Same rules: text fields editable, the data list isn't. Most "dynamic" components above are actually hybrids — title/subtitle is static, the cards are dynamic. The editor reflects that split.

Declare this on the `SectionDefinition`:
```ts
contentKind: "static" | "dynamic" | "hybrid"
dynamicFields?: string[]   // e.g. ["products"] — never written to props
```

---

## 3. Variant system

Replaces the current "one component per campaign" pattern (`EidSpecialBanner`, `PujaSpecialBanner`, etc. → all collapse into `SpecialOffersBanner` with `variant: "eid"`).

```ts
SectionDefinition {
  type: "HeroBanner",
  variants: {
    "classic":   { label: "Classic",  defaultProps: {...}, layout: HeroClassic },
    "festive":   { label: "Festive",  defaultProps: {...}, layout: HeroFestive },
    "minimal":   { label: "Minimal",  defaultProps: {...}, layout: HeroMinimal },
    "video-bg":  { label: "Video BG", defaultProps: {...}, layout: HeroVideoBg },
  }
}
```

Section JSON: `{ type: "HeroBanner", variant: "festive", props: {...} }`.

Variant switch in editor = load that variant's `defaultProps` as a base, merge user's existing props on top where keys overlap. Variant change is non-destructive for shared fields.

**Migration:** existing `EidSpecialBanner` etc. stay registered as deprecated types that redirect to `{ type: "SpecialOffersBanner", variant: "eid" }` on read. No data loss.

---

## 4. Style tokens

Every section has `styles`. Already exists in your schema — extend it:

```ts
BuilderSectionStyles {
  // existing
  spacingTop, spacingBottom: "none"|"sm"|"md"|"lg"|"xl"
  background: "white"|"gray"|"brand"|"dark"
  container: "full"|"contained"|"narrow"

  // new
  bgColor?: string         // hex from color picker
  bgGradient?: string      // "from-X via-Y to-Z" tailwind OR full CSS
  bgImage?: string         // media library URL
  bgOverlay?: number       // 0-100 darkness over bg image
  textColor?: string       // hex
  borderRadius?: "none"|"sm"|"md"|"lg"|"xl"|"full"
  paddingX?, paddingY?: number  // px override
}
```

Resolved by `resolveStyleClasses()` (already exists, extend it).

---

## 5. Data model changes

Current `BuilderTemplate` and `BuilderTemplatePack` exist but aren't used. Repurpose them.

```prisma
model BuilderTemplate {
  id         String   @id @default(cuid())
  key        String   @unique           // "default-home", "ramadan-home", "hero-festive-v1"
  name       String
  scope      String   @default("page")  // "page" | "block" | "theme"
  pageType   String   @default("home")  // which page this targets
  themeKey   String?                    // "ramadan"|"eid"|"puja"|"boishakh"|"blackfriday"|"christmas"
  thumbnail  String?                    // media URL for the picker
  document   Json                       // BuilderPageDocument (full) for page/theme, single section JSON for block
  status     String   @default("active")// "active"|"locked"|"draft"
  isSystem   Boolean  @default(false)   // shipped by us vs user-created
  packId     String?
  pack       BuilderTemplatePack? @relation(...)
  createdById String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([scope, pageType])
  @@index([themeKey])
}
```

`BuilderTemplatePack` stays — it groups themes ("Festive 2026" pack containing Ramadan + Eid + Boishakh templates).

**Server endpoints to add:**
```
GET    /api/builder/templates?scope=page|block&theme=ramadan
POST   /api/builder/templates                    // save current draft as template (block or page)
POST   /api/builder/pages/:key/apply-template    // body: { templateId } — replaces draft sections
GET    /api/builder/templates/:id                // for previews
DELETE /api/builder/templates/:id                // user-created only
```

---

## 6. First-load / default template flow

```
Admin opens /admin/home-builder
  → GET /api/builder/pages/home
  → if no draft AND no published version:
      → server clones BuilderTemplate(key="default-home").document into a new draft
      → returns it
  → if draft exists: returns draft as-is
```

Seed creates exactly one `BuilderTemplate{ key:"default-home", isSystem:true }` containing the curated layout. Admin always sees *something*, never an empty canvas.

---

## 7. Theme application flow

```
Admin clicks "Apply Ramadan theme" in template picker
  → preview modal shows BuilderTemplate(themeKey:"ramadan").document rendered
  → admin clicks Apply
  → POST /api/builder/pages/home/apply-template { templateId }
  → server: clones template.document into a new draft version, bumps version number
  → admin returns to editor with the Ramadan layout loaded as draft
  → admin can edit any section, save, publish like normal
```

Apply = **replace draft**, not merge. The previous draft is preserved as an older version (you have versioning already) so "undo theme" = restore previous version.

---

## 8. Block library (saved single sections)

Same `BuilderTemplate` table, `scope: "block"`. `document` is one section object, not a full page document.

Editor adds an "Add from library" button next to "Add section". User picks → block inserted at cursor with a fresh `id`.

User clicks "Save as block" on any section → modal asks name + thumbnail → POSTs to templates table.

---

## 9. Component registry — required changes

Current `sectionRegistry` is a flat record. Extend to:

```ts
SectionDefinition {
  type: string
  label: string
  category: "Hero" | "Commerce" | "Marketing" | "Content" | "Layout"
  contentKind: "static" | "dynamic" | "hybrid"
  dynamicFields?: string[]
  variants: Record<string, VariantDef>     // at minimum: { default: {...} }
  defaultVariant: string
  Editor: ComponentType<SectionEditorProps>
  resolveProps?: (props, context) => props // for dynamic/hybrid data injection
}

VariantDef {
  label: string
  thumbnail?: string
  defaultProps: Record<string, unknown>
  Renderer: ComponentType
}
```

`BuilderPageRenderer` resolution becomes:
```
definition = registry[section.type]
variant    = definition.variants[section.variant ?? definition.defaultVariant]
props      = resolveSectionProps(section, context)   // merges DB defaults, applies dynamic data
<variant.Renderer {...props} />
```

---

## 10. Card chrome customisation (dynamic components)

For `ProductShowcase` (and similar), editor exposes:

```ts
{
  // header (static)
  title, subtitle, headerAlign

  // source (dynamic — what to pull)
  sourceType: "all" | "category" | "featured" | "sale" | "manual"
  categoryId?, productIds?
  limit: number
  sort: "newest"|"popular"|"price-asc"|"price-desc"

  // card chrome
  layout: "grid" | "carousel"
  cols: { mobile: 2, tablet: 3, desktop: 5 }
  gap: "sm"|"md"|"lg"
  cardVariant: "classic"|"minimal"|"festive"   // maps to ProductCard internal variants
  cardRadius: "sm"|"md"|"lg"|"xl"
  showBadge, showRating, showAddToCart: boolean
  badgeStyle: "pill"|"corner"|"ribbon"
}
```

`ProductCard` itself takes a `variant` prop and renders accordingly. Card content (name, price, image) is never editable — that's product data.

---

## 11. Migration path from current state

1. Add `variants` field to `SectionDefinition`, default each existing component to `{ default: { defaultProps: existingDefaults, Renderer: existingComponent } }`. Nothing breaks.
2. Add `variant` field to `BuilderSection` zod schema, default `"default"`.
3. Collapse campaign components: `EidSpecialBanner` → `SpecialOffersBanner` variant `"eid"`. Keep old types registered as aliases that emit a deprecation log.
4. Extend `BuilderSectionStyles` zod schema with new style fields.
5. Wire `BuilderTemplate` table: seed default-home + 6 theme rows.
6. Add template-apply endpoint.
7. Admin UI: template picker modal, variant switcher in section editor, style panel additions, block library buttons.

Existing pages keep working at every step.

---

## 12. Out of scope for v1

- Multi-page builder UI (data model supports it; UI only does `home`).
- Custom code blocks / user-uploaded React components (security review needed).
- A/B testing / personalisation.
- Localisation per section.
- Per-user template marketplace.

---

## 13. Open questions for product owner

1. Color picker — restricted palette (brand-safe) or full hex/rgb? Recommend palette with "custom" escape hatch.
2. Theme application — should it also force-swap site-wide tokens (header bg, footer accent) or only home sections? v1 = sections only.
3. Should publishing a theme template auto-schedule via `activeFrom/activeTo`? Useful for "Eid goes live April 10".
4. Roles — who can create/edit `isSystem:false` templates? Assume `ADMIN+`.
