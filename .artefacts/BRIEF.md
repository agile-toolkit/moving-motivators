# Moving Motivators — Brief

## Overview

Interactive [Management 3.0 Moving Motivators](https://management30.com/practice/moving-motivators/) (CHAMPFROGS): solo ranking and change assessment, plus optional Firebase-backed team sessions. React 18, Vite, Tailwind, `@dnd-kit`, react-i18next. Deploy: GitHub Pages (`vite.config` base `/moving-motivators/`).

## Features

- [x] Solo mode — rank ten motivators, assess change (↑ / ↓ / neutral), results + interpretation
- [x] Team mode — host/join flow, PIN, Firebase realtime (`TeamSession.tsx`)
- [x] English + Russian locales (`src/i18n/en.json`, `ru.json`)
- [x] Responsive layout and touch-friendly drag-and-drop
- [ ] Share / copy results as image — `results.share` exists in locales but no control in `src/components/ResultsView.tsx`
- [ ] Optional insight line — `results.insight` unused in `src/`
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

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Replaced ad-hoc NO-BRIEF dump with Overview / Features / Backlog / Tech notes / Agent Log per `agile-toolkit/.github` `AGENT_AUTONOMOUS.md`.
- Remaining: share button (`html2canvas` + `t('results.share')`), facilitation + team phase i18n, lang toggle, optional `results.insight`.
- Next task: `npm install html2canvas`; in `src/components/ResultsView.tsx` beside Start Over (~line 202) add button `t('results.share')` for PNG/clipboard capture; keys already in `en.json` / `ru.json`.
