# Changelog

All notable changes to this project are documented here.

## Unreleased

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
