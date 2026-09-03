import { describe, it, expect } from 'vitest'
import { buildSessionEntry } from './sessionEntry'
import type { MotivatorItem } from './types'

function item(id: MotivatorItem['id'], rank: number, impact: MotivatorItem['impact'] = 'neutral'): MotivatorItem {
  return { id, rank, impact }
}

describe('buildSessionEntry', () => {
  it('sorts motivators by rank into `ranked`', () => {
    const motivators = [item('mastery', 2), item('curiosity', 1), item('freedom', 3)]
    const entry = buildSessionEntry(motivators, 'Reorg')
    expect(entry.ranked).toEqual(['curiosity', 'mastery', 'freedom'])
  })

  it('sets topMotivators to the first 3 of ranked', () => {
    const motivators = [
      item('mastery', 2), item('curiosity', 1), item('freedom', 3),
      item('honor', 4), item('power', 5),
    ]
    const entry = buildSessionEntry(motivators, 'Reorg')
    expect(entry.topMotivators).toEqual(['curiosity', 'mastery', 'freedom'])
  })

  it('shortens topMotivators when fewer than 3 motivators are ranked', () => {
    const motivators = [item('curiosity', 1), item('mastery', 2)]
    const entry = buildSessionEntry(motivators, '')
    expect(entry.topMotivators).toEqual(['curiosity', 'mastery'])
  })

  it('maps each motivator id to its impact in `changes`', () => {
    const motivators = [item('curiosity', 1, 'positive'), item('mastery', 2, 'negative')]
    const entry = buildSessionEntry(motivators, '')
    expect(entry.changes).toEqual({ curiosity: 'positive', mastery: 'negative' })
  })

  it('carries the change description through unchanged', () => {
    const entry = buildSessionEntry([item('curiosity', 1)], 'Move to a new open-plan office')
    expect(entry.change).toBe('Move to a new open-plan office')
  })
})
