# nOOk — Project Context

## What this is

A Notion-style workspace — nested pages in a sidebar, databases with several views
(table, board, calendar), block documents, a whiteboard and a charts dashboard.
Frontend-only portfolio project: everything runs and persists in the browser.

The name is written **nOOk** — the double O is a pair of animated eyes (see Brand).

## Stack — committed decisions

- React 19 + Vite (SPA, not Next.js)
- TypeScript strict — ZERO `any`
- TanStack Router v1 — file-based, type-safe routing
- Dexie (IndexedDB) + `useLiveQuery` — ALL persisted data (see Data layer)
- Zustand v5 — ONLY local UI state (modals, drafts, filters)
- Tailwind CSS v4 with CSS-variable design tokens
- shadcn/ui for component primitives (added as needed)
- React Hook Form + Zod for forms; Zod schemas for persisted shapes
- dnd-kit (drag and drop), Tiptap (editor), date-fns
- Charts are small in-house SVG components (`features/dashboards`): colors through
  token classes, no chart library
- Vitest for unit tests; component tests with Testing Library in jsdom (`*.dom.test.tsx`,
  `// @vitest-environment jsdom` + `@/test/setup-dom`); Playwright for a few e2e flows
- pnpm, ESLint 9 flat config, Prettier, Husky + lint-staged

No TanStack Query: there is no server. IndexedDB answers in milliseconds and
`useLiveQuery` re-renders on every change (even from another tab), so a cache layer
would only add manual invalidation. If a backend (Supabase) is added later, Query
comes in behind the same `api/` + `hooks/` boundary and components don't change.

## Working style — SMALL CHUNKS

- Work in small, focused steps; after each one, summarize and let the user review
- Commit after each logical chunk (see Commits) and push to `main`
- For any non-trivial decision (data model, new library, architecture, naming of a
  new concept) present 2–3 options with pros/cons and a recommendation — don't decide
  unilaterally
- Design is not final: keep styling simple and token-based — a design pass comes
  later and should be able to restyle the app from `globals.css`

## Folder structure — feature-based co-location

```
src/
  app/          # router + provider composition
  routes/       # TanStack Router file routes (thin — mount feature pages)
  features/     # feature modules (the bulk of the app)
  components/
    ui/         # shadcn primitives (vendored, not linted)
    brand/      # nOOk wordmark + eyes
  hooks/        # shared hooks used by 2+ features
  lib/          # infrastructure (db, utils); lib/data = data access shared by features
  schemas/      # Zod schemas for persisted shapes; types via z.infer
  stores/       # shared Zustand stores
  utils/        # shared pure functions
  globals.css   # Tailwind + design tokens
```

Each feature in `src/features/<name>/` uses only the subfolders it needs:

- `api/` — data access functions over Dexie (no React)
- `components/` — feature components (pages + sub-components)
- `hooks/` — one hook per query / mutation
- `stores/` — Zustand UI stores
- `types/`, `utils/` — feature types and pure functions
- `i18n.ts` — the feature's EN/PL strings
- `index.ts` — PUBLIC interface, the only thing imported from outside

Rules:

- Import features via their barrel: `import { PageTree } from '@/features/pages'`,
  never from internal paths
- Features never import from each other's internals; shared code goes to root
  `components/`, `hooks/`, `lib/`, `utils/` once 2+ features need it
- Components max ~150 lines — split if larger
- One component per file, named exports only, no default exports

## Data layer

Three layers per resource: **api fn → hook → component**.

- `api/<resource>.ts` — plain async functions over the Dexie db, for data only one
  feature uses. Data shared by several features lives in `lib/data/` instead
  (`lib/data/pages.ts` — records are pages too, so databases need the page
  functions). These are the only places that touch the database.
- `hooks/use-<resource>.ts` — `useLiveQuery(() => listX())` for reads;
  `use-create-x.ts` etc. for writes
