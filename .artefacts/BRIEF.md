# BRIEF

Derived per [`agent-state.NO-BRIEF.md`](https://github.com/agile-toolkit/.github/blob/main/agent-state.NO-BRIEF.md). There was **no prior** `BRIEF.md`. Sources: `README.md`, `src/i18n/en.json` / `ru.json`, `src/`. Generated **2026-04-19**.

## Product scope (from `README.md`)

- **Solo mode** — rank CHAMPFROGS motivators, assess change impact (↑ / ↓ / neutral).
- **Team mode** — host/join with PIN, aggregate view (**Firebase**).
- **EN + RU**, responsive / touch DnD, solo works offline.

## Build

- `npm run build` — **passes** (verified **2026-04-19**; large-bundle warning only).

## TODO in `src/`

- None.

## i18n — keys not wired (confirmed)

- **`results.share`** — exists in `en.json` / `ru.json`; **no** `t('results.share')` in `src/components/ResultsView.tsx` (share / copy-image control missing for solo results).
- **`results.insight`** — not referenced in `src/` (README “insight” copy may be intended under results card).
- **`facilitation.*`** subtree — no component imports `t('facilitation…')` (facilitation guide from README not exposed).
- **`team.phase.lobby`**, **`team.phase.ranking`**, **`team.phase.assessing`** — `TeamSession.tsx` only uses **`team.phase.revealed`** (duplicated twice); other phases not shown.
- **`team.waitingFor`**, **`team.facilitationGuide`** — not referenced.
- **`home.team`** — not used (cards use **`home.host`**, **`home.join`**, **`home.teamUnavailable`**).
- **`lang.en`**, **`lang.ru`** — language switch in `App.tsx` uses raw **`EN` / `RU`** strings instead of these keys.

## i18n — dynamic keys (used)

- **`results.interpretation.${patternKey}`** in `ResultsView.tsx` — covers `positivePattern`, `negativePattern`, `mixedPattern`, `noChangeNote`; do **not** treat those four keys as orphaned.

## Hardcoded user-visible strings

- **`App.tsx`** language toggle (`EN` / `RU`) — see above.

## Classification (NO-BRIEF)

- **Status:** `in-progress`
- **First next task:** In **`moving-motivators`**, add dependency **`html2canvas`** to `package.json`, then in **`src/components/ResultsView.tsx`** next to the existing **Start Over** button (~line 202), add a control labeled **`t('results.share')`** that captures the results column and offers download or clipboard (keys already in **`src/i18n/en.json`** / **`ru.json`**).
