import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function evaluatePolynomial(coefficients, x) {
  return coefficients.reduce((sum, coefficient, power) => sum + coefficient * x ** power, 0);
}

function buildCurve(coefficients, points, sampleCount = 60) {
  const temperatures = points.map((point) => point.temperature_bin_center);
  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);
  const step = (max - min) / (sampleCount - 1);
  return Array.from({ length: sampleCount }, (_, i) => {
    const temperature_bin_center = min + i * step;
    return {
      temperature_bin_center,
      fitted_frequency: evaluatePolynomial(coefficients, temperature_bin_center),
    };
  });
}

export default function AnalysisChart({ points, model }) {
  const curve = buildCurve(model.coefficients, points);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--gridline)" />
        <XAxis
          dataKey="temperature_bin_center"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(value) => `${Math.round(value)}°`}
          label={{ value: "Temperature (°C)", position: "bottom", offset: 0, fill: "var(--ink-muted)" }}
          stroke="var(--axis)"
          tick={{ fill: "var(--ink-muted)" }}
        />
        <YAxis
          dataKey="activity_frequency"
          label={{
            value: "Activity frequency",
            angle: -90,
            position: "insideLeft",
            fill: "var(--ink-muted)",
          }}
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
          formatter={(value, name) => [Number(value).toFixed(3), name]}
          labelFormatter={(value) => `${Number(value).toFixed(1)}°C`}
        />
        <Legend wrapperStyle={{ color: "var(--ink-secondary)", fontSize: "0.85rem", paddingTop: 16 }} />
        <Scatter
          name="Observed frequency"
          data={points}
          dataKey="activity_frequency"
          fill="var(--series-observed)"
        />
        <Line
          name={`Fitted (degree ${model.degree})`}
          data={curve}
          dataKey="fitted_frequency"
          stroke="var(--series-fitted)"
          strokeWidth={2}
          dot={false}
          type="monotone"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
