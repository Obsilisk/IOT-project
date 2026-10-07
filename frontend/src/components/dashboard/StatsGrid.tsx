import { Activity, Droplets, Power, Repeat } from 'lucide-react'
import { MetricCard } from '../ui/MetricCard'
import type { SoilStatus } from '../../types/irrigation'
import { formatLiters, percent } from '../../utils/format'
import { getStatusLabel } from '../../utils/status'

interface StatsGridProps {
  moisture: number
  soilStatus: SoilStatus
  pumpOn: boolean
  waterTodayLiters: number
  cycleCount: number
}

export function StatsGrid({
  moisture,
  soilStatus,
  pumpOn,
  waterTodayLiters,
  cycleCount,
}: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Soil Moisture"
        value={percent(moisture)}
        detail={getStatusLabel(soilStatus)}
        icon={Droplets}
        tone={soilStatus === 'DRY' ? 'amber' : soilStatus === 'WET' ? 'blue' : 'green'}
      />
      <MetricCard
        label="Pump Status"
        value={pumpOn ? 'ON' : 'OFF'}
        detail={pumpOn ? 'Watering active' : 'Standby'}
        icon={Power}
        tone={pumpOn ? 'blue' : 'slate'}
      />
      <MetricCard
        label="Water Usage"
        value={formatLiters(waterTodayLiters)}
        detail="Today"
        icon={Activity}
        tone="blue"
      />
      <MetricCard
        label="Irrigation Cycles"
        value={`${cycleCount}`}
        detail="Today"
        icon={Repeat}
        tone="green"
      />
    </div>
  )
}
