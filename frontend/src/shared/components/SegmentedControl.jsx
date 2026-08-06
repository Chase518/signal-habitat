export default function SegmentedControl({ options, value, onChange, "aria-label": ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        background: "var(--surface-card-raised)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-control)",
        padding: 2,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            title={option.disabled ? "Not implemented in this demo (see docs/decisions.md)" : undefined}
            onClick={() => onChange(option.value)}
            style={{
              border: "none",
              borderRadius: "calc(var(--radius-control) - 2px)",
              padding: "6px 14px",
              font: "inherit",
              fontSize: "0.9rem",
              cursor: option.disabled ? "not-allowed" : "pointer",
              background: selected ? "var(--series-observed)" : "transparent",
              color: option.disabled ? "var(--ink-muted)" : selected ? "#ffffff" : "var(--ink-secondary)",
              opacity: option.disabled ? 0.6 : 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "background 120ms ease, color 120ms ease",
            }}
          >
            {option.label}
            {option.disabled && (
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
          </button>
        );
      })}
    </div>
  );
}
