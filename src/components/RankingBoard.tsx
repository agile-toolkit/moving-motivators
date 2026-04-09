import { useTranslation } from 'react-i18next'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable,
  horizontalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { MotivatorItem, MotivatorId } from '../types'
import MotivatorCard from './MotivatorCard'

interface Props {
  motivators: MotivatorItem[]
  onChange: (items: MotivatorItem[]) => void
  onNext: () => void
  onSkip: () => void
  onBack: () => void
  onInfo?: (id: MotivatorId) => void
}

function SortableCard({ item }: { item: MotivatorItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="touch-none cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <MotivatorCard item={item} showRank isDragging={isDragging} />
    </div>
  )
}

export default function RankingBoard({ motivators, onChange, onNext, onSkip, onBack, onInfo }: Props) {
  const { t } = useTranslation()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = motivators.findIndex(m => m.id === active.id)
    const newIndex = motivators.findIndex(m => m.id === over.id)
    const reordered = arrayMove(motivators, oldIndex, newIndex)
      .map((m, i) => ({ ...m, rank: i + 1 }))
    onChange(reordered)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('rank.title')}</h2>
        <p className="text-gray-500 mt-1">{t('rank.instruction')}</p>
      </div>

      <div className="bg-white rounded-2xl p-4 card-shadow overflow-x-auto">
        <div className="flex items-start gap-1 pb-1" style={{ minWidth: 'max-content' }}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={motivators.map(m => m.id)} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-2">
                {motivators.map(item => (
                  // Column: [draggable card] above [info button] — info is outside dnd, no conflict
                  <div key={item.id} className="flex flex-col items-center gap-1">
                    <SortableCard item={item} />
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
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onBack} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← {t('common.back')}
        </button>
        <div className="flex-1" />
        <button onClick={onSkip} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          {t('rank.skip')}
        </button>
        <button onClick={onNext} className="px-6 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
          {t('rank.next')}
        </button>
      </div>
    </div>
  )
}
