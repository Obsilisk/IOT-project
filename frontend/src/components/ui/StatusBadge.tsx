import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface StatusBadgeProps {
  children: ReactNode
  tone?: 'green' | 'blue' | 'amber' | 'slate' | 'red'
  dot?: boolean
  className?: string
}

const toneClasses = {
  green: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  blue: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  slate: 'border-slate-600 bg-slate-800 text-slate-200',
  red: 'border-rose-400/40 bg-rose-400/10 text-rose-200',
}

const dotClasses = {
  green: 'bg-emerald-300',
  blue: 'bg-sky-300',
  amber: 'bg-amber-300',
  slate: 'bg-slate-300',
  red: 'bg-rose-300',
}

export function StatusBadge({
  children,
  tone = 'slate',
  dot = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-2 w-2 rounded-full', dotClasses[tone])} />}
      {children}
    </span>
  )
}
