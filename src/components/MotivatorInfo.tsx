import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getMotivatorMeta } from '../data/motivators'
import type { MotivatorId } from '../types'

interface Props {
  id: MotivatorId
  onClose: () => void
}

export default function MotivatorInfo({ id, onClose }: Props) {
  const { t } = useTranslation()
  const meta = getMotivatorMeta(id)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — slides in from right on md+, up from bottom on mobile */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t(`motivators.${id}.name`)}
        className="fixed z-50 bg-white dark:bg-gray-900 shadow-2xl flex flex-col
          bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]
          md:inset-y-0 md:right-0 md:left-auto md:rounded-none md:rounded-l-2xl md:w-96 md:max-h-full"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b border-gray-100 ${meta.color} rounded-t-2xl md:rounded-tl-2xl md:rounded-tr-none`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest ${meta.textColor} opacity-70`}>
                {t('app.subtitle')}
              </p>
              <h2 className={`text-xl font-bold ${meta.textColor}`}>
                {t(`motivators.${id}.name`)}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className={`rounded-full w-8 h-8 flex items-center justify-center ${meta.textColor} hover:bg-black/10 transition-colors text-lg font-bold`}
          >
            ×
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">

          {/* About */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">About</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(`motivators.${id}.detail`)}
            </p>
          </section>

          {/* How it shows */}
          <section className={`rounded-xl px-4 py-4 ${meta.color} border ${meta.borderColor}`}>
            <h3 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${meta.textColor}`}>
              How it shows up
            </h3>
            <p className={`text-sm leading-relaxed ${meta.textColor}`}>
              {t(`motivators.${id}.example`)}
            </p>
          </section>

          {/* Reflection */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
              Reflect
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-gray-200 dark:border-gray-700 pl-4">
              {t(`motivators.${id}.reflection`)}
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <a
            href="https://management30.com/practice/moving-motivators/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs ${meta.textColor} hover:underline`}
          >
            Management 3.0 — Moving Motivators ↗
          </a>
        </div>
      </div>
    </>
  )
}
