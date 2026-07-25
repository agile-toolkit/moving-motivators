# Moving Motivators — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Team Identity name handoff** — serves #2. Read `team-identity:draft` on host mount and offer a one-click "use this team's name" suggestion in the team session lobby, replacing the raw PIN as the display name in stored history. [#51](https://github.com/agile-toolkit/moving-motivators/issues/51)
2. **E2: Personalized results coaching** — serves #1. Add a collapsible tips panel in `ResultsView` that surfaces 2-3 short, personalized coaching notes based on the user's top 3 motivators and their change-assessment outcome, so solo results give interpretation, not just a raw ranking. [#52](https://github.com/agile-toolkit/moving-motivators/issues/52)

Both issues are `needs-review` and past the 7-day staleness threshold (open since 2026-06-26 and 2026-06-29 respectively, as of 2026-07-25) — eligible for auto-approval on the next research/build cycle per the pipeline's stale-issue convention.

## Polish backlog
- Favicon fix — `public/favicon.svg` is corrupted; a finalized teal `#0d9488` descending-bars SVG design is ready, awaiting the `approved` label. [#5](https://github.com/agile-toolkit/moving-motivators/issues/5)
- Two open issues have no remaining work in *this* repo: [#16](https://github.com/agile-toolkit/moving-motivators/issues/16) (Dashboard card reader lives in `agile-toolkit.github.io`) and [#53](https://github.com/agile-toolkit/moving-motivators/issues/53) (Improvement Board deep link needs zero Moving Motivators changes — `?change=` param already exists from #22). [#22](https://github.com/agile-toolkit/moving-motivators/issues/22)'s Change Planner-side sidebar is likewise pending in the `change-planner` repo, not here.

## Shipped
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
