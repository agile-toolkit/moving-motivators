import { useTranslation } from 'react-i18next'
import type { MotivatorItem, MotivatorId } from '../types'
import { getMotivatorMeta } from '../data/motivators'

interface Props {
  motivators: MotivatorItem[]
  change: string
  onReset: () => void
  onInfo?: (id: MotivatorId) => void
}

function ImpactGroup({ items, label, colorClass, onInfo }: {
  items: MotivatorItem[]
  label: string
  colorClass: string
  onInfo?: (id: MotivatorId) => void
}) {
  const { t } = useTranslation()
  if (!items.length) return null
  return (
    <div>
      <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${colorClass}`}>{label}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const meta = getMotivatorMeta(item.id)
          return (
            <button
              key={item.id}
              onClick={() => onInfo?.(item.id)}
              title={onInfo ? t('common.learnMore') : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${meta.color} ${meta.textColor} border ${meta.borderColor}
                ${onInfo ? 'hover:opacity-80 transition-opacity cursor-pointer' : 'cursor-default'}`}
            >
              <span>{meta.emoji}</span>
              <span>{t(`motivators.${item.id}.name`)}</span>
              <span className="text-gray-400 font-normal">#{item.rank}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InterpretationPanel({ motivators, change, onInfo }: {
  motivators: MotivatorItem[]
  change: string
  onInfo?: (id: MotivatorId) => void
}) {
  const { t } = useTranslation()
  const sorted = [...motivators].sort((a, b) => a.rank - b.rank)
  const top3 = sorted.slice(0, 3)
  const bottom3 = sorted.slice(-3).reverse()

  const topNegativeCount = top3.filter(m => m.impact === 'negative').length
  const topPositiveCount = top3.filter(m => m.impact === 'positive').length
  const hasAnyImpact = motivators.some(m => m.impact !== 'neutral')

  let patternKey: string
  if (!change || !hasAnyImpact) {
    patternKey = 'noChangeNote'
  } else if (topNegativeCount >= 2) {
    patternKey = 'negativePattern'
  } else if (topPositiveCount >= 2) {
    patternKey = 'positivePattern'
  } else {
    patternKey = 'mixedPattern'
  }

  return (
    <div className="bg-white rounded-2xl p-5 card-shadow flex flex-col gap-5">
      {/* Top motivators */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {t('results.interpretation.topTitle')}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {top3.map(item => {
            const meta = getMotivatorMeta(item.id)
            const impactRing = item.impact === 'positive' ? 'ring-2 ring-green-400' : item.impact === 'negative' ? 'ring-2 ring-red-400' : ''
            return (
              <button
                key={item.id}
                onClick={() => onInfo?.(item.id)}
                title={onInfo ? t('common.learnMore') : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  ${meta.color} ${meta.textColor} border ${meta.borderColor} ${impactRing}
                  ${onInfo ? 'hover:opacity-80 transition-opacity' : 'cursor-default'}`}
              >
                <span>{meta.emoji}</span>
                <span>{t(`motivators.${item.id}.name`)}</span>
              </button>
            )
          })}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{t('results.interpretation.topDesc')}</p>
      </div>

      {/* Pattern insight */}
      <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed
        ${patternKey === 'negativePattern' ? 'bg-red-50 border border-red-200 text-red-700'
          : patternKey === 'positivePattern' ? 'bg-green-50 border border-green-200 text-green-700'
          : patternKey === 'noChangeNote' ? 'bg-gray-50 border border-gray-200 text-gray-500'
          : 'bg-amber-50 border border-amber-200 text-amber-700'}`}
      >
        {patternKey === 'negativePattern' && '⚠️ '}
        {patternKey === 'positivePattern' && '✅ '}
        {patternKey === 'mixedPattern' && '💡 '}
        {t(`results.interpretation.${patternKey}`)}
      </div>

      {/* Lower-ranked note */}
      {bottom3.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {t('results.interpretation.bottomTitle')}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {bottom3.map(item => {
              const meta = getMotivatorMeta(item.id)
              return (
                <button
                  key={item.id}
                  onClick={() => onInfo?.(item.id)}
                  title={onInfo ? t('common.learnMore') : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    ${meta.color} ${meta.textColor} border ${meta.borderColor} opacity-60
                    ${onInfo ? 'hover:opacity-100 transition-opacity' : 'cursor-default'}`}
                >
                  <span>{meta.emoji}</span>
                  <span>{t(`motivators.${item.id}.name`)}</span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('results.interpretation.bottomNote')}
          </p>
        </div>
      )}
    </div>
  )
}

export default function ResultsView({ motivators, change, onReset, onInfo }: Props) {
  const { t } = useTranslation()
  const sorted = [...motivators].sort((a, b) => a.rank - b.rank)
  const positives = sorted.filter(m => m.impact === 'positive')
  const negatives = sorted.filter(m => m.impact === 'negative')
  const neutrals  = sorted.filter(m => m.impact === 'neutral')

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('results.title')}</h2>
        {change && (
          <p className="text-gray-500 mt-1">
            <span className="font-medium text-gray-700">{t('results.change')}:</span> "{change}"
          </p>
        )}
      </div>

      {/* Full ranked row */}
      <div className="bg-white rounded-2xl p-4 card-shadow overflow-x-auto">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {sorted.map(item => {
            const meta = getMotivatorMeta(item.id)
            const impactBar = item.impact === 'positive' ? 'bg-green-400' : item.impact === 'negative' ? 'bg-red-400' : 'bg-gray-200'
            return (
              <button
                key={item.id}
                onClick={() => onInfo?.(item.id)}
                title={onInfo ? t('common.learnMore') : undefined}
                className={`flex flex-col items-center gap-1 w-14 ${onInfo ? 'hover:opacity-80 transition-opacity' : 'cursor-default'}`}
              >
                <div className={`w-full h-1 rounded-full ${impactBar}`} />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${meta.color} border ${meta.borderColor}`}>
                  {meta.emoji}
                </div>
                <span className={`text-[9px] font-medium text-center leading-tight ${meta.textColor}`}>
                  {t(`motivators.${item.id}.name`)}
                </span>
                <span className="text-[9px] text-gray-400">#{item.rank}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Impact groups */}
      {change && (
        <div className="bg-white rounded-2xl p-5 card-shadow flex flex-col gap-4">
          <ImpactGroup items={positives} label={t('results.positives')} colorClass="text-green-600" onInfo={onInfo} />
          <ImpactGroup items={negatives} label={t('results.negatives')} colorClass="text-red-600" onInfo={onInfo} />
          <ImpactGroup items={neutrals}  label={t('results.neutral')}   colorClass="text-gray-400" onInfo={onInfo} />
        </div>
      )}

      {/* Interpretation */}
      <InterpretationPanel motivators={motivators} change={change} onInfo={onInfo} />

      <button onClick={onReset} className="self-start px-6 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        ↩ {t('results.startOver')}
      </button>
    </div>
  )
}
