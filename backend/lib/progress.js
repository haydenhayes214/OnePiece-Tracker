import { getArcEpisodeCount, getArcs } from "./arcCatalog.js";

/** @typedef {{ arcProgress: Record<string, number>, targetDate: string | null, currentEpisode: number, updatedAt?: number }} UserProgress */

export const STORAGE_KEY = "onePieceProgress";

export const DEFAULT_PROGRESS = {
  arcProgress: {},
  targetDate: null,
  currentEpisode: 0,
  updatedAt: 0,
};

export function getArcWatched(arcProgress, arcId) {
  const n = arcProgress[arcId];
  return typeof n === "number" && n >= 0 ? n : 0;
}

export function getArcStats(arc, arcProgress) {
  const total = getArcEpisodeCount(arc);
  const watched = Math.min(getArcWatched(arcProgress, arc.id), total);
  const percent = total === 0 ? 0 : Math.round((watched / total) * 1000) / 10;
  return { total, watched, remaining: total - watched, percent };
}

export function getOverallStats(arcProgress) {
  let watchedTotal = 0;
  let episodeTotal = 0;

  for (const arc of getArcs()) {
    const total = getArcEpisodeCount(arc);
    const watched = Math.min(getArcWatched(arcProgress, arc.id), total);
    watchedTotal += watched;
    episodeTotal += total;
  }

  const remaining = episodeTotal - watchedTotal;
  const percent =
    episodeTotal === 0 ? 0 : Math.round((watchedTotal / episodeTotal) * 1000) / 10;

  return { watchedTotal, episodeTotal, remaining, percent };
}

export function deriveCurrentEpisode(arcProgress) {
  let maxEpisode = 0;
  for (const arc of getArcs()) {
    const watched = getArcWatched(arcProgress, arc.id);
    if (watched > 0) {
      maxEpisode = Math.max(maxEpisode, arc.start + watched - 1);
    }
  }
  return maxEpisode;
}

export function clampArcWatched(arc, value) {
  const total = getArcEpisodeCount(arc);
  return Math.max(0, Math.min(total, Math.floor(Number(value)) || 0));
}

export function setArcWatched(arcProgress, arcId, watched, { fillPrior = false } = {}) {
  const arc = getArcs().find((a) => a.id === arcId);
  if (!arc) return { ...arcProgress };

  const next = { ...arcProgress, [arcId]: clampArcWatched(arc, watched) };

  if (fillPrior) {
    const arcs = getArcs();
    const idx = arcs.findIndex((a) => a.id === arcId);
    for (let i = 0; i < idx; i++) {
      const a = arcs[i];
      next[a.id] = getArcEpisodeCount(a);
    }
  }

  return next;
}

export function setCurrentEpisode(arcProgress, episode) {
  const ep = Math.max(0, Math.floor(Number(episode)) || 0);
  const next = { ...arcProgress };

  for (const arc of getArcs()) {
    if (ep < arc.start) {
      next[arc.id] = 0;
    } else if (ep >= arc.end) {
      next[arc.id] = getArcEpisodeCount(arc);
    } else {
      next[arc.id] = ep - arc.start + 1;
    }
  }

  return next;
}

export function mergeStoredProgress(stored) {
  if (!stored || typeof stored !== "object") {
    return { ...DEFAULT_PROGRESS };
  }
  return {
    arcProgress:
      stored.arcProgress && typeof stored.arcProgress === "object"
        ? { ...stored.arcProgress }
        : {},
    targetDate: stored.targetDate ?? null,
    currentEpisode: typeof stored.currentEpisode === "number" ? stored.currentEpisode : 0,
    updatedAt: typeof stored.updatedAt === "number" ? stored.updatedAt : 0,
  };
}

/**
 * Merge local and cloud progress — keeps max per-arc watch counts; newest updatedAt wins for metadata.
 */
export function mergeProgress(local, remote) {
  if (!remote) return local;
  if (!local) return remote;

  const arcProgress = { ...local.arcProgress };
  for (const [arcId, remoteWatched] of Object.entries(remote.arcProgress ?? {})) {
    const localWatched = arcProgress[arcId] ?? 0;
    arcProgress[arcId] = Math.max(localWatched, remoteWatched);
  }

  const useRemoteMeta = (remote.updatedAt ?? 0) > (local.updatedAt ?? 0);

  return {
    arcProgress,
    targetDate: useRemoteMeta ? remote.targetDate : local.targetDate ?? remote.targetDate,
    currentEpisode: deriveCurrentEpisode(arcProgress),
    updatedAt: Math.max(local.updatedAt ?? 0, remote.updatedAt ?? 0),
  };
}
