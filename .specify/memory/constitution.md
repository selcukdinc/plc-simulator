<!--
SYNC IMPACT REPORT
==================
Version change: [UNFILLED TEMPLATE] → 1.0.0
Modified principles: N/A (initial fill)
Added sections:
  - Core Principles (5 principles)
  - Technology Standards
  - Development Workflow
  - Governance
Removed sections: none (template placeholders replaced)
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ Constitution Check section is generic and references this file correctly
  - .specify/templates/spec-template.md ✅ Aligned — mandatory sections match principles
  - .specify/templates/tasks-template.md ✅ Aligned — performance, testing, and polish phase tasks consistent
Follow-up TODOs: none — all placeholders resolved
-->

# PLC Simulator Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)

All production code MUST be written in TypeScript with strict typing. Use of `any` is
prohibited; prefer `unknown` with type guards where type is genuinely uncertain.
Components MUST follow the existing directory structure (`components/`, `helpers/`,
`store/`, `consts/`). Redux state mutations MUST go through Immer-based reducers in
`simulator.ts` — no direct state mutation elsewhere. Logic MUST be YAGNI-compliant:
add no feature, abstraction, or helper that is not immediately required. Avoid
over-engineering. When three lines are clearer than an abstraction, prefer three lines.
Comments are ONLY added where logic is non-obvious; self-documenting names are preferred.

**Rationale**: The codebase is a fork of an open-source project maintained by a small
team. Strict typing and structural discipline prevent regressions during merging with
upstream and keep the codebase auditable under GPL v3.

### II. Testing Standards

Every change to the simulation engine (`helpers/cycleScan.ts`) MUST be manually
verified against at least two ladder programs covering the affected element type before
commit. New element types (contacts, coils, timers, counters, logic gates) MUST include
a documented manual test scenario in the commit message or PR description. Browser
console MUST be clean (no errors or warnings) after any UI change. When a bug is fixed,
the root cause and the fix MUST be documented in the commit message so regressions can
be detected. Automated tests are OPTIONAL; if added, they MUST target `cycleScan.ts`
logic via pure function calls, not DOM rendering.

**Rationale**: The project currently has no test runner configured. Mandating documented
manual tests is more valuable than aspirational automated tests that don't exist. The
simulation engine is safety-critical — incorrect timer or counter logic can silently
corrupt programs users depend on.

### III. UX Consistency

All visual measurements (border-radius, shadows, transitions, spacing) MUST use CSS
custom properties defined in `src/index.css` (`--radius-*`, `--shadow-*`,
`--transition-*`). Dark-mode-sensitive colors MUST use CSS variables
(`--color-*`) rather than hardcoded hex/rgba values. UI components SHOULD use MUI
components where available before implementing custom solutions. Button sizes and
toolbox item sizes MUST remain consistent within their tier (action buttons: 2.8rem,
simulate button: 3.6rem, toolbox items: 3.2rem). New element types added to the toolbox
MUST provide an SVG icon following the existing `svg/toolbox/` convention.

**Rationale**: Inconsistent theming was a recurring issue inherited from upstream. CSS
custom properties are the single source of truth so that light/dark mode works without
component-level conditional logic.

### IV. Performance

The PLC scan cycle runs every 66ms (`CYCLE_TIME`). Any logic added to `cycleScan.ts`
MUST complete well within that budget on a mid-range device — no blocking I/O,
no synchronous network calls, no heavy computation inside the scan loop. React
components MUST NOT trigger unnecessary re-renders of the full diagram on every cycle;
simulation state updates MUST be scoped to the variables that actually changed.
The production bundle MUST remain loadable on a standard connection within 5 seconds
(first meaningful paint). Large third-party libraries MUST be justified before adding
them as dependencies.

**Rationale**: PLC simulators are latency-sensitive. A lagging scan cycle produces
incorrect timer/counter behavior. Performance regressions are hard to detect visually
but immediately corrupt program semantics.

### V. Upstream Compatibility & Licensing

Fork-specific changes MUST be clearly documented in `CLAUDE.md` under "Yapılan
Değişiklikler". Bug fixes suitable for upstream MUST be submitted as a PR to the
upstream repository (`codingplc/plc-simulator`) separately. No change may remove the
GPL v3 license header or make the source code non-distributable. The `main` branch MUST
remain in sync with upstream — all fork customizations live on `simulator` (active
development) and `selcuk-dev` (auto-deploy target). Commit messages for deployable
changes MUST include `[deploy]` when targeting the `selcuk-dev` branch to trigger
GitHub Actions.

**Rationale**: GPL v3 compliance is a legal requirement. Keeping upstream PRs separate
ensures the project gives back to the community and reduces long-term merge debt.

## Technology Standards

- **Language**: TypeScript (strict mode) — no plain JS files in `src/`
- **Framework**: React 18 with functional components and hooks only (no class components)
- **State**: Redux Toolkit with Immer; `redux-persist` + `localforage` for persistence
- **Styling**: Styled Components for component styles; CSS custom properties in
  `index.css` for design tokens; MUI for interactive controls (tooltips, dialogs, etc.)
- **Package manager**: `yarn` exclusively — do not use `npm` or `pnpm`
- **Build**: `yarn build` → `build/` directory; deployed to `/var/www/plc-sim/` via rsync
- **Browser target**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge);
  no IE support required
- **SVG elements**: Inline SVG for diagram elements; file-based SVG for toolbox icons

## Development Workflow

- **Active development branch**: `simulator` → reviewed locally, merged to `selcuk-dev`
  for deployment
- **Deploy trigger**: Commit message containing `[deploy]` on `selcuk-dev` branch
  activates GitHub Actions (`.github/workflows/deploy.yml`)
- **Feature branches**: Named descriptively from `simulator` (e.g., `feat/ctud-counter`)
- **Upstream sync**: `main` tracks upstream; sync periodically, cherry-pick or rebase
  fork changes onto updated `main` when needed
- **Before committing**: `yarn build` MUST succeed without TypeScript errors; browser
  console MUST be error-free on the primary use flow (draw → simulate → stop)
- **Constitution Check for plans**: Every implementation plan MUST verify compliance
  with all five Core Principles before Phase 0 research begins

## Governance

This constitution supersedes all informal conventions. When a practice conflicts with a
principle stated here, the constitution wins. Amendments require:

1. A clear rationale explaining why the principle change is needed
2. A version bump following semantic versioning:
   - **MAJOR**: Principle removed, redefined, or governance fundamentally restructured
   - **MINOR**: New principle added or an existing principle materially expanded
   - **PATCH**: Clarifications, wording improvements, typo fixes
3. Update to `LAST_AMENDED_DATE` and `CONSTITUTION_VERSION`
4. A propagation check to ensure `.specify/templates/` files remain consistent

All feature plans (`plan.md`) MUST include a "Constitution Check" section. Complexity
that violates a principle (e.g., adding a heavy dependency) MUST be justified in the
plan's "Complexity Tracking" table. Runtime development guidance lives in `CLAUDE.md`.

**Version**: 1.0.0 | **Ratified**: 2026-03-16 | **Last Amended**: 2026-03-16
