<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PHB Command Center — Engineering Guide

## 1. Mission

PHB Command Center is the CRM and AI operations interface for Perth Home Brokers.

The application is designed around the PHB customer/deal lifecycle:

**Lead → Client → Deal → Finance → Land → Builder → Package → Documents → Approvals → Construction → Settlement**

The **Deal is the primary business object**. The UI should make the current state of a deal, its history, outstanding work, documents, approvals, communications, and next actions immediately understandable.

This repository currently represents a **frontend-first product prototype**.

Prioritize:

1. Product clarity
2. Correct domain modeling
3. Type safety
4. Consistent UX
5. Maintainable component architecture
6. Accessibility
7. Testability
8. Performance
9. Security-aware design
10. Easy future integration with APIs and AI services

Do not add backend infrastructure, authentication, external integrations, or production AI infrastructure unless explicitly requested.

---

# 2. Technology Baseline

Use the current stable versions already defined by `package.json`.

Primary stack:

* Next.js
* React
* TypeScript
* App Router
* Tailwind CSS
* shadcn/ui
* Lucide icons
* Vitest for unit/component tests where appropriate
* Playwright for critical end-to-end flows

Use the current Next.js documentation as the source of truth for framework behavior.

Reference:

* https://nextjs.org/docs
* https://nextjs.org/docs/app
* https://nextjs.org/docs/app/getting-started
* https://nextjs.org/docs/app/guides/testing

Do not rely on outdated Pages Router patterns when an App Router equivalent exists.

---

# 3. Core Next.js Principles

## 3.1 Use the App Router

All application routes belong under:

```text
src/app/
```

Use Next.js file-system conventions:

```text
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
route.ts
```

Use nested layouts where they improve shared UI or route organization.

Do not introduce `pages/` unless explicitly required.

---

## 3.2 Server Components by Default

Treat Server Components as the default.

Do NOT add:

```tsx
"use client";
```

unless the component actually requires client-side behavior such as:

* React state
* event handlers
* browser APIs
* effects
* client-only libraries
* interactive UI

Keep Client Components as small and localized as possible.

Prefer:

```text
Server Component
    ↓
Client interactive component
```

rather than making an entire page a Client Component.

---

## 3.3 Do Not Fight the Framework

Prefer native Next.js patterns before introducing additional libraries.

Examples:

* `Link` for navigation
* `Image` for images
* `Metadata` / `generateMetadata` for metadata
* Server Components for server-side data access
* Server Functions/Actions when appropriate
* route-aware Next.js types
* framework-supported loading/error/not-found boundaries

Do not recreate functionality already provided by Next.js.

---

# 4. Repository Architecture

Use this general structure:

```text
src/
├── app/
│   ├── (crm)/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── clients/
│   │   ├── deals/
│   │   ├── documents/
│   │   ├── approvals/
│   │   └── ai/
│   │
│   ├── layout.tsx
│   ├── globals.css
│   └── ...
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── leads/
│   ├── clients/
│   ├── deals/
│   ├── documents/
│   ├── approvals/
│   └── ai/
│
├── data/
│   └── demo/
│
├── domain/
│   ├── clients/
│   ├── deals/
│   ├── leads/
│   ├── documents/
│   ├── approvals/
│   └── ai/
│
├── lib/
│   ├── utils.ts
│   └── constants.ts
│
└── types/
```

Architecture may evolve as the application grows, but boundaries must remain explicit.

---

# 5. Architecture Boundaries

## 5.1 `app/`

Responsible for:

* Routing
* Layouts
* Route-level composition
* Loading states
* Error boundaries
* Metadata
* Server/client boundaries

Avoid putting substantial business logic directly inside page files.

Bad:

```tsx
export default function Page() {
  // 300 lines of business logic
}
```

Prefer:

```tsx
export default function Page() {
  return <DealWorkspace />;
}
```

---

## 5.2 `components/`

Responsible for presentation and UI behavior.

Components should be:

* focused
* reusable where appropriate
* typed
* accessible
* composable

Avoid putting database, API, or domain orchestration logic inside generic UI components.

---

## 5.3 `domain/`

Contains business concepts and domain-specific logic.

Examples:

```text
domain/deals/
├── deal.types.ts
├── deal.constants.ts
├── deal-utils.ts
└── deal-stage.ts
```

The domain layer should describe PHB concepts rather than generic UI concerns.

---

## 5.4 `data/`

Contains prototype/demo data only.

Example:

```text
data/demo/
├── clients.ts
├── deals.ts
├── leads.ts
├── documents.ts
└── activities.ts
```

Do not scatter hard-coded CRM data across components.

Bad:

```tsx
<Card>
  Sarah Williams
  $642,000
</Card>
```

Prefer:

```tsx
<DealCard deal={demoDeal} />
```

---

## 5.5 `lib/`

Contains generic infrastructure/utilities.

Examples:

```text
lib/
├── utils.ts
├── formatting.ts
├── dates.ts
└── validation.ts
```

Do not turn `lib/` into a dumping ground.

---

# 6. Domain Model

The central relationship is:

```text
Lead
  ↓
Client
  ↓
Deal
  ├── Finance
  ├── Package
  ├── Documents
  ├── Tasks
  ├── Approvals
  ├── Communications
  ├── Activities
  └── Commission
```

Core entities should be explicitly typed.

Example:

```ts
export type DealStage =
  | "lead"
  | "qualified"
  | "finance"
  | "land"
  | "builder"
  | "package"
  | "drafting"
  | "approval"
  | "construction"
  | "settlement";
```

Do not use arbitrary strings where a finite domain is known.

Bad:

```ts
stage: string;
```

Prefer:

```ts
stage: DealStage;
```

---

# 7. TypeScript Rules

TypeScript strictness must remain enabled.

Never solve type errors with:

```ts
any
```

unless there is a documented and unavoidable external boundary.

Avoid:

```ts
as any
```

Avoid unnecessary assertions:

```ts
foo as SomeType
```

Prefer narrowing, validation, generics, discriminated unions, and properly typed APIs.

---

## 7.1 Explicit Domain Types

Create reusable domain types instead of duplicating object shapes.

Bad:

