import { useEffect, useState } from 'react'
import { UserCircle } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import type { DeviceStatus } from '../../types/irrigation'
import { formatDateTime } from '../../utils/format'

interface HeaderProps {
  device: DeviceStatus
  simulationMode: boolean
}

export function Header({ device, simulationMode }: HeaderProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-emerald-300">SMART IRRIGATION</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            IoT-Based Intelligent Water Management System
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={device.status === 'Online' ? 'green' : 'red'} dot>
            System {device.status}
          </StatusBadge>
          <StatusBadge tone="blue">Device: SIMULATED-UNO</StatusBadge>
          <StatusBadge tone={simulationMode ? 'amber' : 'slate'}>
            {simulationMode ? 'Simulation Mode' : 'No Device Connected'}
          </StatusBadge>
          <span className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300">
            {formatDateTime(now)}
          </span>
          <button
            type="button"
            title="Profile"
            aria-label="Profile"
            className="rounded-md border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            <UserCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
