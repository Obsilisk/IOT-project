import type {
  DeviceStatus,
  IrrigationHistoryItem,
  IrrigationSettings,
  SensorDevicePayload,
  SensorReading,
} from '../types/irrigation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export const irrigationApi = {
  getDeviceStatus: () => request<DeviceStatus>('/api/device/status'),
  getMoisture: () => request<SensorReading>('/api/sensor/moisture'),
  getIrrigationStatus: () =>
    request<{ pumpOn: boolean; settings: IrrigationSettings }>('/api/irrigation/status'),
  setPump: (pumpOn: boolean) =>
    request<{ pumpOn: boolean }>('/api/irrigation/pump', {
      method: 'POST',
      body: JSON.stringify({ pump_on: pumpOn }),
    }),
  updateSettings: (settings: IrrigationSettings) =>
    request<IrrigationSettings>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),
  getHistory: () => request<IrrigationHistoryItem[]>('/api/history'),
  postDeviceData: (payload: SensorDevicePayload) =>
    request<SensorDevicePayload>('/api/device/data', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
