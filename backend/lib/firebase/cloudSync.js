import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getCurrentFirebaseUser } from "./auth.js";
import { getFirebaseDb } from "./app.js";
import { isFirebaseConfigured } from "./config.js";
import { mergeProgress, mergeStoredProgress } from "../progress.js";

const progressDoc = (uid) => doc(getFirebaseDb(), "users", uid, "data", "progress");

export function isCloudSyncAvailable() {
  return isFirebaseConfigured() && Boolean(getFirebaseDb());
}

export async function pullCloudProgress(uid) {
  if (!isCloudSyncAvailable()) return null;

  const snap = await getDoc(progressDoc(uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return mergeStoredProgress({
    arcProgress: data.arcProgress,
    mangaArcProgress: data.mangaArcProgress,
    targetDate: data.targetDate,
    mangaTargetDate: data.mangaTargetDate,
    currentEpisode: data.currentEpisode,
    currentChapter: data.currentChapter,
    updatedAt: data.updatedAt?.toMillis?.() ?? data.updatedAt ?? 0,
  });
}

export async function pushCloudProgress(uid, progress) {
  if (!isCloudSyncAvailable()) return;

  const payload = {
    arcProgress: progress.arcProgress,
    mangaArcProgress: progress.mangaArcProgress,
    targetDate: progress.targetDate,
    mangaTargetDate: progress.mangaTargetDate,
    currentEpisode: progress.currentEpisode,
    currentChapter: progress.currentChapter,
    updatedAt: progress.updatedAt ?? Date.now(),
    syncedAt: serverTimestamp(),
  };

  await setDoc(progressDoc(uid), payload, { merge: true });
}

export async function syncProgressToCloud(progress) {
  const user = getCurrentFirebaseUser();
  if (!user) return progress;
  await pushCloudProgress(user.uid, progress);
  return progress;
}

export async function fetchAndMergeCloudProgress(localProgress) {
  const user = getCurrentFirebaseUser();
  if (!user) return localProgress;

  const remote = await pullCloudProgress(user.uid);
  if (!remote) {
    await pushCloudProgress(user.uid, {
      ...localProgress,
      updatedAt: Date.now(),
    });
    return localProgress;
  }

  return mergeProgress(localProgress, remote);
}
