import { Gauge } from 'lucide-react'
import { Card } from '../ui/Card'
import type { SoilStatus } from '../../types/irrigation'
import { percent } from '../../utils/format'
import { getGaugeColor, getStatusLabel } from '../../utils/status'

interface MoistureGaugeProps {
  moisture: number
  soilStatus: SoilStatus
  threshold: number
}

export function MoistureGauge({ moisture, soilStatus, threshold }: MoistureGaugeProps) {
  const radius = 78
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (moisture / 100) * circumference
  const color = getGaugeColor(soilStatus)

  return (
    <Card title="Soil Moisture" icon={<Gauge className="h-5 w-5" />}>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="relative mx-auto h-56 w-56">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="18"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeWidth="18"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-semibold text-white">{percent(moisture)}</p>
            <p className="mt-2 text-sm font-semibold uppercase text-slate-400">
              {getStatusLabel(soilStatus)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Dry threshold</p>
            <p className="mt-2 text-3xl font-semibold text-white">{percent(threshold)}</p>
            <p className="mt-2 text-sm text-slate-500">
              Pump starts automatically below this value in AUTO mode.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-amber-200">
              <p className="font-semibold">Dry</p>
              <p className="mt-1 text-xs text-amber-100/70">0-{threshold - 1}%</p>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-200">
              <p className="font-semibold">Optimal</p>
              <p className="mt-1 text-xs text-emerald-100/70">{threshold}-69%</p>
            </div>
            <div className="rounded-lg border border-sky-400/20 bg-sky-400/10 p-3 text-sky-200">
              <p className="font-semibold">Wet</p>
              <p className="mt-1 text-xs text-sky-100/70">70-100%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
