import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const PRESETS = [
  { label: '3m', secs: 180 },
  { label: '5m', secs: 300 },
  { label: '8m', secs: 480 },
]

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  } catch {
    // AudioContext not available
  }
}

function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

type State = 'idle' | 'running' | 'paused' | 'done'

interface Props {
  onTimerStart?: (durationSecs: number) => void
  onTimerStop?: () => void
}

const SIZE = 120
const STROKE = 8
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

export default function FacilitatorTimer({ onTimerStart, onTimerStop }: Props) {
  const { t } = useTranslation()
  const [duration, setDuration] = useState(300)
  const [timeLeft, setTimeLeft] = useState(300)
  const [state, setState] = useState<State>('idle')
  const [custom, setCustom] = useState('')
  const timerRef = useRef<number | null>(null)

  const stopTick = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (state === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopTick()
            setState('done')
            playBeep()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      stopTick()
    }
    return stopTick
  }, [state])

  const selectPreset = (secs: number) => {
    stopTick()
    setDuration(secs)
    setTimeLeft(secs)
    setState('idle')
    setCustom('')
    onTimerStop?.()
  }

  const handleStart = () => {
    if (state === 'done') return
    if (state === 'idle') onTimerStart?.(duration)
    setState('running')
  }

  const handlePause = () => setState('paused')

  const handleReset = () => {
    stopTick()
    setState('idle')
    setTimeLeft(duration)
    onTimerStop?.()
  }

  const pct = duration > 0 ? (timeLeft / duration) * 100 : 0
  const isDone = state === 'done'
  const isLow = pct < 20 && state !== 'idle' && !isDone
  const dashOffset = CIRC * (1 - pct / 100)
  const ringClass = isDone ? 'text-gray-300' : isLow ? 'text-red-400' : 'text-brand-500'

  return (
    <div className="flex flex-col items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm w-full max-w-xs">
      {state === 'idle' && (
        <div className="flex gap-1.5 flex-wrap justify-center">
          {PRESETS.map(p => (
            <button
              key={p.secs}
              onClick={() => selectPreset(p.secs)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                duration === p.secs
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
          <input
            type="number"
            min="1"
            max="60"
            placeholder="min"
            value={custom}
            onChange={e => {
              setCustom(e.target.value)
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1 && v <= 60) {
                setDuration(v * 60)
                setTimeLeft(v * 60)
              }
            }}
            className="w-14 text-xs text-center border border-gray-200 dark:border-gray-700 rounded-lg px-1 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
      )}

      <div className={`relative${isDone ? ' animate-pulse' : ''}`} style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90 text-gray-200 dark:text-gray-700">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none"
            className={`${ringClass} transition-all duration-1000`}
            stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round"
            strokeDasharray={CIRC} strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-mono font-bold tabular-nums ${
            isDone ? 'text-gray-400 dark:text-gray-500' : isLow ? 'text-red-500' : 'text-gray-800 dark:text-gray-100'
          }`}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

      {isDone && (
        <p className="text-sm font-medium text-red-500 text-center">{t('team.timer.timeUp')}</p>
      )}

      <div className="flex gap-2">
        {(state === 'idle' || state === 'paused') && (
          <button
            onClick={handleStart}
            className="px-3 py-1 text-xs bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            {t('team.timer.start')}
          </button>
        )}
        {state === 'running' && (
          <button
            onClick={handlePause}
            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t('team.timer.pause')}
          </button>
        )}
        {state !== 'idle' && (
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {t('team.timer.reset')}
          </button>
        )}
      </div>
    </div>
  )
}
