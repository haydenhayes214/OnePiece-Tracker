export default function OverallProgress({
  overall,
  currentEpisode,
  totalEpisodes,
  onCurrentEpisodeChange,
}) {
  if (!overall) return null;

  return (
    <header className="hero">
      <div className="hero-title">
        <span className="hat" aria-hidden>
          🏴‍☠️
        </span>
        <div>
          <h1>One Piece Tracker</h1>
          <p className="muted">Grand Line progress by arc</p>
        </div>
      </div>

      <div className="overall-bar" aria-hidden>
        <div className="overall-fill" style={{ width: `${overall.percent}%` }} />
      </div>
      <p className="overall-stats">
        <strong>{overall.percent}%</strong> · {overall.watchedTotal} / {overall.episodeTotal}{" "}
        episodes
      </p>

      <label className="field inline">
        <span>Current episode</span>
        <input
          type="number"
          min={0}
          max={totalEpisodes}
          value={currentEpisode}
          onChange={(e) => onCurrentEpisodeChange(Number(e.target.value))}
        />
        <span className="muted">/ {totalEpisodes}</span>
      </label>
    </header>
  );
}
