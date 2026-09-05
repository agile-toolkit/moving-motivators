import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MotivatorItem, MotivatorId, SessionEntry } from '../types'
import { getMotivatorMeta, MOTIVATORS } from '../data/motivators'
import {
  CloseIcon,
  WarningIcon,
  CheckCircleIcon,
  TipIcon,
  ChartIcon,
  UploadIcon,
  DownloadIcon,
  UndoIcon,
  ClipboardIcon,
  PrintIcon,
  LinkIcon,
  PersonIcon,
  TagIcon,
} from './icons'

interface Props {
  motivators: MotivatorItem[]
  change: string
  onReset: () => void
  onInfo?: (id: MotivatorId) => void
  onRestore: (entry: SessionEntry) => void
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
              <span className="text-gray-400 dark:text-gray-600 font-normal">#{item.rank}</span>
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 card-shadow flex flex-col gap-5">
      {/* Top motivators */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">
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
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t('results.interpretation.topDesc')}</p>
      </div>

      {/* Pattern insight */}
      <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed flex items-start gap-1.5
        ${patternKey === 'negativePattern' ? 'bg-red-50 border border-red-200 text-red-700'
          : patternKey === 'positivePattern' ? 'bg-green-50 border border-green-200 text-green-700'
          : patternKey === 'noChangeNote' ? 'bg-gray-50 border border-gray-200 text-gray-500'
          : 'bg-amber-50 border border-amber-200 text-amber-700'}`}
      >
        {patternKey === 'negativePattern' && <WarningIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
        {patternKey === 'positivePattern' && <CheckCircleIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
        {patternKey === 'mixedPattern' && <TipIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
        <span>{t(`results.interpretation.${patternKey}`)}</span>
      </div>

      {/* Lower-ranked note */}
      {bottom3.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">
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
          <p className="text-xs text-gray-400 dark:text-gray-600 leading-relaxed">
            {t('results.interpretation.bottomNote')}
          </p>
        </div>
      )}
    </div>
  )
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const TREND_SESSION_COUNT = 6

function RankTrendTable({ history }: { history: SessionEntry[] }) {
  const { t } = useTranslation()
  const [trendOpen, setTrendOpen] = useState(false)
  const sessions = history.slice(0, TREND_SESSION_COUNT)

  function rankClass(rank: number) {
    if (rank <= 3) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
    if (rank >= 8) return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
    return 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  }

  return (
    <div>
      <button
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
        onClick={() => setTrendOpen(o => !o)}
        aria-expanded={trendOpen}
      >
        <span>{trendOpen ? '▲' : '▼'}</span>
        {trendOpen ? t('results.trendHide') : t('results.trendShow')}
      </button>

      {trendOpen && (
        <div className="overflow-x-auto mt-2">
          <table className="text-[10px] border-collapse" style={{ minWidth: 'max-content' }}>
            <thead>
              <tr>
                <th className="text-left font-medium text-gray-400 dark:text-gray-600 pr-3 pb-1">
                  {t('results.trendView')}
                </th>
                {sessions.map(entry => (
                  <th key={entry.savedAt} className="font-medium text-gray-400 dark:text-gray-600 px-1 pb-1 text-center w-10 truncate">
                    {entry.label || entry.date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOTIVATORS.map(meta => (
                <tr key={meta.id}>
                  <td className={`pr-3 py-0.5 whitespace-nowrap ${meta.textColor}`}>
                    {meta.emoji} {t(`motivators.${meta.id}.name`)}
                  </td>
                  {sessions.map(entry => {
                    const rank = entry.ranked.indexOf(meta.id) + 1
                    return (
                      <td key={entry.savedAt} className="px-1 py-0.5 text-center">
                        {rank > 0 && (
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded ${rankClass(rank)}`}>
                            {rank}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function isValidSessionEntry(v: unknown): v is SessionEntry {
  if (!v || typeof v !== 'object') return false
  const e = v as Record<string, unknown>
  return typeof e.date === 'string' && typeof e.savedAt === 'number' && Array.isArray(e.ranked)
}

