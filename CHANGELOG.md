# Changelog

All notable changes to this project are documented here.

## Unreleased

## 0.3.3 — Coaching tips panel in solo results (2026-09-05)

- **feat**: a collapsible "Coaching tips" panel in `ResultsView.tsx`
  (collapsed by default), showing one personalized tip per top-3
  motivator. Each tip wraps that motivator's existing `reflection`
  question (already in `src/i18n/*.json`, no new content file) in one of
  three impact-aware templates depending on how the user assessed that
  motivator's impact (positive/negative/neutral) during change
  assessment.
- **context**: closes [#52](https://github.com/agile-toolkit/moving-motivators/issues/52). The existing `InterpretationPanel` already surfaces
  aggregate pattern-level insight (e.g. "this change risks undermining
  motivators that are core to you"); this panel is per-motivator and
  personalized, addressing the issue's specific ask rather than
  duplicating what `InterpretationPanel` already covers.
- **chore**: closed [#49](https://github.com/agile-toolkit/moving-motivators/issues/49) (first-run onboarding), which had already
  shipped in PR #57 back in July but was never formally closed.

## 0.3.2 — Add glass effect to the header (2026-09-04)

- **fix**: `AppHeader.tsx`'s background changed from opaque
  `bg-white`/`dark:bg-gray-900` to `bg-[var(--glass)] backdrop-blur-sm` —
  the Dashboard's own nav has always had this translucent blur effect,
  but the shared header every app copies did not. User-reported
  inconsistency. Uses the `--glass` token already sitting in this app's
  own `tokens.css` but never actually consumed. Verified in both themes.

- **ui**: decorative emoji across `HomeScreen`, `FacilitationGuide`,
  `ResultsView`, and `TeamSession` replaced with SVG icons from the shared
  `icons.tsx` set (compass, team, clipboard, tip, warning/check-circle,
  chart, upload/download, undo, print, link, person, tag, clock, hourglass) —
  icons inherit `currentColor` and render at consistent sizes instead of
  relying on the viewer's emoji font. `icons.tsx` synced from the design
  system (64 icons total); `HandshakeIcon` was retired in favor of `TeamIcon`
  (unused in this app, so nothing broke). Motivator card emoji and the
  ↑ / ↓ impact-instruction prose are unchanged — those are product content,
  not decoration.
- **ui**: the `←`/`→` back/next chrome glyphs in `ChangeAssessment` (both
  phases' back buttons, the describe-phase next button) and `RankingBoard`
  (back button) swapped for `ArrowLeftIcon`/`ArrowRightIcon` on the side the
  glyph was on. `MotivatorCard`'s `↑`/`↓` impact-vote glyphs and
  `TeamSession`'s rank-delta badge with its "↑↓ = ≥2 ranks from average"
  legend are deliberately left as text — each pairs a glyph with prose that
  names that exact character, so converting one side without the other would
  desync them.
- **ci**: CI Node bumped 20 → 22 and `engines` declared. `jsdom@30` requires
  Node `^22.22.2 || ^24.15.0 || >=26`, so the test step could never have passed
  on the pinned Node 20 — invisible until this release started running the
  tests in CI at all. Builds were unaffected (vite and tsc do not load jsdom).


## 0.3.0 — Session integrity, error boundary, code-splitting (2026-09-03)

- **fix**: session PINs could silently destroy a live session — including a
  Planning Poker one. Both apps minted 4-digit `Math.random()` PINs, wrote them
  with `set()` without checking, and shared the path `sessions/<pin>` in the
  *same* Firebase project. New `src/session.ts`: 900,000 PINs from
  `crypto.getRandomValues`, `claimSession` checks-then-writes with retry, path
  namespaced to `sessions/moving-motivators/<pin>`.
- **fix**: joining never verified the session existed. Pushing a participant
  into a mistyped PIN *created* that node, leaving the joiner waiting in a lobby
  with no host and no indication anything was wrong.
- **fix**: no session was ever deleted. `createdAt` is now server-set and drives
  a 24h TTL in the security rules; the session is released once results are
  captured locally.
- **fix**: `?join=` was interpolated into a database path unvalidated.
- **fix**: appending to `sessionHistory` and `teamSessionHistory` spread the
  parsed value without checking it was an array — a non-array left by an older version or a
  half-restored workspace threw inside a click handler and took the session
  down.
- **feat**: `ErrorBoundary` at the root, with a scoped "clear this app's saved
  data" recovery path.
- **perf**: entry chunk 230 kB gz → 119 kB gz (lazy Firebase + html2canvas).
- **ci**: `npm test` now runs before `npm run build` in `deploy.yml`.

## 0.2.10 — Facilitator Mode persists across suite apps (2026-09-03)

- **fix**: `useFacilitatorMode`'s storage key changed from
  `'moving-motivators:facilitatorMode'` to the shared
  `'agile-toolkit:facilitatorMode'` — user-requested so Facilitator Mode
  survives navigating to another suite app in the same tab instead of
  resetting. sessionStorage is already shared per-origin-per-tab; this
  was previously app-prefixed specifically to keep it isolated, which
  turned out to be the wrong default for a cross-app presentation
  session.

## 0.2.9 — Fix MotivatorInfo close button using the × variant (2026-09-03)

- **fix (follow-up)**: the motivator-info drawer's close button used `×`
  (multiplication sign, U+00D7) rather than `✕`, a variant the original
  emoji→SVG sweep's grep missed. Replaced with `CloseIcon`. `TeamSession.tsx`'s
  `×{count}` repeat-count badge is genuine multiplication notation, left
  as plain text.

## 0.2.8 — Replace decorative ✕ emoji with SVG icons (2026-09-03)

- **feat**: replaced 3 decorative `✕` back/close text glyphs
  (FacilitationGuide's back button, ResultsView's save-as cancel,
  TeamSession's revealed-phase back button) with `CloseIcon` from the
  new shared `icons.tsx`, `currentColor` throughout. Part of a
  suite-wide emoji→SVG sweep the user asked for.

## 0.2.7 — Hide informational elements in Facilitator Mode (2026-09-03)

- **fix (follow-up)**: the Home screen's "Facilitation guide" link and
  "About this exercise" panel — the latter defaulting open on first
  visit — weren't gated by Facilitator Mode at all (`HomeScreen` never
  received the prop). Both now hide while presenting; nothing else on
  Home was reachable outside the standard nav-hiding pattern already
  applied everywhere else.

## 0.2.6 — Facilitator Mode (2026-09-03)

- **feat**: added Facilitator (projector) Mode — a presentation toggle for
  in-room workshops, bigger UI via one CSS rule (everything sized in `rem`
  scales automatically) plus hiding the language picker while active.
  Toggled from a new header button next to the theme toggle,
  session-scoped via `sessionStorage`. Adopted from the shared
  design-system pattern (`useFacilitatorMode.ts` + `FacilitatorToggle.tsx`),
  originally built for Team Identity. Not to be confused with the existing
  team-mode phase timer, which is a separate feature.

## 0.2.5 — Fix Sprint Metrics never receiving motivator data (2026-09-03)

- **fix (broken integration, missing field)**: `moving-motivators:lastSession`
  never included a `topMotivators` field — only `ranked` (the full,
  ordered list). Sprint Metrics' `loadMotivatorSnapshot()` fallback
  specifically checks `Array.isArray(parsed?.topMotivators)` before
  using this key, so that check was always false and the whole
  fallback path was dead: Sprint Metrics could only ever pick up
  motivator context via a manual file import, never automatically from
  a solo session here. Found by a suite-wide cross-app link audit.
  Added `topMotivators` (first 3 of `ranked`) alongside the existing
  field. Extracted session-building into `src/sessionEntry.ts`
  (tested) while fixing it.

## 0.2.4 — Fix LanguagePicker dark mode (2026-09-02)

- **fix**: `LanguagePicker.tsx` had zero `dark:` classes, so the
  language dropdown stayed light-themed (white background, dark text
  invisible against the app's dark canvas in places) in dark mode.
  Brought it in sync with the design-system's canonical (now fixed)
  copy — full `dark:` coverage on the trigger, chevron, dropdown, and
  each option. Found via a suite-wide audit after a user report.

## 0.2.3 — Fix low-contrast unranked/unselected controls (2026-09-02)

- **fix**: the unselected-state text for impact-vote controls and
  unranked-motivator drag handles used `text-gray-300` (light mode) /
  `text-gray-700` (dark mode) against a near-white/near-black background —
  well below WCAG AA contrast, making the control nearly invisible until
  hover. Bumped to `gray-400`/`gray-600` (light) and `gray-600`/`gray-400`
  (dark) in `MotivatorCard.tsx`, `RankingBoard.tsx`, and
  `ChangeAssessment.tsx`. Found via a suite-wide UX audit.

## 0.2.2 — Remove Management 3.0 trademark references (2026-09-02)

- **content**: removed "Management 3.0" text and the outbound
  `management30.com` link (app subtitle, the "About this exercise" body
  copy, `index.html`'s meta description, `README.md`, `GOAL.md`). Kept
  everything else as-is — the CHAMPFROGS model name, Jurgen Appelo
  attribution, and the app's own name are descriptive practice
  references, not the registered "Management 3.0" mark itself.

## 0.2.1 — Fix broken test suite (2026-09-02)

- **fix**: `npm test` was broken — `vitest` was declared but its `jsdom`
  environment dependency was never installed, and zero test files existed,
  so the command failed outright with no coverage. Added `jsdom`, plus
  real unit tests for `src/activeTeam.ts` (the suite-wide team-name
  contract's read/write/no-op logic) and `src/data/motivators.ts` (the
  CHAMPFROGS motivator table and default-ranking helper). `npm test` now
  passes cleanly: 2 files, 12 tests.

## 0.2.0 — E1: Team Identity name handoff (2026-09-01)

- **feat**: the host lobby now offers a one-click "use this team's name"
  suggestion, sourced from the suite-wide `agile-toolkit:activeTeam`
  contract (`src/activeTeam.ts`, defined by the Dashboard), plus a plain
  text field to type a name directly. The accepted/typed name replaces the
  raw session PIN in `moving-motivators:motivationSnapshot` and
  `moving-motivators:teamSessionHistory` — previously every team session
  was tagged with its PIN as the "team name," with no way to give it a
  real one. Typing or accepting a name also writes it back to the suite
  contract (`source: "moving-motivators"`), so it stays current for other
  apps too. i18n: `team.namePlaceholder` / `team.useSuggestedName` in
  EN/ES/BE/RU.
- **docs**: refresh `GOAL.md` from the suite-wide `GOALS.md` platform
  thesis and rebuild `ROADMAP.md` around it.
- **docs**: added `.artefacts/GOAL.md` and `.artefacts/ROADMAP.md`, and filled in `README.md` with dev commands, a localStorage keys table, and tech notes. Docs-only — no behavior change; documents functionality that previously only lived in `.artefacts/BRIEF.md`.
- **docs**: move GOAL.md and ROADMAP.md from .artefacts/ to the repo root.
