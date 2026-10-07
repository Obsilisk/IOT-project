import { Settings } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import type { SmartIrrigationController } from '../hooks/useSmartIrrigation'
import type { IrrigationSettings } from '../types/irrigation'
import { percent } from '../utils/format'

interface SettingsPageProps {
  irrigation: SmartIrrigationController
}

interface ToggleRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? 'bg-emerald-400' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

export function SettingsPage({ irrigation }: SettingsPageProps) {
  const updateSettings = (settings: Partial<IrrigationSettings>) => {
    irrigation.updateSettings(settings)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card
        title="Settings"
        icon={<Settings className="h-5 w-5" />}
        action={<StatusBadge tone="amber">Simulation Mode</StatusBadge>}
      >
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label htmlFor="threshold" className="text-sm font-semibold text-slate-200">
                Moisture Threshold
              </label>
              <span className="text-sm font-semibold text-white">
                {percent(irrigation.settings.threshold)}
              </span>
            </div>
            <input
              id="threshold"
              type="range"
              min="10"
              max="80"
              value={irrigation.settings.threshold}
              onChange={(event) => updateSettings({ threshold: Number(event.target.value) })}
              className="w-full accent-emerald-400"
            />
          </div>

          <ToggleRow
            label="Auto Irrigation"
            checked={irrigation.settings.autoIrrigation}
            onChange={(checked) => updateSettings({ autoIrrigation: checked })}
          />
          <ToggleRow
            label="Simulation Mode"
            checked={irrigation.settings.simulationMode}
            onChange={(checked) => updateSettings({ simulationMode: checked })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-sm font-semibold text-slate-200">Pump Safety Timeout</span>
              <input
                type="number"
                min="10"
                max="600"
                value={irrigation.settings.pumpSafetyTimeoutSec}
                onChange={(event) =>
                  updateSettings({ pumpSafetyTimeoutSec: Number(event.target.value) })
                }
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              />
              <span className="mt-2 block text-xs text-slate-500">Seconds</span>
            </label>
            <label className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <span className="text-sm font-semibold text-slate-200">Water Flow Rate</span>
              <input
                type="number"
                min="0.2"
                max="12"
                step="0.1"
                value={irrigation.settings.waterFlowRateLpm}
                onChange={(event) =>
                  updateSettings({ waterFlowRateLpm: Number(event.target.value) })
                }
                className="mt-3 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              />
              <span className="mt-2 block text-xs text-slate-500">Liters per minute</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Runtime Values" icon={<Settings className="h-5 w-5" />}>
        <div className="space-y-3">
          {[
            ['Mode', irrigation.controlMode],
            ['Pump', irrigation.pumpOn ? 'ON' : 'OFF'],
            ['Moisture', percent(irrigation.moisture)],
            ['Threshold', percent(irrigation.settings.threshold)],
            ['Cycles Today', `${irrigation.cycleCount}`],
            ['Water Today', `${irrigation.waterUsage.todayLiters.toFixed(1)} L`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4"
            >
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-semibold text-slate-100">{value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