```ts
function DealCard({
  deal,
}: {
  deal: {
    id: string;
    name: string;
    value: number;
  };
}) {}
```

Prefer:

```ts
import type { Deal } from "@/domain/deals/deal.types";

function DealCard({ deal }: { deal: Deal }) {}
```

---

## 7.2 Props

Prefer explicit props types.

```ts
interface DealCardProps {
  deal: Deal;
  onSelect?: (dealId: string) => void;
}
```

Avoid overly generic props such as:

```ts
props: any
```

---

## 7.3 Nullability

Handle nullable values explicitly.

Do not hide problems with:

```ts
value!
```

Prefer:

```ts
if (!value) {
  return null;
}
```

or appropriate fallback behavior.

---

# 8. Data Flow

Data should flow predictably:

```text
Route
  ↓
Server Component
  ↓
Domain/data layer
  ↓
Typed model
  ↓
UI component
```

For interactive behavior:

```text
Server Component
  ↓
Client Component
  ↓
User interaction
  ↓
Typed action/state update
```

Avoid unnecessary global state.

Do not introduce Redux, Zustand, TanStack Query, or another state-management library unless the application actually demonstrates a requirement for it.

---

# 9. Client Components

Use `"use client"` only when necessary.

Good reasons:

```tsx
"use client";

import { useState } from "react";
```

for:

* dialogs
* dropdown interactions
* filters
* drag/drop
* interactive timelines
* AI chat input
* client-side form state

Bad reason:

> "This component is a page."

Pages do not automatically need to be Client Components.

---

# 10. UI Component Rules

Use shadcn/ui as the baseline component system.

Do not recreate existing primitives unnecessarily.

Prefer:

```text
Button
Card
Dialog
DropdownMenu
Tabs
Table
Badge
Input
Textarea
Tooltip
```

from the existing UI system.

Customize components when needed, but maintain a consistent visual language.

---

# 11. PHB Visual Design System

The visual direction is a core engineering constraint.

PHB Command Center is an **internal operations product**, not a PHB marketing website.

The interface should communicate:

* operational clarity
* trust
* precision
* professionalism
* financial confidence
* calm information density
* modern SaaS quality

The PHB brand should be recognizable through **small, deliberate visual signals**, rather than through large blocks of corporate color.

The primary design principle is:

> **Neutral SaaS foundation + restrained PHB brand expression.**

The product should look professional even when all PHB-specific colors are mentally removed.

PHB red and yellow should then act as recognizable accents that reinforce the brand.

Do not build the interface around PHB red.

Do not use PHB red as the default color for important information.

Do not use PHB yellow as the default color for every action.

Do not use brand colors merely because they are available in the palette.

The product should feel like:

**Linear / HubSpot / modern banking operations UI**

with:

**subtle PHB red + yellow DNA.**

It should not feel like:

**a PHB website converted into a CRM.**

Signature principle:

> **PHB Command Center is a professional operations system wearing the PHB brand — not a PHB-branded interface pretending to be an operations system.**

---

## 11.1 Color Philosophy and Visual Hierarchy

The application uses four visual layers. The order is intentional:

```text
1. Neutral foundation
2. Information hierarchy
3. Semantic states
4. PHB brand accents
```

Hierarchy is created through **size, weight, spacing, and placement** — not by turning important information red.

### Neutral foundation — approximately 80%

Use neutral colors for:

* application background
* navigation
* cards
* tables
* forms
* dividers
* text
* inactive states
* progress tracks
* most UI chrome

### Semantic colors — approximately 15%

Use semantic colors only when they communicate actual meaning:

* success
* warning
* danger
* information

### PHB brand accents — approximately 5%

Use PHB red and yellow for:

* PHB identity
* selected navigation indicators
* primary brand moments
* primary actions
* small visual anchors
* AI accents
* important contextual highlights

The interface should never become visually dominated by either PHB red or PHB yellow.

### Important information levels

Important information should not automatically be red.

```text
Level 1 — Critical
Danger semantic color
Overdue approval, blocked deal, missing required compliance document

Level 2 — Attention
Warning / amber
Approaching SLA, pending review, upcoming deadline

Level 3 — Brand emphasis
PHB red or yellow
Selected deal, current workflow stage, important PHB action

Level 4 — Normal
Dark graphite
Most CRM information belongs here
```

### Visual decision test

Before adding a color, ask:

> Does this color communicate brand, semantic meaning, or interaction?

If the answer is no, use a neutral.

Before making something red, ask:

> Is this PHB identity or actual danger?

If it is neither, use a neutral.

Before making something visually prominent, ask:

> Is this genuinely important to the user's workflow?

If not, reduce its visual weight.

> If removing PHB red from a screen makes the hierarchy collapse, there is too much red.

---

## 11.2 Color Tokens

Use these as the prototype's canonical visual tokens.

### Foundation

| Token            | Value     | Purpose                                      |
| ---------------- | --------- | -------------------------------------------- |
| `background`     | `#F7F7F5` | Main application background                  |
| `surface`        | `#FFFFFF` | Cards, panels, sidebar                       |
| `surface-muted`  | `#FAFAF9` | Subtle nested surfaces                       |
| `surface-strong` | `#F3F3F1` | Active nav fill, stronger chrome             |
| `border`         | `#E5E5E3` | Default borders and dividers                 |
| `border-strong`  | `#D8D8D5` | Stronger separators                          |
| `text-primary`   | `#242424` | Main text, metric values, headings           |
| `text-secondary` | `#626262` | Supporting text                              |
| `text-tertiary`  | `#8A8A87` | Metadata                                     |
| `text-disabled`  | `#A8A8A4` | Disabled text                                |

These colors form the majority of the application.

The interface should feel warm, calm, and slightly softer than a purely technical gray-scale SaaS application.

### Sidebar

| Token             | Value     | Purpose                |
| ----------------- | --------- | ---------------------- |
| `sidebar`         | `#FFFFFF` | Sidebar background     |
| `sidebar-border`  | `#E5E5E3` | Sidebar edge           |
| `sidebar-text`    | `#555555` | Navigation labels      |
| `sidebar-muted`   | `#858585` | Inactive / supporting  |

### PHB brand

