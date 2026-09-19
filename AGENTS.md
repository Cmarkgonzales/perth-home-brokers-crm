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

# 11. Design System

PHB Command Center should feel like:

**premium Australian property/finance SaaS**

Design characteristics:

* clean
* professional
* spacious
* information-dense
* highly readable
* subtle borders
* consistent spacing
* restrained use of color
* strong hierarchy

Do not introduce arbitrary colors component-by-component.

Prefer semantic design tokens.

Do not use emoji as primary UI icons when Lucide icons are available.

---

# 12. Accessibility

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

---

# 13. Navigation

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

# 14. Performance

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

# 15. Loading and Error States

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

---

# 16. Forms

Forms must be:

* typed
* validated
* accessible
* predictable

Do not duplicate validation rules across components.

When validation becomes meaningful, centralize schemas in the domain/lib layer.

Do not silently accept invalid domain states.

---

# 17. AI Architecture

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

# 18. Financial / CRM Safety

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

# 19. Testing Strategy

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

# 20. Test Requirements for New Features

Every meaningful feature should answer:

1. What behavior changed?
2. What can break?
3. Which test covers it?
4. Is the happy path covered?
5. Is an important failure/empty state covered?

Do not add tests merely to increase coverage percentages.

Test business behavior.

---

# 21. Linting

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

# 22. Type Checking

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

# 23. Build Verification

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

# 24. Code Review Rules

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

# 25. Definition of Done

A feature is not complete merely because it renders.

A feature is complete when:

* [ ] UI works
* [ ] Types are correct
* [ ] Domain boundaries are respected
* [ ] Accessibility is reasonable
* [ ] Loading state exists where required
* [ ] Error state exists where required
* [ ] Empty state exists where relevant
* [ ] Tests cover important behavior
* [ ] ESLint passes
* [ ] TypeScript passes
* [ ] Production build passes
* [ ] No unnecessary dependencies were added
* [ ] No secrets were introduced
* [ ] Existing functionality still works

---

# 26. Git and Commit Standards

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

# 27. Pull Request / Change Description

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

# 28. Dependency Rules

Before adding a dependency ask:

1. Does the platform already provide this?
2. Does the project already have a library that solves it?
3. Is the dependency actively maintained?
4. Does it materially reduce complexity?
5. Does it increase client bundle size?
6. Is it necessary for the current prototype?

Do not add dependencies simply for convenience.

---

# 29. No Premature Infrastructure

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

# 30. Mock Data Policy

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

# 31. Consistency Rules

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

# 32. Naming Conventions

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

# 33. Avoid Over-Abstraction

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

# 34. Documentation Rule

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

# 35. AI Coding Agent Rules

When an AI coding agent modifies this repository:

1. Read `AGENTS.md` before making changes.
2. Inspect existing code before creating new abstractions.
3. Reuse existing components.
4. Follow existing naming conventions.
5. Do not silently change architecture.
6. Do not upgrade dependencies unless requested.
7. Do not introduce a new library without justification.
8. Do not invent APIs or backend contracts.
9. Do not claim tests passed unless they were run.
10. Do not remove existing tests to make changes pass.
11. Do not disable lint/type checks to hide errors.
12. Prefer the smallest change that correctly solves the task.
13. Preserve existing behavior unless the task explicitly changes it.
14. After implementation, run the appropriate validation commands.
15. Report remaining limitations honestly.

When Next.js behavior is uncertain, consult the current Next.js documentation rather than relying on memory.

---

# 36. Current Next.js Documentation Policy

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

# 37. Prototype Priority

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

# 38. PHB Command Center Product Principle

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

# 39. Final Engineering Principle

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
```

over:

```text
clever
over-engineered
implicit
tightly coupled
prematurely distributed
```

The goal is not maximum code.

The goal is a **coherent CRM architecture that can evolve from prototype → production without requiring a rewrite.**
