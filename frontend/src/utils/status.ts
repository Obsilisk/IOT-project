import type { SoilStatus } from '../types/irrigation'

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const getSoilStatus = (moisture: number, threshold: number): SoilStatus => {
  if (moisture < threshold) {
    return 'DRY'
  }

  if (moisture >= 70) {
    return 'WET'
  }

  return 'OPTIMAL'
}

export const getStatusLabel = (status: SoilStatus): string => {
  if (status === 'DRY') {
    return 'Dry'
  }

  if (status === 'WET') {
    return 'Wet'
  }

  return 'Optimal'
}

export const getStatusClasses = (status: SoilStatus): string => {
  if (status === 'DRY') {
    return 'border-amber-400/40 bg-amber-400/10 text-amber-200'
  }

  if (status === 'WET') {
    return 'border-sky-400/40 bg-sky-400/10 text-sky-200'
  }

  return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
}

export const getGaugeColor = (status: SoilStatus): string => {
  if (status === 'DRY') {
    return '#f59e0b'
  }

  if (status === 'WET') {
    return '#38bdf8'
  }

  return '#34d399'
}
