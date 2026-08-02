export default function StatTile({ label, value, hint }) {
  return (
    <div
      style={{
        background: "var(--surface-card-raised)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-control)",
        padding: "var(--space-3)",
        flex: "1 1 140px",
      }}
    >
      <div style={{ color: "var(--ink-muted)", fontSize: "0.8rem" }}>{label}</div>
      <div
        style={{
          color: "var(--ink-primary)",
          fontSize: "1.5rem",
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
          marginTop: "var(--space-1)",
        }}
      >
        {value}
      </div>
      {hint && <div style={{ color: "var(--ink-secondary)", fontSize: "0.8rem" }}>{hint}</div>}
    </div>
  );
}
