import { StatsGrid } from '../components/dashboard/StatsGrid'
import { HistoryTable } from '../components/dashboard/HistoryTable'
import { WaterUsageCard } from '../components/dashboard/WaterUsageCard'
import type { SmartIrrigationController } from '../hooks/useSmartIrrigation'

interface HistoryPageProps {
  irrigation: SmartIrrigationController
}

export function HistoryPage({ irrigation }: HistoryPageProps) {
  return (
    <div className="space-y-5">
      <StatsGrid
        moisture={irrigation.moisture}
        soilStatus={irrigation.soilStatus}
        pumpOn={irrigation.pumpOn}
        waterTodayLiters={irrigation.waterUsage.todayLiters}
        cycleCount={irrigation.cycleCount}
      />
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.9fr]">
        <HistoryTable items={irrigation.history} />
        <WaterUsageCard usage={irrigation.waterUsage} />
      </div>
    </div>
  )
}
