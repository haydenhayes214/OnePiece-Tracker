export default function OverallProgress({
  overall,
  currentEpisode,
  totalEpisodes,
  onCurrentEpisodeChange,
}) {
  if (!overall) return null;

  return (
    <header className="hero">
      <h1>One Piece Tracker</h1>
      <p className="hero-subtitle">
        {overall.watchedTotal} / {overall.episodeTotal} episodes · <strong>{overall.percent}%</strong>{" "}
        complete
      </p>

      <div className="overall-bar" aria-hidden>
        <div className="overall-fill" style={{ width: `${overall.percent}%` }} />
      </div>

      <label className="current-episode-field">
        <span>Current episode</span>
        <input
          type="number"
          min={0}
          max={totalEpisodes}
          value={currentEpisode}
          onChange={(e) => onCurrentEpisodeChange(Number(e.target.value))}
        />
        <span className="episode-max">/ {totalEpisodes}</span>
      </label>
    </header>
  );
}
