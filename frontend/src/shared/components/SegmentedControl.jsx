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
            onClick={() => onChange(option.value)}
            style={{
              border: "none",
              borderRadius: "calc(var(--radius-control) - 2px)",
              padding: "6px 14px",
              font: "inherit",
              fontSize: "0.9rem",
              cursor: "pointer",
              background: selected ? "var(--series-observed)" : "transparent",
              color: selected ? "#ffffff" : "var(--ink-secondary)",
              transition: "background 120ms ease, color 120ms ease",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
