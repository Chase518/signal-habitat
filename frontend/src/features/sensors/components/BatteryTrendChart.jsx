import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Fixed categorical order, never cycled -- see dataviz skill's color-formula.md.
const SENSOR_COLORS = ["var(--series-observed)", "var(--series-fitted)", "var(--series-3)", "var(--series-4)", "var(--series-5)"];

function pivotByDay(batteryTrend) {
  const sensorIds = [...new Set(batteryTrend.map((point) => point.sensor_id))].sort();
  const byDay = new Map();
  for (const point of batteryTrend) {
    if (!byDay.has(point.day)) {
      byDay.set(point.day, { day: point.day });
    }
    byDay.get(point.day)[point.sensor_id] = point.avg_battery;
  }
  return { sensorIds, rows: [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day)) };
}

export default function BatteryTrendChart({ batteryTrend }) {
  const { sensorIds, rows } = pivotByDay(batteryTrend);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--gridline)" />
        <XAxis
          dataKey="day"
          tickFormatter={(value) => value.slice(5)}
          label={{ value: "Date", position: "bottom", offset: 0, fill: "var(--ink-muted)" }}
          stroke="var(--axis)"
          tick={{ fill: "var(--ink-muted)" }}
        />
        <YAxis
          domain={[0, 100]}
          label={{ value: "Avg. battery %", angle: -90, position: "insideLeft", fill: "var(--ink-muted)" }}
          stroke="var(--axis)"
          tick={{ fill: "var(--ink-muted)" }}
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface-card-raised)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 8,
            color: "var(--ink-primary)",
          }}
          formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
        />
        <Legend wrapperStyle={{ color: "var(--ink-secondary)", fontSize: "0.85rem", paddingTop: 16 }} />
        {sensorIds.map((sensorId, index) => (
          <Line
            key={sensorId}
            name={sensorId}
            dataKey={sensorId}
            stroke={SENSOR_COLORS[index % SENSOR_COLORS.length]}
            strokeWidth={2}
            dot={false}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
