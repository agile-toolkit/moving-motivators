import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MotivatorItem, ImpactLevel, MotivatorId } from '../types'
import MotivatorCard from './MotivatorCard'

interface Props {
  motivators: MotivatorItem[]
  change: string
  onChangeText: (val: string) => void
  onMotivatorChange: (items: MotivatorItem[]) => void
  onNext: () => void
  onBack: () => void
  onInfo?: (id: MotivatorId) => void
}

export default function ChangeAssessment({ motivators, change, onChangeText, onMotivatorChange, onNext, onBack, onInfo }: Props) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'describe' | 'assess'>(change ? 'assess' : 'describe')

  const handleImpact = (id: MotivatorItem['id'], impact: ImpactLevel) => {
    onMotivatorChange(motivators.map(m => m.id === id ? { ...m, impact } : m))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('assess.title')}</h2>
        <p className="text-gray-500 mt-1">
          {phase === 'describe' ? t('assess.instruction') : t('assess.impactInstruction')}
        </p>
      </div>

      {phase === 'describe' ? (
        <div className="flex flex-col gap-4">
          <textarea
            value={change}
            onChange={e => onChangeText(e.target.value)}
            placeholder={t('assess.placeholder')}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          />
          <div className="flex gap-3 justify-end">
            <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
              ← {t('common.back')}
            </button>
            <button
              onClick={() => { if (change.trim()) setPhase('assess') }}
              disabled={!change.trim()}
              className="px-6 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t('rank.next')} →
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-sm text-brand-700">
            <span className="font-medium">"{change}"</span>
            <button onClick={() => setPhase('describe')} className="ml-2 text-brand-400 hover:text-brand-600 text-xs underline">
              edit
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 card-shadow overflow-x-auto">
            <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
              {motivators.map(item => (
                <div key={item.id} className="flex flex-col items-center gap-1">
                  <MotivatorCard item={item} showRank showImpact onImpact={handleImpact} />
                  {onInfo && (
                    <button
                      onClick={() => onInfo(item.id)}
                      title={t('common.learnMore')}
                      className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors leading-none py-0.5"
                    >
                      ⓘ
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setPhase('describe')} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
              ← {t('common.back')}
            </button>
            <button onClick={onNext} className="px-6 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
              {t('assess.seeResults')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
