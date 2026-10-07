import { History } from 'lucide-react'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'
import type { IrrigationHistoryItem } from '../../types/irrigation'
import { formatDuration, percent } from '../../utils/format'
import { getStatusClasses, getStatusLabel } from '../../utils/status'
import { cn } from '../../utils/cn'

interface HistoryTableProps {
  items: IrrigationHistoryItem[]
  limit?: number
  showViewAll?: boolean
  onViewAll?: () => void
}

export function HistoryTable({ items, limit, showViewAll = false, onViewAll }: HistoryTableProps) {
  const visibleItems = limit ? items.slice(0, limit) : items

  return (
    <Card
      title="Irrigation History"
      icon={<History className="h-5 w-5" />}
      action={
        showViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            View All
          </button>
        ) : null
      }
    >
      {visibleItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
          No irrigation records yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="py-3 pr-4 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Moisture</th>
                <th className="px-4 py-3 font-semibold">Soil Status</th>
                <th className="px-4 py-3 font-semibold">Pump</th>
                <th className="py-3 pl-4 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {visibleItems.map((item) => (
                <tr key={item.id} className="text-slate-300">
                  <td className="whitespace-nowrap py-3 pr-4 text-slate-400">{item.time}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold">
                    {percent(item.moisture)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-md border px-2 py-1 text-xs font-semibold',
                        getStatusClasses(item.soilStatus),
                      )}
                    >
                      {getStatusLabel(item.soilStatus)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge tone={item.pumpOn ? 'blue' : 'slate'}>
                      {item.pumpOn ? 'ON' : 'OFF'}
                    </StatusBadge>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-4 text-slate-400">
                    {formatDuration(item.durationSeconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
