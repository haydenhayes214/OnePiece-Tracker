import { useCallback, useEffect, useState } from "react";
import { ARCS, TOTAL_EPISODES } from "@backend/data/arcs.js";
import { getCatchupFromProgress } from "@backend/lib/catchup.js";
import {
  deriveCurrentEpisode,
  getOverallStats,
  setArcWatched,
  setCurrentEpisode,
} from "@backend/lib/progress.js";
import { loadProgress, saveProgress } from "@backend/lib/storage.js";

export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const persist = useCallback(async (next) => {
    setProgress(next);
    setSaving(true);
    try {
      const saved = await saveProgress(next);
      setProgress(saved);
    } finally {
      setSaving(false);
    }
  }, []);

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
      persist({
        ...progress,
        arcProgress,
        currentEpisode: Math.min(TOTAL_EPISODES, Math.max(0, episode)),
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
    arcs: ARCS,
    totalEpisodes: TOTAL_EPISODES,
    progress,
    overall,
    catchup,
    saving,
    updateArc,
    updateCurrentEpisode,
    setTargetDate,
  };
}
