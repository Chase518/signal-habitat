import { AnalysisPanel } from "../features/analysis";

export default function AnalysisPage() {
  return (
    <>
      <h1 style={{ margin: "0 0 var(--space-1)" }}>Is temperature related to wildlife activity?</h1>
      <p style={{ color: "var(--ink-secondary)", maxWidth: 640, margin: "0 0 var(--space-4)" }}>
        Aggregated camera-trap detections against binned temperature readings from 5 simulated
        forest sensors, fitted with a switchable-degree polynomial model.
      </p>
      <AnalysisPanel />
    </>
  );
}
