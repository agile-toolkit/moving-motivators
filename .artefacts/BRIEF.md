# Moving Motivators — Brief

## Overview

Interactive [Management 3.0 Moving Motivators](https://management30.com/practice/moving-motivators/) (CHAMPFROGS): solo ranking and change assessment, plus optional Firebase-backed team sessions. React 18, Vite, Tailwind, `@dnd-kit`, react-i18next. Deploy: GitHub Pages (`vite.config` base `/moving-motivators/`).

## Features

- [x] Solo mode — rank ten motivators, assess change (↑ / ↓ / neutral), results + interpretation
- [x] Team mode — host/join flow, PIN, Firebase realtime (`TeamSession.tsx`)
- [x] English + Russian locales (`src/i18n/en.json`, `ru.json`)
- [x] Spanish + Belarusian locales (`src/i18n/es.json`, `be.json`) — all 4 suite locales now complete
- [x] 4-language toggle in header — cycles EN → ES → BE → RU
- [x] Responsive layout and touch-friendly drag-and-drop
- [x] Share / copy results as image — html2canvas captures results div to clipboard PNG (or downloads if clipboard API unavailable)
- [x] Optional insight line — `results.insight` shown below interpretation panel when change is assessed
- [x] Facilitation guide screen — FacilitationGuide.tsx wired in App.tsx; linked from HomeScreen
- [x] Team session phase copy — lobby/ranking/assessing/revealed all wired; `team.waitingFor` shown when no participants yet
- [x] Home team section label — `home.team` used as section heading above host/join buttons
- [x] Header language toggle — uses `lang.en` / `lang.ru` / `lang.es` / `lang.be` i18n keys

## Backlog

<!-- Agent: append `needs-review` research issues here as `- [ ] #N …` -->
- [x] [#9] Feature: ES + BE locale support (suite standard) — implemented 2026-05-01
- [ ] [#10] Integration: Moving Motivators → Work Profiles (motivator snapshot)
- [ ] [#11] Feature: QR code sharing for team sessions
- [ ] [#12] Feature: PWA / offline support for workshop use
- [ ] [#13] Feature: print / PDF export of results
- [ ] [#14] Integration: Moving Motivators → Sprint Metrics (motivation snapshot export)

## Tech notes

- Firebase optional for solo; CI/production builds may use `VITE_FIREBASE_*` secrets (see `.github/workflows/deploy.yml`).
- Submodule `agentic-kit` remote: `bthos/agentic-kit` (see `.gitmodules`).

## Agent Log

### 2026-05-01 — feat: ES + BE locale support (issue #9, approved)
- Done: created `src/i18n/es.json` and `src/i18n/be.json` with full translations of all ~50 keys (app, home, rank, assess, results, facilitation, team, motivators, lang, common); registered es + be in `src/i18n/index.ts`; updated header toggle in `App.tsx` to cycle EN → ES → BE → RU; added `lang.es` and `lang.be` keys to en.json and ru.json
- Remaining backlog: #10 Work Profiles integration, #11 QR code sharing, #12 PWA offline, #13 print/PDF export, #14 Sprint Metrics integration; also #5 favicon (research-more)
- Next task: check needs-review issues for human feedback (#10 Work Profiles integration, #11 QR code sharing, #12 PWA offline, #13 print/PDF export, #14 Sprint Metrics integration); also check #5 favicon (research-more)

### 2026-04-27 — research: offline, print, and sprint integration opportunities
- Done: checked issues #9/10/11 — all still `needs-review`, no human feedback yet; created issue #12 (PWA/offline support via vite-plugin-pwa), #13 (print/PDF export via CSS @media print), #14 (Sprint Metrics integration via localStorage + URL param snapshot)
- Waiting for human review on #9 through #14
- Next task: check needs-review issues for human feedback (#9 ES+BE locales, #10 Work Profiles integration, #11 QR code sharing, #12 PWA offline, #13 print/PDF export, #14 Sprint Metrics integration)

### 2026-04-24 — research: market + integration opportunities
- Done: created issue #9 (ES+BE locales — suite standard gap), #10 (Work Profiles integration via motivator snapshot export), #11 (QR code sharing for team sessions)
- Waiting for human review on all three
- Next task: check needs-review issues for human feedback (#9 ES+BE locales, #10 Work Profiles integration, #11 QR code sharing)

### 2026-04-20 — feat: wire all remaining unused i18n keys
- Done: `results.insight` paragraph in ResultsView.tsx (shown when change assessed); `home.team` heading in HomeScreen.tsx team section; `lang.en`/`lang.ru` in App.tsx header toggle; `team.waitingFor` in host lobby when no participants; `team.phase.lobby` waiting screen for participants; `team.phase.ranking`/`assessing` phase badges in team-play.
- Remaining features: none — all BRIEF features implemented.
- Next task: check needs-review issues for human feedback; run research cycle for market/integration/UX improvements.

### 2026-04-19 — feat: share / copy results as image
- Done: installed html2canvas; added `handleShare` in `ResultsView.tsx` — captures container div to PNG, writes to clipboard via ClipboardItem, falls back to download link; share button added beside Start Over with `t('results.share')` label and spinner state.
- Remaining features: optional insight line (`results.insight` unused), facilitation guide screen (`facilitation.*` strings), team session phase copy (`team.phase.lobby/ranking/assessing`, `team.waitingFor`, `team.facilitationGuide`), home.team i18n key, lang toggle EN/RU → i18n keys.
- Next task: Wire `results.insight` string as a hint paragraph below the interpretation panel in `src/components/ResultsView.tsx`; key exists in `en.json` and `ru.json`.

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Replaced ad-hoc NO-BRIEF dump with Overview / Features / Backlog / Tech notes / Agent Log per `agile-toolkit/.github` `AGENT_AUTONOMOUS.md`.
- Remaining: share button (`html2canvas` + `t('results.share')`), facilitation + team phase i18n, lang toggle, optional `results.insight`.
- Next task: `npm install html2canvas`; in `src/components/ResultsView.tsx` beside Start Over (~line 202) add button `t('results.share')` for PNG/clipboard capture; keys already in `en.json` / `ru.json`.
