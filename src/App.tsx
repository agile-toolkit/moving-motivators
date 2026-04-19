import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, MotivatorItem, MotivatorId } from './types'
import { defaultMotivatorItems } from './data/motivators'
import HomeScreen from './components/HomeScreen'
import RankingBoard from './components/RankingBoard'
import ChangeAssessment from './components/ChangeAssessment'
import ResultsView from './components/ResultsView'
import TeamSession from './components/TeamSession'
import MotivatorInfo from './components/MotivatorInfo'
import FacilitationGuide from './components/FacilitationGuide'

function App() {
  const { t, i18n } = useTranslation()
  const [screen, setScreen] = useState<Screen>('home')
  const [motivators, setMotivators] = useState<MotivatorItem[]>(defaultMotivatorItems())
  const [change, setChange] = useState('')
  const [infoMotivator, setInfoMotivator] = useState<MotivatorId | null>(null)

  const reset = () => {
    setMotivators(defaultMotivatorItems())
    setChange('')
    setScreen('home')
  }

  const isTeamScreen = ['team-host','team-join','team-play','team-results'].includes(screen)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={reset} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            {t('app.title')}
          </button>
          <button
            onClick={() => i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            {i18n.language.startsWith('ru') ? 'EN' : 'RU'}
          </button>
        </div>
      </header>

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
            onSkip={() => setScreen('solo-results')}
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
            onNext={() => setScreen('solo-results')}
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
