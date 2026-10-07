import { AlertsPanel } from '../components/dashboard/AlertsPanel'
import { MoistureGauge } from '../components/dashboard/MoistureGauge'
import { MoistureHistoryChart } from '../components/dashboard/MoistureHistoryChart'
import { SimulationControls } from '../components/dashboard/SimulationControls'
import { WaterUsageCard } from '../components/dashboard/WaterUsageCard'
import type { SmartIrrigationController } from '../hooks/useSmartIrrigation'

interface MonitoringPageProps {
  irrigation: SmartIrrigationController
}

export function MonitoringPage({ irrigation }: MonitoringPageProps) {
  return (
    <div className="space-y-5">
      <MoistureHistoryChart
        readings={irrigation.readings}
        current={irrigation.moisture}
        average={irrigation.averageMoisture}
        min={irrigation.minMoisture}
        max={irrigation.maxMoisture}
        threshold={irrigation.settings.threshold}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <MoistureGauge
          moisture={irrigation.moisture}
          soilStatus={irrigation.soilStatus}
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
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <WaterUsageCard usage={irrigation.waterUsage} />
        <AlertsPanel alerts={irrigation.alerts} onClear={irrigation.clearAlert} />
      </div>
    </div>
  )
}
