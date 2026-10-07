import { cn } from '../../utils/cn'

interface SegmentedControlProps<T extends string> {
  value: T
  options: Array<{ label: string; value: T }>
  onChange: (value: T) => void
  ariaLabel: string
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      className="grid rounded-lg border border-slate-700 bg-slate-950/80 p-1"
      role="group"
      aria-label={ariaLabel}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-2 text-sm font-semibold transition',
            option.value === value
              ? 'bg-emerald-400 text-slate-950'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