| Token             | Value     | Purpose                                          |
| ----------------- | --------- | ------------------------------------------------ |
| `phb-red`         | `#E21F26` | Brand accent, logo, selected nav rail            |
| `phb-red-dark`    | `#C91820` | Brand hover where a red accent is already in use |
| `phb-red-deep`    | `#A91219` | Rare high-contrast brand moments                 |
| `phb-yellow`      | `#FFC800` | Primary CTA, current step, AI sparkle            |
| `phb-yellow-dark` | `#EAAF00` | Yellow hover / active                            |

PHB red is a **brand accent**, not a structural UI color.

Good uses of PHB red:

* PHB logo / wordmark
* small active-state indicator
* selected navigation rail
* small section accent
* branded empty states
* occasional emphasis
* brand moments

Bad uses of PHB red:

* entire sidebar background
* all primary buttons
* every important metric
* all progress bars
* every active state
* every status badge
* large dashboard backgrounds
* large card backgrounds

PHB yellow represents **action, opportunity, and selected attention**.

Good uses of PHB yellow:

* primary CTA
* active step
* AI sparkle
* selected / highlighted state
* small attention indicator
* workflow emphasis

Yellow should generally appear against neutral surfaces.

Avoid large yellow backgrounds unless the component is specifically intended as an intentional brand moment.

### Semantic

| Token     | Value     | Purpose                              |
| --------- | --------- | ------------------------------------ |
| `success` | `#168A5B` | Completed / approved                 |
| `warning` | `#D98B00` | Waiting / attention                  |
| `danger`  | `#C62828` | Critical / overdue / destructive     |
| `info`    | `#357ABD` | Informational / in progress          |

Semantic colors must remain distinct from PHB branding.

PHB red does not automatically mean danger.

For example:

* a successful deal does not become PHB red
* a finance-approved document does not become PHB red
* a completed workflow stage does not need to be PHB red
* a normal active deal does not need to be PHB red
* a metric count, progress bar, or status label is not red merely because it is important

Use semantic meaning first.

These are **prototype visual-direction tokens**, not official PHB brand specifications.

Do not invent unrelated brand colors without a clear semantic reason.

---

## 11.3 Color Ratio

The application should approximately follow:

```text
~80% neutral
Warm off-white, white surfaces, graphite text, quiet chrome

~15% semantic
Success / warning / danger / info

~5% PHB brand
Red and yellow as accents, identity, and selected actions
```

The exact percentages are a visual guideline, not a strict mathematical requirement.

The important rule is that **neutral surfaces dominate the application**.

---

## 11.4 Semantic Meaning of Brand Colors

Use color consistently:

```text
Neutral graphite
→ information, metrics, progress, most UI

PHB red
→ identity / selected nav rail / rare brand emphasis

PHB yellow
→ action / opportunity / current focus

Green
→ Success / completed / approved

Orange
→ Warning / waiting / attention

Danger red (#C62828)
→ Critical / overdue / destructive

Blue
→ Information / in progress
```

Do not use PHB red for every semantic status.

Do not use PHB yellow as a replacement for warning semantics.

Brand color and semantic meaning must remain distinguishable.

---

# 12. Application Shell Visual Rules

Use a **neutral vertical sidebar**, not a PHB-red sidebar.

A large red sidebar makes the application feel like a marketing-branded portal and causes the rest of the interface to compete with it.

```text
Sidebar Background    #FFFFFF
Sidebar Border        #E5E5E3
Sidebar Text          #555555
Sidebar Muted         #858585
```

The PHB identity should appear near the top of the sidebar:

```text
PHB
Command Center
```

The brand mark / "PHB" may use PHB red while the product name remains dark graphite.

This creates brand recognition without turning the entire navigation system red.

Navigation icons should remain neutral.

The sidebar should contain the primary CRM navigation:

```text
Dashboard
Leads
Clients
Deals
Packages
Documents
Approvals
Commissions
Reports

AI Copilot

Settings
```

### Active navigation

Use a restrained active state:

```text
Background: #F3F3F1
Text:       #242424
Icon:       #242424
Indicator:  PHB Red
```

The active indicator may be:

* a 2–3px red vertical rail
* a small red marker
* a subtle neutral fill with a red accent

Do not use a large red active-navigation pill.

Do not use a giant yellow active-navigation block.

Use the actual PHB logo only when the appropriate brand asset is available and authorized for use.

---

# 13. Do Not Copy the Marketing Website Literally

The public PHB website and the internal CRM have different jobs.

```text
PHB Website
→ Marketing-first
→ Expressive
→ Promotional
→ Large imagery
→ Decorative typography
→ Curved sections

PHB Command Center
→ Operations-first
→ Structured
→ Information-dense
→ Functional imagery
→ Professional typography
→ Subtle brand motifs
```

Do not reproduce the website's curved navigation as a major CRM layout mechanism.

Curves may be used as a **subtle brand motif**, not as the primary layout system.

---

# 14. Brand Curves

PHB's curved visual language may be preserved in a restrained manner.

Use curves in only a few deliberate locations:

1. Sidebar/logo container
2. Dashboard hero
3. Package/property cards

Do not add decorative curves to every card, section or navigation element.

The goal is recognition, not decoration.

---

# 15. Dashboard Visual Direction

The dashboard should feel like an **operations cockpit**, not a branded landing page.

The screen should feel calm even when there is a lot of information.

The primary dashboard hierarchy should be:

```text
Dashboard
    ↓
Context / greeting
    ↓
Key metrics
    ↓
Pipeline
    ↓
AI business brief
    ↓
Needs attention
```

Use neutral cards with strong typography and restrained PHB accents.

Example conceptual structure:

```text
┌───────────────────────────────────────────────────────────────┐
│ Search CRM...                                  Notifications │
├───────────────────────────────────────────────────────────────┤
│ Dashboard                                                     │
│ Good morning                                                  │
│ Here's what's happening across PHB today.                    │
│                                                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ DEALS    │ │ LEADS    │ │ ATTENTION│ │ PIPELINE │          │
│ │ 128      │ │ 42       │ │ 17       │ │ $4.2M    │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                               │
│ ┌──────────────────────────┐ ┌─────────────────────────────┐ │
│ │ DEAL PIPELINE             │ │ ✦ AI BUSINESS BRIEF        │ │
│ └──────────────────────────┘ └─────────────────────────────┘ │
│                                                               │
│ NEEDS ATTENTION                                                │
└───────────────────────────────────────────────────────────────┘
```

