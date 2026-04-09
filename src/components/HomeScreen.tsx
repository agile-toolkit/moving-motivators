import { useTranslation } from 'react-i18next'
import { isFirebaseConfigured } from '../firebase'

interface Props {
  onSolo: () => void
  onHost: () => void
  onJoin: () => void
}

export default function HomeScreen({ onSolo, onHost, onJoin }: Props) {
  const { t } = useTranslation()
  const firebaseReady = isFirebaseConfigured()

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
    </div>
  )
}
