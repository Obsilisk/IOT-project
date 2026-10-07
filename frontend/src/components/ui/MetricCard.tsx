import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface MetricCardProps {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone?: 'green' | 'blue' | 'amber' | 'slate'
}

const toneClasses = {
  green: 'bg-emerald-400/10 text-emerald-200 ring-emerald-400/20',
  blue: 'bg-sky-400/10 text-sky-200 ring-sky-400/20',
  amber: 'bg-amber-400/10 text-amber-200 ring-amber-400/20',
  slate: 'bg-slate-800 text-slate-200 ring-slate-700',
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'slate',
}: MetricCardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-sm shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 truncate text-sm text-slate-400">{detail}</p>
        </div>
        <div className={cn('rounded-lg p-2.5 ring-1', toneClasses[tone])}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
      </div>
    </section>
  )
}
