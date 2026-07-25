# Moving Motivators — Goal

## Problem
Teams and individuals practicing agile / Management 3.0 need a fast, low-friction way to surface intrinsic motivators (the CHAMPFROGS model: Curiosity, Honor, Acceptance, Mastery, Power, Freedom, Relatedness, Order, Goal, Status) and assess how a proposed change affects each one — either as a private solo self-reflection or as a live, facilitated team workshop — without physical card decks, accounts, or specialized software.

## Audience
Individual contributors doing solo self-reflection before or after a change; Scrum Masters and facilitators running a live team workshop (in-person or remote, joined by PIN); teams inside the wider agile-toolkit suite who want motivator context to feed into change-management, retro, and profile tools they already use.

## Success criteria
1. A user can rank all ten CHAMPFROGS motivators solo, assess a proposed change's impact on each, and see interpreted results in a few minutes with no account or setup.
2. A facilitator can host a live team session via PIN, participants join and rank independently, and the facilitator reveals aggregate + individual results synced in real time (Firebase).
3. Solo and team session history persists across visits so users and facilitators can see motivator shifts and trends over multiple sessions.
4. Results can be exported or shared (image, JSON, print) and handed off in-context to other suite apps (Change Planner, Sprint Metrics, Work Profiles) via URL param or localStorage snapshot.
5. The app works fully offline for solo mode (PWA) and is fully operable by keyboard (WCAG-compliant ranking interaction).

## Non-goals
- Not a general-purpose survey/poll builder — the motivator set is fixed to CHAMPFROGS, not user-definable.
- No persistent multi-user accounts or server-side profiles — team sessions are ephemeral and PIN-scoped only.
- Not a full change-management platform — the Change Planner integration is a context handoff (URL param snapshot), not a merged product.
- No native mobile app — responsive web only.
