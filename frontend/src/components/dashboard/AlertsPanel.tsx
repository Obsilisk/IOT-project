import { Bell, X } from 'lucide-react'
import { Card } from '../ui/Card'
import type { AlertItem } from '../../types/irrigation'
import { cn } from '../../utils/cn'

interface AlertsPanelProps {
  alerts: AlertItem[]
  onClear: (id: string) => void
}

const alertClasses = {
  info: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
}

export function AlertsPanel({ alerts, onClear }: AlertsPanelProps) {
  return (
    <Card title="Alerts" icon={<Bell className="h-5 w-5" />}>
      {alerts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
          No active alerts.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'flex items-start justify-between gap-3 rounded-lg border p-3',
                alertClasses[alert.type],
              )}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">{alert.message}</p>
                <p className="mt-1 text-xs opacity-70">{alert.time}</p>
              </div>
              <button
                type="button"
                onClick={() => onClear(alert.id)}
                aria-label="Clear alert"
                title="Clear alert"
                className="rounded-md p-1 text-current opacity-70 transition hover:bg-white/10 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
