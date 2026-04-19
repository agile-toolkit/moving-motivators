import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isFirebaseConfigured } from '../firebase'

interface Props {
  onSolo: () => void
  onHost: () => void
  onJoin: () => void
}

const ABOUT_DISMISSED_KEY = 'mm_about_dismissed'

export default function HomeScreen({ onSolo, onHost, onJoin }: Props) {
  const { t } = useTranslation()
  const firebaseReady = isFirebaseConfigured()
  const [aboutOpen, setAboutOpen] = useState(
    () => localStorage.getItem(ABOUT_DISMISSED_KEY) !== '1'
  )

  const dismissAbout = () => {
    localStorage.setItem(ABOUT_DISMISSED_KEY, '1')
    setAboutOpen(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('app.title')}</h1>
        <p className="text-lg text-gray-500">{t('app.tagline')}</p>
        <p className="text-sm text-brand-500 mt-1">{t('app.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Solo */}
        <button
          onClick={onSolo}
          className="group flex flex-col items-start gap-2 p-6 bg-white rounded-2xl card-shadow hover:card-shadow-lg transition-all border-2 border-transparent hover:border-brand-500"
        >
          <span className="text-3xl">🧭</span>
          <span className="font-semibold text-gray-900 text-lg">{t('home.solo')}</span>
          <span className="text-sm text-gray-500">{t('home.soloDesc')}</span>
        </button>

        {/* Team */}
        <div className="flex flex-col gap-2">
          <button
            onClick={firebaseReady ? onHost : undefined}
            disabled={!firebaseReady}
            className="flex flex-col items-start gap-1 p-4 bg-white rounded-2xl card-shadow border-2 border-transparent enabled:hover:border-brand-500 enabled:hover:card-shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="font-semibold text-gray-900">{t('home.host')}</span>
            <span className="text-sm text-gray-500">{t('home.teamDesc')}</span>
          </button>
          <button
            onClick={firebaseReady ? onJoin : undefined}
            disabled={!firebaseReady}
            className="flex flex-col items-start gap-1 p-4 bg-white rounded-2xl card-shadow border-2 border-transparent enabled:hover:border-brand-500 enabled:hover:card-shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="font-semibold text-gray-900">{t('home.join')}</span>
          </button>
          {!firebaseReady && (
            <p className="text-xs text-gray-400 px-1">{t('home.teamUnavailable')}</p>
          )}
        </div>
      </div>

      {/* About panel */}
      <div className="w-full max-w-lg">
        <button
          onClick={() => setAboutOpen(v => !v)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-2"
        >
          <span className={`transition-transform ${aboutOpen ? 'rotate-90' : ''}`}>▶</span>
          {t('home.about.toggle')}
        </button>

        {aboutOpen && (
          <div className="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-4 text-sm text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2">{t('home.about.title')}</h2>
              <p>{t('home.about.body')}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{t('home.about.howTitle')}</h3>
              <p>{t('home.about.how')}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{t('home.about.usesTitle')}</h3>
              <p>{t('home.about.uses')}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <a
                href="https://management30.com/practice/moving-motivators/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-500 hover:underline"
              >
                Management 3.0 — Moving Motivators ↗
              </a>
              <button
                onClick={dismissAbout}
                className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t('home.about.dismiss')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
