# Moving Motivators

> An interactive Moving Motivators tool for exploring what motivates you and your team — built with React, TypeScript, and Vite.

[![Deploy](https://github.com/bthos/moving-motivators/actions/workflows/deploy.yml/badge.svg)](https://github.com/bthos/moving-motivators/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Live app:** https://bthos.github.io/moving-motivators/

> See [`GOAL.md`](GOAL.md) for why this app exists and [`ROADMAP.md`](ROADMAP.md) for what's next.

---

## What is Moving Motivators?

Moving Motivators is built on the **CHAMPFROGS** model, developed by Jurgen Appelo — ten intrinsic motivators:

| # | Motivator | Description |
|---|-----------|-------------|
| C | **Curiosity** | Learning & exploration |
| H | **Honor** | Reflecting personal values |
| A | **Acceptance** | Approval from those around you |
| M | **Mastery** | Improving skills that matter |
| P | **Power** | Influence over what happens |
| F | **Freedom** | Independence in work & responsibility |
| R | **Relatedness** | Social connections |
| O | **Order** | Stability and clear rules |
| G | **Goal** | Higher purpose |
| S | **Status** | Recognition and position |

The exercise has two phases:
1. **Rank** — drag cards left-to-right from least to most important
2. **Assess** — mark each motivator as positively ↑, negatively ↓, or neutrally affected by a proposed change

---

## Features

- 🎯 **Solo mode** — rank your motivators and assess the impact of a change
- 👥 **Team mode** — host or join a session with a 10-character code; see everyone's results together. No account or backend: messages are end-to-end encrypted and carried by free public relays
- 🌐 **Multilingual** — English and Russian out of the box (easily extensible)
- 📱 **Mobile-friendly** — touch drag-and-drop, responsive layout
- 🔌 **Works offline** — solo mode requires no backend

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run locally

```bash
git clone https://github.com/bthos/moving-motivators.git
cd moving-motivators
git submodule update --init   # pulls agentic-kit
npm install
npm run dev
```

Open http://localhost:5173/moving-motivators/

### Dev commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) then production build (`vite build`) |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite (`vitest run`) |

---

## Deployment

The app auto-deploys to GitHub Pages on every push to `main` via GitHub Actions.

To deploy from a fork:
1. Enable **GitHub Pages** with source = **GitHub Actions** in **Settings → Pages**
2. Push to `main`

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| i18n | react-i18next |
| Realtime | MQTT.js + nostr-tools over public relays (`src/live/`) |
| CI/CD | GitHub Actions → GitHub Pages |

---

## localStorage keys

All keys are namespaced `moving-motivators:*` except two shared-pattern keys (`theme`, `mm_about_dismissed`) and one cross-app key this app writes on behalf of Work Profiles.

| Key | Shape | Purpose |
|-----|-------|---------|
| `moving-motivators:lastSession` | `{ date, savedAt, ranked: MotivatorId[], topMotivators: MotivatorId[], change: string, changes: Record<MotivatorId, ImpactLevel> }` | Most recent solo session; written on the ranking/assessment → results transition. Read by the suite Dashboard card reader, Change Planner (Stakeholder Motivator Profiles prefill), and Sprint Metrics (`loadMotivatorSnapshot` fallback — needs `topMotivators` specifically, see `src/sessionEntry.ts`). |
| `moving-motivators:sessionHistory` | `Array<{ label?: string, date, savedAt, ranked: MotivatorId[], change: string, changes }>` (newest first, capped at 20) | Solo session history behind the shift/trend views, export, import, and "Save as…" naming in `ResultsView.tsx`. |
| `moving-motivators:motivationSnapshot` | `{ teamName: string, date, topMotivators: MotivatorId[3], participantCount }` | Aggregate top-3 snapshot written by the host when a team session is revealed; read by the "Send to Sprint Metrics" deep link. `teamName` is the host's entered team name (E1 #51), falling back to the raw session PIN if none was set. |
| `moving-motivators:teamSessionHistory` | `Array<{ sessionId, teamName, date, topMotivators: MotivatorId[3], participantCount }>` (newest first, capped at 10) | Revealed team sessions behind `SessionHistoryPanel`'s list/trend view, export, and import. Same `teamName` fallback as above. |
| `work-profiles:motivatorSnapshot` | `{ date, ranked: MotivatorId[], topMotivators: MotivatorId[3] }` | Written by this app's "Export to Work Profiles" button — owned/read by the Work Profiles app, not Moving Motivators itself. |
| `agile-toolkit:activeTeam` | `{ name: string, source: string, updatedAt: number }` | Cross-app team identity contract, defined by the Dashboard (`agile-toolkit.github.io`). Read on host mount to suggest a team name in the lobby instead of asking again; written back (`source: "moving-motivators"`) when the host accepts the suggestion or types their own name, so the suite-wide value stays current. See `src/activeTeam.ts`. |
| `theme` | `'light' \| 'dark'` | Shared `ThemeToggle` component's stored preference (same key pattern used by other suite apps, scoped per-origin). |
| `mm_about_dismissed` | `'1'` once dismissed | Marks the HomeScreen "About this exercise" panel as dismissed so it doesn't default open on return visits. |
| `moving-motivators:facilitatorMode` (`sessionStorage`) | `'1' \| '0'` | Facilitator (projector) mode toggle — per-tab, not persisted across sessions. See `src/components/useFacilitatorMode.ts`. |

## Tech notes

- **State**: no global store — screen/session state lives in `App.tsx` component state and is passed down as props; persistence is plain `localStorage.setItem`/`getItem` calls at the transition points listed above, not a data layer.
- **i18n**: `react-i18next` with four complete locales (`src/i18n/{en,es,be,ru}.json`); the header language picker cycles all four. New UI strings must be added to all four files in the same run.
- **Theme**: Tailwind `darkMode: 'class'`; an anti-flash inline script in `index.html` applies the stored `theme` class before first paint; `dark:` variants are hand-added per component (`design-system/tokens.css` token map).
- **Team sessions:** no backend and no account. `src/live/` (kept identical in Planning Poker) connects every client to two public MQTT brokers (`broker.hivemq.com:8884`, `broker.emqx.io:8084`) *and* two public Nostr relays (`relay.damus.io`, `nos.lol`, plain `wss://` on 443) at once, publishing to all of them and de-duplicating on receipt — so a network that blocks the MQTT ports still works over Nostr. The host generates a 10-character session code; PBKDF2 turns it into an AES-GCM key and an unrelated public room id, so relays only see a random topic and ciphertext. The code travels in the join link's fragment (`#join=…`), which browsers never send to a server.
  - **Only numbers go over the wire** (`src/liveSession.ts`, validated field-by-field on receipt): the host's phase and timer, and each participant's alias index plus, once they finish, their ranking as motivator indices and their change impact as -1/0/+1. The change description stays on the participant's device and nobody types a name — each participant is a random animal alias (`live/aliases.ts`).
  - `HomeScreen` disables the team buttons only while the browser is offline.
- **PWA**: `vite-plugin-pwa` (`generateSW` strategy) caches the app shell, static assets, and Google Fonts; a `useOnlineStatus()` hook in `App.tsx` drives an offline banner and disables team-session actions while offline.
- **Cross-app integrations**: writes `work-profiles:motivatorSnapshot` for Work Profiles and `moving-motivators:motivationSnapshot` for Sprint Metrics; opens Change Planner with a base64-encoded snapshot in `?mm_snapshot=` and reads `?change=`/`?join=` URL params on load from Change Planner and QR-code team invites respectively. All are one-way, URL/localStorage-only handoffs — no shared backend.
- **Team identity**: `src/activeTeam.ts` reads/writes the suite-wide `agile-toolkit:activeTeam` contract (defined by the Dashboard). The host lobby offers a one-click "use this name" suggestion instead of asking again, and the accepted/typed name replaces the raw session PIN in `motivationSnapshot`/`teamSessionHistory` — a PIN is still the fallback when no name was entered.
- **Submodule note**: `.gitmodules` references `agentic-kit` (dev-pipeline tooling only); it is not fetched or required by the CI build (`.github/workflows/deploy.yml` does not use `submodules: recursive`).
- **Coaching tips**: `CoachingTipsPanel` in `ResultsView.tsx` (collapsed by default) shows one tip per top-3 motivator, built by wrapping that motivator's existing `motivators.<id>.reflection` i18n string in one of three impact-aware templates (`results.coachingTips.positiveTip`/`negativeTip`/`neutralTip`) — no new per-motivator content, since the reflection questions already exist for `MotivatorInfo.tsx`. Distinct from `InterpretationPanel`, which gives aggregate pattern-level insight rather than per-motivator tips.

---

## Part of the Agile Tools Suite

Moving Motivators is **App 1** of the [bthos Agile Tools](https://github.com/bthos) open-source suite — free,
team-focused implementations of Agile facilitation practices.

---

## License

MIT © [bthos](https://github.com/bthos)
