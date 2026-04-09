import { useTranslation } from 'react-i18next'
import { getMotivatorMeta } from '../data/motivators'
import type { MotivatorItem, ImpactLevel } from '../types'

interface Props {
  item: MotivatorItem
  showRank?: boolean
  showImpact?: boolean
  onImpact?: (id: MotivatorItem['id'], impact: ImpactLevel) => void
  isDragging?: boolean
}

const impactIcon: Record<ImpactLevel, string> = {
  positive: '↑',
  negative: '↓',
  neutral: '–',
}
const impactBg: Record<ImpactLevel, string> = {
  positive: 'bg-green-100 text-green-700',
  negative: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-500',
}

export default function MotivatorCard({ item, showRank, showImpact, onImpact, isDragging }: Props) {
  const { t } = useTranslation()
  const meta = getMotivatorMeta(item.id)

  return (
    <div
      className={`flex flex-col bg-white rounded-xl border-l-4 ${meta.borderColor} card-shadow select-none
        ${isDragging ? 'opacity-50 card-shadow-lg rotate-2' : ''}
        ${showImpact && item.impact !== 'neutral'
          ? item.impact === 'positive' ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400'
          : ''}
        w-28 min-w-[7rem] transition-all`}
    >
      {/* Emoji + rank */}
      <div className="flex items-center justify-between px-2 pt-2">
        {showRank && (
          <span className={`text-xs font-bold ${meta.textColor}`}>#{item.rank}</span>
        )}
        <span className={`text-xl ${showRank ? '' : 'ml-auto'}`}>{meta.emoji}</span>
      </div>

      {/* Name + descriptor — always a div, always same height */}
      <div className="px-2 pb-2 flex-1 flex flex-col gap-0.5">
        <p className={`text-xs font-semibold ${meta.textColor} leading-tight`}>
          {t(`motivators.${item.id}.name`)}
        </p>
        <p className="text-[10px] text-gray-400 leading-tight line-clamp-2">
          {t(`motivators.${item.id}.desc`)}
        </p>
      </div>

      {/* Impact controls */}
      {showImpact && onImpact && (
        <div className="flex border-t border-gray-100">
          {(['positive', 'neutral', 'negative'] as ImpactLevel[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => onImpact(item.id, lvl)}
              title={t(`assess.${lvl}`)}
              className={`flex-1 py-1 text-xs font-bold transition-colors
                ${item.impact === lvl ? impactBg[lvl] : 'text-gray-300 hover:text-gray-500'}`}
            >
              {impactIcon[lvl]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
