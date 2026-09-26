import { isAliasIndex } from './live/aliases'
import { MOTIVATORS } from './data/motivators'
import type { ImpactLevel, MotivatorItem } from './types'

/**
 * What Moving Motivators puts on the wire in a live team session.
 *
 * Only numbers leave the device: the host's phase and timer, and each
 * participant's alias index plus — once they finish — their ranking as
 * motivator *indices* and their change impact as -1/0/+1. The change
 * description a participant types stays on their device, and nobody types a
 * name. Every incoming state is validated against these exact shapes before
 * the UI sees it.
 */

export const APP_ID = 'moving-motivators'

export const PHASES = ['lobby', 'ranking', 'assessing', 'revealed'] as const
export type SessionPhase = (typeof PHASES)[number]

export interface HostState {
  k: 'h'
  /** Index into PHASES. */
  ph: number
  /** Running timer: [startedAt (epoch ms, host clock), durationSecs]. */
  tm?: [number, number]
}

export interface ParticipantState {
  k: 'p'
  /** Alias index (see live/aliases.ts). */
  a: number
  /** 1 once the participant has submitted. */
  d: 0 | 1
  /** Ranking: MOTIVATORS indices, most important first. Only when d = 1. */
  r?: number[]
  /** Impact per motivator, in MOTIVATORS order: -1, 0, +1. Only when d = 1. */
  i?: number[]
}

export type PeerState = HostState | ParticipantState

const N = MOTIVATORS.length
const MAX_TIMER_SECS = 4 * 60 * 60
const hasOnly = (o: object, keys: string[]) => Object.keys(o).every(k => keys.includes(k))

function isPermutation(v: unknown): v is number[] {
  if (!Array.isArray(v) || v.length !== N) return false
  const seen = new Set<number>()
  for (const x of v) {
    if (!Number.isInteger(x) || x < 0 || x >= N || seen.has(x)) return false
    seen.add(x)
  }
  return true
}

function isImpacts(v: unknown): v is number[] {
  return Array.isArray(v) && v.length === N && v.every(x => x === -1 || x === 0 || x === 1)
}

export function isPeerState(v: unknown): v is PeerState {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const s = v as Record<string, unknown>
  if (s.k === 'h') {
    if (!hasOnly(s, ['k', 'ph', 'tm'])) return false
    if (!Number.isInteger(s.ph) || (s.ph as number) < 0 || (s.ph as number) >= PHASES.length) return false
    if (s.tm === undefined) return true
    const tm = s.tm
    return Array.isArray(tm) && tm.length === 2 &&
      typeof tm[0] === 'number' && Number.isFinite(tm[0]) && tm[0] > 0 &&
      Number.isInteger(tm[1]) && tm[1] > 0 && tm[1] <= MAX_TIMER_SECS
  }
  if (s.k === 'p') {
    if (!hasOnly(s, ['k', 'a', 'd', 'r', 'i'])) return false
    if (!isAliasIndex(s.a)) return false
    if (s.d === 0) return s.r === undefined && s.i === undefined
    return s.d === 1 && isPermutation(s.r) && isImpacts(s.i)
  }
  return false
}

const IMPACT_TO_NUM: Record<ImpactLevel, number> = { negative: -1, neutral: 0, positive: 1 }
const NUM_TO_IMPACT: Record<number, ImpactLevel> = { [-1]: 'negative', 0: 'neutral', 1: 'positive' }

/** MotivatorItem[] → the numeric `r`/`i` pair. */
export function encodeMotivators(items: MotivatorItem[]): { r: number[]; i: number[] } {
  const r = [...items]
    .sort((a, b) => a.rank - b.rank)
    .map(m => MOTIVATORS.findIndex(meta => meta.id === m.id))
  const i = MOTIVATORS.map(meta => IMPACT_TO_NUM[items.find(m => m.id === meta.id)?.impact ?? 'neutral'])
  return { r, i }
}

/** Inverse of `encodeMotivators`, for a validated participant state. */
export function decodeMotivators(r: number[], i: number[]): MotivatorItem[] {
  return r.map((idx, pos) => ({
    id: MOTIVATORS[idx].id,
    rank: pos + 1,
    impact: NUM_TO_IMPACT[i[idx]] ?? 'neutral',
  }))
}

export function phaseOf(host: HostState | null): SessionPhase {
  return PHASES[host?.ph ?? 0] ?? 'lobby'
}

/**
 * The host of a room. Anyone holding the code could publish a host state, so
 * when there is more than one the lowest peer id wins — every client applies
 * the same rule and so agrees on the same host.
 */
export function findHost(peers: ReadonlyMap<string, PeerState>): [string, HostState] | null {
  let found: [string, HostState] | null = null
  for (const [id, s] of peers) {
    if (s.k === 'h' && (!found || id < found[0])) found = [id, s]
  }
  return found
}

export function participantsOf(peers: ReadonlyMap<string, PeerState>): [string, ParticipantState][] {
  return [...peers].filter((e): e is [string, ParticipantState] => e[1].k === 'p')
}
