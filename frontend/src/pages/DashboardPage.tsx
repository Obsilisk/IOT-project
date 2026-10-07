import { AlertsPanel } from '../components/dashboard/AlertsPanel'
import { DeviceStatusCard } from '../components/dashboard/DeviceStatusCard'
import { HistoryTable } from '../components/dashboard/HistoryTable'
import { IrrigationControl } from '../components/dashboard/IrrigationControl'
import { MoistureGauge } from '../components/dashboard/MoistureGauge'
import { MoistureHistoryChart } from '../components/dashboard/MoistureHistoryChart'
import { SimulationControls } from '../components/dashboard/SimulationControls'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import { WaterUsageCard } from '../components/dashboard/WaterUsageCard'
import type { SmartIrrigationController } from '../hooks/useSmartIrrigation'

interface DashboardPageProps {
  irrigation: SmartIrrigationController
  onNavigateHistory: () => void
}

export function DashboardPage({ irrigation, onNavigateHistory }: DashboardPageProps) {
  return (
    <div className="space-y-5">
      <StatsGrid
        moisture={irrigation.moisture}
        soilStatus={irrigation.soilStatus}
        pumpOn={irrigation.pumpOn}
        waterTodayLiters={irrigation.waterUsage.todayLiters}
        cycleCount={irrigation.cycleCount}
      />

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <MoistureGauge
          moisture={irrigation.moisture}
          soilStatus={irrigation.soilStatus}
          threshold={irrigation.settings.threshold}
        />
        <IrrigationControl
          mode={irrigation.controlMode}
          pumpOn={irrigation.pumpOn}
          moisture={irrigation.moisture}
          threshold={irrigation.settings.threshold}
          soilStatus={irrigation.soilStatus}
          autoIrrigation={irrigation.settings.autoIrrigation}
          onModeChange={irrigation.setControlMode}
          onPumpChange={irrigation.setManualPump}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <MoistureHistoryChart
          readings={irrigation.readings}
          current={irrigation.moisture}
          average={irrigation.averageMoisture}
          min={irrigation.minMoisture}
          max={irrigation.maxMoisture}
          threshold={irrigation.settings.threshold}
        />
        <SimulationControls
          moisture={irrigation.moisture}
          simulationMode={irrigation.settings.simulationMode}
          simulationRunning={irrigation.simulationRunning}
          onMoistureChange={irrigation.setMoisture}
          onDry={irrigation.simulateDrySoil}
          onMoist={irrigation.simulateMoistSoil}
          onWet={irrigation.simulateWetSoil}
          onRandom={irrigation.randomSensorReading}
          onToggleRunning={irrigation.toggleSimulation}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.4fr]">
        <DeviceStatusCard device={irrigation.deviceStatus} />
        <AlertsPanel alerts={irrigation.alerts} onClear={irrigation.clearAlert} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <HistoryTable
          items={irrigation.history}
          limit={6}
          showViewAll
          onViewAll={onNavigateHistory}
        />
        <WaterUsageCard usage={irrigation.waterUsage} />
      </div>
    </div>
  )
}
