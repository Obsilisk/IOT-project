from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="Smart Irrigation API",
    description="Simulation-ready API for an IoT-Based Smart Irrigation System.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SoilStatus = Literal["DRY", "OPTIMAL", "WET"]


class DeviceDataIn(BaseModel):
    device_id: str = Field(..., examples=["UNO-001"])
    moisture: float = Field(..., ge=0, le=100, examples=[32])
    timestamp: datetime | None = None
    pump_status: bool = Field(..., examples=[True])


class PumpCommandIn(BaseModel):
    pump_on: bool


class SettingsIn(BaseModel):
    threshold: int = Field(40, ge=10, le=80)
    autoIrrigation: bool = True
    simulationMode: bool = True
    pumpSafetyTimeoutSec: int = Field(120, ge=10, le=600)
    waterFlowRateLpm: float = Field(2.4, ge=0.2, le=12)


state = {
    "device": {
        "device": "Arduino Uno",
        "deviceId": "SIM-UNO-001",
        "connection": "Simulation Mode",
        "sensor": "Soil Moisture Sensor",
        "relay": "Connected",
        "pump": "Connected",
        "lastReading": "--:--:--",
        "status": "Online",
    },
    "settings": SettingsIn().model_dump(),
    "moisture": 42,
    "pumpOn": False,
    "history": [],
}


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def format_clock(value: datetime) -> str:
    return value.astimezone().strftime("%H:%M:%S")


def soil_status(moisture: float, threshold: int) -> SoilStatus:
    if moisture < threshold:
        return "DRY"

    if moisture >= 70:
        return "WET"

    return "OPTIMAL"


def build_reading(timestamp: datetime | None = None) -> dict:
    timestamp = timestamp or now_utc()
    status = soil_status(state["moisture"], state["settings"]["threshold"])

    return {
        "id": f"api-reading-{uuid4()}",
        "timestamp": timestamp.isoformat(),
        "time": format_clock(timestamp),
        "moisture": round(state["moisture"]),
        "soilStatus": status,
        "pumpOn": state["pumpOn"],
    }


def record_history(timestamp: datetime | None = None) -> dict:
    reading = build_reading(timestamp)
    item = {
        "id": f"api-history-{uuid4()}",
        "timestamp": reading["timestamp"],
        "time": reading["time"],
        "moisture": reading["moisture"],
        "soilStatus": reading["soilStatus"],
        "pumpOn": reading["pumpOn"],
        "durationSeconds": 30 if reading["pumpOn"] else None,
    }
    state["history"].insert(0, item)
    state["history"] = state["history"][:50]
    state["device"]["lastReading"] = reading["time"]
    return item


@app.on_event("startup")
def seed_history() -> None:
    if state["history"]:
        return

    for moisture, pump_on in [(32, True), (38, True), (44, False), (29, True)]:
        state["moisture"] = moisture
        state["pumpOn"] = pump_on
        record_history()

    state["moisture"] = 42
    state["pumpOn"] = False


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "mode": "simulation"}


@app.get("/api/device/status")
def get_device_status() -> dict:
    return state["device"]


@app.get("/api/sensor/moisture")
def get_sensor_moisture() -> dict:
    return build_reading()


@app.get("/api/irrigation/status")
def get_irrigation_status() -> dict:
    return {
        "pumpOn": state["pumpOn"],
        "settings": state["settings"],
        "soilStatus": soil_status(state["moisture"], state["settings"]["threshold"]),
    }


@app.post("/api/irrigation/pump")
def set_pump(command: PumpCommandIn) -> dict:
    state["pumpOn"] = command.pump_on
    record_history()
    return {"pumpOn": state["pumpOn"]}


@app.post("/api/settings")
def update_settings(settings: SettingsIn) -> dict:
    state["settings"] = settings.model_dump()
    threshold = state["settings"]["threshold"]

    if state["settings"]["simulationMode"] and state["settings"]["autoIrrigation"]:
        state["pumpOn"] = state["moisture"] < threshold
    else:
        state["pumpOn"] = False

    record_history()
    return state["settings"]


@app.get("/api/history")
def get_history() -> list[dict]:
    return state["history"]


@app.post("/api/device/data")
def receive_device_data(payload: DeviceDataIn) -> dict:
    timestamp = payload.timestamp or now_utc()
    state["device"]["deviceId"] = payload.device_id
    state["device"]["connection"] = "Hardware Data Received"
    state["device"]["status"] = "Online"
    state["moisture"] = payload.moisture
    state["pumpOn"] = payload.pump_status
    record_history(timestamp)
    return {
        "device_id": payload.device_id,
        "moisture": payload.moisture,
        "timestamp": timestamp.isoformat(),
        "pump_status": payload.pump_status,
    }
