# Project Roadmap

Two weeks of focused work for the MVP. The day split is a guide, not a contract —
stages move as needed. Anything that doesn't fit lands in "Later".

---

## Week 1 — foundation and databases

### Stage 0 — Setup ✅ COMPLETE

- [x] Vite + React 19 + TypeScript strict
- [x] TanStack Router (file-based)
- [x] Tailwind v4 with design tokens
- [x] ESLint 9 (type-aware + react-hooks), Prettier, Husky + lint-staged
- [x] Vitest
- [x] GitHub Actions CI (build, lint, typecheck, test)
- [x] CLAUDE.md and this roadmap

### Stage 1 — Brand and splash ✅ COMPLETE

- [x] nOOk wordmark with SVG eyes (cursor tracking, idle glances, blinking)
- [x] Lime primary color tokens (light + dark)
- [x] Once-per-session splash (fade in, blur out, reveal the app)

### Stage 2 — App shell and data foundation ✅ COMPLETE

- [x] Dexie database + first schema (pages)
- [x] Pages data access (create, rename, trash, restore) + tree builder
- [x] i18n (EN default, PL) with per-feature dictionaries
- [x] Theme store (light / dark / system)
- [x] App layout: sidebar + content area, mobile drawer

### Stage 3 — Sidebar and pages ✅ COMPLETE

- [x] Page tree with nesting, editable page title
- [x] Create, rename, delete, duplicate pages
- [x] Drag to reorder and re-parent (mouse + long-press on touch)
- [x] Emoji icon per page
- [x] Favorites and recently opened
- [x] Trash with restore and delete forever
- [x] Breadcrumbs, auto-expand ancestors of the open page

### Stage 4 — Databases: model + table view ✅ COMPLETE

- [x] Page type picker on create, routing to a view per page type
- [x] Database page type with typed properties (text, number, date, select,
      multi-select, checkbox, URL)
- [x] Add / rename / delete properties
- [x] Reorder and hide properties
- [x] Each record is a page (properties on top, content below)
- [x] Table view with inline cell editing
- [x] Sorting and filtering
- [x] Views as tabs, each with its own filters and sorting

### Stage 5 — Board view (Kanban) ✅ COMPLETE

- [x] Group by a select property (e.g. Status)
- [x] Drag cards between and within columns
- [x] New columns via new select options
- [x] Rename / recolor / reorder / delete columns (select options)
- [x] Card shows chosen properties; overdue marker

---

## Week 2 — documents, calendar, whiteboard, charts

### Stage 6 — Documents ✅ COMPLETE

- [x] Block editor (Tiptap): headings, lists, to-dos, quotes, code, dividers
- [x] Slash menu and Markdown shortcuts
- [x] Drag blocks

### Stage 7 — Links and backlinks

- [ ] `@` mentions of pages and records (with live status)
- [ ] Backlinks section under every page

### Stage 8 — Calendar view

- [ ] Month / week grid by a date property
- [ ] Drag a record to another day to change its date
- [ ] Create a record by clicking a day

### Stage 9 — Dashboard

- [ ] Records per status, done per week, burndown (Recharts)
- [ ] Stat tiles (total, overdue, done this week)
- [ ] Pick the source database

### Stage 10 — Polish and ship

- [ ] Keyboard shortcuts
- [ ] Sample workspace on first launch
- [ ] Mobile pass
- [ ] Unit tests for data + utils, 2–3 Playwright flows
- [ ] README with GIF and architecture notes
- [ ] Deploy to Vercel

### Stage 11 — Whiteboard (own Excalidraw-style canvas)

Built in-house rather than embedding `@excalidraw/excalidraw`: Rough.js for the
hand-drawn look (matches the eyes in the logo), perfect-freehand for the pen.

- [ ] New page type with an infinite canvas: zoom / pan
- [ ] Tools: pen, rectangle, ellipse, arrow, line, text, eraser
- [ ] Color and stroke width
- [ ] Select, move, resize, delete
- [ ] Undo / redo, export to PNG
- [ ] Scene stored as JSON in IndexedDB, like document bodies

---

## Polish of stages 1–6 (in progress)

- [x] Dark mode contrast, sidebar progress rings, eye moods
- [x] Board and table refresh (relative dates, quick-done, summary, footer)
- [x] Roles across pages, documents, databases and Today
- [ ] Formatting toolbar on text selection
- [ ] Command palette (Ctrl/Cmd+K)
- [ ] Debounced title writes, persistent storage, visible write errors
- [ ] Workspace export / import (JSON)

---

## Later (if time allows, otherwise post-MVP)

- Timeline (Gantt) view
- Page graph (Obsidian-style)
- Embeds in documents (database views, whiteboards, charts)
- Page version history
- Eye moods: hearts when a task is done, sleepy on empty states, …
- Supabase: auth, sync, real-time collaboration
- PWA, cross-tab sync indicator, recurring tasks, page templates
