# Home Page Builder — Implementation Task List

Sequential. Each phase ends with a working app — don't skip ahead.
Tick boxes as you go. Tasks marked **[BLOCK]** must finish before next phase.

---

## Phase 0 — Prep (1 session)

- [x] Read `home-builder-architecture.md` end to end.
- [x] Confirm the 6 working assumptions in §0 with product owner.
- [x] Branch: `feat/home-builder-v2`.
- [x] Snapshot DB before any migration.

---

## Phase 1 — Schema & seed foundations [BLOCK]

Backend: `backend/prisma/schema.prisma`, migrations, `prisma/seed.ts`.

- [x] Add to `BuilderTemplate`: `scope`, `pageType`, `themeKey`, `thumbnail`, `isSystem`, `createdById`. Add indexes from arch §5.
- [x] Extend `BuilderSectionStyles` Zod schema (`backend/src/modules/builder/schema.ts`) with `bgColor`, `bgGradient`, `bgImage`, `bgOverlay`, `textColor`, `borderRadius`, `paddingX`, `paddingY`.
- [x] Add `variant?: string` to `builderSectionSchema`.
- [x] Generate migration `add_template_metadata_and_variants`.
- [x] Seed `BuilderTemplate{ key:"default-home", scope:"page", isSystem:true }` with the document from `createDefaultHomeDocument()`.
- [x] Seed 6 theme template rows (one per festival): `ramadan-home`, `eid-home`, `puja-home`, `boishakh-home`, `blackfriday-home`, `christmas-home`. Stub `document` for now — real layouts come in Phase 5.
- [x] Verify migration runs clean on fresh DB.

---

## Phase 2 — Backend variant + template APIs [BLOCK]

Backend: `backend/src/modules/builder/`.

- [x] Update `validateBuilderDocument` to accept optional `variant` per section.
- [x] **Controller:** in `getAdminPage`, when no draft exists, clone `BuilderTemplate(key:"default-home").document` instead of `createDefaultHomeDocument()`. Delete the hardcoded fn after.
- [x] Add endpoint `GET /api/builder/templates` with query `?scope=&themeKey=&pageType=`.
- [x] Add endpoint `GET /api/builder/templates/:id`.
- [x] Add endpoint `POST /api/builder/templates` (save block or page).
- [x] Add endpoint `POST /api/builder/pages/:key/apply-template` — clones template.document into a new draft version, returns it.
- [x] Add endpoint `DELETE /api/builder/templates/:id` (only `isSystem:false`).
- [x] Wire routes in `builder/routes.ts`. Admin auth on all writes.
- [x] Manual test each endpoint with curl/Postman, document in `docs/builder-api.md`.

---

## Phase 3 — Frontend registry refactor [BLOCK]

Frontend: `frontend/src/page-builder/`, `frontend/src/components/home/`.

- [x] Update `SectionDefinition` type in `types.ts` per arch §9 (add `variants`, `defaultVariant`, `contentKind`, `dynamicFields`).
- [x] Refactor `registry.tsx`: wrap every existing component as `variants: { default: { label:"Default", defaultProps:<existing>, Renderer:<existing> } }`. No behaviour change yet.
- [x] Tag each entry's `contentKind`:
  - static: HeroBanner, SpecialOffersBanner, ConsultationBanner, RoutineBanner, PromoBadgeGrid, TestimonialSection
  - hybrid: ProductShowcase, HotDealsSection, NewArrivalsSection
- [x] Update `BuilderPageRenderer` to pick `variant.Renderer` instead of `definition.Renderer`.
- [x] Update `resolveSectionProps` to merge from variant's defaultProps, then DB defaults, then section.props.
- [x] Verify existing home still renders identically.
- [x] Collapse campaign components: register `Eid/Puja/Ramadan/Boishakh/BlackFriday/Christmas SpecialBanner` as variants under `SpecialOffersBanner`. Keep old types as aliases that warn in console and redirect on first save.

---

## Phase 4 — Editor UI: variant switcher + style panel

Frontend: `frontend/src/components/admin/HomeBuilder/`, `frontend/src/page-builder/editors.tsx`.

- [x] Add **Variant Switcher** row at top of every section editor: thumbnails (or labels for now) of `definition.variants`. Click swaps variant, merges shared props.
- [x] Add **Style Panel** tab to section editor with controls for the new style fields:
  - Color pickers (bg, text) — native `<input type="color">` + hex text input
  - Gradient picker (preset list + custom CSS textarea)
  - BG image media picker (reuse `MediaPickerField`)
  - Overlay slider 0–100
  - Border radius segmented control
  - Padding X/Y sliders
- [x] Style changes write to `section.styles`, not `section.props`.
- [x] Update `resolveStyleClasses` + `BuilderPageRenderer` inline style block to apply new fields.

---

