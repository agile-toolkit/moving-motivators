import { useTranslation } from 'react-i18next'

interface Props {
  onBack: () => void
}

export default function FacilitationGuide({ onBack }: Props) {
  const { t } = useTranslation()
  const steps = t('facilitation.steps', { returnObjects: true }) as { label: string; text: string }[]

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('facilitation.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('facilitation.intro')}</p>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ✕ {t('common.back')}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 card-shadow flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center">
              {i + 1}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{step.label}</span>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm text-amber-800 leading-relaxed">
          <span className="font-semibold">💡 </span>
          {t('facilitation.tip')}
        </p>
      </div>

      <button
        onClick={onBack}
        className="self-start px-6 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
      >
        ↩ {t('common.back')}
      </button>
    </div>
  )
}
