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

export default function DashboardHeader({
  overall,
  totalEpisodes,
  currentEpisode,
  targetDate,
  catchup,
  watchReminder,
  onSaveEpisode,
  onIncrementEpisode,
  onTargetDateChange,
  onWatchReminderChange,
}) {
  const [draftEpisode, setDraftEpisode] = useState(String(currentEpisode ?? 0));

  useEffect(() => {
    setDraftEpisode(String(currentEpisode ?? 0));
  }, [currentEpisode]);

  const remaining = overall?.remaining ?? 0;
  const targetLabel = formatTargetDate(targetDate);
  const episodesPerWeek =
    catchup && !catchup.isPast && !catchup.message && catchup.episodesPerWeek != null
      ? String(catchup.episodesPerWeek)
      : null;

  const handleSave = () => {
    const n = Math.min(totalEpisodes, Math.max(0, Number(draftEpisode) || 0));
    setDraftEpisode(String(n));
    onSaveEpisode(n);
  };

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <header className="dashboard">
      <div className="stat-grid">
        <StatCard
          title="Overall Progress"
          icon={<TrendIcon />}
          value={`${overall?.percent ?? 0}%`}
          subtext={`${overall?.watchedTotal ?? 0} / ${overall?.episodeTotal ?? totalEpisodes} episodes`}
        />
        <StatCard
          title="Episodes Remaining"
          icon={<TvIcon />}
          value={String(remaining)}
          subtext="episodes to go"
        />
        <StatCard
          title="Target Date"
          icon={<CalendarIcon />}
          value={targetLabel ?? "Not set"}
          muted={!targetLabel}
        />
        <StatCard
          title="Episodes/Week"
          icon={<TargetIcon />}
          value={episodesPerWeek ?? "Set target date"}
          muted={!episodesPerWeek}
        />
      </div>

      <section className="update-panel">
        <h2>Update Your Progress</h2>
        <p className="update-desc">Track which episode you&apos;re on and set your catch-up goal</p>

        <div className="update-columns">
          <div className="update-col">
            <label className="update-label" htmlFor="current-episode">
              Current Episode
            </label>
            <div className="episode-input-row">
              <input
                id="current-episode"
                type="number"
                min={0}
                max={totalEpisodes}
                value={draftEpisode}
                onChange={(e) => setDraftEpisode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <button type="button" className="save-btn" onClick={handleSave} aria-label="Save episode">
                <SaveIcon />
              </button>
            </div>
            <p className="episode-range">
              Episode 0 – {totalEpisodes}
            </p>
            <div className="quick-btns">
              <button type="button" onClick={() => onIncrementEpisode(1)}>
                +1 Episode
              </button>
              <button type="button" onClick={() => onIncrementEpisode(5)}>
                +5 Episodes
              </button>
              <button type="button" onClick={() => onIncrementEpisode(10)}>
                +10 Episodes
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
                <span className="reminder-title">Daily reminder</span>
                <span className="reminder-copy">
                  {targetDate ? "7:00 PM catch-up nudge" : "Set a target date first"}
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
