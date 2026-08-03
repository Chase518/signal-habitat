export default function ComingSoonPage({ title }) {
  return (
    <div>
      <h1 style={{ margin: "0 0 var(--space-1)" }}>{title}</h1>
      <p style={{ color: "var(--ink-secondary)" }}>
        This feature isn't implemented in this demo yet — routing and layout are wired up, the
        page itself is still a placeholder.
      </p>
    </div>
  );
}
