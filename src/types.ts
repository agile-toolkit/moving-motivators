export type MotivatorId =
  | 'curiosity' | 'honor' | 'acceptance' | 'mastery' | 'power'
  | 'freedom' | 'relatedness' | 'order' | 'goal' | 'status'

export type ImpactLevel = 'positive' | 'negative' | 'neutral'

export interface MotivatorItem {
  id: MotivatorId
  rank: number
  impact: ImpactLevel
}

export type Screen =
  | 'home'
  | 'solo-rank'
  | 'solo-assess'
  | 'solo-results'
  | 'team-host'
  | 'team-join'
  | 'team-play'
  | 'team-results'
  | 'facilitation'

export interface SessionParticipant {
  id: string
  name: string
  completed: boolean
  motivators?: MotivatorItem[]
}

export interface TeamSessionData {
  pin: string
  hostId: string
  change: string
  participants: Record<string, SessionParticipant>
  phase: 'lobby' | 'ranking' | 'assessing' | 'revealed'
  createdAt: number
}
