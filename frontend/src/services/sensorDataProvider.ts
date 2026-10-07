import type {
  DeviceStatus,
  IrrigationSettings,
  SensorDevicePayload,
  SensorReading,
} from '../types/irrigation'
import { createInitialReadings, deviceStatusTemplate } from '../data/initialData'

export interface SensorDataProvider {
  getDeviceStatus: () => Promise<DeviceStatus>
  getLatestReading: () => Promise<SensorReading>
  updateSettings: (settings: IrrigationSettings) => Promise<IrrigationSettings>
  sendPumpCommand: (pumpOn: boolean) => Promise<{ pumpOn: boolean }>
  receiveDeviceData: (payload: SensorDevicePayload) => Promise<SensorDevicePayload>
}

export class MockSensorDataProvider implements SensorDataProvider {
  private latestReading = createInitialReadings().at(-1)!
  private settings: IrrigationSettings

  constructor(settings: IrrigationSettings) {
    this.settings = settings
  }

  async getDeviceStatus(): Promise<DeviceStatus> {
    return {
      ...deviceStatusTemplate,
      lastReading: this.latestReading.time,
    }
  }

  async getLatestReading(): Promise<SensorReading> {
    return this.latestReading
  }

  async updateSettings(settings: IrrigationSettings): Promise<IrrigationSettings> {
    this.settings = settings
    return this.settings
  }

  async sendPumpCommand(pumpOn: boolean): Promise<{ pumpOn: boolean }> {
    return { pumpOn }
  }

  async receiveDeviceData(payload: SensorDevicePayload): Promise<SensorDevicePayload> {
    return payload
  }
}
