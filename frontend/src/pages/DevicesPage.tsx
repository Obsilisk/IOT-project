import { Cable, Cpu, Database, Droplets, Radio, Server } from 'lucide-react'
import { DeviceStatusCard } from '../components/dashboard/DeviceStatusCard'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import type { SmartIrrigationController } from '../hooks/useSmartIrrigation'

interface DevicesPageProps {
  irrigation: SmartIrrigationController
}

const hardwareItems = [
  ['Controller', 'Arduino Uno'],
  ['Sensor', 'Soil Moisture Sensor'],
  ['Actuator', 'DC Motor / Water Pump'],
  ['Switching', 'Relay Module'],
  ['Indicator', 'LED'],
  ['Mode', 'Simulation Mode'],
]

const integrationFlow = [
  { label: 'Arduino / ESP32', icon: Cpu },
  { label: 'Wi-Fi / Serial', icon: Radio },
  { label: 'FastAPI', icon: Server },
  { label: 'Database', icon: Database },
  { label: 'React Dashboard', icon: Droplets },
]

export function DevicesPage({ irrigation }: DevicesPageProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.15fr]">
        <DeviceStatusCard device={irrigation.deviceStatus} />
        <Card
          title="Hardware Profile"
          icon={<Cable className="h-5 w-5" />}
          action={<StatusBadge tone="amber">Simulation Mode</StatusBadge>}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {hardwareItems.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Future IoT Integration" icon={<Server className="h-5 w-5" />}>
        <div className="grid gap-3 md:grid-cols-5">
          {integrationFlow.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.label}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-sky-400/10 text-sky-200 ring-1 ring-sky-400/20">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-100">{step.label}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <pre className="overflow-x-auto text-sm text-slate-300">
            {`{
  "device_id": "UNO-001",
  "moisture": 32,
  "timestamp": "2026-10-07T08:24:15Z",
  "pump_status": true
}`}
          </pre>
        </div>
      </Card>
    </div>
  )
}