The dashboard should communicate operational clarity rather than visual spectacle.

### Metric cards

Metric cards should use neutral surfaces.

The number should be dark graphite.

Do not make the number red simply because the metric is important.

A small brand indicator may sit above the label:

```text
────
ACTIVE DEALS
7
Excluding settled deals
```

The indicator can use PHB red or yellow.

The indicator is the brand accent.

The metric itself remains neutral.

```text
Normal metric        Dark graphite
Positive change      Success
Warning              Warning
Critical             Danger
Brand emphasis       PHB red/yellow accent only
```

### Pipeline visualization

The pipeline is an operational visualization, not a branding component.

Do not render every pipeline bar in PHB red.

Instead:

* inactive stages → neutral gray
* current stage → PHB yellow
* completed stages → neutral dark / restrained PHB accent
* exceptional / problem stage → semantic warning / danger

The visualization should have hierarchy rather than identical red bars.

### Progress bars

Progress tracks should remain neutral.

Progress fills should use dark graphite or a restrained semantic color.

Do not default important counts, labels, or progress fills to PHB red.

---

# 16. Cards

**Do not make standard CRM cards red.**

Bad:

```text
████████████████
████ RED CARD ███
████████████████
```

Prefer:

```text
┌───────────────────────┐
│ ACTIVE DEALS          │
│                       │
│ 128                   │
│ +12.4% this month     │
└───────────────────────┘
```

Standard cards should normally use:

```text
background: #FFFFFF
border: 1px solid #E5E5E3
radius: 10–12px
shadow: none or extremely subtle
```

Cards should create structure through spacing, borders, and typography rather than strong color.

Use PHB red as a small visual anchor:

* accent line
* small icon
* heading marker
* selected indicator

Do not fill large information surfaces with brand red unless the component is deliberately designed as a branded feature surface.

---

# 17. Buttons

## 17.1 Primary Button

Use PHB yellow selectively.

The yellow button should feel like a deliberate PHB signature.

Do not use yellow for every clickable control.

Example:

```text
+ Create New Deal
```

Use:

```css
background: #FFC800;
color: #242424;
border-radius: 8px;
```

Examples of appropriate primary actions:

* Create Deal
* Add Client
* Generate Package
* Draft Follow-up
* Approve

Do not default to extremely pill-shaped marketing buttons.

For CRM controls, use approximately:

```text
8px
```

border radius.

---

## 17.2 Secondary Button

Use neutral styling:

```css
background: #FFFFFF;
border: 1px solid #E5E5E3;
color: #242424;
```

Secondary actions should visually remain secondary.

---

## 17.3 Destructive Button

Destructive actions must use semantic danger styling.

Use:

```text
#C62828
```

for destructive actions such as Delete.

Do not use PHB yellow merely because it is a brand color.

Destructive actions should normally require confirmation when consequential.

---

# 18. Typography

Do not copy the public marketing site's display typography into dense CRM interfaces.

Use a professional modern sans-serif. Preferred, in order:

1. Geist
2. Inter
3. Plus Jakarta Sans

The exact choice should be consistent across the application.

The current prototype uses Geist via Next.js `next/font`. Keep that unless there is a deliberate, application-wide change.

### Do not use monospace as the application font.

Monospace should be restricted to genuinely technical content such as:

* IDs
* reference numbers
* API values
* code
* logs
* technical metadata

A serif or monospace-like presentation makes the CRM feel like a prototype or terminal-inspired tool rather than a modern professional SaaS product.

Use the PHB display font only for small, intentional brand moments when the appropriate asset/font is available.

Examples:

```text
PHB Command Center
```

or an occasional empty-state brand treatment.

### Typography hierarchy

Use typography rather than color to communicate hierarchy.

```text
Page title
32px / semibold
dark graphite

Section heading
16–18px / semibold
dark graphite

Metric
28–32px / semibold
dark graphite

Supporting text
13–14px / regular
secondary gray

Metadata
12–13px / medium
tertiary gray
```

Important information should become visually important through size, weight, spacing, and placement — not simply by turning it red.

Rule:

> **PHB website typography for personality; SaaS typography for usability.**

---

# 19. Package Builder Visual Direction

The Package Builder is the area where stronger PHB visual identity is appropriate.

Property imagery may be prominent.

Use:

```text
large property image
+
neutral information surface
+
red property/context accent
+
yellow action
+
dark typography
```

Conceptually:

```text
┌─────────────────────────────────────────────────────────────┐
│ PACKAGE BUILDER                                             │
│                                                             │
│ ┌───────────────────┐  ┌─────────────────────────────────┐ │
│ │                   │  │ THE HORIZON                     │ │
│ │                   │  │                                 │ │
│ │   HOUSE IMAGE     │  │ 4 Bedrooms · 2 Baths · 2 Cars  │ │
│ │                   │  │                                 │ │
│ │                   │  │ Builder                         │ │
│ └───────────────────┘  │ $320,000                        │ │
│                        │                                 │ │
│                        │ [ Select Design ]                │ │
│                        └─────────────────────────────────┘ │
│                                                             │
│ LAND                                                        │
│                                                             │
│ Alkimos       Baldivis       Byford                         │
│ $250K         $265K          $235K                          │
│                                                             │
│                         TOTAL $593,500                      │
│                         [ SAVE PACKAGE ]                    │
└─────────────────────────────────────────────────────────────┘
```

This is an intentional place for stronger PHB personality while maintaining functional SaaS structure.

---

# 20. Deal Workspace Visual Direction

The Deal Workspace is the signature screen of PHB Command Center.

It can use PHB colors more intentionally than generic screens, but it must still remain a SaaS operations workspace.

It should communicate:

```text
Client
    ↓
Deal
    ↓
Workflow
    ↓
Documents
    ↓
Package
    ↓
AI
    ↓
Next Action
```

The workspace should remain substantially more SaaS-oriented than the marketing website.

Example hierarchy:

