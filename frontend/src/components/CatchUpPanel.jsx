export default function CatchUpPanel({ targetDate, catchup, remaining, onTargetDateChange }) {
  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <section className="panel catchup-panel">
      <h2>Catch-up plan</h2>
      <p className="muted">
        {remaining > 0
          ? `${remaining} episode${remaining === 1 ? "" : "s"} left to reach the latest aired episode.`
          : "You are caught up with all aired episodes!"}
      </p>

      <label className="field">
        <span>Target catch-up date</span>
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
            <>
              <p className="catchup-highlight">
                Watch about <strong>{catchup.episodesPerWeek}</strong> episode
                {catchup.episodesPerWeek === 1 ? "" : "s"} per week
              </p>
              <p className="muted small">
                {catchup.daysRemaining} days left ({catchup.weeksRemaining} weeks) · ~
                {catchup.episodesPerDay}/day if you spread evenly
              </p>
            </>
          )}
        </div>
      )}

      {!targetDate && remaining > 0 && (
        <p className="muted small">Pick a date to see your weekly watch goal.</p>
      )}
    </section>
  );
}
