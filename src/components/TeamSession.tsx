import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { generateRoomCode, normalizeRoomCode, formatRoomCode } from '../live/crypto'
import { useLiveRoom } from '../live/useLiveRoom'
import { pickAlias, aliasLabel, aliasLabels } from '../live/aliases'
import {
  APP_ID, PHASES, isPeerState, findHost, participantsOf, phaseOf, encodeMotivators, decodeMotivators,
  type PeerState, type SessionPhase,
} from '../liveSession'
import { readActiveTeam, writeActiveTeam } from '../activeTeam'
import { CloseIcon, ClockIcon, UploadIcon, DownloadIcon, ChartIcon, TeamIcon, CheckCircleIcon, HourglassIcon } from './icons'
import type { Screen, MotivatorItem, MotivatorId, TeamSessionHistoryEntry } from '../types'
import { getMotivatorMeta } from '../data/motivators'
import RankingBoard from './RankingBoard'
import ChangeAssessment from './ChangeAssessment'
import FacilitatorTimer from './FacilitatorTimer'
import ParticipantTimerBar from './ParticipantTimerBar'

interface Props {
  screen: Screen
  setScreen: (s: Screen) => void
  motivators: MotivatorItem[]
  onMotivators: (items: MotivatorItem[]) => void
  change: string
  onChange: (s: string) => void
  onBack: () => void
  onInfo?: (id: MotivatorId) => void
  initialJoinCode?: string
}

/** A participant as the results views show them. `change` is only ever the viewer's own. */
interface TeamParticipant {
  name: string
  completed: boolean
  motivators?: MotivatorItem[]
  change?: string
}

// ── Individual Comparison Grid ─────────────────────────────────────────────
const MOTIVATOR_ORDER: MotivatorId[] = [
  'curiosity', 'honor', 'acceptance', 'mastery', 'power',
  'freedom', 'relatedness', 'order', 'goal', 'status',
]