```text
Williams Family Home                    $642,000
Sarah & James Williams                  PHB-00142

Finance Approval

● Lead
● Qualified
● Finance Assessment
● Finance Approval       ← CURRENT
○ Land
○ Builder
○ Package
○ Construction
○ Settlement
```

Stage treatment:

```text
Completed
→ restrained PHB red

Current
→ PHB yellow

Future
→ neutral gray

Blocked
→ semantic danger
```

This is one of the few places where PHB colors can have stronger representation because they communicate workflow progression.

This provides strong workflow visibility without turning the entire workspace into a branded surface.

---

# 21. Tables

Tables are a core CRM interaction pattern and should prioritize information density and scanability.

Use:

```text
white background
subtle horizontal separators
dark text
compact typography
semantic status badges
restrained hover state
```

Do not use red row backgrounds.

Avoid colored table headers unless a particular workflow requires it.

Use:

```text
hover
→ #FAF8EE

selected
→ very light yellow

status
→ semantic status color
```

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ CLIENTS                                      + New Client     │
├──────────────────────────────────────────────────────────────┤
│ □ CLIENT           DEAL             STAGE        OWNER       │
├──────────────────────────────────────────────────────────────┤
│ □ Sarah Williams   Williams Home    Finance      James       │
│ □ Michael Chen     Chen Residence   Package      Arvin       │
│ □ Daniel Smith     Smith Home       New          Jay         │
└──────────────────────────────────────────────────────────────┘
```

Tables should feel like a professional operations tool, not a marketing component.

---

# 22. Status Badges

Status badges should communicate state.

Examples:

```text
Approved
→ green

Pending
→ amber

Blocked
→ semantic danger

Draft
→ gray

In Progress
→ blue
```

Use small badges/pills rather than colored blocks.

Do not use PHB red for every status.

Do not turn every badge into PHB red.

Do not use color as the only status indicator.

Pair semantic color with:

* text
* icon
* shape
* position

Status must remain understandable through text and/or iconography, not color alone.

---

# 23. AI Copilot Visual Direction

AI should feel like **PHB AI**, not a generic AI SaaS product.

Do not introduce the typical:

```text
purple
blue gradients
pink glow
neon AI aesthetic
large glowing AI cards
futuristic decorative UI
```

The AI identity should use:

* white / light neutral surfaces
* subtle warm-yellow highlight
* small yellow sparkle
* PHB red for occasional brand accents
* dark graphite text

Use:

```text
✦
```

or an appropriate Lucide sparkle icon.

The AI panel should feel embedded in the CRM workflow:

```text
┌──────────────────────────────────────────────┐
│ ✦ PHB AI COPILOT                             │
│                                              │
│ Good morning.                                │
│                                              │
│ I've reviewed your active pipeline.          │
│                                              │
│ 🔴 2 deals require immediate attention       │
│ 🟡 5 deals need follow-up                    │
│ 📄 3 clients have missing documents          │
│                                              │
│ [ View Priorities ]                          │
└──────────────────────────────────────────────┘
```

Prefer:

```text
white
+
very light yellow
+
red accents
```

over large yellow panels.

Do not use a giant yellow or red AI card.

AI should feel operational and trustworthy.

---

# 24. AI Action Buttons

AI actions should communicate that AI is embedded in the workflow.

AI recommendations should be visually subordinate to actual CRM actions.

Example:

```text
AI RECOMMENDATION

Bank statement is missing.
Finance approval cannot proceed.

[ Request document ]    [ Draft follow-up ]
```

The recommendation surface can use a subtle warm-yellow tint.

Examples:

```text
[ ✦ Draft Follow-up ]
[ ✦ Summarize Deal ]
[ ✦ Find Missing Documents ]
```

Use:

```text
white button
subtle yellow border
small yellow sparkle
```

The visual language should communicate:

> **AI is embedded into the workflow.**

Not:

> **Here's a chatbot.**

---

# 25. Property Imagery

Property imagery is an important connection to PHB's actual business.

Use property images specifically where they improve understanding:

### Use prominently in

* Package Builder
* Selected client package
* Deal overview
* Builder directory
* Land directory

### Avoid in

* Task tables
* Approvals
* Reporting
* Administration
* Settings

Images should support property selection and context rather than decorate every part of the CRM.

Use Next.js image optimization patterns where appropriate.

Do not use placeholder imagery as permanent production design.

---

# 26. Shadows

Prefer borders over shadows.

Default:

```css
box-shadow: none;
```

Most cards should use:

```css
border: 1px solid #E5E5E3;
```

with little or no shadow.

Use subtle elevation only for:

* dropdowns
* dialogs
* command menus
* popovers
* floating panels

Suggested floating shadow:

```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
```

Avoid heavily elevated cards.

The target is a modern SaaS interface rather than a heavily elevated marketing UI.

---

# 27. Border Radius

Use radius to establish hierarchy.

Recommended prototype values:

```text
Standard controls
→ 8px

Cards
→ 10–12px

Large property cards
→ 14–16px

Buttons
→ 8px

Status pills
→ 999px
```

Avoid applying one giant radius universally.

Marketing UI may use stronger rounding; operational CRM UI should remain restrained.

---

# 28. Spacing System

Use a strict 4px/8px spacing system.

Preferred values:

```text
4
8
12
16
20
24
32
40
48
64
```

Typical examples:

```text
Dashboard page padding
→ 32px

Card padding
→ 20–24px

Table row
→ 52–60px

Section gap
→ 32px
```

Avoid arbitrary one-off spacing values unless there is a clear reason.

Consistent spacing is a core part of visual consistency.

---

# 29. Visual Design Tokens

The canonical prototype visual tokens are:

```text
BACKGROUND
#F7F7F5

SURFACE
#FFFFFF

SURFACE MUTED
#FAFAF9

SURFACE STRONG
#F3F3F1

BORDER
#E5E5E3

BORDER STRONG
#D8D8D5

TEXT PRIMARY
#242424

TEXT SECONDARY
#626262

TEXT TERTIARY
#8A8A87

TEXT DISABLED
#A8A8A4

SIDEBAR
#FFFFFF

SIDEBAR BORDER
#E5E5E3

SIDEBAR TEXT
#555555

SIDEBAR MUTED
#858585

PHB RED
#E21F26

PHB RED DARK
#C91820

PHB RED DEEP
#A91219

