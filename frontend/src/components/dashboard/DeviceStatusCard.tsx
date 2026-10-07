import { Cpu } from 'lucide-react'
import { Card } from '../ui/Card'
import { StatusBadge } from '../ui/StatusBadge'
import type { DeviceStatus } from '../../types/irrigation'

interface DeviceStatusCardProps {
  device: DeviceStatus
}

export function DeviceStatusCard({ device }: DeviceStatusCardProps) {
  const rows = [
    ['Device', device.device],
    ['Device ID', device.deviceId],
    ['Connection', device.connection],
    ['Sensor', device.sensor],
    ['Relay', device.relay],
    ['Pump', device.pump],
    ['Last Reading', device.lastReading],
    ['Status', device.status],
  ]

  return (
    <Card
      title="Device Status"
      icon={<Cpu className="h-5 w-5" />}
      action={<StatusBadge tone={device.status === 'Online' ? 'green' : 'red'} dot>{device.status}</StatusBadge>}
    >
      <div className="divide-y divide-slate-800">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-right text-sm font-semibold text-slate-200">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
