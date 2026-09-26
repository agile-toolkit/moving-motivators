import { useEffect, useState, lazy, Suspense } from 'react'
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
import { normalizeRoomCode } from './live/crypto'
import { buildSessionEntry } from './sessionEntry'
import AppHeader from './components/AppHeader'
import ThemeToggle from './components/ThemeToggle'
import FacilitatorToggle from './components/FacilitatorToggle'
import { useFacilitatorMode } from './components/useFacilitatorMode'
import HomeScreen from './components/HomeScreen'
import RankingBoard from './components/RankingBoard'
import ChangeAssessment from './components/ChangeAssessment'
import ResultsView from './components/ResultsView'
// Lazy: TeamSession is the only thing that needs the relay clients (MQTT,
// Nostr), and most visitors never open a team session. Loading it on demand
// keeps them out of the entry chunk for everyone else.
const TeamSession = lazy(() => import('./components/TeamSession'))
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

/**
 * The room code from a join link (`#join=ABCDE-12345`), normalized, or ''.
 *
 * The code is the session's encryption secret, so it lives in the URL
 * fragment — browsers never send that to a server — and anything that is
 * not a well-formed code is dropped here.
 */
function readJoinParam(): string {
  return normalizeRoomCode(new URLSearchParams(window.location.hash.slice(1)).get('join') ?? '')
}

function App() {
  const { t } = useTranslation()
  const isOnline = useOnlineStatus()
  const [facilitatorMode, toggleFacilitatorMode] = useFacilitatorMode('agile-toolkit:facilitatorMode')
  const initialChange = readChangeParam()
  const initialJoinCode = readJoinParam()
  const [screen, setScreen] = useState<Screen>(
    initialChange ? 'solo-rank' : initialJoinCode ? 'team-join' : 'home'
  )
  const [motivators, setMotivators] = useState<MotivatorItem[]>(defaultMotivatorItems())
  const [change, setChange] = useState(initialChange)
  const [infoMotivator, setInfoMotivator] = useState<MotivatorId | null>(null)

  useEffect(() => {
    if (initialChange || initialJoinCode) {
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
    const session = buildSessionEntry(motivators, change)
    localStorage.setItem('moving-motivators:lastSession', JSON.stringify(session))
    // Guarded rather than spread blind: a non-array left by an older version or
    // a half-restored workspace makes `...existing` throw inside a click
    // handler, which loses the session the user just finished. Same defect as
    // the team-session history append.
    let existing: unknown[] = []
    try {
      const parsed: unknown = JSON.parse(
        localStorage.getItem('moving-motivators:sessionHistory') || '[]'
      )
      if (Array.isArray(parsed)) existing = parsed
    } catch {
      /* keep the empty list */
    }
    localStorage.setItem(
      'moving-motivators:sessionHistory',
      JSON.stringify([session, ...existing].slice(0, 20))
    )
    setScreen('solo-results')
  }

  const isTeamScreen = ['team-host','team-join','team-play','team-results'].includes(screen)

  return (
    <div data-accent="coral" className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <AppHeader title={t('app.title')} onTitleClick={reset} hideLanguagePicker={facilitatorMode}>
        <ThemeToggle />
        <FacilitatorToggle
          active={facilitatorMode}
          onToggle={toggleFacilitatorMode}
          labelOn={t('facilitator.toggle_on')}
          labelOff={t('facilitator.toggle_off')}
        />
      </AppHeader>

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
            facilitatorMode={facilitatorMode}
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
          <Suspense fallback={<p className="pt-12 text-center text-gray-500 dark:text-gray-400">{t('team.loading')}</p>}>
          <TeamSession
            screen={screen}
            setScreen={setScreen}
            motivators={motivators}
            onMotivators={setMotivators}
            change={change}
            onChange={setChange}
            onBack={reset}
            initialJoinCode={initialJoinCode}
          />
          </Suspense>
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