PHB YELLOW
#FFC800

PHB YELLOW DARK
#EAAF00

SUCCESS
#168A5B

WARNING
#D98B00

DANGER
#C62828

INFO
#357ABD
```

These values should be centralized in the application's theme/design-token system rather than repeatedly hard-coded throughout components.

Prefer semantic token names over direct hex values in component code.

Bad:

```tsx
className="bg-[#E21F26]"
```

when a semantic token exists.

Prefer:

```tsx
className="bg-phb-red"
```

or the equivalent configured design token.

Do not use `bg-phb-red` for large structural surfaces such as the sidebar, metric numbers, or pipeline bars.

---

# 30. Visual Consistency Rules

When creating a new component, ask:

1. Which existing component is most similar?
2. Which semantic color should this use?
3. Is this a brand element or a semantic state?
4. Should the surface be neutral?
5. Does it follow the spacing system?
6. Does its radius match its hierarchy?
7. Does it use the established typography?
8. Does it need imagery?
9. Is the PHB brand being used deliberately rather than decoratively?

Do not introduce isolated visual patterns.

### Visual anti-patterns

The following are explicitly prohibited.

Brand overload:

```text
❌ Red sidebar
❌ Red metric numbers
❌ Red pipeline bars everywhere
❌ Red buttons everywhere
❌ Red status badges
❌ Red card backgrounds
```

Generic AI aesthetic:

```text
❌ Purple AI gradients
❌ Neon AI effects
❌ Large glowing AI cards
❌ Futuristic decorative UI
```

Prototype aesthetic:

```text
❌ Monospace application typography
❌ Excessive borders
❌ Random font sizes
❌ Arbitrary colors
❌ Every component having its own visual treatment
❌ Excessive shadows
❌ Excessive rounded cards
```

Marketing-site aesthetic:

```text
❌ Large hero sections
❌ Oversized decorative curves
❌ Full-screen brand-color backgrounds
❌ Marketing-style CTA sections
❌ Property imagery everywhere
```

---

# 31. Accessibility

Accessibility is required, not optional.

Every interactive element must have:

* accessible name
* keyboard interaction
* visible focus state
* appropriate semantic HTML

Prefer:

```html
<button>
```

over:

```html
<div onClick={...}>
```

Images require meaningful `alt` text unless decorative.

Forms require associated labels.

Dialogs must correctly manage focus.

Do not rely on color alone to communicate status.

The visual system must remain usable for users with color-vision differences.

---

# 32. Navigation

Use Next.js navigation primitives.

Prefer:

```tsx
import Link from "next/link";
```

for normal navigation.

Use router APIs only when programmatic navigation is actually required.

Do not use raw:

```html
<a href="/dashboard">
```

for internal application navigation.

---

# 33. Performance

Performance is part of the architecture.

Prefer:

* Server Components
* minimal Client Components
* optimized images
* lazy loading for expensive UI
* route-level loading states
* stable component boundaries
* small client-side bundles

Avoid unnecessarily importing large libraries.

Do not add a dependency when a small local utility is sufficient.

Do not prematurely optimize without evidence.

---

# 34. Loading and Error States

Every meaningful asynchronous route or operation should have an intentional UI state.

Use:

```text
loading.tsx
error.tsx
not-found.tsx
```

where appropriate.

Interactive components should also handle:

```text
idle
loading
success
error
empty
```

Do not leave blank screens while an operation is pending.

Loading states should visually match the established PHB/SaaS design system.

---

# 35. Forms

Forms must be:

* typed
* validated
* accessible
* predictable

Do not duplicate validation rules across components.

When validation becomes meaningful, centralize schemas in the domain/lib layer.

Do not silently accept invalid domain states.

Form controls should use the established 8px radius, spacing system, typography and semantic colors.

---

# 36. AI Architecture

The AI layer is a first-class product capability but must remain separated from UI concerns.

Conceptually:

```text
AI Copilot
    ↓
AI application layer
    ↓
Permissioned tools
    ↓
CRM/domain operations
```

The AI should NOT directly manipulate arbitrary application state or database structures.

Future AI tools may include:

```text
searchClients()
getDeal()
getDealTimeline()
getDocuments()
getPendingApprovals()
getPipeline()
createTask()
draftMessage()
summarizeDeal()
```

All AI actions must have:

* typed inputs
* typed outputs
* authorization
* validation
* auditability
* human approval for consequential actions

For the current prototype, AI responses may be mocked.

Do not pretend mocked AI is a production AI integration.

---

# 37. Financial / CRM Safety

PHB data may contain sensitive personal and financial information.

Never:

* expose secrets in client components
* commit credentials
* hard-code API keys
* log sensitive customer information unnecessarily
* place private data in URLs unnecessarily
* send unrestricted CRM data to an AI model

Use environment variables for secrets.

Never expose server-only secrets through `NEXT_PUBLIC_*`.

AI recommendations must not be represented as authoritative financial, lending, or legal decisions.

---

# 38. Testing Strategy

Use the appropriate level of testing.

## Unit tests

Test:

* domain utilities
* calculations
* formatting
* validation
* state transitions
* pure functions

Example:

```text
deal-stage.test.ts
format-currency.test.ts
deal-utils.test.ts
```

---

## Component tests

Test important interactive components:

* filters
* dialogs
* approval actions
* document status
* AI input/output behavior
* stage selectors

Focus on user-visible behavior rather than implementation details.

---

## E2E tests

Use Playwright for critical business journeys.

At minimum, eventually test:

```text
Dashboard
  ↓
Open Deal
  ↓
View Timeline
  ↓
View Documents
  ↓
Review Approval
  ↓
