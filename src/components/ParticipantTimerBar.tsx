import { useState, useEffect } from 'react'

interface Props {
  startedAt: number
  durationSecs: number
}

export default function ParticipantTimerBar({ startedAt, durationSecs }: Props) {
  const [pct, setPct] = useState(() =>
    Math.min(100, ((Date.now() - startedAt) / 1000 / durationSecs) * 100)
  )

  useEffect(() => {
    const id = setInterval(() => {
      setPct(Math.min(100, ((Date.now() - startedAt) / 1000 / durationSecs) * 100))
    }, 1000)
    return () => clearInterval(id)
  }, [startedAt, durationSecs])

  const isLow = pct > 80

  return (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-400' : 'bg-brand-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
