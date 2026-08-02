import { useEffect, useState } from "react";
import { fetchAnalysis } from "../api/analysisApi";
import AnalysisChart from "./AnalysisChart";

export default function AnalysisPanel() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [modelKey, setModelKey] = useState("quadratic");

  useEffect(() => {
    fetchAnalysis().then(setAnalysis).catch(setError);
  }, []);

  if (error) {
    return (
      <p role="alert">
        Could not load analysis data — is the analysis service running on{" "}
        <code>localhost:8000</code>?
      </p>
    );
  }

  if (!analysis) {
    return <p>Loading analysis…</p>;
  }

  const model = analysis.models[modelKey];

  return (
    <section>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
        <label htmlFor="model-select">Fit model:</label>
        <select id="model-select" value={modelKey} onChange={(e) => setModelKey(e.target.value)}>
          <option value="linear">Linear</option>
          <option value="quadratic">Quadratic</option>
        </select>
        <span style={{ color: "#94a3b8" }}>
          R² = {model.r_squared.toFixed(3)}, max p-value ={" "}
          {Math.max(...model.p_values).toExponential(2)}
        </span>
      </div>

      <AnalysisChart points={analysis.aggregated_points} model={model} />

      <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
        {analysis.meta.confident_reading_count} of {analysis.meta.raw_reading_count} readings passed
        the battery/RSSI confidence filter, across {analysis.meta.sensor_count} sensors, yielding{" "}
        {analysis.meta.detection_count} detections.
      </p>
    </section>
  );
}
