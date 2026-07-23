import { getArcItemCount, getArcsForMedium } from "./arcCatalog.js";

/** @typedef {"anime" | "manga"} ProgressMedium */
/** @typedef {{ arcProgress: Record<string, number>, mangaArcProgress: Record<string, number>, targetDate: string | null, mangaTargetDate: string | null, currentEpisode: number, currentChapter: number, updatedAt?: number }} UserProgress */

export const STORAGE_KEY = "onePieceProgress";

export const DEFAULT_PROGRESS = {
  arcProgress: {},
  mangaArcProgress: {},
  targetDate: null,
  mangaTargetDate: null,
  currentEpisode: 0,
  currentChapter: 0,
  updatedAt: 0,
};

export function getArcWatched(arcProgress, arcId) {
  const n = arcProgress?.[arcId];
  return typeof n === "number" && n >= 0 ? n : 0;
}

export function getArcStats(arc, arcProgress, medium = "anime") {
  const total = getArcItemCount(arc, medium);
  const watched = Math.min(getArcWatched(arcProgress, arc.id), total);
  const percent = total === 0 ? 0 : Math.round((watched / total) * 1000) / 10;
  return { total, watched, remaining: total - watched, percent };
}

export function getOverallStats(arcProgress, medium = "anime") {
  let watchedTotal = 0;
  let totalItems = 0;

  for (const arc of getArcsForMedium(medium)) {
    const total = getArcItemCount(arc, medium);
    const watched = Math.min(getArcWatched(arcProgress, arc.id), total);
    watchedTotal += watched;
    totalItems += total;
  }

  const remaining = totalItems - watchedTotal;
  const percent =
    totalItems === 0 ? 0 : Math.round((watchedTotal / totalItems) * 1000) / 10;

  return { watchedTotal, episodeTotal: totalItems, totalItems, remaining, percent };
}

export function deriveCurrentItem(arcProgress, medium = "anime") {
  let maxItem = 0;
  for (const arc of getArcsForMedium(medium)) {
    const watched = getArcWatched(arcProgress, arc.id);
    if (watched > 0) {
      const start = medium === "manga" ? arc.mangaStart : arc.start;
      maxItem = Math.max(maxItem, start + watched - 1);
    }
  }
  return maxItem;
}

export function deriveCurrentEpisode(arcProgress) {
  return deriveCurrentItem(arcProgress, "anime");
}

export function deriveCurrentChapter(arcProgress) {
  return deriveCurrentItem(arcProgress, "manga");
}

export function clampArcWatched(arc, value, medium = "anime") {
  const total = getArcItemCount(arc, medium);
  return Math.max(0, Math.min(total, Math.floor(Number(value)) || 0));
}

export function setArcWatched(arcProgress, arcId, watched, { fillPrior = false, medium = "anime" } = {}) {
  const arcs = getArcsForMedium(medium);
  const arc = arcs.find((a) => a.id === arcId);
  if (!arc) return { ...arcProgress };

  const next = { ...arcProgress, [arcId]: clampArcWatched(arc, watched, medium) };

  if (fillPrior) {
    const idx = arcs.findIndex((a) => a.id === arcId);
    for (let i = 0; i < idx; i++) {
      const a = arcs[i];
      next[a.id] = getArcItemCount(a, medium);
    }
  }

  return next;
}

export function setCurrentItem(arcProgress, item, medium = "anime") {
  const current = Math.max(0, Math.floor(Number(item)) || 0);
  const next = { ...arcProgress };

  for (const arc of getArcsForMedium(medium)) {
    const start = medium === "manga" ? arc.mangaStart : arc.start;
    const end = medium === "manga" ? arc.mangaEnd : arc.end;
    if (current < start) {
      next[arc.id] = 0;
    } else if (current >= end) {
      next[arc.id] = getArcItemCount(arc, medium);
    } else {
      next[arc.id] = current - start + 1;
    }
  }

  return next;
}

export function setCurrentEpisode(arcProgress, episode) {
  return setCurrentItem(arcProgress, episode, "anime");
}

export function setCurrentChapter(arcProgress, chapter) {
  return setCurrentItem(arcProgress, chapter, "manga");
}

export function getProgressMap(progress, medium = "anime") {
  return medium === "manga" ? progress.mangaArcProgress ?? {} : progress.arcProgress ?? {};
}

export function getCurrentProgressItem(progress, medium = "anime") {
  return medium === "manga" ? progress.currentChapter ?? 0 : progress.currentEpisode ?? 0;
}

export function getTargetDate(progress, medium = "anime") {
  return medium === "manga" ? progress.mangaTargetDate ?? null : progress.targetDate ?? null;
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
    mangaArcProgress:
      stored.mangaArcProgress && typeof stored.mangaArcProgress === "object"
        ? { ...stored.mangaArcProgress }
        : {},
    targetDate: stored.targetDate ?? null,
    mangaTargetDate: stored.mangaTargetDate ?? null,
    currentEpisode: typeof stored.currentEpisode === "number" ? stored.currentEpisode : 0,
    currentChapter: typeof stored.currentChapter === "number" ? stored.currentChapter : 0,
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

  const mangaArcProgress = { ...(local.mangaArcProgress ?? {}) };
  for (const [arcId, remoteRead] of Object.entries(remote.mangaArcProgress ?? {})) {
    const localRead = mangaArcProgress[arcId] ?? 0;
    mangaArcProgress[arcId] = Math.max(localRead, remoteRead);
  }

  const useRemoteMeta = (remote.updatedAt ?? 0) > (local.updatedAt ?? 0);

  return {
    arcProgress,
    mangaArcProgress,
    targetDate: useRemoteMeta ? remote.targetDate : local.targetDate ?? remote.targetDate,
    mangaTargetDate: useRemoteMeta
      ? remote.mangaTargetDate
      : local.mangaTargetDate ?? remote.mangaTargetDate,
    currentEpisode: deriveCurrentEpisode(arcProgress),
    currentChapter: deriveCurrentChapter(mangaArcProgress),
    updatedAt: Math.max(local.updatedAt ?? 0, remote.updatedAt ?? 0),
  };
}
