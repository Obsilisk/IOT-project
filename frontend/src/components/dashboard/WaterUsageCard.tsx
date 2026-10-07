import { BarChart3 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../ui/Card'
import type { WaterUsageSummary } from '../../types/irrigation'
import { formatLiters } from '../../utils/format'

interface WaterUsageCardProps {
  usage: WaterUsageSummary
}

export function WaterUsageCard({ usage }: WaterUsageCardProps) {
  return (
    <Card title="Water Usage" icon={<BarChart3 className="h-5 w-5" />}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs font-medium uppercase text-slate-500">Today's Usage</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatLiters(usage.todayLiters)}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs font-medium uppercase text-slate-500">This Week</p>
          <p className="mt-1 text-xl font-semibold text-white">{formatLiters(usage.weekLiters)}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-xs font-medium uppercase text-slate-500">Estimated Savings</p>
          <p className="mt-1 text-xl font-semibold text-emerald-300">
            {usage.estimatedSavingsPercent}%
          </p>
        </div>
      </div>

      <div className="mt-5 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usage.trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: 8,
                color: '#e2e8f0',
              }}
              formatter={(value) => [`${value} L`, 'Usage']}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Bar dataKey="liters" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