Use AI Copilot
```

Async Server Components should generally be covered through E2E tests rather than forcing unsuitable unit-test abstractions.

---

# 39. Test Requirements for New Features

Every meaningful feature should answer:

1. What behavior changed?
2. What can break?
3. Which test covers it?
4. Is the happy path covered?
5. Is an important failure/empty state covered?

Do not add tests merely to increase coverage percentages.

Test business behavior.

---

# 40. Linting

The repository must use the current Next.js ESLint configuration.

The Next.js documentation recommends `eslint-config-next`, including its TypeScript configuration for TypeScript projects.

Use the project's configured lint command.

Typical:

```bash
npm run lint
```

Do not disable lint rules merely to make a build pass.

If a rule is genuinely inappropriate, document the reason and scope the exception as narrowly as possible.

---

# 41. Type Checking

Before completing work:

```bash
npx tsc --noEmit
```

There must be no new TypeScript errors.

Do not suppress errors with:

```ts
// @ts-ignore
```

unless there is a documented exceptional reason.

Prefer:

```ts
// @ts-expect-error -- explanation of why this is intentionally required
```

when an unavoidable type-system limitation exists.

---

# 42. Build Verification

Before considering a significant feature complete:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If tests exist:

```bash
npm test
```

For E2E:

```bash
npm run test:e2e
```

Use the actual scripts defined in `package.json`.

Do not claim a check passed unless it was actually run.

---

# 43. Code Review Rules

Every change should be reviewed for:

### Correctness

* Does the feature actually work?
* Are edge cases handled?
* Are domain states valid?

### Architecture

* Is logic in the correct layer?
* Is a Client Component truly required?
* Is business logic leaking into UI components?

### Type safety

* Are types precise?
* Are nullable states handled?
* Is `any` being introduced?

### UX

* Is loading state handled?
* Is empty state handled?
* Is error state handled?
* Is keyboard access preserved?

### Visual consistency

* Does the component follow the PHB design tokens?
* Is the color usage semantically correct?
* Is the surface neutral unless there is a brand, semantic, or interaction reason?
* Did PHB red get used as a structural color (sidebar, metrics, progress, badges)?
* Does spacing follow the 4px/8px system?
* Are border radius and shadows consistent?
* Is the component too visually promotional?
* Is PHB branding being overused?

### Performance

* Did the change unnecessarily increase client-side JavaScript?
* Is a dependency necessary?
* Could the component remain server-rendered?

### Security

* Are secrets protected?
* Is sensitive information exposed?
* Could user input reach an unsafe operation?

### Maintainability

* Is the code understandable?
* Is duplication justified?
* Are names domain-appropriate?

---

# 44. Definition of Done

A feature is not complete merely because it renders.

A feature is complete when:

* [ ] UI works
* [ ] Types are correct
* [ ] Domain boundaries are respected
* [ ] Accessibility is reasonable
* [ ] Loading state exists where required
* [ ] Error state exists where required
* [ ] Empty state exists where relevant
* [ ] Visual design follows PHB Command Center guidelines
* [ ] Design tokens are reused instead of arbitrary colors
* [ ] Tests cover important behavior
* [ ] ESLint passes
* [ ] TypeScript passes
* [ ] Production build passes
* [ ] No unnecessary dependencies were added
* [ ] No secrets were introduced
* [ ] Existing functionality still works

---

# 45. Git and Commit Standards

Use small, focused commits.

Preferred format:

```text
feat: add deal workspace
feat: add AI copilot shell
fix: handle missing deal documents
refactor: extract deal timeline
test: add deal stage tests
chore: update dependencies
docs: document CRM domain model
```

Do not combine unrelated changes into one commit.

Avoid commit messages such as:

```text
update
changes
fix stuff
final
```

---

# 46. Pull Request / Change Description

Every meaningful change should explain:

```text
## What changed

## Why

## How it works

## Tests

## Screenshots / UI changes

## Known limitations
```

For UI work, screenshots are strongly encouraged.

---

# 47. Dependency Rules

Before adding a dependency ask:

1. Does the platform already provide this?
2. Does the project already have a library that solves it?
3. Is the dependency actively maintained?
4. Does it materially reduce complexity?
5. Does it increase client bundle size?
6. Is it necessary for the current prototype?

Do not add dependencies simply for convenience.

---

# 48. No Premature Infrastructure

For the current PHB prototype, do NOT introduce:

* microservices
* Kubernetes
* complex event sourcing
* unnecessary message brokers
* production database infrastructure
* real lender integrations
* real Twilio integration
* production AI agents
* multi-tenant architecture
* complex RBAC administration

unless explicitly requested.

The prototype should demonstrate the product and architecture without pretending to be a production backend.

---

# 49. Mock Data Policy

Mock data must look realistic enough to demonstrate the product but must not contain real customer information.

Use clearly synthetic records.

Example:

```text
Sarah & James Williams
Williams Family Home
PHB-2026-00142
```

Keep mock data centralized.

Do not hard-code demo records throughout JSX.

---

# 50. Consistency Rules

Use consistent:

* naming
* capitalization
* spacing
* typography
* iconography
* status labels
* date formatting
* currency formatting
* component APIs
* color semantics
* design tokens
* border radii
* component density

For example, use one canonical representation for deal stages.

Do not create:

```text
"Finance"
"finance"
"Finance Approval"
"finance_approval"
```

in unrelated parts of the UI without a deliberate domain distinction.

---

# 51. Naming Conventions

Files:

```text
kebab-case.tsx
```

Examples:

```text
deal-workspace.tsx
deal-timeline.tsx
ai-copilot.tsx
```

React components:

```text
PascalCase
```

Examples:

```tsx
DealWorkspace
DealTimeline
AICopilot
```

Functions:

```text
camelCase
```

Types:

```text
PascalCase
```

Constants:

```text
UPPER_SNAKE_CASE
```

when appropriate.

---

# 52. Avoid Over-Abstraction

Do not create abstractions simply because two components look similar.

Prefer duplication temporarily over a badly designed abstraction.

Extract a component when:

* it has a clear responsibility
* it is reused
* it makes a page easier to understand
* it represents a meaningful domain/UI concept

Avoid generic components such as:

```text
UniversalCard
UniversalContainer
GenericManager
SuperTable
BaseThing
```

unless they have a genuinely clear purpose.

---

# 53. Documentation Rule

When introducing non-obvious architecture, document the reason.

Good:

```ts
// Deal stages are intentionally modeled as a union because
// stage transitions drive workflow and reporting.
```

Bad:

```ts
// This is important.
```

Comments should explain **why**, not restate what the code already says.

---

# 54. AI Coding Agent Rules

When an AI coding agent modifies this repository:

1. Read `AGENTS.md` before making changes.
2. Inspect existing code before creating new abstractions.
3. Reuse existing components.
4. Follow existing naming conventions.
5. Follow the PHB visual design system. Neutral SaaS foundation first; PHB red and yellow only as restrained accents. Never use a red sidebar, red metric numbers, or red pipeline bars as the default treatment.
6. Reuse existing design tokens before creating new visual values.
7. Do not silently change architecture.
8. Do not upgrade dependencies unless requested.
9. Do not introduce a new library without justification.
10. Do not invent APIs or backend contracts.
11. Do not claim tests passed unless they were run.
12. Do not remove existing tests to make changes pass.
13. Do not disable lint/type checks to hide errors.
14. Prefer the smallest change that correctly solves the task.
15. Preserve existing behavior unless the task explicitly changes it.
16. After implementation, run the appropriate validation commands.
17. Report remaining limitations honestly.

When Next.js behavior is uncertain, consult the current Next.js documentation rather than relying on memory.

---

# 55. Current Next.js Documentation Policy

Next.js evolves quickly.

Before making architectural decisions involving:

* routing
* caching
* Server Components
* Client Components
* Server Functions
* forms
* data fetching
* revalidation
* authentication
* proxy
* metadata
* testing
* configuration
* deployment

consult the current official Next.js documentation.

Official source:

https://nextjs.org/docs

Do not copy patterns from old tutorials if they conflict with the current documentation.

---

# 56. Prototype Priority

When tradeoffs are necessary, prioritize in this order:

```text
1. Correct user workflow
2. Clear domain model
3. Type safety
4. Consistent UX
5. Accessibility
6. Maintainability
7. Tests
8. Performance
9. Visual polish
10. Additional features
```

Do not sacrifice architecture for visual polish.

Do not sacrifice type safety for development speed.

Do not build infrastructure before proving the product workflow.

---

# 57. PHB Command Center Product Principle

The application should answer these questions immediately:

> Who is the customer?

> Where is the deal?

> What has happened?

> What is missing?

> Who needs to act?

> What happens next?

> Which deals are at risk?

> What should I focus on today?

The UI, domain model, workflow design, and AI Copilot should consistently reinforce these questions.

---

# 58. Final Visual Principle

The application should inherit the recognizable PHB visual language without becoming a marketing website.

The final visual identity should be:

```text
                 PHB COMMAND CENTER

        Professional SaaS operations system

        ┌─────────────────────────────────┐
        │ Neutral foundation              │
        │                                 │
        │ Dark graphite typography        │
        │ White surfaces                  │
        │ Warm off-white background       │
        │                                 │
        │ PHB Red       → brand accent   │
        │ PHB Yellow    → action/focus   │
        │                                 │
        │ Semantic colors → system state │
        └─────────────────────────────────┘
