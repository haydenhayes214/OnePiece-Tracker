export default function EpisodeSyncBanner({ meta, syncing, onRefresh }) {
  if (!meta && !syncing) return null;

  const updatedLabel = meta?.updatedAt
    ? new Date(meta.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="episode-sync-banner">
      <span>
        {syncing
          ? "Checking for new episodes…"
          : meta
            ? `Tracking through episode ${meta.latestEpisode}${updatedLabel ? ` · updated ${updatedLabel}` : ""}`
            : null}
      </span>
      {!syncing && (
        <button type="button" className="episode-sync-refresh" onClick={onRefresh}>
          Refresh
        </button>
      )}
    </div>
  );
}
