import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DailyDetectionsChart({ dailyCounts }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={dailyCounts} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--gridline)" />
        <XAxis
          dataKey="day"
          tickFormatter={(value) => value.slice(5)}
          label={{ value: "Date", position: "bottom", offset: 0, fill: "var(--ink-muted)" }}
          stroke="var(--axis)"
          tick={{ fill: "var(--ink-muted)" }}
        />
        <YAxis
          label={{ value: "Detections", angle: -90, position: "insideLeft", fill: "var(--ink-muted)" }}
          stroke="var(--axis)"
          tick={{ fill: "var(--ink-muted)" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--surface-card-raised)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 8,
            color: "var(--ink-primary)",
          }}
        />
        <Bar name="Detections" dataKey="count" fill="var(--series-observed)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
