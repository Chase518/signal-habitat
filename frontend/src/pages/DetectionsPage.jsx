import { DetectionsPanel } from "../features/detections";

export default function DetectionsPage() {
  return (
    <>
      <h1 style={{ margin: "0 0 var(--space-1)" }}>Detections</h1>
      <p style={{ color: "var(--ink-secondary)", maxWidth: 640, margin: "0 0 var(--space-4)" }}>
        Camera-trap detection events across the simulation window.
      </p>
      <DetectionsPanel />
    </>
  );
}
