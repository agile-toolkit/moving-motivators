// Cross-app team identity contract (agile-toolkit:activeTeam).
// Defined by the Dashboard (agile-toolkit/agile-toolkit.github.io) — see
// its README.md `## localStorage keys` and design-system/team.ts. Written
// by whichever app last set a team name; read here to suggest a name in
// the team session lobby instead of asking again, and written back when
// the host accepts or edits it, so the suite-wide value stays current.

export interface ActiveTeam {
  name: string
  source: string
  updatedAt: number
}

const KEY = 'agile-toolkit:activeTeam'

export function readActiveTeam(): ActiveTeam | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ActiveTeam>
    return parsed?.name ? (parsed as ActiveTeam) : null
  } catch {
    return null
  }
}

// No-ops when the name/source already match, so this doesn't spam
// `storage` events or rewrite `updatedAt` on every call.
export function writeActiveTeam(name: string, source: string): void {
  const trimmed = name.trim()
  if (!trimmed) return
  try {
    const current = readActiveTeam()
    if (current?.name === trimmed && current.source === source) return
    localStorage.setItem(KEY, JSON.stringify({ name: trimmed, source, updatedAt: Date.now() }))
  } catch {
    /* storage unavailable or quota exceeded */
  }
}
