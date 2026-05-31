import { initArcCatalog } from "./episodeSync.js";
import {
  DEFAULT_PROGRESS,
  STORAGE_KEY,
  deriveCurrentEpisode,
  mergeProgress,
  mergeStoredProgress,
} from "./progress.js";
import { fetchAndMergeCloudProgress, syncProgressToCloud } from "./firebase/cloudSync.js";
import { getCurrentFirebaseUser, subscribeToAuth } from "./firebase/auth.js";
import { isFirebaseConfigured } from "./firebase/config.js";

export { subscribeToAuth, isFirebaseConfigured };

export function isExtensionContext() {
  return typeof chrome !== "undefined" && chrome.storage?.local;
}

async function loadLocalProgress() {
  if (!isExtensionContext()) {
    return loadFromLocalStorage();
  }

  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const merged = mergeStoredProgress(result[STORAGE_KEY]);
      merged.currentEpisode = deriveCurrentEpisode(merged.arcProgress);
      resolve(merged);
    });
  });
}

async function saveLocalProgress(progress) {
  const payload = {
    ...progress,
    currentEpisode: deriveCurrentEpisode(progress.arcProgress),
    updatedAt: Date.now(),
  };

  if (!isExtensionContext()) {
    saveToLocalStorage(payload);
    return payload;
  }

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: payload }, () => resolve(payload));
  });
}

export async function loadProgress() {
  await initArcCatalog();

  let local = await loadLocalProgress();

  if (isFirebaseConfigured() && getCurrentFirebaseUser()) {
    try {
      local = await fetchAndMergeCloudProgress(local);
      await saveLocalProgress(local);
    } catch (error) {
      console.warn("Cloud merge on load failed:", error);
    }
  }

  return local;
}

export async function saveProgress(progress) {
  const saved = await saveLocalProgress(progress);

  if (isFirebaseConfigured() && getCurrentFirebaseUser()) {
    try {
      await syncProgressToCloud(saved);
    } catch (error) {
      console.warn("Cloud save failed:", error);
    }
  }

  return saved;
}

/**
 * After sign-in: merge cloud data with local and persist.
 */
export async function syncAfterLogin() {
  const local = await loadLocalProgress();
  const merged = await fetchAndMergeCloudProgress(local);
  const saved = await saveLocalProgress(merged);
  return saved;
}

/**
 * On sign-out: keep local data; optionally merge cloud one last time is done before signOut in UI.
 */
export async function syncBeforeLogout() {
  const local = await loadLocalProgress();
  if (getCurrentFirebaseUser()) {
    await syncProgressToCloud(local);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const merged = mergeStoredProgress(JSON.parse(raw));
    merged.currentEpisode = deriveCurrentEpisode(merged.arcProgress);
    return merged;
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveToLocalStorage(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export { mergeProgress };
