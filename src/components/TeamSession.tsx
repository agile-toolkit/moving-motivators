import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ref, set, onValue, push } from 'firebase/database'
import { getFirebaseDb } from '../firebase'
import type { Screen, MotivatorItem } from '../types'
import RankingBoard from './RankingBoard'
import ChangeAssessment from './ChangeAssessment'

interface Props {
  screen: Screen
  setScreen: (s: Screen) => void
  motivators: MotivatorItem[]
  onMotivators: (items: MotivatorItem[]) => void
  change: string
  onChange: (s: string) => void
  onBack: () => void
}

function generatePin(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export default function TeamSession({ screen, setScreen, motivators, onMotivators, change, onChange, onBack }: Props) {
  const { t } = useTranslation()
  const [pin, setPin] = useState('')
  const [joinPin, setJoinPin] = useState('')
  const [name, setName] = useState('')
  const [participantId, setParticipantId] = useState('')
  const [sessionPhase, setSessionPhase] = useState<'lobby'|'ranking'|'assessing'|'revealed'>('lobby')
  const [participants, setParticipants] = useState<Record<string, { name: string; completed: boolean }>>({})
  const db = getFirebaseDb()

  // HOST: create session
  useEffect(() => {
    if (screen !== 'team-host' || !db) return
    const newPin = generatePin()
    setPin(newPin)
    set(ref(db, `sessions/${newPin}`), {
      pin: newPin, hostId: 'host', change: '', phase: 'lobby',
      participants: {}, createdAt: Date.now(),
    })
  }, [screen])

  // HOST: listen for participants
  useEffect(() => {
    if (screen !== 'team-host' || !pin || !db) return
    const unsub = onValue(ref(db, `sessions/${pin}/participants`), snap => {
      setParticipants(snap.val() ?? {})
    })
    return () => unsub()
  }, [screen, pin])

  // PARTICIPANT: join session
  const handleJoin = async () => {
    if (!db || !joinPin || !name) return
    const pRef = push(ref(db, `sessions/${joinPin}/participants`))
    setParticipantId(pRef.key!)
    await set(pRef, { name, completed: false })
    setPin(joinPin)
    setScreen('team-play')
  }

  // HOST: advance phase
  const advancePhase = (next: typeof sessionPhase) => {
    if (!db || !pin) return
    set(ref(db, `sessions/${pin}/phase`), next)
    setSessionPhase(next)
    if (next === 'assessing') setScreen('team-play')
    if (next === 'revealed') setScreen('team-results')
  }

  if (screen === 'team-host') {
    const count = Object.keys(participants).length
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto pt-12">
        <h2 className="text-2xl font-bold">{t('team.pinLabel')}</h2>
        <div className="text-6xl font-mono font-bold text-brand-600 tracking-widest bg-brand-50 px-8 py-4 rounded-2xl">
          {pin}
        </div>
        <p className="text-gray-500">{count} {t('team.participants')}</p>
        {Object.entries(participants).map(([id, p]) => (
          <div key={id} className="text-sm text-gray-700">{p.name} {p.completed ? '✓' : '…'}</div>
        ))}
        <button onClick={() => advancePhase('ranking')}
          className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
          {t('team.reveal')}
        </button>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600">{t('common.back')}</button>
      </div>
    )
  }

  if (screen === 'team-join') {
    return (
      <div className="flex flex-col items-center gap-4 max-w-sm mx-auto pt-12">
        <h2 className="text-2xl font-bold">{t('team.joinPrompt')}</h2>
        <input value={joinPin} onChange={e => setJoinPin(e.target.value)} placeholder={t('team.joinPin')}
          className="w-full border rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-400" maxLength={4} />
        <input value={name} onChange={e => setName(e.target.value)} placeholder={t('team.yourName')}
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400" />
        <button onClick={handleJoin} disabled={!joinPin || !name}
          className="w-full py-3 bg-brand-500 text-white rounded-xl font-medium hover:bg-brand-600 disabled:opacity-40 transition-colors">
          {t('team.join')}
        </button>
        <button onClick={onBack} className="text-sm text-gray-400">{t('common.back')}</button>
      </div>
    )
  }

  if (screen === 'team-play') {
    if (sessionPhase === 'ranking') {
      return <RankingBoard motivators={motivators} onChange={onMotivators}
        onNext={() => setSessionPhase('assessing')} onSkip={() => setSessionPhase('assessing')} onBack={onBack} />
    }
    return <ChangeAssessment motivators={motivators} change={change} onChangeText={onChange}
      onMotivatorChange={onMotivators} onNext={() => setScreen('team-results')} onBack={() => setSessionPhase('ranking')} />
  }

  return <div className="text-center py-12 text-gray-500">{t('team.phase.revealed')}</div>
}
