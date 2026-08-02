const NAV_ITEMS = [
  { label: "Analysis", active: true },
  { label: "Sensors", active: false },
  { label: "Detections", active: false },
  { label: "Alerts", active: false },
];

export default function AppLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <header
        style={{
          borderBottom: "1px solid var(--border-hairline)",
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
          <strong style={{ fontSize: "1.1rem" }}>Signal: Habitat</strong>
          <span style={{ color: "var(--ink-muted)", fontSize: "0.85rem" }}>wildlife activity analysis</span>
        </div>

        <nav style={{ display: "flex", gap: "var(--space-1)" }}>
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              title={item.active ? undefined : "Not implemented in this demo"}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-control)",
                fontSize: "0.85rem",
                color: item.active ? "var(--ink-primary)" : "var(--ink-muted)",
                background: item.active ? "var(--surface-card-raised)" : "transparent",
                cursor: item.active ? "default" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {item.label}
              {!item.active && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    padding: "1px 6px",
                    borderRadius: 999,
                    border: "1px solid var(--border-hairline)",
                    color: "var(--ink-muted)",
                  }}
                >
                  soon
                </span>
              )}
            </span>
          ))}
        </nav>
      </header>

      <main style={{ padding: "var(--space-5) var(--space-4)" }}>{children}</main>
    </div>
  );
}