function SessionShiftPanel({ current, history, onRestore, onImport }: {
  current: MotivatorItem[]
  history: SessionEntry[]
  onRestore: (entry: SessionEntry) => void
  onImport: (entries: SessionEntry[]) => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as unknown[]
        if (!Array.isArray(parsed)) return
        const valid = parsed.filter(isValidSessionEntry) as SessionEntry[]
        if (valid.length > 0) onImport(valid)
      } catch { /* ignore malformed JSON */ }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  if (history.length < 2) return null

  const previous = history[1]
  const prevRankMap: Record<string, number> = {}
  previous.ranked.forEach((id, i) => { prevRankMap[id] = i + 1 })

  const currentSorted = [...current].sort((a, b) => a.rank - b.rank)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl card-shadow overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <ChartIcon className="w-3.5 h-3.5" /> {t('results.shift')}
        </span>
        <span className="text-gray-400 dark:text-gray-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          {/* Previous session row */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-2">
              {t('results.history')} · {previous.label || previous.date}
              {previous.change && <span className="ml-1 italic">"{previous.change}"</span>}
            </p>
            <div className="overflow-x-auto">
              <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
                {previous.ranked.map((id, i) => {
                  const meta = getMotivatorMeta(id)
                  return (
                    <div key={id} className="flex flex-col items-center gap-1 w-14">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${meta.color} border ${meta.borderColor} opacity-50`}>
                        {meta.emoji}
                      </div>
                      <span className={`text-[9px] font-medium text-center leading-tight ${meta.textColor} opacity-50`}>
                        {t(`motivators.${id}.name`)}
                      </span>
                      <span className="text-[9px] text-gray-300 dark:text-gray-700">#{i + 1}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Current session row with delta arrows */}
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-2">
              {currentSorted[0] && history[0]?.label || history[0]?.date}
            </p>
            <div className="overflow-x-auto">
              <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
                {currentSorted.map(item => {
                  const meta = getMotivatorMeta(item.id)
                  const prevRank = prevRankMap[item.id]
                  const delta = prevRank != null ? item.rank - prevRank : 0
                  const significant = Math.abs(delta) >= 3
                  const deltaEl = delta === 0
                    ? <span className="text-[9px] text-gray-300 dark:text-gray-700 h-3 flex items-center">—</span>
                    : delta > 0
                      ? <span className={`text-[9px] font-bold h-3 flex items-center ${significant ? 'text-green-600 dark:text-green-400' : 'text-green-400 dark:text-green-600'}`}>↑{delta}</span>
                      : <span className={`text-[9px] font-bold h-3 flex items-center ${significant ? 'text-red-600 dark:text-red-400' : 'text-red-400 dark:text-red-600'}`}>↓{Math.abs(delta)}</span>

                  return (
                    <div key={item.id} className="flex flex-col items-center gap-1 w-14">
                      {deltaEl}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${meta.color} border ${meta.borderColor}`}>
                        {meta.emoji}
                      </div>
                      <span className={`text-[9px] font-medium text-center leading-tight ${meta.textColor}`}>
                        {t(`motivators.${item.id}.name`)}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-gray-600">#{item.rank}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Multi-session rank trend */}
          <RankTrendTable history={history} />

          {/* History list with restore */}
          <hr className="border-gray-100 dark:border-gray-800" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide">
                {t('results.sessionHistory')}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => importRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  <UploadIcon className="w-3 h-3" /> {t('results.importHistory')}
                </button>
                <button
                  onClick={() => downloadJson('moving-motivators-solo-history.json', history)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  <DownloadIcon className="w-3 h-3" /> {t('results.exportHistory')}
                </button>
              </div>
              <input
                ref={importRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>
            {history.slice(1).map(entry => (
              <div
                key={entry.savedAt}
                className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {entry.label || entry.date}
                  </span>
                  {entry.label && (
                    <span className="text-xs text-gray-400 dark:text-gray-600">{entry.date}</span>
                  )}
                  {entry.change && (
                    <span className="text-xs text-gray-400 dark:text-gray-600 truncate italic">
                      "{entry.change}"
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onRestore(entry)}
                  className="shrink-0 px-3 py-1 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
                >
                  {t('results.restore')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CoachingTipsPanel({ motivators }: { motivators: MotivatorItem[] }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const top3 = [...motivators].sort((a, b) => a.rank - b.rank).slice(0, 3)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl card-shadow overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <TipIcon className="w-3.5 h-3.5" /> {t('results.coachingTips.title')}
        </span>
        <span className="text-gray-400 dark:text-gray-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
          {top3.map(item => {
            const meta = getMotivatorMeta(item.id)
            const templateKey = item.impact === 'positive' ? 'positiveTip' : item.impact === 'negative' ? 'negativeTip' : 'neutralTip'
            const tip = t(`results.coachingTips.${templateKey}`, {
              name: t(`motivators.${item.id}.name`),
              reflection: t(`motivators.${item.id}.reflection`),
            })
            return (
              <div key={item.id} className="flex items-start gap-2.5">
                <span className="text-lg leading-none flex-shrink-0" aria-hidden="true">{meta.emoji}</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const CHANGE_PLANNER_URL = 'https://agile-toolkit.github.io/change-planner/'
const WORK_PROFILES_URL = 'https://agile-toolkit.github.io/work-profiles/'

function buildWorkProfilesSnapshot(motivators: MotivatorItem[]): string {
  const sorted = [...motivators].sort((a, b) => a.rank - b.rank)
  const snapshot = {
    date: new Date().toISOString().slice(0, 10),
    ranked: sorted.map(m => m.id),
    topMotivators: sorted.slice(0, 3).map(m => m.id) as [string, string, string],
  }
  localStorage.setItem('work-profiles:motivatorSnapshot', JSON.stringify(snapshot))
  return btoa(encodeURIComponent(JSON.stringify(snapshot)))
}

function buildMmSnapshot(motivators: MotivatorItem[], change: string): string {
  const sorted = [...motivators].sort((a, b) => a.rank - b.rank)
  const snapshot = {
    ranked: sorted.map(m => m.id),
    changes: Object.fromEntries(motivators.map(m => [m.id, m.impact])),
    change,
    date: new Date().toISOString().slice(0, 10),
  }
  return btoa(encodeURIComponent(JSON.stringify(snapshot)))
}

export default function ResultsView({ motivators, change, onReset, onInfo, onRestore }: Props) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [copying, setCopying] = useState(false)
  const [history, setHistory] = useState<SessionEntry[]>(() =>
    JSON.parse(localStorage.getItem('moving-motivators:sessionHistory') || '[]')
  )
  const [saveAsEditing, setSaveAsEditing] = useState(false)
  const [saveAsValue, setSaveAsValue] = useState('')

  const sorted = [...motivators].sort((a, b) => a.rank - b.rank)
  const currentLabel = history[0]?.label

  async function handleShare() {
    if (!containerRef.current || copying) return
    setCopying(true)
    try {
      // Loaded on demand: html2canvas is ~200 kB and only the "save as image"
      // button needs it, so it stays out of the entry chunk.
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(containerRef.current, { useCORS: true, backgroundColor: '#f9fafb' })
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (blob && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      } else {
        const link = document.createElement('a')
        link.download = 'moving-motivators.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
    } finally {
      setCopying(false)
    }
  }

  function handleExportToChangePlanner() {
    const snapshot = buildMmSnapshot(motivators, change)
    window.open(`${CHANGE_PLANNER_URL}?mm_snapshot=${snapshot}`, '_blank', 'noopener')
  }

  function handleExportToWorkProfiles() {
    const snapshot = buildWorkProfilesSnapshot(motivators)
    window.open(`${WORK_PROFILES_URL}?motivators=${snapshot}`, '_blank', 'noopener')
  }

  function handleImportSoloHistory(incoming: SessionEntry[]) {
    const existing: SessionEntry[] = JSON.parse(localStorage.getItem('moving-motivators:sessionHistory') || '[]')
    const seen = new Set(existing.map(e => e.savedAt))
    const merged = [...existing, ...incoming.filter(e => !seen.has(e.savedAt))]
      .sort((a, b) => b.savedAt - a.savedAt)
      .slice(0, 20)
    localStorage.setItem('moving-motivators:sessionHistory', JSON.stringify(merged))
    setHistory(merged)
  }

  function commitSaveAs() {
    const label = saveAsValue.trim()
    if (!label) return
    const updated = history.length > 0
      ? [{ ...history[0], label }, ...history.slice(1)]
      : history
    setHistory(updated)
    localStorage.setItem('moving-motivators:sessionHistory', JSON.stringify(updated))
    setSaveAsEditing(false)
    setSaveAsValue('')
  }

  const positives = sorted.filter(m => m.impact === 'positive')
  const negatives = sorted.filter(m => m.impact === 'negative')
  const neutrals  = sorted.filter(m => m.impact === 'neutral')

  return (
    <div ref={containerRef} className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('results.title')}</h2>
        {change && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-medium text-gray-700 dark:text-gray-200">{t('results.change')}:</span> "{change}"
          </p>
        )}
      </div>

      {/* Full ranked row */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 card-shadow overflow-x-auto">
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
                <span className="text-[9px] text-gray-400 dark:text-gray-600">#{item.rank}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Impact groups */}
      {change && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 card-shadow flex flex-col gap-4">
          <ImpactGroup items={positives} label={t('results.positives')} colorClass="text-green-600" onInfo={onInfo} />
          <ImpactGroup items={negatives} label={t('results.negatives')} colorClass="text-red-600" onInfo={onInfo} />
          <ImpactGroup items={neutrals}  label={t('results.neutral')}   colorClass="text-gray-400" onInfo={onInfo} />
        </div>
      )}

      {/* Interpretation */}
      <InterpretationPanel motivators={motivators} change={change} onInfo={onInfo} />

      {/* Coaching tips (collapsed by default) */}
      <CoachingTipsPanel motivators={motivators} />

      {/* Session shift panel */}
      <SessionShiftPanel current={motivators} history={history} onRestore={onRestore} onImport={handleImportSoloHistory} />

      {/* Insight hint */}
      {change && negatives.length > 0 && (
        <p className="inline-flex items-start gap-1.5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-1">
          <TipIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {t('results.insight')}
        </p>
      )}

      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex flex-wrap gap-3">
          <button onClick={onReset} className="inline-flex items-center gap-1 px-6 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors">
            <UndoIcon className="w-3.5 h-3.5" /> {t('results.startOver')}
          </button>
          <button
            onClick={handleShare}
            disabled={copying}
            className="inline-flex items-center gap-1 px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {copying ? '…' : <><ClipboardIcon className="w-3.5 h-3.5" /> {t('results.share')}</>}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 px-6 py-2 text-sm font-medium bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PrintIcon className="w-3.5 h-3.5" /> {t('results.print')}
          </button>
          <button
            onClick={handleExportToChangePlanner}
            className="inline-flex items-center gap-1 px-6 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" /> {t('results.exportToChangePlanner')}
          </button>
          <button
            onClick={handleExportToWorkProfiles}
            className="inline-flex items-center gap-1 px-6 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <PersonIcon className="w-3.5 h-3.5" /> {t('results.exportToWorkProfiles')}
          </button>
          {currentLabel ? (
            <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5" /> {currentLabel}
            </span>
          ) : !saveAsEditing ? (
            <button
              onClick={() => setSaveAsEditing(true)}
              className="inline-flex items-center gap-1 px-6 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors"
            >
              <TagIcon className="w-3.5 h-3.5" /> {t('results.saveAs')}
            </button>
          ) : null}
        </div>

        {saveAsEditing && (
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="text"
              value={saveAsValue}
              onChange={e => setSaveAsValue(e.target.value)}
              placeholder={t('results.saveAsPlaceholder')}
              autoFocus
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
              onKeyDown={e => {
                if (e.key === 'Enter') commitSaveAs()
                if (e.key === 'Escape') { setSaveAsEditing(false); setSaveAsValue('') }
              }}
            />
            <button
              onClick={commitSaveAs}
              disabled={!saveAsValue.trim()}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {t('results.saveAsSave')}
            </button>
            <button
              onClick={() => { setSaveAsEditing(false); setSaveAsValue('') }}
              className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
