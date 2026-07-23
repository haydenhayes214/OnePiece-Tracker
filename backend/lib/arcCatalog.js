import {
  ARCS as BASE_ARCS,
  BASE_TOTAL_EPISODES,
  LATEST_ARC_ID,
  LATEST_MANGA_CHAPTER,
  getArcChapterCount,
  getArcEpisodeCount,
} from "../data/arcs.js";

export const EPISODE_META_KEY = "episodeCatalogMeta";

/** @typedef {{ latestEpisode: number, source: string, updatedAt: number } | null} EpisodeMeta */

let cachedArcs = [...BASE_ARCS];
let cachedMeta = null;

export function buildArcsFromMeta(meta) {
  const arcs = BASE_ARCS.map((a) => ({ ...a }));
  if (!meta?.latestEpisode) return arcs;

  const latest = arcs.find((a) => a.id === LATEST_ARC_ID);
  if (latest && meta.latestEpisode >= latest.start) {
    latest.end = meta.latestEpisode;
  }
  return arcs;
}

export function getArcs() {
  return cachedArcs;
}

export function getArcsForMedium(medium = "anime") {
  if (medium === "manga") {
    return cachedArcs.filter((arc) => getArcChapterCount(arc) > 0);
  }
  return cachedArcs;
}

export function getTotalEpisodes() {
  return cachedArcs[cachedArcs.length - 1]?.end ?? BASE_TOTAL_EPISODES;
}

export function getTotalChapters() {
  return LATEST_MANGA_CHAPTER;
}

export function getTotalItems(medium = "anime") {
  return medium === "manga" ? getTotalChapters() : getTotalEpisodes();
}

export function getArcItemCount(arc, medium = "anime") {
  return medium === "manga" ? getArcChapterCount(arc) : getArcEpisodeCount(arc);
}

export function getEpisodeMeta() {
  return cachedMeta;
}

export function applyEpisodeMeta(meta) {
  cachedMeta = meta;
  cachedArcs = buildArcsFromMeta(meta);
  return cachedArcs;
}

export function resetArcCatalog() {
  cachedMeta = null;
  cachedArcs = buildArcsFromMeta(null);
}

export { getArcEpisodeCount, getArcChapterCount, LATEST_ARC_ID, BASE_TOTAL_EPISODES, LATEST_MANGA_CHAPTER };
