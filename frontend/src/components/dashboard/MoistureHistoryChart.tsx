import { LineChart as LineChartIcon } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../ui/Card'
import type { SensorReading } from '../../types/irrigation'
import { percent } from '../../utils/format'

interface MoistureHistoryChartProps {
  readings: SensorReading[]
  current: number
  average: number
  min: number
  max: number
  threshold: number
}

export function MoistureHistoryChart({
  readings,
  current,
  average,
  min,
  max,
  threshold,
}: MoistureHistoryChartProps) {
  const stats = [
    { label: 'Current', value: percent(current) },
    { label: 'Average', value: percent(average) },
    { label: 'Minimum', value: percent(min) },
    { label: 'Maximum', value: percent(max) },
  ]

  return (
    <Card title="Soil Moisture History" icon={<LineChartIcon className="h-5 w-5" />}>
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs font-medium uppercase text-slate-500">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={readings} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 12 }} minTickGap={24} />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#e2e8f0',
              }}
              formatter={(value) => [`${value}%`, 'Moisture']}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <ReferenceLine
              y={threshold}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Threshold', fill: '#fbbf24', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="moisture"
              stroke="#34d399"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, stroke: '#06251d', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
