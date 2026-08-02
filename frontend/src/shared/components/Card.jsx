export default function Card({ title, action, children, style }) {
  return (
    <section
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-card)",
        padding: "var(--space-4)",
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-3)",
            marginBottom: "var(--space-3)",
          }}
        >
          {title && <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
