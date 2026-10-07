# Smart Irrigation

IoT-Based Intelligent Water Management System

This project is a complete local software demo for an IoT-based smart irrigation system. The current version uses simulated sensor data so it can be demonstrated without Arduino hardware, while keeping the architecture ready for a future Arduino/ESP32 -> FastAPI -> React dashboard flow.

## Features

- Professional React dashboard for live irrigation monitoring
- Realistic soil moisture simulation cycle
- AUTO and MANUAL pump control
- Configurable moisture threshold, safety timeout, flow rate, auto irrigation, and simulation mode
- Live Recharts moisture graph with current, average, minimum, and maximum values
- Device simulation controls for dry, moist, wet, random, and slider-driven readings
- Dynamic alerts, irrigation history, water usage stats, and device status
- FastAPI backend with simulated API endpoints and future hardware ingestion route

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts
- Backend: Python, FastAPI, Uvicorn

## Folder Structure

```text
.
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, usually:

```text
http://localhost:5173
```

## Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

API docs:

```text
http://localhost:8000/docs
```

## How The Simulation Works

The frontend runs a simulation engine every few seconds.

- If moisture is below the threshold in AUTO mode, the pump turns ON.
- While the pump is ON, moisture gradually increases.
- Once moisture reaches the threshold, the pump turns OFF.
- When the pump is OFF, moisture slowly decreases.
- Slider and preset buttons inject simulated sensor readings for live demos.

Default threshold: 40%.

## Future Hardware Integration

The UI is separated from the data source through a provider/service layer:

```text
Current:
MockSensorDataProvider -> React Dashboard

Future:
Arduino Uno / ESP32 -> Wi-Fi / Serial -> FastAPI -> Database -> React Dashboard
```

Future hardware can send readings to:

```http
POST /api/device/data
```

Example payload:

```json
{
  "device_id": "UNO-001",
  "moisture": 32,
  "timestamp": "2026-10-07T08:24:15Z",
  "pump_status": true
}
```

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Backend health check |
| GET | `/api/device/status` | Device metadata and connection state |
| GET | `/api/sensor/moisture` | Latest moisture reading |
| GET | `/api/irrigation/status` | Pump and irrigation status |
| POST | `/api/irrigation/pump` | Manually set pump state |
| POST | `/api/settings` | Update irrigation settings |
| GET | `/api/history` | Irrigation history |
| POST | `/api/device/data` | Receive future real device data |

## Demo Flow

1. Open Dashboard.
2. Confirm System Online and Simulation Mode.
3. Use Simulate Dry Soil or set slider to 25%.
4. AUTO mode turns the pump ON.
5. Moisture rises on the gauge and chart.
6. Pump turns OFF after the threshold is reached.
7. Open History to show recorded activity.
8. Switch to MANUAL mode and use TURN PUMP ON / TURN PUMP OFF.
9. Open Devices to show current simulation hardware profile and future integration path.
