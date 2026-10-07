import type { ControlMode, IrrigationSettings } from '../types/irrigation'
import { clamp } from './status'

export const SIMULATION_INTERVAL_MS = 2500
export const MAX_READINGS = 30
export const MAX_HISTORY_ITEMS = 40
export const MAX_ALERTS = 8

export const shouldPumpRun = (
  moisture: number,
  settings: IrrigationSettings,
  mode: ControlMode,
  currentPumpState: boolean,
): boolean => {
  if (!settings.simulationMode) {
    return false
  }

  if (mode === 'MANUAL') {
    return currentPumpState
  }

  if (!settings.autoIrrigation) {
    return false
  }

  return moisture < settings.threshold
}

export const calculateNextMoisture = (
  moisture: number,
  pumpOn: boolean,
  threshold: number,
): number => {
  const wave = Math.sin(Date.now() / 6500) * 0.35

  if (pumpOn) {
    const recoveryBoost = moisture < threshold - 10 ? 2.2 : 1.2
    return clamp(moisture + recoveryBoost + Math.random() * 2.2 + wave, 0, 100)
  }

  const dryingRate = moisture > 70 ? 1.8 : 0.7 + Math.random() * 1.2
  return clamp(moisture - dryingRate + wave, 0, 100)
}

export const realisticRandomMoisture = (): number => {
  const bands = [
    { min: 22, max: 38 },
    { min: 39, max: 66 },
    { min: 67, max: 88 },
  ]
  const band = bands[Math.floor(Math.random() * bands.length)]

  return Math.round(band.min + Math.random() * (band.max - band.min))
}
