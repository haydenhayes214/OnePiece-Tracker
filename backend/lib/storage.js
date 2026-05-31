import {
  DEFAULT_PROGRESS,
  STORAGE_KEY,
  deriveCurrentEpisode,
  mergeStoredProgress,
} from "./progress.js";

export function isExtensionContext() {
  return typeof chrome !== "undefined" && chrome.storage?.local;
}

export function loadProgress() {
  if (!isExtensionContext()) {
    return Promise.resolve(loadFromLocalStorage());
  }

  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const merged = mergeStoredProgress(result[STORAGE_KEY]);
      merged.currentEpisode = deriveCurrentEpisode(merged.arcProgress);
      resolve(merged);
    });
  });
}

export function saveProgress(progress) {
  const payload = {
    ...progress,
    currentEpisode: deriveCurrentEpisode(progress.arcProgress),
  };

  if (!isExtensionContext()) {
    saveToLocalStorage(payload);
    return Promise.resolve(payload);
  }

  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: payload }, () => {
      resolve(payload);
    });
  });
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
