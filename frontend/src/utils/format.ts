export const formatClock = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)

export const formatDateTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

export const formatLiters = (value: number): string => `${value.toFixed(1)} L`

export const formatDuration = (seconds: number | null): string =>
  seconds === null ? '-' : `${Math.max(1, Math.round(seconds))} sec`

export const percent = (value: number): string => `${Math.round(value)}%`
