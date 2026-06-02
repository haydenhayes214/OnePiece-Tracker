/** Service worker — side panel + daily episode count sync (no bundler). */
const SYNC_ALARM = "episodeCountSync";
const WATCH_REMINDER_ALARM = "watchReminderDaily";
const EPISODE_META_KEY = "episodeCatalogMeta";
const PROGRESS_KEY = "onePieceProgress";
const REMINDER_KEY = "watchReminderSettings";
const JIKAN_ONE_PIECE_URL = "https://api.jikan.moe/v4/anime/21";
const BASE_TOTAL = 1164;
const STALE_MS = 24 * 60 * 60 * 1000;

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("sidePanel.setPanelBehavior:", error));

  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 24 * 60 });
  rescheduleWatchReminder();
  runEpisodeCountSync();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM) runEpisodeCountSync();
  if (alarm.name === WATCH_REMINDER_ALARM) sendWatchReminder();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SYNC_EPISODE_COUNT") {
    runEpisodeCountSync({ force: Boolean(message.force) })
      .then(sendResponse)
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }

  if (message?.type === "GET_WATCH_REMINDER") {
    getWatchReminderSettings()
      .then(sendResponse)
      .catch((error) => sendResponse({ enabled: false, error: error.message }));
    return true;
  }

  if (message?.type === "SET_WATCH_REMINDER") {
    setWatchReminderSettings(message.settings)
      .then(sendResponse)
      .catch((error) => sendResponse({ enabled: false, error: error.message }));
    return true;
  }
});

async function getWatchReminderSettings() {
  const result = await chrome.storage.local.get(REMINDER_KEY);
  return normalizeReminderSettings(result[REMINDER_KEY]);
}

async function setWatchReminderSettings(settings) {
  const next = normalizeReminderSettings(settings);
  await chrome.storage.local.set({ [REMINDER_KEY]: next });
  await rescheduleWatchReminder(next);
  return next;
}

function normalizeReminderSettings(settings) {
  return {
    enabled: Boolean(settings?.enabled),
    hour: clampHour(settings?.hour ?? 19),
  };
}

function clampHour(hour) {
  const n = Math.floor(Number(hour));
  if (!Number.isFinite(n)) return 19;
  return Math.max(0, Math.min(23, n));
}

async function rescheduleWatchReminder(settings) {
  const reminder = settings ?? (await getWatchReminderSettings());
  await chrome.alarms.clear(WATCH_REMINDER_ALARM);

  if (!reminder.enabled) return;

  chrome.alarms.create(WATCH_REMINDER_ALARM, {
    when: nextReminderTime(reminder.hour),
    periodInMinutes: 24 * 60,
  });
}

function nextReminderTime(hour) {
  const next = new Date();
  next.setHours(hour, 0, 0, 0);
  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

async function sendWatchReminder() {
  const reminder = await getWatchReminderSettings();
  if (!reminder.enabled || !chrome.notifications?.create) return;

  const stored = await chrome.storage.local.get([PROGRESS_KEY, EPISODE_META_KEY]);
  const progress = stored[PROGRESS_KEY];
  const remaining = getRemainingEpisodes(progress, stored[EPISODE_META_KEY]);
  const pacing = calculateReminderPacing(progress?.targetDate ?? null, remaining);

  if (remaining <= 0) {
    await chrome.notifications.create("log-pose-caught-up", {
      type: "basic",
      iconUrl: chrome.runtime.getURL("sidepanel/log-pose.svg"),
      title: "Log Pose",
      message: "You're caught up. The Grand Line can rest for today.",
    });
    return;
  }

  const message = pacing?.episodesPerDay
    ? `Watch ${pacing.episodesPerDay} episode${pacing.episodesPerDay === 1 ? "" : "s"} today to stay on pace.`
    : `${remaining} episode${remaining === 1 ? "" : "s"} left on your voyage.`;

  await chrome.notifications.create("log-pose-watch-reminder", {
    type: "basic",
    iconUrl: chrome.runtime.getURL("sidepanel/log-pose.svg"),
    title: "Time to set sail",
    message,
  });
}

function getRemainingEpisodes(progress, meta) {
  const total =
    typeof meta?.latestEpisode === "number" && meta.latestEpisode > 0
      ? Math.max(meta.latestEpisode, BASE_TOTAL)
      : BASE_TOTAL;
  const current =
    typeof progress?.currentEpisode === "number" && progress.currentEpisode > 0
      ? progress.currentEpisode
      : 0;
  return Math.max(0, total - current);
}

function calculateReminderPacing(targetDate, remaining) {
  if (!targetDate || remaining <= 0) return null;
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(`${targetDate}T12:00:00`));
  if (Number.isNaN(target.getTime())) return null;

  const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  return {
    episodesPerDay: days === 0 ? remaining : Math.ceil(remaining / days),
  };
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function runEpisodeCountSync({ force = false } = {}) {
  try {
    const stored = await chrome.storage.local.get(EPISODE_META_KEY);
    const meta = stored[EPISODE_META_KEY];
    const stale = !meta?.updatedAt || Date.now() - meta.updatedAt > STALE_MS;

    if (!force && meta && !stale) {
      return { meta, updated: false, count: meta.latestEpisode };
    }

    const response = await fetch(JIKAN_ONE_PIECE_URL);
    if (!response.ok) throw new Error(`API ${response.status}`);

    const json = await response.json();
    const count = json?.data?.episodes;
    if (typeof count !== "number" || count <= 0) {
      return { meta: meta ?? null, updated: false, count: meta?.latestEpisode ?? null };
    }

    const nextCount = Math.max(count, BASE_TOTAL);
    const changed = !meta || nextCount !== meta.latestEpisode;
    const nextMeta = {
      latestEpisode: nextCount,
      source: "jikan",
      updatedAt: Date.now(),
    };

    await chrome.storage.local.set({ [EPISODE_META_KEY]: nextMeta });

    if (changed) {
      chrome.runtime.sendMessage({ type: "EPISODE_COUNT_UPDATED", meta: nextMeta }).catch(() => {});
    }

    return { meta: nextMeta, updated: changed, count: nextCount };
  } catch (error) {
    console.error("Episode count sync failed:", error);
    return { error: error.message };
  }
}
