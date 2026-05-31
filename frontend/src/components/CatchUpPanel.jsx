export default function CatchUpPanel({ targetDate, catchup, remaining, onTargetDateChange, collapsed, onToggle }) {
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <section className={`catchup-panel ${collapsed ? "collapsed" : ""}`}>
      <button type="button" className="catchup-toggle" onClick={onToggle}>
        <span>Catch-up plan</span>
        <span className="catchup-chevron" aria-hidden>
          {collapsed ? "▼" : "▲"}
        </span>
      </button>

      {!collapsed && (
        <div className="catchup-body">
          <p className="catchup-summary">
            {remaining > 0
              ? `${remaining} episode${remaining === 1 ? "" : "s"} left until you are caught up.`
              : "You are caught up with all aired episodes."}
          </p>

          <label className="catchup-date-field">
            <span>Target date</span>
            <input
              type="date"
              value={targetDate ?? ""}
              min={minDate}
              onChange={(e) => onTargetDateChange(e.target.value)}
            />
          </label>

          {catchup && (
            <div className={`catchup-result ${catchup.isPast ? "error" : ""}`}>
              {catchup.message ? (
                <p>{catchup.message}</p>
              ) : (
                <p className="catchup-highlight">
                  Watch about <strong>{catchup.episodesPerWeek}</strong> episodes per week
                  <span className="catchup-sub">
                    ({catchup.daysRemaining} days · ~{catchup.episodesPerDay}/day)
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
