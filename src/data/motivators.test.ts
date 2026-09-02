import { describe, it, expect } from 'vitest'
import { MOTIVATORS, getMotivatorMeta, defaultMotivatorItems } from './motivators'

describe('MOTIVATORS', () => {
  it('has all 10 CHAMPFROGS motivators with unique ids', () => {
    expect(MOTIVATORS).toHaveLength(10)
    expect(new Set(MOTIVATORS.map(m => m.id)).size).toBe(10)
  })

  it('gives every motivator an emoji and color classes', () => {
    for (const m of MOTIVATORS) {
      expect(m.emoji.length).toBeGreaterThan(0)
      expect(m.color).toMatch(/^bg-/)
      expect(m.borderColor).toMatch(/^border-/)
      expect(m.textColor).toMatch(/^text-/)
    }
  })
})

describe('getMotivatorMeta', () => {
  it('looks up a motivator by id', () => {
    expect(getMotivatorMeta('mastery').emoji).toBe('🎯')
  })
})

describe('defaultMotivatorItems', () => {
  it('produces one item per motivator with sequential ranks and neutral impact', () => {
    const items = defaultMotivatorItems()
    expect(items).toHaveLength(10)
    expect(items.map(i => i.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(items.every(i => i.impact === 'neutral')).toBe(true)
    expect(items.map(i => i.id)).toEqual(MOTIVATORS.map(m => m.id))
  })
})
