import { useEffect, useMemo, useReducer } from 'react'
import {
  baseWaterTrend,
  createInitialAlerts,
  createInitialHistory,
  createInitialReadings,
  defaultSettings,
  deviceStatusTemplate,
} from '../data/initialData'
import { MockSensorDataProvider } from '../services/sensorDataProvider'
import type {
  AlertItem,
  ControlMode,
  DeviceStatus,
  IrrigationHistoryItem,
  IrrigationSettings,
  SensorReading,
  SoilStatus,
  WaterUsageSummary,
} from '../types/irrigation'
import { formatClock } from '../utils/format'
import {
  calculateNextMoisture,
  MAX_ALERTS,
  MAX_HISTORY_ITEMS,
  MAX_READINGS,
  realisticRandomMoisture,
  shouldPumpRun,
  SIMULATION_INTERVAL_MS,
} from '../utils/simulationEngine'
import { clamp, getSoilStatus } from '../utils/status'

interface IrrigationRuntimeState {
  moisture: number
  pumpOn: boolean
  controlMode: ControlMode
  simulationRunning: boolean
  settings: IrrigationSettings
  readings: SensorReading[]
  history: IrrigationHistoryItem[]
  alerts: AlertItem[]
  waterTodayLiters: number
  cycleCount: number
  pumpStartedAt: number | null
  lastReadingAt: string
}

type IrrigationAction =
  | { type: 'TICK' }
  | { type: 'SET_MOISTURE'; moisture: number; message: string }
  | { type: 'SET_MODE'; mode: ControlMode }
  | { type: 'SET_MANUAL_PUMP'; pumpOn: boolean }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<IrrigationSettings> }
  | { type: 'TOGGLE_SIMULATION' }
  | { type: 'CLEAR_ALERT'; id: string }

interface CommitOptions {
  message?: string
  intervalSeconds?: number
  pumpActiveDuringInterval?: boolean
  pumpOverride?: boolean
}

const createId = (prefix: string, nowMs: number): string =>
  `${prefix}-${nowMs}-${Math.random().toString(16).slice(2)}`

const addAlert = (
  alerts: AlertItem[],
  message: string,
  type: AlertItem['type'],
  now: Date,
): AlertItem[] => [
  {
    id: createId('alert', now.getTime()),
    timestamp: now.toISOString(),
    time: formatClock(now),
    type,
    message,
  },
  ...alerts,
].slice(0, MAX_ALERTS)

const createInitialState = (): IrrigationRuntimeState => {
  const readings = createInitialReadings()
  const latest = readings.at(-1)!

  return {
    moisture: latest.moisture,
    pumpOn: false,
    controlMode: 'AUTO',
    simulationRunning: true,
    settings: defaultSettings,
    readings,
    history: createInitialHistory(),
    alerts: createInitialAlerts(),
    waterTodayLiters: 12.6,
    cycleCount: 7,
    pumpStartedAt: null,
    lastReadingAt: latest.timestamp,
  }
}

const buildReading = (
  moisture: number,
  soilStatus: SoilStatus,
  pumpOn: boolean,
  now: Date,
): SensorReading => ({
  id: createId('reading', now.getTime()),
  timestamp: now.toISOString(),
  time: formatClock(now),
  moisture: Math.round(moisture),
  soilStatus,
  pumpOn,
})

const buildHistoryItem = (
  reading: SensorReading,
  durationSeconds: number | null,
): IrrigationHistoryItem => ({
  id: createId('history', Date.parse(reading.timestamp)),
  timestamp: reading.timestamp,
  time: reading.time,
  moisture: reading.moisture,
  soilStatus: reading.soilStatus,
  pumpOn: reading.pumpOn,
  durationSeconds,
})

