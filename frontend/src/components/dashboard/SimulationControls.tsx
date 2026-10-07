import { Droplet, Pause, Play, RotateCcw, Waves } from 'lucide-react'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'
import { percent } from '../../utils/format'

interface SimulationControlsProps {
  moisture: number
  simulationMode: boolean
  simulationRunning: boolean
  onMoistureChange: (moisture: number) => void
  onDry: () => void
  onMoist: () => void
  onWet: () => void
  onRandom: () => void
  onToggleRunning: () => void
}

export function SimulationControls({
  moisture,
  simulationMode,
  simulationRunning,
  onMoistureChange,
  onDry,
  onMoist,
  onWet,
  onRandom,
  onToggleRunning,
}: SimulationControlsProps) {
  const actions = [
    { label: 'Simulate Dry Soil', onClick: onDry, icon: Droplet },
    { label: 'Simulate Moist Soil', onClick: onMoist, icon: Waves },
    { label: 'Simulate Wet Soil', onClick: onWet, icon: Waves },
    { label: 'Random Sensor Reading', onClick: onRandom, icon: RotateCcw },
  ]

  return (
    <Card
      title="Device Simulation"
      icon={<RotateCcw className="h-5 w-5" />}
      action={
        <StatusBadge tone={simulationMode ? 'green' : 'amber'}>
          Simulation Mode: {simulationMode ? 'ON' : 'OFF'}
        </StatusBadge>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:text-white"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor="simulated-moisture" className="text-sm font-medium text-slate-300">
              Simulated Moisture
            </label>
            <span className="text-sm font-semibold text-white">{percent(moisture)}</span>
          </div>
          <input
            id="simulated-moisture"
            type="range"
            min="0"
            max="100"
            value={moisture}
            onChange={(event) => onMoistureChange(Number(event.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleRunning}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          {simulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {simulationRunning ? 'Pause Simulation' : 'Resume Simulation'}
        </button>
      </div>
    </Card>
  )
}
