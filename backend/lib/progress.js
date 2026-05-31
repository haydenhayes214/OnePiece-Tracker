import { ARCS, getArcEpisodeCount } from "../data/arcs.js";

/** @typedef {{ arcProgress: Record<string, number>, targetDate: string | null, currentEpisode: number }} UserProgress */

export const STORAGE_KEY = "onePieceProgress";

export const DEFAULT_PROGRESS = {
  arcProgress: {},
  targetDate: null,
  currentEpisode: 0,
};

/**
 * Episodes completed within a single arc (0 .. arc length).
 */
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

  for (const arc of ARCS) {
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

/**
 * Highest global episode number implied by per-arc progress.
 */
export function deriveCurrentEpisode(arcProgress) {
  let maxEpisode = 0;
  for (const arc of ARCS) {
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

/**
 * Set progress for one arc; optionally sync arcs before it as fully watched.
 */
export function setArcWatched(arcProgress, arcId, watched, { fillPrior = false } = {}) {
  const arc = ARCS.find((a) => a.id === arcId);
  if (!arc) return { ...arcProgress };

  const next = { ...arcProgress, [arcId]: clampArcWatched(arc, watched) };

  if (fillPrior) {
    const idx = ARCS.findIndex((a) => a.id === arcId);
    for (let i = 0; i < idx; i++) {
      const a = ARCS[i];
      next[a.id] = getArcEpisodeCount(a);
    }
  }

  return next;
}

/**
 * Mark through global episode number across arcs.
 */
export function setCurrentEpisode(arcProgress, episode) {
  const ep = Math.max(0, Math.floor(Number(episode)) || 0);
  const next = { ...arcProgress };

  for (const arc of ARCS) {
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
    arcProgress: stored.arcProgress && typeof stored.arcProgress === "object"
      ? { ...stored.arcProgress }
      : {},
    targetDate: stored.targetDate ?? null,
    currentEpisode:
      typeof stored.currentEpisode === "number" ? stored.currentEpisode : 0,
  };
}
