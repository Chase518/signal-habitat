export default function RecentEventsTable({ events }) {
  return (
    <div style={{ maxHeight: 320, overflowY: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--ink-muted)" }}>
            <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-hairline)" }}>Sensor</th>
            <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-hairline)" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={`${event.sensor_id}-${event.timestamp}-${index}`}>
              <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-hairline)", color: "var(--ink-primary)" }}>
                {event.sensor_id}
              </td>
              <td style={{ padding: "6px 8px", borderBottom: "1px solid var(--border-hairline)", color: "var(--ink-secondary)" }}>
                {event.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
