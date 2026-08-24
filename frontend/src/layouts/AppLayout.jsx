import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Analysis", path: "/", implemented: true },
  { label: "Sensors", path: "/sensors", implemented: true },
  { label: "Detections", path: "/detections", implemented: true },
  { label: "Alerts", path: "/alerts", implemented: false },
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
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              title={item.implemented ? undefined : "Not implemented in this demo yet"}
              style={({ isActive }) => ({
                padding: "6px 12px",
                borderRadius: "var(--radius-control)",
                fontSize: "0.85rem",
                textDecoration: "none",
                color: isActive ? "var(--ink-primary)" : "var(--ink-muted)",
                background: isActive ? "var(--surface-card-raised)" : "transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              })}
            >
              {item.label}
              {!item.implemented && (
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
            </NavLink>
          ))}
        </nav>
      </header>

      <main style={{ padding: "var(--space-5) var(--space-4)" }}>{children}</main>
    </div>
  );
}
