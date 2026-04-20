# Moving Motivators — Brief

## Overview

Interactive [Management 3.0 Moving Motivators](https://management30.com/practice/moving-motivators/) (CHAMPFROGS): solo ranking and change assessment, plus optional Firebase-backed team sessions. React 18, Vite, Tailwind, `@dnd-kit`, react-i18next. Deploy: GitHub Pages (`vite.config` base `/moving-motivators/`).

## Features

- [x] Solo mode — rank ten motivators, assess change (↑ / ↓ / neutral), results + interpretation
- [x] Team mode — host/join flow, PIN, Firebase realtime (`TeamSession.tsx`)
- [x] English + Russian locales (`src/i18n/en.json`, `ru.json`)
- [x] Responsive layout and touch-friendly drag-and-drop
- [x] Share / copy results as image — html2canvas captures results div to clipboard PNG (or downloads if clipboard API unavailable)
- [x] Optional insight line — `results.insight` shown below interpretation panel when change has negatives
- [ ] Facilitation guide screen — `facilitation.*` strings unused
- [ ] Team session phase copy — `team.phase.lobby` / `ranking` / `assessing`, `team.waitingFor`, `team.facilitationGuide` unused; only `team.phase.revealed` wired
- [ ] Home copy — `home.team` unused (host/join/unavailable used)
- [ ] Header language toggle uses raw `EN`/`RU` in `App.tsx` instead of `lang.en` / `lang.ru`

## Backlog

<!-- Agent: append `needs-review` research issues here as `- [ ] #N …` -->

## Tech notes

- Firebase optional for solo; CI/production builds may use `VITE_FIREBASE_*` secrets (see `.github/workflows/deploy.yml`).
- Submodule `agentic-kit` remote: `bthos/agentic-kit` (see `.gitmodules`).

## Agent Log

### 2026-04-20 — feat: wire results.insight hint paragraph
- Done: added `<p>` below `InterpretationPanel` in `ResultsView.tsx` rendering `t('results.insight')` when `change` is set and `negatives.length > 0`.
- Remaining features: facilitation guide screen (`facilitation.*` strings), team session phase copy (`team.phase.lobby/ranking/assessing`, `team.waitingFor`, `team.facilitationGuide`), home.team i18n key, lang toggle EN/RU → i18n keys.
- Next task: Add facilitation guide screen — `FacilitationGuide.tsx` already exists; wire it into `App.tsx` routing and add a link from `HomeScreen.tsx`; `facilitation.*` i18n keys already in `en.json`/`ru.json`.

### 2026-04-19 — feat: share / copy results as image
- Done: installed html2canvas; added `handleShare` in `ResultsView.tsx` — captures container div to PNG, writes to clipboard via ClipboardItem, falls back to download link; share button added beside Start Over with `t('results.share')` label and spinner state.
- Remaining features: optional insight line (`results.insight` unused), facilitation guide screen (`facilitation.*` strings), team session phase copy (`team.phase.lobby/ranking/assessing`, `team.waitingFor`, `team.facilitationGuide`), home.team i18n key, lang toggle EN/RU → i18n keys.
- Next task: Wire `results.insight` string as a hint paragraph below the interpretation panel in `src/components/ResultsView.tsx`; key exists in `en.json` and `ru.json`.

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Replaced ad-hoc NO-BRIEF dump with Overview / Features / Backlog / Tech notes / Agent Log per `agile-toolkit/.github` `AGENT_AUTONOMOUS.md`.
- Remaining: share button (`html2canvas` + `t('results.share')`), facilitation + team phase i18n, lang toggle, optional `results.insight`.
- Next task: `npm install html2canvas`; in `src/components/ResultsView.tsx` beside Start Over (~line 202) add button `t('results.share')` for PNG/clipboard capture; keys already in `en.json` / `ru.json`.
