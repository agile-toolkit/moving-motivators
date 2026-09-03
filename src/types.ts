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

export interface SessionEntry {
  label?: string
  date: string
  savedAt: number
  ranked: MotivatorId[]
  /** First 3 of `ranked`, duplicated for consumers that only want the top motivators (e.g. Sprint Metrics' loadMotivatorSnapshot). Optional: absent on entries saved before this field existed. */
  topMotivators?: MotivatorId[]
  change: string
  changes: Record<string, string>
}

export interface TeamSessionData {
  pin: string
  hostId: string
  change: string
  participants: Record<string, SessionParticipant>
  phase: 'lobby' | 'ranking' | 'assessing' | 'revealed'
  createdAt: number
}

export interface TeamSessionHistoryEntry {
  sessionId: string
  teamName: string
  date: string
  topMotivators: MotivatorId[]
  participantCount: number
}
