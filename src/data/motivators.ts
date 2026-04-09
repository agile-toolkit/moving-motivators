import type { MotivatorId } from '../types'

export interface MotivatorMeta {
  id: MotivatorId
  emoji: string
  color: string        // Tailwind bg color class
  borderColor: string  // Tailwind border color class
  textColor: string    // Tailwind text color class
}

export const MOTIVATORS: MotivatorMeta[] = [
  { id: 'curiosity',    emoji: '🔍', color: 'bg-purple-50',  borderColor: 'border-purple-400', textColor: 'text-purple-700' },
  { id: 'honor',        emoji: '🏅', color: 'bg-amber-50',   borderColor: 'border-amber-400',  textColor: 'text-amber-700'  },
  { id: 'acceptance',   emoji: '❤️',  color: 'bg-pink-50',    borderColor: 'border-pink-400',   textColor: 'text-pink-700'   },
  { id: 'mastery',      emoji: '🎯', color: 'bg-blue-50',    borderColor: 'border-blue-400',   textColor: 'text-blue-700'   },
  { id: 'power',        emoji: '⚡', color: 'bg-red-50',     borderColor: 'border-red-400',    textColor: 'text-red-700'    },
  { id: 'freedom',      emoji: '🦋', color: 'bg-green-50',   borderColor: 'border-green-400',  textColor: 'text-green-700'  },
  { id: 'relatedness',  emoji: '🤝', color: 'bg-orange-50',  borderColor: 'border-orange-400', textColor: 'text-orange-700' },
  { id: 'order',        emoji: '📋', color: 'bg-teal-50',    borderColor: 'border-teal-400',   textColor: 'text-teal-700'   },
  { id: 'goal',         emoji: '🌟', color: 'bg-indigo-50',  borderColor: 'border-indigo-400', textColor: 'text-indigo-700' },
  { id: 'status',       emoji: '🏆', color: 'bg-yellow-50',  borderColor: 'border-yellow-400', textColor: 'text-yellow-700' },
]

export const getMotivatorMeta = (id: MotivatorId): MotivatorMeta =>
  MOTIVATORS.find(m => m.id === id)!

export const defaultMotivatorItems = () =>
  MOTIVATORS.map((m, i) => ({ id: m.id, rank: i + 1, impact: 'neutral' as const }))
