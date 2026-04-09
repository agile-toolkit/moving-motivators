# Moving Motivators

> An interactive [Management 3.0](https://management30.com/practice/moving-motivators/) tool for exploring what motivates you and your team — built with React, TypeScript, and Vite.

[![Deploy](https://github.com/bthos/moving-motivators/actions/workflows/deploy.yml/badge.svg)](https://github.com/bthos/moving-motivators/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Live app:** https://bthos.github.io/moving-motivators/

---

## What is Moving Motivators?

Moving Motivators is a Management 3.0 practice based on the **CHAMPFROGS** model — ten intrinsic motivators:

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
- 👥 **Team mode** — host or join a session with a PIN; see everyone's results together (requires Firebase)
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

### Environment variables (optional — for team mode)

Copy `.env.example` to `.env.local` and fill in your Firebase project values:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Solo mode works without any Firebase config.

---

## Deployment

The app auto-deploys to GitHub Pages on every push to `main` via GitHub Actions.

To deploy from a fork:
1. Add the five `VITE_FIREBASE_*` secrets in **Settings → Secrets → Actions** (optional)
2. Enable **GitHub Pages** with source = **GitHub Actions** in **Settings → Pages**
3. Push to `main`

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| i18n | react-i18next |
| Realtime | Firebase Realtime Database |
| CI/CD | GitHub Actions → GitHub Pages |
| Dev pipeline | [agentic-kit](https://github.com/bthos/agentic-kit) (submodule) |

---

## Part of the Agile Tools Suite

Moving Motivators is **App 1** of the [bthos Agile Tools](https://github.com/bthos) open-source suite — free,
team-focused implementations of Agile and Management 3.0 practices.

---

## License

MIT © [bthos](https://github.com/bthos)
