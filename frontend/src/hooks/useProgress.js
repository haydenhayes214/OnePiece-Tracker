import { useCallback, useEffect, useState } from "react";
import { getArcsForMedium, getEpisodeMeta, getTotalItems } from "@backend/lib/arcCatalog.js";
import { initArcCatalog, syncEpisodeCountIfStale } from "@backend/lib/episodeSync.js";
import { getCatchupFromProgress } from "@backend/lib/catchup.js";
import {
  deriveCurrentEpisode,
  deriveCurrentChapter,
  getCurrentProgressItem,
  getOverallStats,
  getProgressMap,
  getTargetDate,
  setArcWatched,
  setCurrentChapter,
  setCurrentEpisode,
} from "@backend/lib/progress.js";
import { loadProgress, saveProgress } from "@backend/lib/storage.js";

function requestBackgroundEpisodeSync(force = false) {
  if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({ type: "SYNC_EPISODE_COUNT", force }, () => {
      void chrome.runtime.lastError;
    });
  }
}

function requestWatchReminder(type, settings) {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    return Promise.resolve({ enabled: false, hour: 19 });
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, settings }, (response) => {
      void chrome.runtime.lastError;
      resolve(response ?? { enabled: false, hour: 19 });
    });
  });
}

export function useProgress(medium = "anime") {
  const [progress, setProgress] = useState(null);
  const [episodeMeta, setEpisodeMeta] = useState(null);
  const [saving, setSaving] = useState(false);
  const [episodeSyncing, setEpisodeSyncing] = useState(false);
  const [watchReminder, setWatchReminder] = useState({ enabled: false, hour: 19 });
  const [ready, setReady] = useState(false);

  const refreshEpisodeMeta = useCallback(async ({ force = false } = {}) => {
    setEpisodeSyncing(true);
    try {
      const result = await syncEpisodeCountIfStale({ force });
      setEpisodeMeta(result.meta ?? getEpisodeMeta());
      return result;
    } finally {
      setEpisodeSyncing(false);
    }
  }, []);

  const reloadProgress = useCallback(async () => {
    const data = await loadProgress();
    setProgress(data);
    setEpisodeMeta(getEpisodeMeta());
    return data;
  }, []);

  useEffect(() => {
    async function init() {
      await initArcCatalog();
      setEpisodeMeta(getEpisodeMeta());
      requestBackgroundEpisodeSync();
      const data = await loadProgress();
      setProgress(data);
      setWatchReminder(await requestWatchReminder("GET_WATCH_REMINDER"));
      await refreshEpisodeMeta();
      setReady(true);
    }
    init();
  }, [refreshEpisodeMeta]);

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.runtime?.onMessage) return;

    const listener = (message) => {
      if (message?.type === "EPISODE_COUNT_UPDATED") {
        initArcCatalog().then(() => {
          setEpisodeMeta(message.meta ?? getEpisodeMeta());
        });
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const persist = useCallback(
    async (next) => {
      setProgress(next);
      setSaving(true);
      try {
        const saved = await saveProgress(next);
        setProgress(saved);
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const updateArc = useCallback(
    (arcId, watched, options) => {
      if (!progress) return;
      const sourceProgress = getProgressMap(progress, medium);
      const arcProgress = setArcWatched(sourceProgress, arcId, watched, { ...options, medium });
      const next =
        medium === "manga"
          ? {
              ...progress,
              mangaArcProgress: arcProgress,
              currentChapter: deriveCurrentChapter(arcProgress),
            }
          : {
              ...progress,
              arcProgress,
              currentEpisode: deriveCurrentEpisode(arcProgress),
            };
      persist(next);
    },
    [medium, progress, persist]
  );

  const updateCurrentItem = useCallback(
    (item) => {
      if (!progress) return;
      const sourceProgress = getProgressMap(progress, medium);
      const arcProgress =
        medium === "manga"
          ? setCurrentChapter(sourceProgress, item)
          : setCurrentEpisode(sourceProgress, item);
      const max = getTotalItems(medium);
      const clamped = Math.min(max, Math.max(0, item));
      const next =
        medium === "manga"
          ? { ...progress, mangaArcProgress: arcProgress, currentChapter: clamped }
          : { ...progress, arcProgress, currentEpisode: clamped };
      persist(next);
    },
    [medium, progress, persist]
  );

  const updateCurrentEpisode = useCallback(
    (episode) => updateCurrentItem(episode),
    [updateCurrentItem]
  );

  const setTargetDate = useCallback(
    (targetDate) => {
      if (!progress) return;
      persist(
        medium === "manga"
          ? { ...progress, mangaTargetDate: targetDate || null }
          : { ...progress, targetDate: targetDate || null }
      );
      if (!targetDate && watchReminder.enabled) {
        requestWatchReminder("SET_WATCH_REMINDER", {
          ...watchReminder,
          enabled: false,
        }).then(setWatchReminder);
      }
    },
    [medium, progress, persist, watchReminder]
  );

  const setWatchReminderEnabled = useCallback(async (enabled) => {
    const next = await requestWatchReminder("SET_WATCH_REMINDER", {
      ...watchReminder,
      enabled,
    });
    setWatchReminder(next);
  }, [watchReminder]);

  const activeArcProgress = progress ? getProgressMap(progress, medium) : {};
  const activeTargetDate = progress ? getTargetDate(progress, medium) : null;
  const activeCurrentItem = progress ? getCurrentProgressItem(progress, medium) : 0;
  const overall = progress ? getOverallStats(activeArcProgress, medium) : null;
  const catchup = progress
    ? getCatchupFromProgress(activeTargetDate, activeArcProgress, medium)
    : null;

  return {
    arcs: getArcsForMedium(medium),
    totalEpisodes: getTotalItems(medium),
    totalItems: getTotalItems(medium),
    progress,
    activeArcProgress,
    activeTargetDate,
    activeCurrentItem,
    overall,
    catchup,
    saving,
    ready,
    episodeMeta,
    episodeSyncing,
    watchReminder,
    refreshEpisodeMeta,
    reloadProgress,
    updateArc,
    updateCurrentItem,
    updateCurrentEpisode,
    setTargetDate,
    setWatchReminderEnabled,
  };
}
