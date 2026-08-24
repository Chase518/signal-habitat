import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../../shared";
import { loadSensors } from "../sensorsSlice";
import BatteryTrendChart from "./BatteryTrendChart";

// Mirrors analysis-python/app/quality.py's confidence thresholds, so a
// sensor reads as "low" here exactly when its readings would get
// filtered out of the analysis.
const MIN_BATTERY_PCT = 20;
const MIN_RSSI_DBM = -100;

export default function SensorsPanel() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.sensors);

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadSensors());
    }
  }, [status, dispatch]);

  if (status === "failed") {
    return (
      <Card>
        <p role="alert" style={{ margin: 0, color: "var(--ink-secondary)" }}>
          Could not load sensor data ({error}) — is the analysis service running on{" "}
          <code>localhost:8080</code>?
        </p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <p style={{ margin: 0, color: "var(--ink-secondary)" }}>Loading sensors…</p>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
        {data.sensors.map((sensor) => (
          <SensorCard key={sensor.sensor_id} sensor={sensor} />
        ))}
      </div>

      <Card title="Battery over time">
        <BatteryTrendChart batteryTrend={data.battery_trend} />
      </Card>
    </div>
  );
}

function SensorCard({ sensor }) {
  const lowBattery = sensor.latest_battery !== null && sensor.latest_battery < MIN_BATTERY_PCT;
  const lowRssi = sensor.latest_rssi !== null && sensor.latest_rssi < MIN_RSSI_DBM;

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-card)",
        padding: "var(--space-3)",
        flex: "1 1 200px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <strong style={{ color: "var(--ink-primary)" }}>{sensor.sensor_id}</strong>
        {sensor.is_faulty && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 8px",
              borderRadius: 999,
              background: "var(--status-critical)",
              color: "#ffffff",
            }}
          >
            faulty
          </span>
        )}
      </div>
      <div style={{ color: "var(--ink-muted)", fontSize: "0.8rem", marginTop: 4 }}>
        base {sensor.base_temperature_c.toFixed(1)}°C · {sensor.reading_count.toLocaleString()} readings
      </div>
      <div style={{ marginTop: "var(--space-2)", fontSize: "0.9rem" }}>
        <div style={{ color: lowBattery ? "var(--status-critical)" : "var(--ink-primary)" }}>
          Battery: {sensor.latest_battery?.toFixed(1) ?? "—"}%
        </div>
        <div style={{ color: lowRssi ? "var(--status-critical)" : "var(--ink-primary)" }}>
          RSSI: {sensor.latest_rssi?.toFixed(1) ?? "—"} dBm
        </div>
      </div>
    </div>
  );
}
