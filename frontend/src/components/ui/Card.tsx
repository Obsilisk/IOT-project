import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps {
  title?: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, icon, action, children, className }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-lg border border-slate-800 bg-slate-900/80 p-5 shadow-sm shadow-slate-950/20',
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {icon && <div className="text-emerald-300">{icon}</div>}
            {title && (
              <h2 className="truncate text-base font-semibold text-slate-100">{title}</h2>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
