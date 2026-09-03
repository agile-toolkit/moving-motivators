import type { MotivatorItem, SessionEntry } from './types'

/**
 * Builds the session snapshot written to `moving-motivators:lastSession`
 * and `moving-motivators:sessionHistory`. `topMotivators` (first 3 of
 * `ranked`) exists because Sprint Metrics' `loadMotivatorSnapshot()`
 * fallback reads `topMotivators` from this exact key and previously found
 * nothing — the field never existed, so that receiver path was dead.
 */
export function buildSessionEntry(motivators: MotivatorItem[], change: string): SessionEntry {
  const ranked = [...motivators].sort((a, b) => a.rank - b.rank).map(m => m.id)
  const changes: Record<string, string> = {}
  motivators.forEach(m => { changes[m.id] = m.impact })
  return {
    date: new Date().toISOString().slice(0, 10),
    savedAt: Date.now(),
    ranked,
    topMotivators: ranked.slice(0, 3),
    change,
    changes,
  }
}
