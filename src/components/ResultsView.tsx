import { useTranslation } from 'react-i18next'
import type { MotivatorItem } from '../types'
import { getMotivatorMeta } from '../data/motivators'

interface Props {
  motivators: MotivatorItem[]
  change: string
  onReset: () => void
}

function ImpactGroup({ items, label, colorClass }: { items: MotivatorItem[], label: string, colorClass: string }) {
  const { t } = useTranslation()
  if (!items.length) return null
  return (
    <div>
      <h3 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${colorClass}`}>{label}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const meta = getMotivatorMeta(item.id)
          return (
            <div key={item.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${meta.color} ${meta.textColor} border ${meta.borderColor}`}>
              <span>{meta.emoji}</span>
              <span>{t(`motivators.${item.id}.name`)}</span>
              <span className="text-gray-400 font-normal">#{item.rank}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ResultsView({ motivators, change, onReset }: Props) {
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
              <div key={item.id} className="flex flex-col items-center gap-1 w-14">
                <div className={`w-full h-1 rounded-full ${impactBar}`} />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${meta.color} border ${meta.borderColor}`}>
                  {meta.emoji}
                </div>
                <span className={`text-[9px] font-medium text-center leading-tight ${meta.textColor}`}>
                  {t(`motivators.${item.id}.name`)}
                </span>
                <span className="text-[9px] text-gray-400">#{item.rank}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Impact groups */}
      {change && (
        <div className="bg-white rounded-2xl p-5 card-shadow flex flex-col gap-4">
          <ImpactGroup items={positives} label={t('results.positives')} colorClass="text-green-600" />
          <ImpactGroup items={negatives} label={t('results.negatives')} colorClass="text-red-600" />
          <ImpactGroup items={neutrals}  label={t('results.neutral')}   colorClass="text-gray-400" />
          {negatives.some(n => n.rank <= 3) && (
            <div className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              💡 {t('results.insight')}
            </div>
          )}
        </div>
      )}

      <button onClick={onReset} className="self-start px-6 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        ↩ {t('results.startOver')}
      </button>
    </div>
  )
}
