# PHB Command Center

CRM and AI operations interface for **Perth Home Brokers**.

This repository is a **frontend-first product prototype**. It models the full PHB deal lifecycle in a typed Next.js application, with realistic synthetic data and a mocked AI Copilot. There is no production backend, authentication, or live AI integration yet.

The **Deal** is the primary business object. Every screen should make these questions easy to answer:

- Who is the customer?
- Where is the deal?
- What has happened?
- What is missing?
- Who needs to act?
- What happens next?

## Domain

```text
Lead → Client → Deal → Finance → Land → Builder → Package
      → Documents → Approvals → Construction → Settlement
```

Deal stages in the domain model:

`lead` · `qualified` · `finance` · `land` · `builder` · `package` · `drafting` · `approval` · `construction` · `settlement`

## Prototype surfaces

| Area | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/dashboard` | Operations cockpit — metrics, pipeline, AI brief, needs attention |
| Leads | `/leads` | Inbound pipeline and lead assessment |
| Clients | `/clients` | Client records and 360° profiles |
| Deals | `/deals` | Pipeline list, board, and Deal Workspace |
| Packages | `/packages` | Land + builder package composition |
| Documents | `/documents` | Required documents and missing-file checks |
| Approvals | `/approvals` | Review and decision workflow |
| Commissions | `/commissions` | Consultant commission tracking |
| Reports | `/reports` | Pipeline and cycle reporting |
| AI Copilot | `/ai` | Mocked PHB AI with human-in-the-loop actions |
| Settings | `/settings` | Prototype preferences |
| Demo walkthrough | `/demo` | Guided path through the signature product story |
| Architecture | `/architecture` | Future modular-monolith target |

`/` redirects to `/dashboard`.

The **Deal Workspace** (`/deals/[id]`) is the signature screen: client, workflow, documents, package, AI insight, and next action on one operations surface.

## Stack

| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router | 16.3.5 |
| UI | React | 19.2.8 |
| Language | TypeScript (strict) | 5 |
| Styling | Tailwind CSS | 4 |
| Components | shadcn/ui (`base-nova`, RSC) | — |
| Icons | Lucide | 1.47 |
| Charts | Recharts | 3.10 |
| Font | Geist via `next/font` | — |
| Lint | ESLint + `eslint-config-next` | 9 / 16.3.5 |

Path alias: `@/*` → `./src/*`

## Requirements

- **Node.js** 20.9 or later (required by Next.js 16)
- **npm** (lockfile is `package-lock.json`)

No `.env` file is required for the prototype. Demo data lives in `src/data/demo/`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to the dashboard.

Suggested first pass:

1. [http://localhost:3000/demo](http://localhost:3000/demo) — product walkthrough
2. [http://localhost:3000/deals/PHB-2026-00142](http://localhost:3000/deals/PHB-2026-00142) — Deal Workspace (Williams Family Home)
3. [http://localhost:3000/ai](http://localhost:3000/ai) — mocked Copilot

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`core-web-vitals` + TypeScript) |
| `npx tsc --noEmit` | Typecheck without emitting files |

There is no Vitest or Playwright suite in this prototype yet. Add tests when introducing non-trivial domain logic or critical journeys.

## Project structure

```text
src/
├── app/                 # App Router: routes, layouts, metadata
│   ├── (crm)/           # Authenticated CRM shell (prototype)
│   ├── layout.tsx       # Root layout, fonts, theme
│   └── page.tsx         # Redirects to /dashboard
├── components/
│   ├── ui/              # shadcn primitives
│   ├── layout/          # Sidebar, topbar, shell
│   └── …                # Feature UI (deals, dashboard, ai, …)
├── data/demo/           # Synthetic CRM records only
├── domain/              # Typed PHB concepts and pure logic
├── lib/                 # Shared utilities and nav constants
└── types/
```

Boundaries:

| Layer | Owns |
| --- | --- |
| `app/` | Routing, layouts, composition |
| `components/` | Presentation and interaction |
| `domain/` | Deal, client, document, approval, AI types and rules |
| `data/demo/` | Prototype records — not real customers |
| `lib/` | Formatting, constants, generic helpers |

Do not hard-code demo clients or deal values inside JSX. Import them from `src/data/demo`.

## Visual system

PHB Command Center is an internal operations product, not the marketing website.

```text
~80%  Neutral SaaS foundation
~15%  Semantic status (success / warning / danger / info)
~5%   PHB red + yellow as restrained brand accents
```

- Neutral surfaces and graphite typography carry the interface
- PHB red is identity (logo, selected nav rail), not danger
- PHB yellow is action and current focus (primary CTA, active stage, AI sparkle)
- Semantic danger (`#C62828`) is reserved for overdue, blocked, or destructive states

Canonical tokens live in `src/app/globals.css`. Prefer token classes such as `bg-phb-yellow` over raw hex values.

## Prototype constraints

Intentionally **not** in this repo yet:

- Authentication / RBAC
- PostgreSQL, Redis, object storage
- NestJS API or event bus
- Real lender, Twilio, or email integrations
- Production LLM gateway

AI responses and agent runs are **mocked**. They demonstrate workflow and human approval, not a live model.

Demo records are synthetic (for example `Sarah & James Williams`, `PHB-2026-00142`). Do not add real customer data.

## Engineering conventions

Full rules are in [`AGENTS.md`](./AGENTS.md). Highlights:

- Server Components by default; `"use client"` only for actual client behaviour
- Strict TypeScript — no `any` unless an external boundary requires it
- Domain types over duplicated object shapes
- Keep Client Components small and local
- Do not add backend infrastructure unless explicitly requested

## Learn more

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
