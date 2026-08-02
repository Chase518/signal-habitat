import {
  CartesianGrid,
  ComposedChart,
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
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart margin={{ top: 16, right: 24, bottom: 16, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="temperature_bin_center"
          type="number"
          domain={["dataMin", "dataMax"]}
          label={{ value: "Temperature (°C)", position: "insideBottom", offset: -8, fill: "#94a3b8" }}
          stroke="#94a3b8"
        />
        <YAxis
          dataKey="activity_frequency"
          label={{ value: "Activity frequency", angle: -90, position: "insideLeft", fill: "#94a3b8" }}
          stroke="#94a3b8"
        />
        <Tooltip
          contentStyle={{ background: "#1e293b", border: "1px solid #334155" }}
          formatter={(value, name) => [Number(value).toFixed(3), name]}
          labelFormatter={(value) => `${Number(value).toFixed(1)}°C`}
        />
        <Scatter name="Observed frequency" data={points} dataKey="activity_frequency" fill="#38bdf8" />
        <Line
          name={`Fitted (degree ${model.degree})`}
          data={curve}
          dataKey="fitted_frequency"
          stroke="#f472b6"
          dot={false}
          type="monotone"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