const commitReading = (
  state: IrrigationRuntimeState,
  rawMoisture: number,
  options: CommitOptions = {},
): IrrigationRuntimeState => {
  const now = new Date()
  const nowMs = now.getTime()
  const moisture = Math.round(clamp(rawMoisture, 0, 100))
  const soilStatus = getSoilStatus(moisture, state.settings.threshold)
  const previousStatus = getSoilStatus(state.moisture, state.settings.threshold)
  const previousPump = state.pumpOn
  let nextPump =
    options.pumpOverride ??
    shouldPumpRun(moisture, state.settings, state.controlMode, state.pumpOn)
  let pumpStartedAt = state.pumpStartedAt
  let cycleCount = state.cycleCount
  let alerts = state.alerts
  const intervalSeconds = options.intervalSeconds ?? 0
  const pumpActiveDuringInterval = options.pumpActiveDuringInterval ?? nextPump

  if (nextPump && !pumpStartedAt) {
    pumpStartedAt = nowMs
  }

  if (
    nextPump &&
    pumpStartedAt &&
    (nowMs - pumpStartedAt) / 1000 > state.settings.pumpSafetyTimeoutSec
  ) {
    nextPump = false
    alerts = addAlert(alerts, 'Pump safety timeout reached. Pump turned OFF.', 'warning', now)
  }

  if (!previousPump && nextPump) {
    cycleCount += 1
    pumpStartedAt = nowMs
    alerts = addAlert(
      alerts,
      state.controlMode === 'AUTO'
        ? 'Pump automatically turned ON.'
        : 'Pump turned ON manually.',
      'success',
      now,
    )
  }

  if (previousPump && !nextPump) {
    alerts = addAlert(
      alerts,
      state.controlMode === 'AUTO'
        ? 'Pump automatically turned OFF.'
        : 'Pump turned OFF manually.',
      'info',
      now,
    )
    pumpStartedAt = null
  }

  if (soilStatus === 'DRY' && previousStatus !== 'DRY') {
    alerts = addAlert(alerts, 'Low soil moisture detected.', 'warning', now)
  }

  if (previousStatus === 'DRY' && soilStatus !== 'DRY') {
    alerts = addAlert(alerts, 'Soil moisture restored to optimal level.', 'success', now)
  }

  if (options.message) {
    alerts = addAlert(alerts, options.message, 'info', now)
  }

  const reading = buildReading(moisture, soilStatus, nextPump, now)
  const durationSeconds =
    nextPump && pumpStartedAt ? Math.max(1, (nowMs - pumpStartedAt) / 1000) : null
  const waterIncrement =
    intervalSeconds > 0 && pumpActiveDuringInterval
      ? (state.settings.waterFlowRateLpm / 60) * intervalSeconds
      : 0

  return {
    ...state,
    moisture,
    pumpOn: nextPump,
    cycleCount,
    pumpStartedAt,
    alerts,
    readings: [...state.readings, reading].slice(-MAX_READINGS),
    history: [buildHistoryItem(reading, durationSeconds), ...state.history].slice(
      0,
      MAX_HISTORY_ITEMS,
    ),
    waterTodayLiters: state.waterTodayLiters + waterIncrement,
    lastReadingAt: reading.timestamp,
  }
}

const sanitizeSettings = (
  current: IrrigationSettings,
  update: Partial<IrrigationSettings>,
): IrrigationSettings => ({
  ...current,
  ...update,
  threshold: clamp(update.threshold ?? current.threshold, 10, 80),
  pumpSafetyTimeoutSec: clamp(
    update.pumpSafetyTimeoutSec ?? current.pumpSafetyTimeoutSec,
    10,
    600,
  ),
  waterFlowRateLpm: clamp(update.waterFlowRateLpm ?? current.waterFlowRateLpm, 0.2, 12),
})

const reducer = (
  state: IrrigationRuntimeState,
  action: IrrigationAction,
): IrrigationRuntimeState => {
  switch (action.type) {
    case 'TICK': {
      if (!state.simulationRunning || !state.settings.simulationMode) {
        return state
      }

      const pumpActiveDuringInterval = shouldPumpRun(
        state.moisture,
        state.settings,
        state.controlMode,
        state.pumpOn,
      )
      const nextMoisture = calculateNextMoisture(
        state.moisture,
        pumpActiveDuringInterval,
        state.settings.threshold,
      )

      return commitReading(state, nextMoisture, {
        intervalSeconds: SIMULATION_INTERVAL_MS / 1000,
        pumpActiveDuringInterval,
      })
    }

    case 'SET_MOISTURE':
      return commitReading(state, action.moisture, { message: action.message })

    case 'SET_MODE': {
      const nextState = {
        ...state,
        controlMode: action.mode,
      }

      return commitReading(nextState, state.moisture, {
        message: `${action.mode === 'AUTO' ? 'Auto' : 'Manual'} irrigation mode selected.`,
      })
    }

    case 'SET_MANUAL_PUMP': {
      const nextState = {
        ...state,
        controlMode: 'MANUAL' as ControlMode,
      }

      return commitReading(nextState, state.moisture, { pumpOverride: action.pumpOn })
    }

    case 'UPDATE_SETTINGS': {
      const nextSettings = sanitizeSettings(state.settings, action.settings)
      const nextState = {
        ...state,
        settings: nextSettings,
      }

      return commitReading(nextState, state.moisture, { message: 'Settings updated.' })
    }

    case 'TOGGLE_SIMULATION': {
      const simulationRunning = !state.simulationRunning
      const now = new Date()

      return {
        ...state,
        simulationRunning,
        alerts: addAlert(
          state.alerts,
          simulationRunning ? 'Simulation resumed.' : 'Simulation paused.',
          'info',
          now,
        ),
      }
    }

    case 'CLEAR_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.id),
      }
  }
}

