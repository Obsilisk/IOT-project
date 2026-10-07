import { Power, PowerOff, Settings2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { SegmentedControl } from '../ui/SegmentedControl'
import { StatusBadge } from '../ui/StatusBadge'
import type { ControlMode, SoilStatus } from '../../types/irrigation'
import { percent } from '../../utils/format'
import { getStatusLabel } from '../../utils/status'

interface IrrigationControlProps {
  mode: ControlMode
  pumpOn: boolean
  moisture: number
  threshold: number
  soilStatus: SoilStatus
  autoIrrigation: boolean
  onModeChange: (mode: ControlMode) => void
  onPumpChange: (pumpOn: boolean) => void
}

export function IrrigationControl({
  mode,
  pumpOn,
  moisture,
  threshold,
  soilStatus,
  autoIrrigation,
  onModeChange,
  onPumpChange,
}: IrrigationControlProps) {
  return (
    <Card title="Irrigation Control" icon={<Settings2 className="h-5 w-5" />}>
      <div className="space-y-5">
        <SegmentedControl
          ariaLabel="Irrigation mode"
          value={mode}
          options={[
            { label: 'AUTO', value: 'AUTO' },
            { label: 'MANUAL', value: 'MANUAL' },
          ]}
          onChange={onModeChange}
        />

        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Current state</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                PUMP {pumpOn ? 'ON' : 'OFF'}
              </p>
            </div>
            <StatusBadge tone={pumpOn ? 'blue' : 'slate'} dot>
              {pumpOn ? 'Watering' : 'Standby'}
            </StatusBadge>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-slate-500">Moisture</p>
              <p className="font-semibold text-slate-200">{percent(moisture)}</p>
            </div>
            <div>
              <p className="text-slate-500">Threshold</p>
              <p className="font-semibold text-slate-200">{percent(threshold)}</p>
            </div>
            <div>
              <p className="text-slate-500">Soil</p>
              <p className="font-semibold text-slate-200">{getStatusLabel(soilStatus)}</p>
            </div>
          </div>
        </div>

        {mode === 'AUTO' ? (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-100">AUTO mode</p>
                <p className="mt-1 text-sm text-emerald-100/70">
                  {autoIrrigation ? 'Automatic irrigation enabled' : 'Automatic irrigation paused'}
                </p>
              </div>
              <StatusBadge tone={autoIrrigation ? 'green' : 'amber'} dot>
                {autoIrrigation ? 'Active' : 'Paused'}
              </StatusBadge>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onPumpChange(true)}
              disabled={pumpOn}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Power className="h-4 w-4" />
              TURN PUMP ON
            </button>
            <button
              type="button"
              onClick={() => onPumpChange(false)}
              disabled={!pumpOn}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:bg-slate-700 disabled:text-slate-400"
            >
              <PowerOff className="h-4 w-4" />
              TURN PUMP OFF
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
