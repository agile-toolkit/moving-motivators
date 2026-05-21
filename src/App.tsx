import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, MotivatorItem, MotivatorId } from './types'
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

function App() {
  const { t } = useTranslation()
  const [screen, setScreen] = useState<Screen>('home')
  const [motivators, setMotivators] = useState<MotivatorItem[]>(defaultMotivatorItems())
  const [change, setChange] = useState('')
  const [infoMotivator, setInfoMotivator] = useState<MotivatorId | null>(null)

  const reset = () => {
    setMotivators(defaultMotivatorItems())
    setChange('')
    setScreen('home')
  }

  const goToSoloResults = () => {
    const ranked = [...motivators].sort((a, b) => a.rank - b.rank).map(m => m.id)
    const changes: Record<string, string> = {}
    motivators.forEach(m => { changes[m.id] = m.impact })
    localStorage.setItem(
      'moving-motivators:lastSession',
      JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        savedAt: Date.now(),
        ranked,
        change,
        changes,
      })
    )
    setScreen('solo-results')
  }

  const isTeamScreen = ['team-host','team-join','team-play','team-results'].includes(screen)

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <AppHeader title={t('app.title')} onTitleClick={reset}><ThemeToggle /></AppHeader>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {screen === 'home' && (
          <HomeScreen
            onSolo={() => setScreen('solo-rank')}
            onHost={() => setScreen('team-host')}
            onJoin={() => setScreen('team-join')}
            onFacilitation={() => setScreen('facilitation')}
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
