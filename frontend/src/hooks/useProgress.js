import { useCallback, useEffect, useState } from "react";
import { getArcs, getEpisodeMeta, getTotalEpisodes } from "@backend/lib/arcCatalog.js";
import { initArcCatalog, syncEpisodeCountIfStale } from "@backend/lib/episodeSync.js";
import { getCatchupFromProgress } from "@backend/lib/catchup.js";
import {
  deriveCurrentEpisode,
  getOverallStats,
  setArcWatched,
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

export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [episodeMeta, setEpisodeMeta] = useState(null);
  const [saving, setSaving] = useState(false);
  const [episodeSyncing, setEpisodeSyncing] = useState(false);
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
      const arcProgress = setArcWatched(progress.arcProgress, arcId, watched, options);
      persist({
        ...progress,
        arcProgress,
        currentEpisode: deriveCurrentEpisode(arcProgress),
      });
    },
    [progress, persist]
  );

  const updateCurrentEpisode = useCallback(
    (episode) => {
      if (!progress) return;
      const arcProgress = setCurrentEpisode(progress.arcProgress, episode);
      const max = getTotalEpisodes();
      persist({
        ...progress,
        arcProgress,
        currentEpisode: Math.min(max, Math.max(0, episode)),
      });
    },
    [progress, persist]
  );

  const setTargetDate = useCallback(
    (targetDate) => {
      if (!progress) return;
      persist({ ...progress, targetDate: targetDate || null });
    },
    [progress, persist]
  );

  const overall = progress ? getOverallStats(progress.arcProgress) : null;
  const catchup = progress
    ? getCatchupFromProgress(progress.targetDate, progress.arcProgress)
    : null;

  return {
    arcs: getArcs(),
    totalEpisodes: getTotalEpisodes(),
    progress,
    overall,
    catchup,
    saving,
    ready,
    episodeMeta,
    episodeSyncing,
    refreshEpisodeMeta,
    reloadProgress,
    updateArc,
    updateCurrentEpisode,
    setTargetDate,
  };
}
