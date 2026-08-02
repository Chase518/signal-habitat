import { AnalysisPanel } from "../features/analysis";

export default function AnalysisPage() {
  return (
    <main>
      <h1>Signal: Habitat</h1>
      <p style={{ color: "#94a3b8" }}>
        Is wildlife activity frequency related to temperature? Aggregated camera-trap detections
        against binned temperature readings, fitted with a switchable-degree polynomial model.
      </p>
      <AnalysisPanel />
    </main>
  );
}
