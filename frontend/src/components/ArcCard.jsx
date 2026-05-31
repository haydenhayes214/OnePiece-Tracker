import { getArcStats } from "@backend/lib/progress.js";

export default function ArcCard({ arc, arcProgress, onChange }) {
  const { total, watched, percent, remaining } = getArcStats(arc, arcProgress);

  const setWatched = (value) => onChange(arc.id, value);

  return (
    <article className={`arc-card ${watched >= total && total > 0 ? "complete" : ""}`}>
      <div className="arc-header">
        <h3>{arc.name}</h3>
        <span className="arc-range">
          Eps {arc.start}–{arc.end}
        </span>
      </div>

      <div className="progress-bar" aria-hidden>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="arc-controls">
        <span className="arc-percent">{percent}%</span>
        <div className="arc-buttons">
          <button type="button" onClick={() => setWatched(watched - 1)} disabled={watched <= 0}>
            −
          </button>
          <input
            type="number"
            min={0}
            max={total}
            value={watched}
            onChange={(e) => setWatched(Number(e.target.value))}
            aria-label={`Episodes watched in ${arc.name}`}
          />
          <span className="arc-total">/ {total}</span>
          <button
            type="button"
            onClick={() => setWatched(watched + 1)}
            disabled={watched >= total}
          >
            +
          </button>
          <button type="button" className="ghost" onClick={() => setWatched(total)}>
            Done
          </button>
        </div>
      </div>

      {remaining > 0 && watched > 0 && (
        <p className="muted small">{remaining} left in this arc</p>
      )}
    </article>
  );
}
