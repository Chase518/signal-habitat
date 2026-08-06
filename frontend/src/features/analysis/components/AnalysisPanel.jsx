import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, SegmentedControl, StatTile } from "../../../shared";
import { loadAnalysis } from "../analysisSlice";
import AnalysisChart from "./AnalysisChart";
import PredictionInput from "./PredictionInput";

const MODEL_OPTIONS = [
  { label: "Linear", value: "linear" },
  { label: "Quadratic", value: "quadratic" },
  { label: "Neural Network", value: "neural_network", disabled: true },
];

export default function AnalysisPanel() {
  const dispatch = useDispatch();
  const { data: analysis, status, error } = useSelector((state) => state.analysis);
  const [modelKey, setModelKey] = useState("quadratic");

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadAnalysis());
    }
  }, [status, dispatch]);

  if (status === "failed") {
    return (
      <Card>
        <p role="alert" style={{ margin: 0, color: "var(--ink-secondary)" }}>
          Could not load analysis data ({error}) — is the analysis service running on{" "}
          <code>localhost:8080</code>?
        </p>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <p style={{ margin: 0, color: "var(--ink-secondary)" }}>Loading analysis…</p>
      </Card>
    );
  }

  const model = analysis.models[modelKey];
  const { meta } = analysis;
  const confidenceRate = ((meta.confident_reading_count / meta.raw_reading_count) * 100).toFixed(1);
  const temperatures = analysis.aggregated_points.map((point) => point.temperature_bin_center);
  const observedRange = { min: Math.min(...temperatures), max: Math.max(...temperatures) };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
        <StatTile label="Sensors" value={meta.sensor_count} />
        <StatTile label="Readings" value={meta.raw_reading_count.toLocaleString()} />
        <StatTile
          label="Passed confidence filter"
          value={`${confidenceRate}%`}
          hint={`${meta.confident_reading_count.toLocaleString()} of ${meta.raw_reading_count.toLocaleString()}`}
        />
        <StatTile label="Detections" value={meta.detection_count.toLocaleString()} />
      </div>

      <Card
        title="Activity frequency vs. temperature"
        action={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <span style={{ color: "var(--ink-secondary)", fontSize: "0.85rem" }}>
              R² = {model.r_squared.toFixed(3)}, max p = {Math.max(...model.p_values).toExponential(2)}
            </span>
            <SegmentedControl
              aria-label="Fit model"
              options={MODEL_OPTIONS}
              value={modelKey}
              onChange={setModelKey}
            />
          </div>
        }
      >
        <AnalysisChart points={analysis.aggregated_points} model={model} />
        <PredictionInput model={model} observedRange={observedRange} />
      </Card>
    </div>
  );
}
