import { BASE_TOTAL_EPISODES } from "../data/arcs.js";
import { applyEpisodeMeta, EPISODE_META_KEY } from "./arcCatalog.js";

const JIKAN_ONE_PIECE_URL = "https://api.jikan.moe/v4/anime/21";
const STALE_MS = 24 * 60 * 60 * 1000;

/**
 * Fetch latest aired episode count for One Piece (MAL id 21).
 * @returns {Promise<{ count: number, source: string } | null>}
 */
export async function fetchLatestEpisodeCount() {
  const response = await fetch(JIKAN_ONE_PIECE_URL);
  if (!response.ok) {
    throw new Error(`Episode API error (${response.status})`);
  }

  const json = await response.json();
  const count = json?.data?.episodes;

  if (typeof count === "number" && count > 0) {
    return { count, source: "jikan" };
  }

  return null;
}

export function readEpisodeMetaFromStorage(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.latestEpisode !== "number" || raw.latestEpisode <= 0) return null;
  return {
    latestEpisode: raw.latestEpisode,
    source: raw.source ?? "unknown",
    updatedAt: raw.updatedAt ?? 0,
  };
}

export function isEpisodeMetaStale(meta) {
  if (!meta?.updatedAt) return true;
  return Date.now() - meta.updatedAt > STALE_MS;
}

export async function loadEpisodeMeta() {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([EPISODE_META_KEY], (result) => {
        resolve(readEpisodeMetaFromStorage(result[EPISODE_META_KEY]));
      });
    });
  }

  try {
    const raw = localStorage.getItem(EPISODE_META_KEY);
    return raw ? readEpisodeMetaFromStorage(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export async function saveEpisodeMeta(meta) {
  applyEpisodeMeta(meta);

  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [EPISODE_META_KEY]: meta }, () => resolve(meta));
    });
  }

  localStorage.setItem(EPISODE_META_KEY, JSON.stringify(meta));
  return meta;
}

/**
 * Refresh episode count if cache is stale.
 */
export async function syncEpisodeCountIfStale({ force = false } = {}) {
  let meta = await loadEpisodeMeta();
  applyEpisodeMeta(meta);

  if (!force && meta && !isEpisodeMetaStale(meta)) {
    return { meta, updated: false, count: meta.latestEpisode };
  }

  try {
    const result = await fetchLatestEpisodeCount();
    if (!result) {
      return { meta, updated: false, count: meta?.latestEpisode ?? null };
    }

    const nextCount = Math.max(result.count, BASE_TOTAL_EPISODES);
    const changed = !meta || nextCount !== meta.latestEpisode;

    meta = {
      latestEpisode: nextCount,
      source: result.source,
      updatedAt: Date.now(),
    };

    await saveEpisodeMeta(meta);
    return { meta, updated: changed, count: nextCount };
  } catch (error) {
    console.warn("Episode sync failed:", error);
    return { meta, updated: false, count: meta?.latestEpisode ?? null, error };
  }
}

export async function initArcCatalog() {
  const meta = await loadEpisodeMeta();
  applyEpisodeMeta(meta);
  return meta;
}
