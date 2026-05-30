import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ref, set, onValue, push, update } from 'firebase/database'
import { getFirebaseDb } from '../firebase'
import type { Screen, MotivatorItem, MotivatorId } from '../types'
import { getMotivatorMeta, defaultMotivatorItems } from '../data/motivators'
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
}

interface FirebaseParticipant {
  name: string
  completed: boolean
  motivators?: MotivatorItem[]
  change?: string
}

function generatePin(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

// ── Team Results View ──────────────────────────────────────────────────────
function TeamResultsView({
  participants,
  onBack,
}: {
  participants: Record<string, FirebaseParticipant>
  onBack: () => void
}) {
  const { t } = useTranslation()
  const entries = Object.entries(participants).filter(([, p]) => p.completed && p.motivators)

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
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">
          ✕ {t('common.back')}
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
    </div>
  )
}

function OverlapPanel({
  entries,
}: {
  entries: [string, FirebaseParticipant][]
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
      <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-3">
        🤝 Shared top motivators
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
export default function TeamSession({
  screen,
  setScreen,
  motivators,
  onMotivators,
  change,
  onChange,
  onBack,
  onInfo,
}: Props) {
  const { t } = useTranslation()
  const [pin, setPin] = useState('')
  const [joinPin, setJoinPin] = useState('')
  const [name, setName] = useState('')
  const [participantId, setParticipantId] = useState('')
  const [sessionPhase, setSessionPhase] = useState<'lobby' | 'ranking' | 'assessing' | 'revealed'>('lobby')
  const [participants, setParticipants] = useState<Record<string, FirebaseParticipant>>({})
  const [sessionTimer, setSessionTimer] = useState<{ startedAt: number; durationSecs: number } | null>(null)
  const db = getFirebaseDb()

  // HOST: create session
  useEffect(() => {
    if (screen !== 'team-host' || !db) return
    const newPin = generatePin()
    setPin(newPin)
    set(ref(db, `sessions/${newPin}`), {
      pin: newPin,
      hostId: 'host',
      change: '',
      phase: 'lobby',
      participants: {},
      createdAt: Date.now(),
    })
  }, [screen])

  // HOST: listen for all participant data (including motivators)
  useEffect(() => {
    if (screen !== 'team-host' || !pin || !db) return
    const unsub = onValue(ref(db, `sessions/${pin}/participants`), snap => {
      setParticipants(snap.val() ?? {})
    })
    return () => unsub()
  }, [screen, pin])

  // PARTICIPANT: listen for phase changes from host
  useEffect(() => {
    if (!['team-play'].includes(screen) || !pin || !db || participantId) return
    // guest-only: listen to phase changes
    const unsub = onValue(ref(db, `sessions/${pin}/phase`), snap => {
      const phase = snap.val() as typeof sessionPhase
      if (phase) setSessionPhase(phase)
    })
    return () => unsub()
  }, [screen, pin, participantId])

  // PARTICIPANT: listen for timer (to show progress bar)
  useEffect(() => {
    if (screen !== 'team-play' || !pin || !db) return
    const unsub = onValue(ref(db, `sessions/${pin}/timer`), snap => {
      setSessionTimer(snap.val() as { startedAt: number; durationSecs: number } | null)
    })
    return () => unsub()
  }, [screen, pin])

  // HOST: write/clear timer in Firebase
  const writeTimer = (durationSecs: number) => {
    if (!db || !pin) return
    set(ref(db, `sessions/${pin}/timer`), { startedAt: Date.now(), durationSecs })
  }

  const clearSessionTimer = () => {
    if (!db || !pin) return
    set(ref(db, `sessions/${pin}/timer`), null)
  }

  // PARTICIPANT: join session
  const handleJoin = async () => {
    if (!db || !joinPin || !name) return
    const pRef = push(ref(db, `sessions/${joinPin}/participants`))
    const id = pRef.key!
    setParticipantId(id)
    await set(pRef, { name, completed: false, motivators: defaultMotivatorItems() })
    setPin(joinPin)
    setScreen('team-play')
  }

  // PARTICIPANT: save final results to Firebase
  const handleParticipantDone = async () => {
    if (db && pin && participantId) {
      await update(ref(db, `sessions/${pin}/participants/${participantId}`), {
        completed: true,
        motivators,
        change,
      })
    }
    setScreen('team-results')
  }

  // HOST: advance phase (also clears timer)
  const advancePhase = (next: typeof sessionPhase) => {
    if (!db || !pin) return
    clearSessionTimer()
    set(ref(db, `sessions/${pin}/phase`), next)
    setSessionPhase(next)
    if (next === 'revealed') setScreen('team-results')
  }

  // ── HOST lobby ─────────────────────────────────────────────────────────
  if (screen === 'team-host') {
    const entries = Object.entries(participants)
    const completedCount = entries.filter(([, p]) => p.completed).length

    return (
      <div className="flex flex-col items-center gap-5 max-w-sm mx-auto pt-8">
        {/* Always show PIN */}
        <div className="flex flex-col items-center gap-1 w-full">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('team.pinLabel')}</p>
          <div className="text-5xl font-mono font-bold text-brand-600 dark:text-brand-400 tracking-widest bg-brand-50 dark:bg-gray-800 px-8 py-3 rounded-2xl">
            {pin}
          </div>
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
                    <span>{p.completed ? '✅' : '⏳'}</span>
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
          value={joinPin}
          onChange={e => setJoinPin(e.target.value)}
          placeholder={t('team.joinPin')}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
          maxLength={4}
        />
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t('team.yourName')}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          onClick={handleJoin}
          disabled={!joinPin || !name}
          className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 disabled:opacity-40 transition-colors"
        >
          {t('team.join')}
        </button>
        <button onClick={onBack} className="text-sm text-gray-400 dark:text-gray-600">
          {t('common.back')}
        </button>
      </div>
    )
  }

  // ── PARTICIPANT play ────────────────────────────────────────────────────
  if (screen === 'team-play') {
    if (sessionPhase === 'lobby') {
      return (
        <div className="flex flex-col items-center gap-4 pt-16 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">{t('team.phase.lobby')}</p>
          <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400">{t('common.back')}</button>
        </div>
      )
    }
    const timerBar = sessionTimer
      ? <ParticipantTimerBar startedAt={sessionTimer.startedAt} durationSecs={sessionTimer.durationSecs} />
      : null
    const phaseBadge = (key: string) => (
      <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-2">{t(key)}</p>
    )
    if (sessionPhase === 'ranking') {
      return (
        <div>
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
    // Host: participants already loaded via listener
    // Participant: build a fake entry from their own data
    const displayParticipants: Record<string, FirebaseParticipant> =
      Object.keys(participants).length > 0
        ? participants
        : participantId
        ? { [participantId]: { name: name || 'You', completed: true, motivators, change } }
        : {}

    return <TeamResultsView participants={displayParticipants} onBack={onBack} />
  }

  return null
}
