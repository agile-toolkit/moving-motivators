import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const up = () => setIsOnline(true)
    const down = () => setIsOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down) }
  }, [])
  return isOnline
}
import type { Screen, MotivatorItem, MotivatorId, SessionEntry, ImpactLevel } from './types'
import { defaultMotivatorItems } from './data/motivators'
import AppHeader from './components/AppHeader'
import ThemeToggle from './components/ThemeToggle'
import HomeScreen from './components/HomeScreen'
import RankingBoard from './components/RankingBoard'
import ChangeAssessment from './components/ChangeAssessment'
import ResultsView from './components/ResultsView'
import TeamSession from './components/TeamSession'
import MotivatorInfo from './components/MotivatorInfo'
import FacilitationGuide from './components/FacilitationGuide'

function readChangeParam(): string {
  try {
    const raw = new URLSearchParams(window.location.search).get('change')
    return raw ? decodeURIComponent(raw) : ''
  } catch {
    return ''
  }
}

function App() {
  const { t } = useTranslation()
  const isOnline = useOnlineStatus()
  const initialChange = readChangeParam()
  const [screen, setScreen] = useState<Screen>(initialChange ? 'solo-rank' : 'home')
  const [motivators, setMotivators] = useState<MotivatorItem[]>(defaultMotivatorItems())
  const [change, setChange] = useState(initialChange)
  const [infoMotivator, setInfoMotivator] = useState<MotivatorId | null>(null)

  useEffect(() => {
    if (initialChange) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = () => {
    setMotivators(defaultMotivatorItems())
    setChange('')
    setScreen('home')
  }

  const restoreSession = (entry: SessionEntry) => {
    const restored: MotivatorItem[] = entry.ranked.map((id, i) => ({
      id: id as MotivatorId,
      rank: i + 1,
      impact: ((entry.changes[id] as ImpactLevel) || 'neutral'),
    }))
    setMotivators(restored)
    setChange(entry.change || '')
    setScreen('solo-rank')
  }

  const goToSoloResults = () => {
    const ranked = [...motivators].sort((a, b) => a.rank - b.rank).map(m => m.id)
    const changes: Record<string, string> = {}
    motivators.forEach(m => { changes[m.id] = m.impact })
    const session = {
      date: new Date().toISOString().slice(0, 10),
      savedAt: Date.now(),
      ranked,
      change,
      changes,
    }
    localStorage.setItem('moving-motivators:lastSession', JSON.stringify(session))
    const existing = JSON.parse(localStorage.getItem('moving-motivators:sessionHistory') || '[]')
    localStorage.setItem(
      'moving-motivators:sessionHistory',
      JSON.stringify([session, ...existing].slice(0, 20))
    )
    setScreen('solo-results')
  }

  const isTeamScreen = ['team-host','team-join','team-play','team-results'].includes(screen)

  return (
    <div data-accent="coral" className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <AppHeader title={t('app.title')} onTitleClick={reset}><ThemeToggle /></AppHeader>

      {!isOnline && (
        <div role="status" className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm text-center py-2 px-4">
          {t('pwa.offlineBanner')}
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {screen === 'home' && (
          <HomeScreen
            onSolo={() => setScreen('solo-rank')}
            onHost={() => setScreen('team-host')}
            onJoin={() => setScreen('team-join')}
            onFacilitation={() => setScreen('facilitation')}
            isOnline={isOnline}
          />
        )}
        {screen === 'facilitation' && (
          <FacilitationGuide onBack={() => setScreen('home')} />
        )}
        {screen === 'solo-rank' && (
          <RankingBoard
            motivators={motivators}
            onChange={setMotivators}
            onNext={() => setScreen('solo-assess')}
            onSkip={goToSoloResults}
            onBack={() => setScreen('home')}
            onInfo={setInfoMotivator}
          />
        )}
        {screen === 'solo-assess' && (
          <ChangeAssessment
            motivators={motivators}
            change={change}
            onChangeText={setChange}
            onMotivatorChange={setMotivators}
            onNext={goToSoloResults}
            onBack={() => setScreen('solo-rank')}
            onInfo={setInfoMotivator}
          />
        )}
        {screen === 'solo-results' && (
          <ResultsView
            motivators={motivators}
            change={change}
            onReset={reset}
            onInfo={setInfoMotivator}
            onRestore={restoreSession}
          />
        )}
        {isTeamScreen && (
          <TeamSession
            screen={screen}
            setScreen={setScreen}
            motivators={motivators}
            onMotivators={setMotivators}
            change={change}
            onChange={setChange}
            onBack={reset}
          />
        )}
      </main>

      {/* Motivator info drawer — rendered at root so it overlays everything */}
      {infoMotivator && (
        <MotivatorInfo
          id={infoMotivator}
          onClose={() => setInfoMotivator(null)}
        />
      )}
    </div>
  )
}

export default App