- Components never call Dexie directly
- Every table row has `id` (uuid), `createdAt`, `updatedAt`; deletes are soft where
  the trash needs them

## Roles and permissions

- Roles: `owner`, `editor`, `viewer` (`lib/permissions`). One matrix (`GRANTS`)
  maps each role to the actions it may perform (`page.create`, `page.edit`,
  `page.trash`, `page.deleteForever`, `database.editSchema`, `record.edit`,
  `workspace.manage`)
- Components ask `useCan(action)` (or `usePermissions()` for several checks) and
  hide or disable what the role can't do — never check the role name directly
- Every new feature that writes data adds or reuses an action here
- No auth yet: the role comes from `profile.store` and the profile menu in the sidebar.
  With a backend the role comes from the session, and the server enforces the
  same rules — the UI checks are only for UX

## Code style

- File names kebab-case (`page-tree.tsx`, `use-pages.ts`, `pages-ui.store.ts`)
- Components PascalCase, hooks `useX`, functions camelCase, constants
  SCREAMING_SNAKE_CASE, types PascalCase
- No comments by default. Comment only something genuinely non-standard that the
  code can't say itself: a browser quirk, a workaround, a non-obvious convention
  (e.g. "the last option of the status select means done"). Never restate the code
- Comments, code and commits in English
- Discriminated unions for multi-state values
- Prettier: single quotes, semicolons, trailing commas, width 100

## i18n

- UI in English (default) and Polish
- Each feature owns its strings in `features/<name>/i18n.ts`; English is the
  source shape, every locale must match it

## Commits

- Conventional Commits with a scope, lowercase, imperative, ~60 chars:
  `feat(pages): add nested page tree`, `fix(board): …`, `style(brand): …`
- Related small changes can share one title, joined by commas
- Body only when it adds something; no `Co-Authored-By` trailer
- Prefixes: feat, fix, refactor, style, test, docs, chore, perf, ci

## Brand

- Wordmark `nOOk` in Bricolage Grotesque 800 (optical size pinned to 96); UI text in
  Geist
- The OO are SVG eyes (`components/brand`): hand-drawn outlines, lime iris, black
  pupil, two catchlights. They follow the cursor, glance around when idle and blink
- Primary color: lime (`--primary` in `globals.css`). Dark text on lime fills;
  `--primary-text` (deeper lime) for text/links on light surfaces
- Splash: once per browser session (sessionStorage), white → wordmark fades in →
  wordmark blurs out → beat of white → app fades in

## Visual direction

nOOk must not look like a generic AI-generated app. Lean on what's ours — the eyes,
the lime, Bricolage for display type — and keep the rest quiet and precise.

- NO purple/blue gradients, glassmorphism, glowing borders or "sparkle" accents
- NO identical rounded cards with soft shadows for everything; prefer plain rows,
  hairline borders and whitespace
- NO emoji in headings or buttons as decoration (page icons are user content)
- Lime is an accent, not a fill for every surface — one strong primary per view
- Small details over big effects (drop lines, focus states, the eyes reacting)
- Warm neutrals (paper sidebar, warm greys and borders), small radii (`rounded-sm`/
  `rounded-md`), hairlines over shadows
- `eyebrow` utility (mono, uppercase, 11px) for section labels, column names, counts
- `btn-primary` utility for the main action; the active sidebar row gets a 2px lime bar
- Content is left-aligned and fills the available width — no centered narrow column
  with empty gutters; columns (table, board) stretch to fit
- No horizontal scrolling on desktop unless the content truly can't fit (e.g. many
  columns); on phones, swipeable rows are fine

## What NOT to do

- NO `any`, NO default exports
- NO TanStack Query / Axios / backend code (until a backend is decided)
- NO direct Dexie calls from components
- NO hardcoded colors in components — use tokens
- NO var() inside SVG presentation attributes (`fill="var(…)"`) — use classes
- NO scope creep beyond the current roadmap stage
