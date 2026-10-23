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

### Stage 4 — Databases: model + table view

- [ ] Page type picker on create, routing to a view per page type
- [ ] Database page type with typed properties (text, number, date, select,
      multi-select, checkbox, URL)
- [ ] Add / edit / reorder / delete properties
- [ ] Each record is a page (properties on top, content below)
- [ ] Table view with inline cell editing
- [ ] Sorting and filtering
- [ ] Views as tabs, each with its own filters and sorting

### Stage 5 — Board view (Kanban)

- [ ] Group by a select property (e.g. Status)
- [ ] Drag cards between and within columns
- [ ] Add / rename / reorder columns
- [ ] Card shows chosen properties; overdue marker

---

## Week 2 — documents, calendar, whiteboard, charts

### Stage 6 — Documents

- [ ] Block editor (Tiptap): headings, lists, to-dos, quotes, code, dividers
- [ ] Slash menu and Markdown shortcuts
- [ ] Drag blocks

### Stage 7 — Links and backlinks

- [ ] `@` mentions of pages and records (with live status)
- [ ] Backlinks section under every page

### Stage 8 — Calendar view

- [ ] Month / week grid by a date property
- [ ] Drag a record to another day to change its date
- [ ] Create a record by clicking a day

### Stage 9 — Whiteboard

- [ ] Canvas tools: pen, rectangle, ellipse, arrow, line, text, eraser
- [ ] Color and stroke width
- [ ] Select, move, resize, delete
- [ ] Zoom / pan, infinite canvas
- [ ] Undo / redo, export to PNG

### Stage 10 — Dashboard

- [ ] Records per status, done per week, burndown (Recharts)
- [ ] Stat tiles (total, overdue, done this week)
- [ ] Pick the source database

### Stage 11 — Polish and ship

- [ ] Command palette (Ctrl/Cmd+K)
- [ ] Keyboard shortcuts
- [ ] Sample workspace on first launch
- [ ] Mobile pass
- [ ] Workspace export / import (JSON)
- [ ] Unit tests for data + utils, 2–3 Playwright flows
- [ ] README with GIF and architecture notes
- [ ] Deploy to Vercel

---

## Later (if time allows, otherwise post-MVP)

- Timeline (Gantt) view
- Page graph (Obsidian-style)
- Embeds in documents (database views, whiteboards, charts)
- Page version history
- Eye moods: hearts when a task is done, sleepy on empty states, …
- Supabase: auth, sync, real-time collaboration
- PWA, cross-tab sync indicator, recurring tasks, page templates
