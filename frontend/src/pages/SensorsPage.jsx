import { SensorsPanel } from "../features/sensors";

export default function SensorsPage() {
  return (
    <>
      <h1 style={{ margin: "0 0 var(--space-1)" }}>Sensors</h1>
      <p style={{ color: "var(--ink-secondary)", maxWidth: 640, margin: "0 0 var(--space-4)" }}>
        Battery and signal status for the 5 simulated forest sensors, plus battery drain over the
        7-day simulation window.
      </p>
      <SensorsPanel />
    </>
  );
}
