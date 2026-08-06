import { useState } from "react";
import { evaluatePolynomial } from "../lib/polynomial";

export default function PredictionInput({ model, observedRange }) {
  const [temperature, setTemperature] = useState(String(Math.round((observedRange.min + observedRange.max) / 2)));

  const parsed = Number(temperature);
  const hasValue = temperature.trim() !== "" && !Number.isNaN(parsed);
  const prediction = hasValue ? evaluatePolynomial(model.coefficients, parsed) : null;
  const isExtrapolating = hasValue && (parsed < observedRange.min || parsed > observedRange.max);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        flexWrap: "wrap",
        paddingTop: "var(--space-3)",
        borderTop: "1px solid var(--border-hairline)",
      }}
    >
      <label htmlFor="predict-temperature" style={{ color: "var(--ink-secondary)", fontSize: "0.9rem" }}>
        Predict activity frequency at
      </label>
      <input
        id="predict-temperature"
        type="number"
        step="0.5"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        style={{
          width: "5rem",
          padding: "4px 8px",
          borderRadius: "var(--radius-control)",
          border: "1px solid var(--border-hairline)",
          background: "var(--surface-card-raised)",
          color: "var(--ink-primary)",
          font: "inherit",
        }}
      />
      <span style={{ color: "var(--ink-secondary)", fontSize: "0.9rem" }}>°C:</span>

      {prediction !== null && (
        <strong style={{ color: "var(--ink-primary)", fontVariantNumeric: "tabular-nums" }}>
          {prediction.toFixed(3)}
        </strong>
      )}

      {isExtrapolating && (
        <span style={{ color: "var(--series-fitted)", fontSize: "0.8rem" }}>
          outside the observed {observedRange.min.toFixed(1)}–{observedRange.max.toFixed(1)}°C range —
          extrapolated, not fitted
        </span>
      )}
    </div>
  );
}