const buildWaterUsage = (todayLiters: number): WaterUsageSummary => {
  const today = Number(todayLiters.toFixed(1))

  return {
    todayLiters: today,
    weekLiters: Number((baseWaterTrend.reduce((sum, day) => sum + day.liters, 0) + today).toFixed(1)),
    estimatedSavingsPercent: 23,
    trend: [...baseWaterTrend, { label: 'Today', liters: today }],
  }
}

export const useSmartIrrigation = () => {
  const provider = useMemo(() => new MockSensorDataProvider(defaultSettings), [])
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  useEffect(() => {
    const timer = window.setInterval(() => {
      dispatch({ type: 'TICK' })
    }, SIMULATION_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    void provider.updateSettings(state.settings)
  }, [provider, state.settings])

  const latestStatus = getSoilStatus(state.moisture, state.settings.threshold)
  const moistureValues = state.readings.map((reading) => reading.moisture)
  const averageMoisture =
    moistureValues.length > 0
      ? Math.round(moistureValues.reduce((sum, value) => sum + value, 0) / moistureValues.length)
      : 0
  const minMoisture = moistureValues.length > 0 ? Math.min(...moistureValues) : 0
  const maxMoisture = moistureValues.length > 0 ? Math.max(...moistureValues) : 0
  const waterUsage = buildWaterUsage(state.waterTodayLiters)
  const deviceStatus: DeviceStatus = {
    ...deviceStatusTemplate,
    lastReading: formatClock(new Date(state.lastReadingAt)),
    status: state.settings.simulationMode ? 'Online' : 'Offline',
  }

  return {
    moisture: state.moisture,
    soilStatus: latestStatus,
    pumpOn: state.pumpOn,
    controlMode: state.controlMode,
    simulationRunning: state.simulationRunning,
    settings: state.settings,
    readings: state.readings,
    history: state.history,
    alerts: state.alerts,
    cycleCount: state.cycleCount,
    waterUsage,
    averageMoisture,
    minMoisture,
    maxMoisture,
    deviceStatus,
    setControlMode: (mode: ControlMode) => dispatch({ type: 'SET_MODE', mode }),
    setManualPump: (pumpOn: boolean) => dispatch({ type: 'SET_MANUAL_PUMP', pumpOn }),
    setMoisture: (moisture: number) =>
      dispatch({
        type: 'SET_MOISTURE',
        moisture,
        message: `Simulated moisture adjusted to ${Math.round(moisture)}%.`,
      }),
    simulateDrySoil: () =>
      dispatch({
        type: 'SET_MOISTURE',
        moisture: 25,
        message: 'Simulated dry soil reading received.',
      }),
    simulateMoistSoil: () =>
      dispatch({
        type: 'SET_MOISTURE',
        moisture: 52,
        message: 'Simulated moist soil reading received.',
      }),
    simulateWetSoil: () =>
      dispatch({
        type: 'SET_MOISTURE',
        moisture: 82,
        message: 'Simulated wet soil reading received.',
      }),
    randomSensorReading: () =>
      dispatch({
        type: 'SET_MOISTURE',
        moisture: realisticRandomMoisture(),
        message: 'Random simulated sensor reading received.',
      }),
    updateSettings: (settings: Partial<IrrigationSettings>) =>
      dispatch({ type: 'UPDATE_SETTINGS', settings }),
    toggleSimulation: () => dispatch({ type: 'TOGGLE_SIMULATION' }),
    clearAlert: (id: string) => dispatch({ type: 'CLEAR_ALERT', id }),
  }
}

export type SmartIrrigationController = ReturnType<typeof useSmartIrrigation>
