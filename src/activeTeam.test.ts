import { describe, it, expect, beforeEach } from 'vitest'
import { readActiveTeam, writeActiveTeam } from './activeTeam'

const KEY = 'agile-toolkit:activeTeam'

describe('readActiveTeam', () => {
  beforeEach(() => localStorage.clear())

  it('returns null when nothing is stored', () => {
    expect(readActiveTeam()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    localStorage.setItem(KEY, '{not json')
    expect(readActiveTeam()).toBeNull()
  })

  it('returns null when the stored value has no name', () => {
    localStorage.setItem(KEY, JSON.stringify({ source: 'x', updatedAt: 1 }))
    expect(readActiveTeam()).toBeNull()
  })

  it('returns the parsed team when valid', () => {
    localStorage.setItem(KEY, JSON.stringify({ name: 'Team Alpha', source: 'dashboard', updatedAt: 123 }))
    expect(readActiveTeam()).toEqual({ name: 'Team Alpha', source: 'dashboard', updatedAt: 123 })
  })
})

describe('writeActiveTeam', () => {
  beforeEach(() => localStorage.clear())

  it('writes a trimmed name and source', () => {
    writeActiveTeam('  Team Bravo  ', 'moving-motivators')
    expect(readActiveTeam()).toMatchObject({ name: 'Team Bravo', source: 'moving-motivators' })
  })

  it('is a no-op for a blank name', () => {
    writeActiveTeam('   ', 'moving-motivators')
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('does not rewrite when name and source are unchanged', () => {
    writeActiveTeam('Team Bravo', 'moving-motivators')
    const first = localStorage.getItem(KEY)
    writeActiveTeam('Team Bravo', 'moving-motivators')
    expect(localStorage.getItem(KEY)).toBe(first)
  })

  it('does rewrite when the source changes for the same name', () => {
    writeActiveTeam('Team Bravo', 'moving-motivators')
    const first = readActiveTeam()!.updatedAt
    writeActiveTeam('Team Bravo', 'dashboard')
    const second = readActiveTeam()!
    expect(second.source).toBe('dashboard')
    expect(second.updatedAt).toBeGreaterThanOrEqual(first)
  })
})
