export type SoilStatus = 'DRY' | 'OPTIMAL' | 'WET'
export type ControlMode = 'AUTO' | 'MANUAL'
export type PageId =
  | 'dashboard'
  | 'monitoring'
  | 'irrigation'
  | 'history'
  | 'devices'
  | 'settings'

export interface SensorReading {
  id: string
  timestamp: string
  time: string
  moisture: number
  soilStatus: SoilStatus
  pumpOn: boolean
}

export interface IrrigationHistoryItem {
  id: string
  timestamp: string
  time: string
  moisture: number
  soilStatus: SoilStatus
  pumpOn: boolean
  durationSeconds: number | null
}

export interface AlertItem {
  id: string
  timestamp: string
  time: string
  type: 'info' | 'success' | 'warning'
  message: string
}

export interface DeviceStatus {
  device: string
  deviceId: string
  connection: string
  sensor: string
  relay: string
  pump: string
  lastReading: string
  status: 'Online' | 'Offline'
}

export interface IrrigationSettings {
  threshold: number
  autoIrrigation: boolean
  simulationMode: boolean
  pumpSafetyTimeoutSec: number
  waterFlowRateLpm: number
}

export interface WaterUsagePoint {
  label: string
  liters: number
}

export interface WaterUsageSummary {
  todayLiters: number
  weekLiters: number
  estimatedSavingsPercent: number
  trend: WaterUsagePoint[]
}

export interface SensorDevicePayload {
  device_id: string
  moisture: number
  timestamp: string
  pump_status: boolean
}
