<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Instructions for Home Page Builder

Welcome agent! You are assigned to implement the **Home Page Builder** refactoring for the FreshCart e-commerce website. The project requirements, architectural design, and tasks are detailed in the repository documents:
- Architecture Guide: [home-builder-architecture.md](file:///d:/Rasel%20Mahmud%20Shanto/e-commerce-fresh-market/frontend/home-builder-architecture.md)
- Sequential Checklist: [home-builder-tasks.md](file:///d:/Rasel%20Mahmud%20Shanto/e-commerce-fresh-market/frontend/home-builder-tasks.md)
- Code & Tool Playbook: [skill.md](file:///d:/Rasel%20Mahmud%20Shanto/e-commerce-fresh-market/frontend/skill.md)

---

## 1. Core Directives

1. **Sequential Phase Execution**: You must complete tasks phase-by-phase in the order specified in `home-builder-tasks.md`. Never jump to styling or component building before validating database migrations and APIs.
2. **Backwards Compatibility**: The existing `/home` page must continue to render without errors. Ensure all legacy campaign components (`EidSpecialBanner`, etc.) map cleanly as aliases to consolidated component variants, emitting deprecation warnings in the console where appropriate.
3. **No Empty Canvas (First-Load Rule)**: The admin page builder should never open to an empty workspace. Ensure the seeding of `BuilderTemplate` with `key: "default-home"` is correct, and that the backend clones this default layout as a new draft if no published draft exists.
4. **Premium UI & Design Guidelines**: Adhere to the modern visual aesthetics described in the web application guidelines. Ensure all components use harmonized palette presets, rounded corners, dynamic layout sizing (cols, gap), and responsive styling.

---

## 2. Technical Map & File List

Refer to these files when modifying the builder architecture:
- **Backend Schema & Database**:
  - Prisma Schema: [schema.prisma](file:///d:/Rasel%20Mahmud%20Shanto/e-commerce-fresh-market/backend/prisma/schema.prisma)
  - Seeds Script: [seed.ts](file:///d:/Rasel%20Mahmud%20Shanto/e-commerce-fresh-market/backend/prisma/seed.ts)
  - Zod Validators: `backend/src/modules/builder/schema.ts`
- **Backend APIs & Controllers**:
  - API Routes: `backend/src/modules/builder/routes.ts`
  - Admin Controller: `backend/src/modules/builder/controller.ts` (specifically `getAdminPage` cloning logic)
- **Frontend Components & Registry**:
  - Builder Types: `frontend/src/page-builder/types.ts`
  - Component Registry: `frontend/src/page-builder/registry.tsx`
  - Page Renderer: `frontend/src/page-builder/renderer.tsx` or similar rendering logic
  - Admin Layout & Editor: `frontend/src/components/admin/HomeBuilder/`
- **Documentation**:
  - API Reference: `docs/builder-api.md` (to be updated/created in Phase 2)
  - Authoring Guide: `docs/builder-authoring.md` (to be created in Phase 9)

---

## 3. Operational Workflow

For each phase of the implementation:
1. **Prepare**: Open the relevant backend or frontend files, check for existing code patterns, and double-check instructions in the architecture document.
2. **Implement**: Refer to [skill.md](file:///d:/Rasel%20Mahmud%20Shanto/e-commerce-fresh-market/frontend/skill.md) for concrete templates and syntax guidelines. Write complete, well-commented code, keeping component definitions separate.
3. **Verify**: Use curl/manual test scripts for API testing. Inspect database updates using Prisma Studio or querying. Run `npm run dev` to verify hot module replacement and client rendering.
4. **Document Progress**: Tick the checkboxes in `home-builder-tasks.md` as soon as you have verified the completion of a specific task.
