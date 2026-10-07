import type {
  AlertItem,
  DeviceStatus,
  IrrigationHistoryItem,
  IrrigationSettings,
  SensorReading,
  WaterUsagePoint,
} from '../types/irrigation'
import { formatClock } from '../utils/format'
import { getSoilStatus } from '../utils/status'

export const defaultSettings: IrrigationSettings = {
  threshold: 40,
  autoIrrigation: true,
  simulationMode: true,
  pumpSafetyTimeoutSec: 120,
  waterFlowRateLpm: 2.4,
}

export const deviceStatusTemplate: DeviceStatus = {
  device: 'Arduino Uno',
  deviceId: 'SIM-UNO-001',
  connection: 'Simulation Mode',
  sensor: 'Soil Moisture Sensor',
  relay: 'Connected',
  pump: 'Connected',
  lastReading: '--:--:--',
  status: 'Online',
}

export const createInitialReadings = (): SensorReading[] => {
  const pattern = [
    58, 55, 52, 49, 46, 43, 41, 39, 36, 34, 31, 28, 25, 27, 32, 38, 44, 49, 55,
    61, 58, 54, 50, 46,
  ]
  const now = Date.now()

  return pattern.map((moisture, index) => {
    const date = new Date(now - (pattern.length - index) * 15000)
    const soilStatus = getSoilStatus(moisture, defaultSettings.threshold)

    return {
      id: `seed-${index}`,
      timestamp: date.toISOString(),
      time: formatClock(date),
      moisture,
      soilStatus,
      pumpOn: moisture < defaultSettings.threshold,
    }
  })
}

export const createInitialHistory = (): IrrigationHistoryItem[] => [
  {
    id: 'history-1',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    time: '08:10:00',
    moisture: 32,
    soilStatus: 'DRY',
    pumpOn: true,
    durationSeconds: 45,
  },
  {
    id: 'history-2',
    timestamp: new Date(Date.now() - 840000).toISOString(),
    time: '08:11:00',
    moisture: 38,
    soilStatus: 'DRY',
    pumpOn: true,
    durationSeconds: 30,
  },
  {
    id: 'history-3',
    timestamp: new Date(Date.now() - 780000).toISOString(),
    time: '08:12:00',
    moisture: 44,
    soilStatus: 'OPTIMAL',
    pumpOn: false,
    durationSeconds: null,
  },
  {
    id: 'history-4',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    time: '08:30:00',
    moisture: 29,
    soilStatus: 'DRY',
    pumpOn: true,
    durationSeconds: 60,
  },
]

export const createInitialAlerts = (): AlertItem[] => {
  const now = new Date()

  return [
    {
      id: 'alert-simulation',
      timestamp: now.toISOString(),
      time: formatClock(now),
      type: 'info',
      message: 'Device operating in simulation mode.',
    },
  ]
}

export const baseWaterTrend: WaterUsagePoint[] = [
  { label: 'Mon', liters: 8.4 },
  { label: 'Tue', liters: 9.2 },
  { label: 'Wed', liters: 7.8 },
  { label: 'Thu', liters: 10.1 },
  { label: 'Fri', liters: 8.9 },
  { label: 'Sat', liters: 11.3 },
]
