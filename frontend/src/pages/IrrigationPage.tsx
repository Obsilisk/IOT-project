import { HistoryTable } from '../components/dashboard/HistoryTable'
import { IrrigationControl } from '../components/dashboard/IrrigationControl'
import { MoistureGauge } from '../components/dashboard/MoistureGauge'
import { SimulationControls } from '../components/dashboard/SimulationControls'
import type { SmartIrrigationController } from '../hooks/useSmartIrrigation'

interface IrrigationPageProps {
  irrigation: SmartIrrigationController
}

export function IrrigationPage({ irrigation }: IrrigationPageProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.1fr]">
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
        <MoistureGauge
          moisture={irrigation.moisture}
          soilStatus={irrigation.soilStatus}
          threshold={irrigation.settings.threshold}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.1fr]">
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
        <HistoryTable items={irrigation.history} limit={8} />
      </div>
    </div>
  )
}
