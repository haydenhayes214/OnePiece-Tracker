import { useEffect, useState } from "react";

function StatCard({ title, icon, value, subtext, muted }) {
  return (
    <div className="stat-card">
      <div className="stat-card-head">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-icon" aria-hidden>
          {icon}
        </span>
      </div>
      <p className={`stat-card-value ${muted ? "muted" : ""}`}>{value}</p>
      {subtext && <p className="stat-card-sub">{subtext}</p>}
    </div>
  );
}

function TrendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="15" rx="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function formatTargetDate(iso) {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function DashboardHeader({
  overall,
  totalItems,
  currentItem,
  targetDate,
  catchup,
  medium = "anime",
  watchReminder,
  onSaveItem,
  onIncrementItem,
  onTargetDateChange,
  onWatchReminderChange,
}) {
  const [draftItem, setDraftItem] = useState(String(currentItem ?? 0));

  useEffect(() => {
    setDraftItem(String(currentItem ?? 0));
  }, [currentItem]);

  const itemName = medium === "manga" ? "chapter" : "episode";
  const itemTitle = titleCase(itemName);
  const itemPlural = medium === "manga" ? "chapters" : "episodes";
  const itemPluralTitle = titleCase(itemPlural);
  const remaining = overall?.remaining ?? 0;
  const targetLabel = formatTargetDate(targetDate);
  const perWeek =
    catchup && !catchup.isPast && !catchup.message && catchup.episodesPerWeek != null
      ? String(catchup.episodesPerWeek)
      : null;

  const handleSave = () => {
    const n = Math.min(totalItems, Math.max(0, Number(draftItem) || 0));
    setDraftItem(String(n));
    onSaveItem(n);
  };

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <header className="dashboard">
      <div className="stat-grid">
        <StatCard
          title="Overall Progress"
          icon={<TrendIcon />}
          value={`${overall?.percent ?? 0}%`}
          subtext={`${overall?.watchedTotal ?? 0} / ${overall?.totalItems ?? totalItems} ${itemPlural}`}
        />
        <StatCard
          title={`${itemPluralTitle} Remaining`}
          icon={medium === "manga" ? <BookIcon /> : <TvIcon />}
          value={String(remaining)}
          subtext={`${itemPlural} to go`}
        />
        <StatCard
          title="Target Date"
          icon={<CalendarIcon />}
          value={targetLabel ?? "Not set"}
          muted={!targetLabel}
        />
        <StatCard
          title={`${itemPluralTitle}/Week`}
          icon={<TargetIcon />}
          value={perWeek ?? "Set target date"}
          muted={!perWeek}
        />
      </div>

      <section className="update-panel">
        <h2>Update Your Progress</h2>
        <p className="update-desc">Track your current {itemName} and set your catch-up goal</p>

        <div className="update-columns">
          <div className="update-col">
            <label className="update-label" htmlFor="current-item">
              Current {itemTitle}
            </label>
            <div className="episode-input-row">
              <input
                id="current-item"
                type="number"
                min={0}
                max={totalItems}
                value={draftItem}
                onChange={(e) => setDraftItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <button type="button" className="save-btn" onClick={handleSave} aria-label={`Save ${itemName}`}>
                <SaveIcon />
              </button>
            </div>
            <p className="episode-range">
              {itemTitle} 0 - {totalItems}
            </p>
            <div className="quick-btns">
              <button type="button" onClick={() => onIncrementItem(1)}>
                +1 {itemTitle}
              </button>
              <button type="button" onClick={() => onIncrementItem(5)}>
                +5 {itemPluralTitle}
              </button>
              <button type="button" onClick={() => onIncrementItem(10)}>
                +10 {itemPluralTitle}
              </button>
            </div>
          </div>

          <div className="update-col">
            <label className="update-label" htmlFor="target-date">
              Target Catch-Up Date
            </label>
            <div className="date-input-wrap">
              <CalendarIcon />
              <input
                id="target-date"
                type="date"
                value={targetDate ?? ""}
                min={minDate}
                placeholder="Pick a date"
                onChange={(e) => onTargetDateChange(e.target.value)}
              />
            </div>
            <div className="reminder-row">
              <div>
                <span className="reminder-title">Daily progress reminder</span>
                <span className="reminder-copy">
                  {targetDate ? `7:00 PM ${itemName} nudge` : "Set a target date first"}
                </span>
              </div>
              <button
                type="button"
                className={`toggle-btn ${watchReminder?.enabled ? "active" : ""}`}
                onClick={() => onWatchReminderChange(!watchReminder?.enabled)}
                disabled={!targetDate}
                aria-pressed={Boolean(watchReminder?.enabled)}
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
