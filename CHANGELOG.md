# Changelog

All notable changes to this project are documented here.

## Unreleased

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