```

Use:

```text
Neutral foundation
→ navigation, cards, tables, text, progress, most chrome

PHB red
→ logo, selected nav rail, rare brand emphasis

PHB yellow
→ primary action, current focus, AI sparkle

Semantic colors
→ operational status

Property imagery
→ package/property context

Subtle curves
→ brand recognition in a few deliberate places

Professional SaaS typography
→ usability

Consistent spacing
→ clarity

Restrained shadows
→ modern SaaS feel
```

Avoid:

```text
red sidebar
red everywhere
yellow everywhere
red metric numbers
red pipeline bars
marketing-style typography everywhere
monospace as the application font
large decorative curves
excessive gradients
generic purple AI
heavy card shadows
random colors
random spacing
random border radii
decorative imagery without purpose
```

Brand recognition should emerge from restraint.

Every screen should prioritize clarity, hierarchy, trust, and workflow efficiency.

---

# 59. Signature Product Screen

The **Deal Workspace** should be treated as the signature screen of the prototype.

It should combine:

```text
Client
    ↓
Deal
    ↓
Workflow
    ↓
Documents
    ↓
Package
    ↓
AI
    ↓
Next Action
```

A representative layout is:

```text
┌──────────────────────────────────────────────────────────────┐
│ PHB COMMAND CENTER                                           │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│ Dashboard  │ Williams Family Home             $642,000      │
│ Leads      │ Sarah & James Williams          ● Finance      │
│ Clients    │                                                 │
│ Deals      │ ┌─────────────────────────────────────────────┐ │
│ Packages   │ │ ●────●────●────●────○────○────○            │ │
│ Documents  │ │ Lead Qual Finance Package Build Settle      │ │
│ Approvals  │ └─────────────────────────────────────────────┘ │
│            │                                                 │
│            │ ┌────────────────────┐ ┌─────────────────────┐ │
│            │ │ NEXT ACTION        │ │ ✦ AI INSIGHT        │ │
│            │ │                    │ │                     │ │
│            │ │ Bank statement     │ │ Client is ready     │ │
│            │ │ required           │ │ for finance review  │ │
│            │ │                    │ │                     │ │
│            │ │ [ Request ]        │ │ [ Draft Follow-up ] │ │
│            │ └────────────────────┘ └─────────────────────┘ │
│            │                                                 │
│            │ DOCUMENTS                                       │
│            │ ✓ ID       ✓ Payslip       ⚠ Bank Statement    │
│            │                                                 │
│            │ PACKAGE                                        │
│            │ ┌─────────────┐  Alkimos + Horizon             │
│            │ │ HOUSE IMAGE │  $593,500                      │
│            │ └─────────────┘  [ View Package ]              │
│            │                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

This screen should communicate the complete product story:

> **Client → Deal → Workflow → Documents → Package → AI → Next Action**

The signature screen should be visually polished, but it must still follow the same architecture, accessibility, type-safety and testing rules as the rest of the application.

---

# 60. Final Engineering Principle

Build the application as if the prototype will eventually become a real product.

But do not build production infrastructure before it is needed.

Prefer:

```text
simple
typed
explicit
testable
composable
accessible
consistent
```

over:

```text
clever
over-engineered
implicit
tightly coupled
prematurely distributed
visually inconsistent
```

The goal is not maximum code.

The goal is a **coherent CRM architecture and visual system that can evolve from prototype → production without requiring a rewrite.**

The final design principle is:

> **PHB Command Center is a professional operations system wearing the PHB brand — not a PHB-branded interface pretending to be an operations system.**

