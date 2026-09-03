# Moving Motivators — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E2: Personalized results coaching** — serves signal #1 (inbound links/advocacy via richer content). Add a collapsible tips panel in `ResultsView` that surfaces 2-3 short, personalized coaching notes based on the user's top 3 motivators and their change-assessment outcome, so solo results give interpretation, not just a raw ranking. [#52](https://github.com/agile-toolkit/moving-motivators/issues/52) — `needs-review`, past the 7-day staleness threshold, eligible for auto-approval on the next cycle.

## Recently shipped
**Facilitator Mode persists across suite apps** (2026-09-03) — see `## Shipped`. `useFacilitatorMode`'s storage key changed to the shared `agile-toolkit:facilitatorMode` so the mode survives switching to another suite app in the same tab, per direct user request.

**Fix MotivatorInfo close button using the × variant** (2026-09-03) — see `## Shipped`. Follow-up to the emoji→SVG sweep — this button used `×` (multiplication sign) rather than `✕`, missed by the original grep. `TeamSession.tsx`'s `×{count}` badge is genuine multiplication, left as text.

**Replace decorative ✕ emoji with SVG icons** (2026-09-03) — see `## Shipped`. Part of a suite-wide emoji→SVG sweep the user asked for.

**Hide informational elements in Facilitator Mode** (2026-09-03) — see `## Shipped`. A follow-up user request found the Facilitation guide link and About panel on Home were untouched by Facilitator Mode — `HomeScreen` never even received the flag. Fixed.

**Facilitator Mode** (2026-09-03) — see `## Shipped`. A user asked for the presentation/projector mode already built for Team Identity to be adopted suite-wide; this is repo 2 of an 11-repo rollout, adopting the pattern now shared in `design-system/`.

**Fix Sprint Metrics never receiving motivator data** (2026-09-03) — see `## Shipped`. A suite-wide cross-app link audit found `moving-motivators:lastSession` never had a `topMotivators` field — Sprint Metrics' fallback read specifically checked for it and always came up empty. Added the field.

**Fix LanguagePicker dark mode** (2026-09-02) — see `## Shipped`. The design-system's canonical `LanguagePicker.tsx` had never been given dark-mode classes; this app's copy inherited that gap. Synced with the now-fixed design-system source.

**Fix low-contrast unranked/unselected controls** (2026-09-02) — see `## Shipped`. A suite-wide UX audit flagged `text-gray-300`/`gray-700` unselected-state text (impact-vote buttons, unranked drag handles) as failing WCAG AA contrast; bumped to `gray-400`/`gray-600` in both themes.

**E1: Team Identity name handoff** (2026-09-01) — see `## Shipped`. Adopted `agile-toolkit:activeTeam` (the Dashboard's new cross-app team-identity contract, GOAL's "shared team object" thesis) instead of reading `team-identity:draft` directly, per the auto-approval comment on [#51](https://github.com/agile-toolkit/moving-motivators/issues/51) — same outcome, but the mechanism now round-trips through the suite contract instead of a point-to-point read.

## Polish backlog
- Favicon fix — `public/favicon.svg` is corrupted; a finalized teal `#0d9488` descending-bars SVG design is ready, awaiting the `approved` label. [#5](https://github.com/agile-toolkit/moving-motivators/issues/5)
- Two open issues have no remaining work in *this* repo: [#16](https://github.com/agile-toolkit/moving-motivators/issues/16) (Dashboard card reader lives in `agile-toolkit.github.io`) and [#53](https://github.com/agile-toolkit/moving-motivators/issues/53) (Improvement Board deep link needs zero Moving Motivators changes — `?change=` param already exists from #22). [#22](https://github.com/agile-toolkit/moving-motivators/issues/22)'s Change Planner-side sidebar is likewise pending in the `change-planner` repo, not here.

## Shipped
- ~~Unify Facilitator Mode's storage key to the shared `agile-toolkit:facilitatorMode` so it persists across suite apps~~
- ~~Fix MotivatorInfo's close button using the × variant instead of ✕~~
- ~~Replace decorative ✕ back/close text glyphs with a shared SVG icon~~
- ~~Hide Home's Facilitation guide link and About panel in Facilitator Mode~~
- ~~Facilitator Mode — bigger UI + hidden language picker for in-room presentation, adopted from the shared design-system pattern~~
- ~~Add `topMotivators` to `moving-motivators:lastSession` so Sprint Metrics' fallback read actually fires~~
- ~~Solo mode: rank CHAMPFROGS motivators, assess a change's impact, interpreted results~~
- ~~Team mode: host/join via PIN, Firebase realtime sync, phase-aware facilitator timer~~
- ~~4-language i18n (EN/ES/BE/RU) with header language picker~~
- ~~Light/dark theme and unified AppHeader/LanguagePicker design-system components~~
- ~~Keyboard-accessible drag-and-drop ranking (WCAG 2.1.1)~~
- ~~Solo + team session history — shift/trend views, save/restore, JSON export & import~~
- ~~Share results as image, print/PDF export, QR code team join~~
- ~~PWA / offline support for workshop use~~
- ~~Suite integrations: Work Profiles, Sprint Metrics, Change Planner (Moving Motivators side)~~
- ~~First-run onboarding content in the "About this exercise" panel~~

**v0.2.0 — [E1: Team Identity name handoff](https://github.com/agile-toolkit/moving-motivators/issues/51)** (2026-09-01):
- ~~`src/activeTeam.ts` reads/writes the suite-wide `agile-toolkit:activeTeam`
  contract~~
- ~~Host lobby offers a one-click "use this team's name" suggestion, plus a
  plain text field for typing one directly~~
- ~~The accepted/typed name replaces the raw session PIN in
  `motivationSnapshot` / `teamSessionHistory`, falling back to the PIN only
  when no name was entered~~

**v0.2.3 — Fix low-contrast unranked/unselected controls** (2026-09-02):
- ~~Bumped unselected-state text (impact votes, unranked drag handles) from
  `gray-300`/`gray-700` to `gray-400`/`gray-600` in both themes~~

**v0.2.4 — Fix LanguagePicker dark mode** (2026-09-02):
- ~~Synced `LanguagePicker.tsx` with the design-system's now-fixed
  canonical copy — full `dark:` coverage~~