## Phase 5 — Theme variant content [BLOCK before Phase 6]

Build the actual festive variants. Each existing static component gets 6 new variants — minimum visual swap (colours, copy, imagery), full editability preserved.

- [x] `HeroBanner`: add variants `eid`, `puja`, `ramadan`, `boishakh`, `blackfriday`, `christmas`. Reuse existing `themeVariant` infra; promote it to top-level `variant`.
- [x] `SpecialOffersBanner`: variants `eid`, `puja`, `ramadan`, `boishakh`, `blackfriday`, `christmas`. Migrate logic from existing campaign components into variant renderers.
- [x] `PromoBadgeGrid`: 6 theme variants (icon set + gradient palette swap).
- [x] `TestimonialSection`: 6 theme variants (background, badge colour).
- [x] `ConsultationBanner`, `RoutineBanner`: 6 theme variants each.
- [x] Fill the 6 theme `BuilderTemplate.document` rows seeded in Phase 1 with real curated layouts using these variants.
- [x] Delete (or mark deprecated) the standalone `components/page-builder/campaigns/*` files once aliases prove stable.


---

## Phase 6 — Template picker UI

Frontend: admin builder page.

- [x] Add **"Templates"** button in admin toolbar → opens modal.
- [x] Modal has tabs: **Starters | Themes | My Blocks**.
- [x] Starters tab: `GET /templates?scope=page&themeKey=null`. Cards show thumbnail + name + Apply.
- [x] Themes tab: `GET /templates?scope=page&themeKey=NOT_NULL`. Grouped by `themeKey`.
- [x] Hover/click a card → preview panel (read-only `BuilderPageRenderer` of `template.document`).
- [x] Apply button → confirmation ("This replaces your current draft. Previous draft is kept in version history.") → calls apply-template endpoint → reloads draft.
- [x] My Blocks tab in Phase 7.

---

## Phase 7 — Block library

- [x] **Save as Block** button on each section's action bar in admin.
  - Modal: name, optional thumbnail, scope locked to `"block"`.
  - POSTs to `/api/builder/templates`.
- [x] **Add Block** button in the add-section panel.
  - Lists `GET /templates?scope=block`.
  - Inserts a copy of the block's single-section document into draft at cursor with fresh `id`.
- [x] **My Blocks** tab in Templates modal — manage (delete user blocks, can't delete system blocks).

---

## Phase 8 — Dynamic component card chrome

For `ProductShowcase` (lead case, then duplicate pattern to `HotDealsSection`, `NewArrivalsSection`).

- [x] Add new props to `ProductShowcase`: `sourceType`, `limit`, `sort`, `cols`, `gap`, `cardVariant`, `cardRadius`, `showBadge`, `showRating`, `showAddToCart`, `badgeStyle`.
- [x] Refactor `ProductCard` to accept `variant`, `radius`, `badgeStyle`, `showRating`, `showBadge`, `showAddToCart` props. Add 2–3 visual variants beyond classic.
- [x] Update `ProductShowcaseEditor` with all chrome controls (no card-content fields — those stay locked).
- [x] Update `resolveSectionProps` for `ProductShowcase` to apply source filters server-side (or filter `allProducts` client-side for v1).
- [x] Repeat for `HotDealsSection` , `NewArrivalsSection` and `ShopbyCategory`.

---

## Phase 9 — Polish + handoff

- [x] Default-template fallback: if `BuilderTemplate(key:"default-home")` missing in DB, hardcoded JS fallback kicks in (don't crash production).
- [x] Versioning UI: list versions, "restore this version" button (uses existing data, just needs UI).
- [x] Loading skeletons in template picker.
- [x] Empty state for "no blocks saved yet".
- [x] `docs/builder-api.md` finalised.
- [x] `docs/builder-authoring.md` — how a developer adds a new component or variant.
- [x] Manual QA pass: create page from scratch → apply theme → edit → save block → reuse block → publish → verify public renders.

---

## Out-of-band items (defer past prototype)

- Color picker brand-palette mode.
- Theme scheduling integration with existing `activeFrom`/`activeTo`.
- Custom code section type (security review needed).
- Multi-page builder UI (data model already supports it).
- User-uploaded component bundles.

---

## Acceptance criteria for "working prototype"

1. Fresh DB → admin opens builder → sees default home → can edit any text/image/style → save → publish → public page reflects changes.
2. Admin opens template picker → applies Ramadan theme → home swaps to Ramadan layout → admin tweaks Hero title → publishes → public shows Ramadan home.
3. Admin saves a configured Hero as a block → opens add panel → block appears → inserts into page → independent edits don't affect the saved block.
4. Admin changes ProductShowcase from 5-col grid to 3-col carousel with rounded cards → public reflects it, product data unchanged.
5. Versioning: admin can roll back to pre-Ramadan version.
