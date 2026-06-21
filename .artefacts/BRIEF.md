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
- [x] Solo results localStorage persistence — writes `moving-motivators:lastSession` on solo-results transition (issue #16, moving-motivators side)
- [x] Unified AppHeader + LanguagePicker — replaced inline header with design-system components; flag dropdown replaces cycle button (issue #24)
- [x] Light/dark theme — darkMode:class in tailwind.config.js, anti-flash script in index.html, ThemeToggle in AppHeader, dark: variants across all src/ files (issue #25)
- [x] Keyboard accessibility for motivator ranking — KeyboardSensor + sortableKeyboardCoordinates added to RankingBoard; aria-label on each SortableCard; focus-visible ring; keyboard hint text below board (issue #17)
- [x] Solo motivator shift tracking — writes `moving-motivators:sessionHistory` (last 5 sessions) on solo-results transition; collapsible "How have your motivators shifted?" panel in ResultsView shows previous vs current ranked rows with ↑↓ delta arrows, green/red for ≥3 position moves (issue #21)
- [x] Change Planner integration (Moving Motivators side) — "Assess in Change Planner" button in ResultsView encodes motivator snapshot (ranked order + change directions + change text) as base64 JSON in `?mm_snapshot=` URL param and opens Change Planner; reads `?change=` URL param on load to pre-fill change description and skip to ranking screen (issue #22, MM side)
- [x] Facilitator timer for team sessions — phase-aware host controls (Start Ranking → Start Assessing → Reveal); `FacilitatorTimer.tsx` with circular SVG progress ring, 3/5/8 min presets + custom input, Web Audio API beep on completion, start/pause/reset; timer start time synced to Firebase so participants see a thin progress bar (`ParticipantTimerBar.tsx`) without countdown numbers (issue #20)
- [x] Side-by-side individual comparison in team sessions — toggle below aggregate revealed view; motivator×participant grid sorted by aggregate rank; green top-3 / red bottom-3 color coding; ↑↓ badges for ranks ≥2 from average; host-controlled anonymization (P1/P2); legend line; all 4 locale keys under `team.comparison.*` (issue #19)
- [x] Sprint Metrics integration — writes `moving-motivators:motivationSnapshot` to localStorage when host reveals team session (top 3 motivators by aggregate rank, participant count, date, PIN as team name); "Send to Sprint Metrics" button in TeamResultsView encodes snapshot as base64 and opens Sprint Metrics with `?mm=<base64>` URL param; i18n key `team.sendToSprintMetrics` in all 4 locales (issue #14)
- [x] Named session storage — "Save as…" button in ResultsView labels the current session in sessionHistory; label shown in SessionShiftPanel history list; each history entry has optional `label?: string` field; Restore button re-populates ranking board from any history entry; history cap increased from 5 to 20 (issue #34)
- [x] PWA / offline support — `vite-plugin-pwa` with `generateSW` strategy; service worker caches app shell + fonts; offline banner shown app-wide when network drops; team session buttons disabled when offline; Web App Manifest with coral theme and SVG icon (issue #12)
- [x] QR code sharing for team sessions — `qrcode.react` `<QRCodeSVG>` rendered in host lobby showing join URL (`?join=<PIN>`); hidden on screens < 480px; `team.scanToJoin` i18n key in all 4 locales; App.tsx reads `?join=` URL param on load and auto-navigates to join screen with PIN pre-filled (issue #11)
- [x] Team session history — `advancePhase('revealed')` appends to `moving-motivators:teamSessionHistory` (max 10, FIFO); `SessionHistoryPanel` collapsible below Send-to-Sprint-Metrics in host-only TeamResultsView; each entry: PIN, date, top 3 motivators as chips, participant count (issue #18)

## localStorage keys

| Key | Written by | Shape |
|-----|-----------|-------|
| `moving-motivators:lastSession` | `App.tsx` `goToSoloResults()` — called on solo-results transition from both RankingBoard (skip) and ChangeAssessment (next) | `{ date: "YYYY-MM-DD", savedAt: number, ranked: MotivatorId[], change: string, changes: Record<MotivatorId, ImpactLevel> }` |
| `moving-motivators:sessionHistory` | `App.tsx` `goToSoloResults()` — prepends current session, keeps last 20 | `Array<{ label?: string, date: "YYYY-MM-DD", savedAt: number, ranked: MotivatorId[], change: string, changes: Record<MotivatorId, ImpactLevel> }>` — index 0 = most recent |
| `moving-motivators:motivationSnapshot` | `TeamSession.tsx` `advancePhase('revealed')` — written by host when revealing team session results | `{ teamName: string (PIN), date: "YYYY-MM-DD", topMotivators: MotivatorId[3], participantCount: number }` |
| `moving-motivators:teamSessionHistory` | `TeamSession.tsx` `advancePhase('revealed')` — prepends entry, keeps last 10 | `Array<{ sessionId: string (PIN), teamName: string (PIN), date: "YYYY-MM-DD", topMotivators: MotivatorId[3], participantCount: number }>` |
| `work-profiles:motivatorSnapshot` | `ResultsView.tsx` `handleExportToWorkProfiles()` — written on "Export to Work Profiles" button click | `{ date: "YYYY-MM-DD", ranked: MotivatorId[], topMotivators: MotivatorId[3] }` |

## Backlog

<!-- Agent: append `needs-review` research issues here as `- [ ] #N …` -->
- [x] [#9] Feature: ES + BE locale support (suite standard) — implemented 2026-05-01
- [x] [#10] Integration: Moving Motivators → Work Profiles (motivator snapshot) — implemented 2026-06-20
- [x] [#11] Feature: QR code sharing for team sessions — implemented 2026-06-16
- [x] [#12] Feature: PWA / offline support for workshop use — implemented 2026-06-13
- [x] [#13] Feature: print / PDF export of results — implemented 2026-06-21
- [x] [#14] Integration: Moving Motivators → Sprint Metrics (motivation snapshot export) — implemented 2026-06-07
- [ ] [#16] Feature: persist solo results to localStorage + Dashboard card reader (MM side done; Dashboard reader pending in agile-toolkit.github.io)
- [x] [#17] Feature: keyboard accessibility for motivator ranking (KeyboardSensor) — implemented 2026-05-21
- [x] [#18] Feature: team session history — view past revealed sessions — implemented 2026-06-21
- [x] [#19] Feature: side-by-side individual comparison in team sessions — implemented 2026-05-31
- [x] [#20] Feature: facilitator timer for ranking and assessment phases — implemented 2026-05-30
- [x] [#21] Feature: solo motivator shift tracking — compare sessions over time (implemented)
- [x] [#22] Integration: Moving Motivators ↔ Change Planner — MM side implemented; Change Planner side (read ?mm_snapshot= and show motivator context sidebar) pending

## Tech notes

- Firebase optional for solo; CI/production builds may use `VITE_FIREBASE_*` secrets (see `.github/workflows/deploy.yml`).
- `.gitmodules` references `agentic-kit` (dev pipeline tooling, not used in build). CI workflow does not fetch submodules.

## Agent Log

### 2026-06-21 — chore: housekeeping — transition to stable
- Done: fixed BRIEF.md backlog (#17 marked [x] — was implemented 2026-05-21 but backlog checkbox was stale); updated project status for issue #25 (Backlog → In Review); all moving-motivators features now complete and checked
- Remaining: #16 Dashboard card reader (needs agile-toolkit.github.io run); #22 Change Planner side (needs change-planner run)
- Next task: check issues for human feedback; research cycle — market/UX/integration improvements

### 2026-06-21 — feat: team session history (issue #18)
- Done: added `TeamSessionHistoryEntry` type to `types.ts`; in `TeamSession.tsx` `advancePhase('revealed')` now appends entry to `moving-motivators:teamSessionHistory` (max 10 FIFO) alongside existing `motivationSnapshot` write; added `SessionHistoryPanel` component — collapsible panel reading history from localStorage, shows each past session's PIN, date, top-3 motivator chips, and participant count; wired into `TeamResultsView` for host only (below "Send to Sprint Metrics"); i18n key `team.sessionHistory.title` in all 4 locales
- Remaining: many approved issues pending (#24 header unification, #16 Dashboard reader, etc.)
- Next task: check issues for human feedback; implement #16 (Dashboard card reader for moving-motivators — add readMovingMotivators() in agile-toolkit.github.io/src/readers.ts reading moving-motivators:lastSession, show top 3 motivators + change + date chip in Dashboard card)

### 2026-06-21 — feat: print / PDF export of results (issue #13)
- Done: added `@media print` CSS to `src/index.css` — hides `<header>` and `[role="status"]` (offline banner), removes box-shadows, forces white background, makes `.overflow-x-auto` visible so ranked card row doesn't clip; added `print:hidden` class to action buttons section in `ResultsView.tsx` so buttons don't appear in printout; added "🖨️ Print / Save as PDF" button that calls `window.print()`, placed between share and Change Planner buttons; added `results.print` i18n key to all 4 locales (EN/ES/RU/BE); installed `qrcode.react` (was missing from node_modules, needed for build)
- Remaining: #18 (team session history)
- Next task: check issues for human feedback; implement #18 (team session history — last 10 revealed team sessions in localStorage moving-motivators:teamSessionHistory key, aggregate data only: PIN/teamName, date, topMotivators, participantCount; SessionHistoryPanel in TeamSession.tsx revealed view for host)

### 2026-06-20 — feat: Work Profiles integration — Export to Work Profiles button (issue #10)
- Done: added `buildWorkProfilesSnapshot()` in `ResultsView.tsx` — sorts motivators by rank, creates `{date, ranked, topMotivators[3]}` snapshot, writes to `work-profiles:motivatorSnapshot` localStorage key, encodes as base64 JSON; added `handleExportToWorkProfiles()` handler that calls builder and opens `https://agile-toolkit.github.io/work-profiles/?motivators=<base64>` in new tab; added "Export to Work Profiles" button (violet) below "Assess in Change Planner" in the actions row; added `results.exportToWorkProfiles` i18n key to all 4 locales (EN/ES/BE/RU); solo mode only (button lives in ResultsView.tsx)
- Remaining: #13 (print/PDF export), #18 (team session history)
- Next task: check issues for human feedback; implement #13 (print/PDF export of results — CSS @media print approach, add print button in ResultsView.tsx, zero new deps) or #18 (team session history — last 10 sessions in localStorage moving-motivators:teamSessionHistory, list in TeamSession.tsx revealed view)

### 2026-06-20 — research: human feedback check + auto-approvals
- Done: checked open issues; auto-approved #13 (print/PDF, 54 days stale Feature from BRIEF — CSS @media print approach, zero deps) and #18 (team session history, 37 days stale Feature from BRIEF — localStorage-only, last 10 sessions, aggregate data only, key: moving-motivators:teamSessionHistory); added research-complete comment to #5 (favicon, research-more — SVG design ready, teal #0d9488); set project statuses: #5 → In Review, #10/#13/#18 → In Progress
- Remaining: implement #10 (Work Profiles integration)
- Next task: implement #10 (Work Profiles integration — in ResultsView.tsx add "Export to Work Profiles" button below "Assess in Change Planner"; snapshot {date, ranked: MotivatorId[], topMotivators: MotivatorId[3]}; write to localStorage key work-profiles:motivatorSnapshot; encode as base64 JSON in ?motivators= URL param; open https://agile-toolkit.github.io/work-profiles/ in new tab; add results.exportToWorkProfiles i18n key to all 4 locales)

### 2026-06-16 — feat: QR code sharing for team sessions (issue #11)
- Done: installed `qrcode.react@4.2.0`; in `TeamSession.tsx` — imported `QRCodeSVG` and added `initialJoinPin` prop; QR code block (`<QRCodeSVG>`, 140px, level M) rendered in host lobby below PIN display, hidden on screens < 480px via `hidden min-[480px]:flex`; `joinUrl` = `window.location.origin + import.meta.env.BASE_URL + '?join=' + pin`; `team.scanToJoin` label below QR in all 4 locales (EN/ES/RU/BE); in `App.tsx` — added `readJoinParam()` helper, `initialJoinPin` state, if `?join=` param present initial screen is `team-join` and PIN pre-filled in join form via prop; URL params cleared after read
- Remaining approved: #10 (Work Profiles integration — motivator snapshot)
- Next task: check issues for human feedback; implement #10 (Work Profiles integration — export motivator snapshot to work-profiles:motivatorSnapshot localStorage key, or deep-link to Work Profiles with snapshot encoded in URL)

### 2026-06-13 — feat: PWA / offline support (issue #12)
- Done: installed `vite-plugin-pwa@1.3.0`; updated `vite.config.ts` with `VitePWA({ registerType: 'autoUpdate', generateSW })` — caches app shell + static assets + Google Fonts (CacheFirst, 365d TTL); Web App Manifest (`dist/manifest.webmanifest`) with name, short_name, coral theme_color `#FF6B5B`, `display: standalone`, `start_url/scope: /moving-motivators/`, SVG icon at `public/icons/icon.svg`; added `useOnlineStatus()` hook in `App.tsx` (listens to `window online/offline` events); offline amber banner shown below header when offline (`pwa.offlineBanner` i18n key in all 4 locales); `HomeScreen` accepts `isOnline` prop and short-circuits `firebaseReady` to false when offline, gracefully disabling team session buttons
- Remaining approved: #11 (QR code sharing), #10 (Work Profiles integration)
- Next task: check issues for human feedback; implement #11 (QR code sharing for team sessions — qrcode.react or qrjs2 library, QR code overlay in team lobby showing join URL with PIN pre-filled, visible to host)

### 2026-06-09 — feat: named session storage — Save as…, Restore, history cap 20 (issue #34)
- Done: added `label?: string` to `SessionEntry` in `types.ts`; in `App.tsx` increased history cap from 5→20 and added `restoreSession()` — reconstructs `MotivatorItem[]` from `SessionEntry.ranked`+`changes`, sets state, navigates to `solo-rank`; in `ResultsView.tsx` — local `history` state synced with localStorage, "🏷️ Save as…" button shows inline input to label the current session (updates `history[0].label`, persists to localStorage), label displayed after save; `SessionShiftPanel` now accepts `history`+`onRestore` props — history list (previous sessions) with per-entry Restore button shown below shift comparison; labels shown in both shift comparison header and history list, fallback to date; all 4 locales updated with `saveAs`, `saveAsPlaceholder`, `saveAsSave`, `restore`, `sessionHistory` keys
- Remaining: check issues for human feedback; next approved items: #12 (PWA offline), #11 (QR sharing), #10 (Work Profiles integration)
- Next task: check issues for human feedback; implement next approved item among #12 (PWA offline), #11 (QR sharing), #10 (Work Profiles integration)

### 2026-06-07 — feat: Sprint Metrics integration — motivationSnapshot localStorage + deep link (issue #14)
- Done: in `TeamSession.tsx` `advancePhase('revealed')` — compute aggregate top 3 motivators by average rank across all completed participants, write `moving-motivators:motivationSnapshot` to localStorage (`{teamName: pin, date, topMotivators: MotivatorId[3], participantCount}`); added "Send to Sprint Metrics" button in `TeamResultsView` (host-only, visible only when snapshot present) — encodes snapshot as base64 JSON, opens Sprint Metrics with `?mm=<base64>`; added `team.sendToSprintMetrics` i18n key to all 4 locales
- Remaining approved issues: #34 (named session storage), #25 (dark theme — already done), #24 (header unify — done), #12 (PWA offline), #11 (QR sharing), #10 (Work Profiles integration), #17 (keyboard a11y — done), #9 (locales — done)
- Next task: check issues for human feedback; implement #34 (named session storage — "Save as…" button in ResultsView, label field on sessionHistory entries, cap at 20, restore to editable board)

### 2026-05-31 — feat: side-by-side individual comparison in team sessions (issue #19)
- Done: added `IndividualComparisonGrid` component to `TeamSession.tsx` — table with motivator rows (sorted by aggregate rank average), participant columns, rank cells color-coded green (top 3) / red (bottom 3) / neutral, ↑↓ outlier badges for ranks ≥2 from average, host-only anonymize toggle (P1/P2/etc); added toggle button ("Show/Hide Individual Rankings") below OverlapPanel in `TeamResultsView`; passed `isHost` prop (true when Firebase participants loaded and viewer is not a participant); added `team.comparison.show/hide/anonymize/deanonymize` i18n keys to all 4 locales
- Remaining approved issues: #14 (Sprint Metrics integration), #12 (PWA offline), #11 (QR code sharing), #10 (Work Profiles integration)
- Next task: check issues for human feedback; implement #14 (Sprint Metrics integration — write moving-motivators:motivationSnapshot localStorage key from team revealed results)

### 2026-05-30 — feat: facilitator timer for team sessions (issue #20)
- Done: created `FacilitatorTimer.tsx` — circular SVG progress ring (120px/stroke-8), 3/5/8 min presets + custom minute input, start/pause/reset controls, Web Audio API beep on completion, animates red when <20% remaining; created `ParticipantTimerBar.tsx` — thin 1.5px horizontal bar for participants (no countdown numbers) that reads timer start time from Firebase; updated `TeamSession.tsx`: host lobby is now phase-aware with "Start Ranking" → "Start Assessing" → "Reveal Results" progression, FacilitatorTimer shown during ranking and assessing phases; timer start/stop synced to Firebase under `sessions/{pin}/timer`; added `team.startRanking`, `team.startAssessing`, `team.timer.*` (start/pause/reset/timeUp) i18n keys to all 4 locales
- Remaining approved issues: #19 (side-by-side individual comparison), #14 (Sprint Metrics integration), #12 (PWA offline), #11 (QR code sharing), #10 (Work Profiles integration)
- Next task: implement #19 (side-by-side individual comparison in team session revealed view: toggle below aggregate showing motivator×participant grid, rank values, green top-3/red bottom-3 color coding, host-controlled anonymization showing P1/P2 instead of names)

### 2026-05-28 — feat: Change Planner integration — Moving Motivators side (issue #22)
- Done: added `buildMmSnapshot()` helper in `ResultsView.tsx` that encodes ranked motivator order, change directions, change text, and date as base64 JSON; "Assess in Change Planner" button opens `https://agile-toolkit.github.io/change-planner/?mm_snapshot=<base64>` in a new tab; added `readChangeParam()` helper in `App.tsx` — reads `?change=` URL param on load, pre-fills `change` state, and navigates directly to `solo-rank` screen (skipping home); clears URL param via `history.replaceState` after reading; added `results.exportToChangePlanner` key to all 4 locales
- Remaining work for full #22 integration: Change Planner side — read `?mm_snapshot=` on load, decode snapshot, display read-only "Motivator context" sidebar showing ranked order and impact directions
- Next task: implement Change Planner side of issue #22 in change-planner repo (read ?mm_snapshot=, show motivator context sidebar); also check issues for human feedback

### 2026-05-24 — feat: solo motivator shift tracking (issue #21)
- Done: added `SessionEntry` type to `types.ts`; updated `goToSoloResults()` in `App.tsx` to prepend current session to `moving-motivators:sessionHistory` array (max 5, FIFO) alongside existing `lastSession` write; added `SessionShiftPanel` component in `ResultsView.tsx` — collapsible panel that reads `sessionHistory`, shows previous + current ranked card rows with ↑↓ delta arrows (green/red for ≥3 position moves); added `results.history` and `results.shift` i18n keys to all 4 locales; documented `sessionHistory` key in BRIEF.md localStorage section
- Remaining approved issues: #22 (Change Planner integration), #20 (facilitator timer), #19 (team comparison), #12 (PWA), #11 (QR sharing), #14 (Sprint Metrics), #10 (Work Profiles)
- Next task: check issues for human feedback; implement #22 (Moving Motivators ↔ Change Planner integration: export motivators snapshot via URL param on results share, read URL param on load in Change Planner to pre-fill change description)

### 2026-05-21 — feat: keyboard accessibility for motivator ranking (issue #17)
- Done: imported `KeyboardSensor` from `@dnd-kit/core` and `sortableKeyboardCoordinates` from `@dnd-kit/sortable`; added `useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })` to `useSensors` in `RankingBoard.tsx`; added `useTranslation` + `aria-label` with motivator name and rank to `SortableCard`; added `focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl` to draggable div; added `rank.keyboardHint` i18n key to all 4 locale files; added keyboard hint `<p>` below the ranking board
- Remaining approved issues: #21 (shift tracking), #22 (Change Planner integration), #20 (facilitator timer), #19 (team comparison), #12 (PWA), #11 (QR sharing), #14 (Sprint Metrics), #10 (Work Profiles)
- Next task: check issues for human feedback; implement #21 (solo motivator shift tracking: extend moving-motivators:lastSession to sessionHistory array of 5, show rank-change arrows in ResultsView.tsx comparing current vs previous session)

### 2026-05-21 — feat: light/dark theme (issue #25)
- Done: added `darkMode: 'class'` to `tailwind.config.js`; added anti-flash inline script to `index.html`; copied `ThemeToggle.tsx` from design-system into `src/components/`; mounted `<ThemeToggle />` in `<AppHeader>` children; added `dark:` Tailwind variants across `App.tsx`, `AppHeader.tsx`, `HomeScreen.tsx`, `RankingBoard.tsx`, `ChangeAssessment.tsx`, `MotivatorCard.tsx`, `ResultsView.tsx`, `FacilitationGuide.tsx`, `MotivatorInfo.tsx`, `TeamSession.tsx` per token map in `design-system/tokens.css`
- Remaining approved issues: #17 (KeyboardSensor a11y), #21 (shift tracking), #22 (Change Planner integration), #20 (facilitator timer), #19 (team comparison), #12 (PWA), #11 (QR sharing), #14 (Sprint Metrics), #10 (Work Profiles)
- Next task: check issues for human feedback; implement #17 (KeyboardSensor a11y: add KeyboardSensor to RankingBoard useSensors, set activationConstraint: space/enter)

### 2026-05-21 — fix: remove submodules:recursive from CI workflow
- Done: removed `submodules: recursive` from `.github/workflows/deploy.yml`; stale `.agentic-kit` gitlink in index had no URL in .gitmodules, causing `git submodule update --init --recursive` to fail with exit code 128; build does not need any submodule content
- Next task: implement #25 (light/dark theme)

### 2026-05-21 — feat: unified AppHeader + LanguagePicker (issue #24)
- Done: copied `AppHeader.tsx` and `LanguagePicker.tsx` from `agile-toolkit.github.io/design-system/components/` into `src/components/`; replaced inline `<header>` block in `App.tsx` with `<AppHeader title={t('app.title')} onTitleClick={reset} />`; removed cycle-button logic and unused `i18n` import
- Remaining approved issues: #25 (dark theme — depends on #24, now ready), #17 (KeyboardSensor a11y), #21 (shift tracking), #22 (Change Planner integration), #20 (facilitator timer), #19 (team comparison), #12 (PWA), #11 (QR sharing), #14 (Sprint Metrics), #10 (Work Profiles)
- Next task: implement #25 (light/dark theme: add darkMode:class to tailwind.config.js, anti-flash script in index.html, copy ThemeToggle.tsx, add dark: variants across src/)

### 2026-05-20 — feat: solo results localStorage persistence (issue #16, moving-motivators side)
- Done: added `goToSoloResults()` in `App.tsx` — sorts motivators by rank, builds `ranked[]` + `changes{}` object, writes `moving-motivators:lastSession` to localStorage, then calls `setScreen('solo-results')`; wired to `onSkip` (RankingBoard) and `onNext` (ChangeAssessment); documented key in BRIEF.md `## localStorage keys` section
- Remaining for #16: add `readMovingMotivators()` to `agile-toolkit.github.io/src/readers.ts` and replace `null` in `readAll()` — to be done in a Dashboard-targeted run
- Next task: in `agile-toolkit.github.io` run — add `readMovingMotivators()` reading `moving-motivators:lastSession`, chip with top 3 motivators + change text + date; also check remaining approved issues (#17 keyboard a11y, #21 shift tracking, #22 Change Planner integration)

### 2026-05-16 — research: favicon follow-up, shift tracking, Change Planner integration
- Done: confirmed issue #9 (ES+BE locale) already in "In Review" project status — no action needed; added additional research comment to issue #5 (research-more): confirmed scrum-facilitator favicon also corrupted with same binary, validated visual differentiation from Kanban Designer's columns (staircase vs random heights), compared emoji vs geometric approaches, confirmed geometric ranked-cards SVG recommendation; created issue #21 (solo motivator shift tracking — extend #16's sessionHistory array to 5 entries, show delta view in ResultsView.tsx with rank-change arrows); created issue #22 (Moving Motivators ↔ Change Planner integration — motivator snapshot export via URL param, pre-fill change description from URL on load)
- Waiting for human review on #5, #10–#14, #16–#22
- Next task: check issues for human feedback; implement first approved item — priority candidates: #16 (localStorage persistence, most requested, unlocks #21), #5 (favicon fix, single-file change), #17 (keyboard a11y, WCAG fix)

### 2026-05-14 — research: team history, comparison view, facilitator timer
- Done: confirmed issue #9 (ES+BE locale) already implemented — set project status to "In Review"; updated issue #5 (favicon) with additional research comment — 3 SVG design options (A: descending bars, B: ranked list lines, C: card stack), browser compatibility notes, and contrast analysis; created issue #18 (team session history via localStorage moving-motivators:sessionHistory), issue #19 (side-by-side individual comparison in revealed phase), issue #20 (facilitator timer for ranking/assessing phases using Web Audio API, pattern from scrum-facilitator)
- Waiting for human review on #5, #10–#14, #16–#20
- Next task: check issues for human feedback; implement first approved item — #16 (localStorage solo session persistence + Dashboard card reader) or #5 (favicon fix, single-file change)

### 2026-05-09 — research: localStorage persistence, accessibility, favicon
- Done: set issue #9 to "In Review" (already implemented in prior run); updated issue #5 (favicon research-more) with detailed findings — teal #0d9488, geometric 3-bar descending design, corrupted SVG confirmed; created issue #16 (localStorage solo session persistence + Dashboard card reader — app is only suite app with null Dashboard data); created issue #17 (KeyboardSensor for drag-and-drop ranking — RankingBoard uses PointerSensor + TouchSensor only, KeyboardSensor absent, WCAG 2.1.1 failure)
- Waiting for human review on #5, #10–#14, #16, #17
- Next task: check issues for human feedback; implement first approved item — likely #16 (localStorage + Dashboard) or #5 (favicon fix)

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