function IndividualComparisonGrid({
  entries,
  isHost,
}: {
  entries: [string, TeamParticipant][]
  isHost: boolean
}) {
  const { t } = useTranslation()
  const [anonymize, setAnonymize] = useState(false)

  // Compute average rank per motivator across all participants
  const avgRank: Record<string, number> = {}
  for (const id of MOTIVATOR_ORDER) {
    const ranks = entries.map(([, p]) => p.motivators?.find(m => m.id === id)?.rank ?? 5)
    avgRank[id] = ranks.reduce((s, r) => s + r, 0) / ranks.length
  }

  const sortedMotivators = [...MOTIVATOR_ORDER].sort((a, b) => avgRank[a] - avgRank[b])

  return (
    <div className="flex flex-col gap-3">
      {isHost && (
        <div className="flex justify-end">
          <button
            onClick={() => setAnonymize(a => !a)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              anonymize
                ? 'bg-brand-500 text-white border-brand-500'
                : 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-500'
            }`}
          >
            {anonymize ? t('team.comparison.deanonymize') : t('team.comparison.anonymize')}
          </button>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap sticky left-0 bg-gray-50 dark:bg-gray-800">
                Motivator
              </th>
              {entries.map(([id, p], i) => (
                <th key={id} className="text-center px-2 py-2 font-medium text-gray-700 dark:text-gray-300 max-w-[80px]">
                  <span className="block truncate max-w-[72px]">
                    {anonymize ? `P${i + 1}` : p.name}
                  </span>
                </th>
              ))}
              <th className="text-center px-2 py-2 font-medium text-gray-400 dark:text-gray-500">Avg</th>
            </tr>
          </thead>
          <tbody>
            {sortedMotivators.map((id, rowIdx) => {
              const meta = getMotivatorMeta(id)
              const avg = avgRank[id]
              return (
                <tr
                  key={id}
                  className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}
                >
                  <td className={`px-3 py-2 whitespace-nowrap sticky left-0 ${rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/70'}`}>
                    <span className="mr-1">{meta.emoji}</span>
                    <span className={`font-medium ${meta.textColor}`}>{t(`motivators.${id}.name`)}</span>
                  </td>
                  {entries.map(([pId, p]) => {
                    const item = p.motivators?.find(m => m.id === id)
                    const rank = item?.rank
                    const isTop3 = rank !== undefined && rank <= 3
                    const isBottom3 = rank !== undefined && rank >= 8
                    const delta = rank !== undefined ? avg - rank : 0
                    const badge = delta >= 2 ? '↑' : delta <= -2 ? '↓' : ''
                    const cellCls = isTop3
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : isBottom3
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'text-gray-600 dark:text-gray-400'
                    return (
                      <td key={pId} className="text-center px-2 py-1.5">
                        <span className={`inline-flex items-center justify-center w-9 h-7 rounded-lg font-mono font-semibold ${cellCls}`}>
                          {rank ?? '—'}
                          {badge && <span className="text-[10px] ml-0.5 opacity-80">{badge}</span>}
                        </span>
                      </td>
                    )
                  })}
                  <td className="text-center px-2 py-1.5 font-mono text-gray-400 dark:text-gray-500">
                    {avg.toFixed(1)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-gray-600 leading-relaxed">
        Green = top 3 · Red = bottom 3 · ↑↓ = ≥2 ranks from average
      </p>
    </div>
  )
}

// ── Session History Panel ──────────────────────────────────────────────────
function downloadTeamHistoryJson(history: TeamSessionHistoryEntry[]) {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'moving-motivators-team-history.json'
  link.click()
  URL.revokeObjectURL(url)
}

function isValidTeamHistoryEntry(v: unknown): v is TeamSessionHistoryEntry {
  if (!v || typeof v !== 'object') return false
  const e = v as Record<string, unknown>
  return typeof e.sessionId === 'string' && typeof e.date === 'string' &&
    Array.isArray(e.topMotivators) && typeof e.participantCount === 'number'
}

function SessionHistoryPanel() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'list' | 'trend'>('list')
  const [history, setHistory] = useState<TeamSessionHistoryEntry[]>(() =>
    JSON.parse(localStorage.getItem('moving-motivators:teamSessionHistory') || '[]')
  )
  const importRef = useRef<HTMLInputElement>(null)

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as unknown[]
        if (!Array.isArray(parsed)) return
        const valid = parsed.filter(isValidTeamHistoryEntry) as TeamSessionHistoryEntry[]
        if (valid.length === 0) return
        setHistory(existing => {
          const seen = new Set(existing.map(en => en.sessionId))
          const merged = [...existing, ...valid.filter(en => !seen.has(en.sessionId))].slice(0, 10)
          localStorage.setItem('moving-motivators:teamSessionHistory', JSON.stringify(merged))
          return merged
        })
      } catch { /* ignore malformed JSON */ }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  if (history.length === 0) return null

  // Compute top-3 appearance frequency per motivator across all stored sessions
  const freq: Partial<Record<MotivatorId, number>> = {}
  for (const entry of history) {
    for (const id of entry.topMotivators) {
      freq[id] = (freq[id] ?? 0) + 1
    }
  }
  const trendRows = MOTIVATOR_ORDER
    .map(id => ({ id, count: freq[id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
  const maxCount = trendRows[0]?.count || 1

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
      >
        <span className="inline-flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {t('team.sessionHistory.title')} ({history.length})</span>
        <span className="text-gray-400 dark:text-gray-600">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="flex flex-col gap-3">
          {/* View toggle */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('team.history.list')}
              </button>
              <button
                onClick={() => setView('trend')}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                  view === 'trend'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t('team.history.trend')}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => importRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors px-1"
              >
                <UploadIcon className="w-3 h-3" /> {t('team.history.import')}
              </button>
              <button
                onClick={() => downloadTeamHistoryJson(history)}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors px-1"
              >
                <DownloadIcon className="w-3 h-3" /> {t('team.history.export')}
              </button>
              <input
                ref={importRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>
          </div>

          {view === 'list' && (
            <div className="flex flex-col gap-2">
              {history.map((entry, i) => (
                <div
                  key={`${entry.sessionId}-${i}`}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 flex flex-col gap-1.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-brand-600 dark:text-brand-400">
                      {entry.teamName}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-600">{entry.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {entry.topMotivators.map(id => {
                      const meta = getMotivatorMeta(id)
                      return (
                        <span
                          key={id}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${meta.color} ${meta.textColor} border ${meta.borderColor}`}
                        >
                          {meta.emoji} {t(`motivators.${id}.name`)}
                        </span>
                      )
                    })}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    {entry.participantCount} {t('team.participants')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {view === 'trend' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3 flex flex-col gap-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                {t('team.history.topMotivators')} ({history.length} {t('team.history.sessions')})
              </p>
              {trendRows.map(({ id, count }) => {
                const meta = getMotivatorMeta(id)
                const pct = count === 0 ? 0 : Math.round((count / maxCount) * 100)
                return (
                  <div key={id} className="flex items-center gap-2 py-0.5">
                    <span className="w-5 text-center text-base">{meta.emoji}</span>
                    <span className={`w-20 text-xs font-medium truncate ${count > 0 ? meta.textColor : 'text-gray-300 dark:text-gray-700'}`}>
                      {t(`motivators.${id}.name`)}
                    </span>
                    <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      {count > 0 && (
                        <div
                          className={`h-full rounded-full ${meta.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      )}
                    </div>
                    <span className={`w-6 text-right text-xs font-mono font-semibold ${count > 0 ? meta.textColor : 'text-gray-300 dark:text-gray-700'}`}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Team Results View ──────────────────────────────────────────────────────
function TeamResultsView({
  participants,
  onBack,
  isHost,
}: {
  participants: Record<string, TeamParticipant>
  onBack: () => void
  isHost: boolean
}) {
  const { t } = useTranslation()
  const [showComparison, setShowComparison] = useState(false)
  const entries = Object.entries(participants).filter(([, p]) => p.completed && p.motivators)

  const handleSendToSprintMetrics = () => {
    const raw = localStorage.getItem('moving-motivators:motivationSnapshot')
    if (!raw) return
    window.open(
      `https://agile-toolkit.github.io/sprint-metrics/?mm=${btoa(raw)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 pt-12 text-gray-400 dark:text-gray-600">
        <p>{t('team.phase.revealed')}</p>
        <p className="text-sm">No completed rankings yet.</p>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">{t('common.back')}</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('team.phase.revealed')}</h2>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 inline-flex items-center gap-1">
          <CloseIcon className="w-3.5 h-3.5" /> {t('common.back')}
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {entries.length} participant{entries.length !== 1 ? 's' : ''} completed
      </p>

      {/* Per-participant ranking strips */}
      <div className="flex flex-col gap-6">
        {entries.map(([id, participant]) => {
          const sorted = [...(participant.motivators ?? [])].sort((a, b) => a.rank - b.rank)
          return (
            <div key={id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-semibold text-gray-900 dark:text-gray-50">{participant.name}</span>
                {participant.change && (
                  <span className="text-xs text-gray-400 dark:text-gray-600 truncate max-w-xs">
                    re: "{participant.change}"
                  </span>
                )}
              </div>
              {/* Ranked cards */}
              <div className="overflow-x-auto">
                <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
                  {sorted.map(item => {
                    const meta = getMotivatorMeta(item.id)
                    const impactBar =
                      item.impact === 'positive'
                        ? 'bg-green-400'
                        : item.impact === 'negative'
                        ? 'bg-red-400'
                        : 'bg-gray-200'
                    return (
                      <div key={item.id} className="flex flex-col items-center gap-1 w-14">
                        <div className={`w-full h-1 rounded-full ${impactBar}`} />
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${meta.color} border ${meta.borderColor}`}
                        >
                          {meta.emoji}
                        </div>
                        <span
                          className={`text-[9px] font-medium text-center leading-tight ${meta.textColor}`}
                        >
                          {t(`motivators.${item.id}.name`)}
                        </span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-600">#{item.rank}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overlap analysis: top-3 motivators by frequency */}
      {entries.length > 1 && (
        <OverlapPanel entries={entries} />
      )}

      {/* Individual comparison grid toggle */}
      {entries.length > 1 && (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setShowComparison(s => !s)}
            className="flex items-center justify-between w-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 hover:border-brand-400 dark:hover:border-brand-500 transition-colors"
          >
            <span>{showComparison ? t('team.comparison.hide') : t('team.comparison.show')}</span>
            <span className="text-gray-400 dark:text-gray-600">{showComparison ? '▲' : '▼'}</span>
          </button>
          {showComparison && (
            <IndividualComparisonGrid entries={entries} isHost={isHost} />
          )}
        </div>
      )}

      {/* Send to Sprint Metrics */}
      {isHost && localStorage.getItem('moving-motivators:motivationSnapshot') && (
        <button
          onClick={handleSendToSprintMetrics}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
        >
          <ChartIcon className="w-3.5 h-3.5" />
          <span>{t('team.sendToSprintMetrics')}</span>
        </button>
      )}

      {/* Past sessions — host only */}
      {isHost && <SessionHistoryPanel />}
    </div>
  )
}

function OverlapPanel({
  entries,
}: {
  entries: [string, TeamParticipant][]
}) {
  const { t } = useTranslation()

  // Count how many times each motivator appears in top 3
  const freq: Record<string, number> = {}
  for (const [, p] of entries) {
    const top3 = [...(p.motivators ?? [])]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 3)
    for (const item of top3) {
      freq[item.id] = (freq[item.id] ?? 0) + 1
    }
  }

  const shared = Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)

  if (shared.length === 0) return null

  return (
    <div className="bg-brand-50 dark:bg-gray-800 border border-brand-100 dark:border-gray-700 rounded-2xl p-5">
      <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-400 mb-3">
        <TeamIcon className="w-4 h-4" /> Shared top motivators
      </h3>
      <div className="flex flex-wrap gap-2">
        {shared.map(([id, count]) => {
          const meta = getMotivatorMeta(id as MotivatorId)
          return (
            <div
              key={id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${meta.color} ${meta.textColor} border ${meta.borderColor}`}
            >
              <span>{meta.emoji}</span>
              <span>{t(`motivators.${id}.name`)}</span>
              <span className="opacity-60">×{count}</span>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-brand-600 dark:text-brand-400 mt-3 leading-relaxed">
        These motivators appear in the top 3 for multiple participants. Changes that affect
        them will resonate across the team.
      </p>
    </div>
  )
}

// ── Main TeamSession ───────────────────────────────────────────────────────

/** The code rides in the fragment, which browsers never send to a server. */
function buildJoinUrl(code: string): string {
  return `${window.location.origin}${window.location.pathname}#join=${code}`
}

/** How long a joiner waits for a host before calling the code wrong. */
const HOST_WAIT_MS = 12_000

function newSessionId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(3)), b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

export default function TeamSession({
  screen,
  setScreen,
  motivators,
  onMotivators,
  change,
  onChange,
  onBack,
  onInfo,
  initialJoinCode = '',
}: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language ?? 'en'
  const [code, setCode] = useState<string | null>(() => (screen === 'team-host' ? generateRoomCode() : null))
  const [joinInput, setJoinInput] = useState(() => formatRoomCode(initialJoinCode))
  const [alias] = useState(() => pickAlias())
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('lobby')
  const [teamName, setTeamName] = useState('')
  const [teamNameSuggestion, setTeamNameSuggestion] = useState<string | null>(null)
  const [sessionError, setSessionError] = useState('')

  // Host
  const [timer, setTimer] = useState<[number, number] | null>(null)
  /** Results captured at reveal, so they outlive the room. */
  const [frozen, setFrozen] = useState<Record<string, TeamParticipant> | null>(null)

  // Participant
  const [done, setDone] = useState(false)
  const [hostSeen, setHostSeen] = useState(false)
  const [hostWaitOver, setHostWaitOver] = useState(false)

  const isHost = screen === 'team-host' || (screen === 'team-results' && frozen !== null)
  const myState: PeerState | null =
    !code ? null
    : isHost ? { k: 'h', ph: PHASES.indexOf(sessionPhase), ...(timer ? { tm: timer } : {}) }
    : { k: 'p', a: alias, ...(done ? { d: 1 as const, ...encodeMotivators(motivators) } : { d: 0 as const }) }

  const { status, selfId, peers } = useLiveRoom<PeerState>(code, APP_ID, isPeerState, myState)
  const host = isHost ? null : findHost(peers)?.[1] ?? null
  const hostPhase = host ? phaseOf(host) : null
  const participantEntries = participantsOf(peers)
  const labels = useMemo(
    () => aliasLabels([
      ...participantEntries.map(([id, p]): [string, number] => [id, p.a]),
      ...(!isHost && selfId ? [[selfId, alias] as [string, number]] : []),
    ], lang),
  // eslint-disable-next-line react-hooks/exhaustive-deps
    [peers, selfId, alias, lang, isHost],
  )
  const participants: Record<string, TeamParticipant> = Object.fromEntries(
    participantEntries.map(([id, p]) => [id, {
      name: labels.get(id) ?? '?',
      completed: p.d === 1,
      ...(p.d === 1 && p.r && p.i ? { motivators: decodeMotivators(p.r, p.i) } : {}),
    }]),
  )

  // PARTICIPANT: follow the host's phase. Local navigation between ranking
  // and assessing still works; the host moving on pulls everyone along.
  useEffect(() => {
    if (!hostPhase) return
    setHostSeen(true)
    if (hostPhase === 'lobby' || hostPhase === 'ranking' || hostPhase === 'assessing') setSessionPhase(hostPhase)
  }, [hostPhase])

  // PARTICIPANT: a mistyped code would otherwise wait forever.
  useEffect(() => {
    if (screen !== 'team-play' || status !== 'online' || hostSeen) return
    const id = setTimeout(() => setHostWaitOver(true), HOST_WAIT_MS)
    return () => clearTimeout(id)
  }, [screen, status, hostSeen])

  // HOST: offer the suite-wide active team name (E1 #51) instead of asking
  // again — read once on mount, never overwrite what the host types.
  useEffect(() => {
    if (screen !== 'team-host') return
    const active = readActiveTeam()
    if (active?.name) setTeamNameSuggestion(active.name)
  }, [screen])

  const acceptTeamNameSuggestion = () => {
    if (!teamNameSuggestion) return
    setTeamName(teamNameSuggestion)
    writeActiveTeam(teamNameSuggestion, 'moving-motivators')
  }

  const commitTeamName = (value: string) => {
    setTeamName(value)
    if (value.trim()) writeActiveTeam(value, 'moving-motivators')
  }

  // HOST: timer shown to participants as a progress bar
  const writeTimer = (durationSecs: number) => setTimer([Date.now(), durationSecs])
  const clearSessionTimer = () => setTimer(null)

  // PARTICIPANT: join session
  const handleJoin = () => {
    const normalized = normalizeRoomCode(joinInput)
    if (!normalized) {
      setSessionError(t('team.code_invalid'))
      return
    }
    setSessionError('')
    setHostSeen(false)
    setHostWaitOver(false)
    setDone(false)
    setCode(normalized)
    setScreen('team-play')
  }

  // PARTICIPANT: submit — only the numeric ranking and impacts are sent;
  // the change description stays on this device.
  const handleParticipantDone = () => {
    setDone(true)
    setScreen('team-results')
  }

  // HOST: advance phase (also clears timer)
  const advancePhase = (next: SessionPhase) => {
    clearSessionTimer()
    setSessionPhase(next)
    if (next === 'revealed') {
      setFrozen(participants)
      const completedEntries = Object.values(participants).filter(p => p.completed && p.motivators)
      if (completedEntries.length > 0) {
        const avgRank: Record<string, number> = {}
        for (const id of MOTIVATOR_ORDER) {
          const ranks = completedEntries.map(p => p.motivators!.find(m => m.id === id)?.rank ?? 5)
          avgRank[id] = ranks.reduce((s, r) => s + r, 0) / ranks.length
        }
        const topMotivators = [...MOTIVATOR_ORDER]
          .sort((a, b) => avgRank[a] - avgRank[b])
          .slice(0, 3) as MotivatorId[]
        const date = new Date().toISOString().slice(0, 10)
        // Never the room code: it is the session key, and history gets exported.
        const sessionId = newSessionId()
        const resolvedTeamName = teamName.trim() || sessionId
        const snapshot = {
          teamName: resolvedTeamName,
          date,
          topMotivators,
          participantCount: completedEntries.length,
        }
        localStorage.setItem('moving-motivators:motivationSnapshot', JSON.stringify(snapshot))
        const historyEntry: TeamSessionHistoryEntry = {
          sessionId,
          teamName: resolvedTeamName,
          date,
          topMotivators,
          participantCount: completedEntries.length,
        }
        // Guarded rather than cast: spreading a non-array here (a key another
        // app or an older version left behind) throws during a click handler
        // and takes the whole session down with it.
        let existing: TeamSessionHistoryEntry[] = []
        try {
          const parsed: unknown = JSON.parse(
            localStorage.getItem('moving-motivators:teamSessionHistory') || '[]'
          )
          if (Array.isArray(parsed)) existing = parsed as TeamSessionHistoryEntry[]
        } catch {
          /* keep the empty list */
        }
        localStorage.setItem(
          'moving-motivators:teamSessionHistory',
          JSON.stringify([historyEntry, ...existing].slice(0, 10))
        )
      }
      setScreen('team-results')
    }
  }

  const statusBanner = status !== 'online' && code && (
    <p role="status" className={`text-sm text-center ${status === 'unreachable' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {status === 'unreachable' ? t('team.unreachable') : t('team.connecting')}
    </p>
  )

  const privacyNote = (
    <p className="text-xs text-gray-400 dark:text-gray-600 text-center">{t('team.privacy_note')}</p>
  )

  // ── HOST lobby ─────────────────────────────────────────────────────────
  if (screen === 'team-host' && code) {
    const entries = Object.entries(participants)
    const completedCount = entries.filter(([, p]) => p.completed).length
    const joinUrl = buildJoinUrl(code)

    return (
      <div className="flex flex-col items-center gap-5 max-w-sm mx-auto pt-8">
        {/* Always show the code */}
        <div className="flex flex-col items-center gap-1 w-full">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('team.pinLabel')}</p>
          <div className="text-3xl font-mono font-bold text-brand-600 dark:text-brand-400 tracking-widest bg-brand-50 dark:bg-gray-800 px-6 py-3 rounded-2xl select-all">
            {formatRoomCode(code)}
          </div>
        </div>
        {statusBanner}

        {/* Optional team name — stays on this device, labels saved history */}
        {sessionPhase === 'lobby' && (
          <div className="flex flex-col items-center gap-1.5 w-full">
            <input
              type="text"
              value={teamName}
              onChange={e => commitTeamName(e.target.value)}
              placeholder={t('team.namePlaceholder')}
              maxLength={40}
              className="w-full text-center text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {teamNameSuggestion && teamNameSuggestion !== teamName && (
              <button
                type="button"
                onClick={acceptTeamNameSuggestion}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
              >
                {t('team.useSuggestedName', { name: teamNameSuggestion })}
              </button>
            )}
          </div>
        )}

        {/* QR code — hidden on small screens (< 480px) where host's phone can't be shared) */}
        <div className="hidden min-[480px]:flex flex-col items-center gap-2">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <QRCodeSVG value={joinUrl} size={140} level="M" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t('team.scanToJoin')}</p>
        </div>

        {/* Phase: lobby — waiting for participants */}
        {sessionPhase === 'lobby' && (
          <>
            {entries.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('team.waitingFor')}</p>
            ) : (
              <div className="flex flex-col gap-1.5 w-full">
                {entries.map(([id, p]) => (
                  <div key={id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-800">
                    {p.completed ? <CheckCircleIcon className="w-3.5 h-3.5" /> : <HourglassIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />}
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => advancePhase('ranking')}
              disabled={entries.length === 0}
              className="w-full py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 disabled:opacity-40 transition-colors"
            >
              {t('team.startRanking')}
            </button>
            {privacyNote}
          </>
        )}

        {/* Phase: ranking — timer + progress + advance button */}
        {sessionPhase === 'ranking' && (
          <>
            <p className="text-xs font-medium text-brand-500 uppercase tracking-wider self-start">{t('team.phase.ranking')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 self-start">
              {completedCount}/{entries.length} {t('team.participants')} done
            </p>
            <FacilitatorTimer onTimerStart={writeTimer} onTimerStop={clearSessionTimer} />
            <button
              onClick={() => advancePhase('assessing')}
              className="w-full py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
            >
              {t('team.startAssessing')}
            </button>
          </>
        )}

        {/* Phase: assessing — timer + progress + reveal button */}
        {sessionPhase === 'assessing' && (
          <>
            <p className="text-xs font-medium text-brand-500 uppercase tracking-wider self-start">{t('team.phase.assessing')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 self-start">
              {completedCount}/{entries.length} {t('team.participants')} done
            </p>
            <FacilitatorTimer onTimerStart={writeTimer} onTimerStop={clearSessionTimer} />
            <button
              onClick={() => advancePhase('revealed')}
              className="w-full py-2.5 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 transition-colors"
            >
              {t('team.reveal')}
            </button>
          </>
        )}

        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">
          {t('common.back')}
        </button>
      </div>
    )
  }

  // ── JOIN form ───────────────────────────────────────────────────────────
  if (screen === 'team-join') {
    return (
      <div className="flex flex-col items-center gap-4 max-w-sm mx-auto pt-12">
        <h2 className="text-2xl font-bold dark:text-gray-50">{t('team.joinPrompt')}</h2>
        <input
          autoFocus
          value={joinInput}
          onChange={e => { setJoinInput(e.target.value); setSessionError('') }}
          onKeyDown={e => { if (e.key === 'Enter') handleJoin() }}
          placeholder="XXXXX-XXXXX"
          aria-label={t('team.joinPin')}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest uppercase bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
          maxLength={13}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('team.you_are', { alias: aliasLabel(alias, lang) })}</p>
        {sessionError && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{sessionError}</p>
        )}
        <button
          onClick={handleJoin}
          disabled={!joinInput.trim()}
          className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 disabled:opacity-40 transition-colors"
        >
          {t('team.join')}
        </button>
        {privacyNote}
        <button onClick={onBack} className="text-sm text-gray-400 dark:text-gray-600">
          {t('common.back')}
        </button>
      </div>
    )
  }

  // ── PARTICIPANT play ────────────────────────────────────────────────────
  if (screen === 'team-play') {
    if (!host) {
      const message =
        status === 'unreachable' ? t('team.unreachable')
        : hostSeen ? t('team.host_left')
        : hostWaitOver ? t('team.join_error')
        : null
      return (
        <div className="flex flex-col items-center gap-4 pt-16 max-w-sm mx-auto text-center text-gray-500 dark:text-gray-400">
          {message ? (
            <p>{message}</p>
          ) : (
            <>
              <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
              <p className="text-sm">{t('team.connecting')}</p>
            </>
          )}
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">{t('common.back')}</button>
        </div>
      )
    }
    if (sessionPhase === 'lobby') {
      return (
        <div className="flex flex-col items-center gap-4 pt-16 text-gray-500 dark:text-gray-400">
          {statusBanner}
          <p className="text-lg font-medium">{t('team.phase.lobby')}</p>
          <p className="text-sm">{t('team.you_are', { alias: labels.get(selfId) ?? aliasLabel(alias, lang) })}</p>
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">{t('common.back')}</button>
        </div>
      )
    }
    const timerBar = host.tm
      ? <ParticipantTimerBar startedAt={host.tm[0]} durationSecs={host.tm[1]} />
      : null
    const phaseBadge = (key: string) => (
      <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-2">{t(key)}</p>
    )
    if (sessionPhase === 'ranking') {
      return (
        <div>
          {statusBanner}
          {timerBar}
          {phaseBadge('team.phase.ranking')}
          <RankingBoard
            motivators={motivators}
            onChange={onMotivators}
            onNext={() => setSessionPhase('assessing')}
            onSkip={() => setSessionPhase('assessing')}
            onBack={onBack}
            onInfo={onInfo}
          />
        </div>
      )
    }
    return (
      <div>
        {statusBanner}
        {timerBar}
        {phaseBadge('team.phase.assessing')}
        <ChangeAssessment
          motivators={motivators}
          change={change}
          onChangeText={onChange}
          onMotivatorChange={onMotivators}
          onNext={handleParticipantDone}
          onBack={() => setSessionPhase('ranking')}
          onInfo={onInfo}
        />
      </div>
    )
  }

  // ── TEAM RESULTS ────────────────────────────────────────────────────────
  if (screen === 'team-results') {
    // Host: the snapshot taken at reveal. Participant: their own data only.
    const displayParticipants: Record<string, TeamParticipant> = frozen ?? {
      self: { name: labels.get(selfId) ?? aliasLabel(alias, lang), completed: true, motivators, change },
    }
    return <TeamResultsView participants={displayParticipants} onBack={onBack} isHost={frozen !== null} />
  }

  return null
}
