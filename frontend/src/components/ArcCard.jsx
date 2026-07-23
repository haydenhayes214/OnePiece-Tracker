import { getArcTheme } from "@backend/data/sagaThemes.js";
import { getSagaName } from "@backend/data/sagas.js";
import { getArcItemCount } from "@backend/lib/arcCatalog.js";
import { getArcStats } from "@backend/lib/progress.js";

function CheckIcon({ color }) {
  return (
    <svg className="arc-check" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="10" fill={color} />
      <path
        d="M6 10.2l2.4 2.4L14 7.2"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ArcCard({ arc, arcProgress, expanded, medium = "anime", onToggle, onChange }) {
  const { total, watched, percent, remaining } = getArcStats(arc, arcProgress, medium);
  const isComplete = watched >= total && total > 0;
  const isInProgress = watched > 0 && !isComplete;
  const sagaName = getSagaName(arc.id);
  const theme = getArcTheme(arc.id);
  const itemCount = getArcItemCount(arc, medium);
  const start = medium === "manga" ? arc.mangaStart : arc.start;
  const end = medium === "manga" ? arc.mangaEnd : arc.end;
  const itemName = medium === "manga" ? "chapter" : "episode";
  const itemNamePlural = medium === "manga" ? "chapters" : "episodes";
  const itemShort = medium === "manga" ? "Ch." : "Ep.";
  const verb = medium === "manga" ? "Reading" : "Watching";
  const currentItem = isInProgress ? Math.min(start + watched - 1, end) : null;

  const setWatched = (value) => onChange(arc.id, value);

  const cardStyle = {
    "--arc-primary": theme.primary,
    "--arc-light": theme.light,
    "--arc-pill-text": theme.pillText,
    "--arc-complete-bg": theme.completeBg,
    "--arc-border": theme.border ?? theme.primary,
  };

  return (
    <article
      className={`arc-card arc-card--themed ${isComplete ? "complete" : ""} ${expanded ? "expanded" : ""}`}
      style={cardStyle}
      onClick={() => onToggle(arc.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(arc.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <div className="arc-card-top">
        <h3 className="arc-title">{arc.name}</h3>
        {isComplete && <CheckIcon color={theme.primary} />}
      </div>

      <div className="arc-meta">
        <span className="saga-pill">{sagaName}</span>
        <span className="arc-episodes">
          {itemShort} {start}-{end} ({itemCount} {itemName}
          {itemCount === 1 ? "" : "s"})
        </span>
      </div>

      <div className="arc-progress-row">
        <span className="progress-label">Progress</span>
        <span className="progress-percent">{percent}%</span>
      </div>

      <div className="progress-bar" aria-hidden>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      {isInProgress && currentItem && (
        <p className="arc-status">
          {verb} {itemName} {currentItem} of {end}
        </p>
      )}

      {expanded && (
        <div className="arc-editor" onClick={(e) => e.stopPropagation()}>
          <div className="arc-buttons">
            <button type="button" onClick={() => setWatched(watched - 1)} disabled={watched <= 0}>
              -1
            </button>
            <input
              type="number"
              min={0}
              max={total}
              value={watched}
              onChange={(e) => setWatched(Number(e.target.value))}
              aria-label={`${itemName} progress in ${arc.name}`}
            />
            <span className="arc-total">/ {total}</span>
            <button type="button" onClick={() => setWatched(watched + 1)} disabled={watched >= total}>
              +1
            </button>
            <button type="button" className="done-btn" onClick={() => setWatched(total)}>
              Mark done
            </button>
          </div>
          {remaining > 0 && (
            <p className="arc-remaining">
              {remaining} {remaining === 1 ? itemName : itemNamePlural} left in this arc
            </p>
          )}
        </div>
      )}
    </article>
  );
}
