/** Service worker — side panel + daily episode count sync (no bundler). */
const SYNC_ALARM = "episodeCountSync";
const EPISODE_META_KEY = "episodeCatalogMeta";
const JIKAN_ONE_PIECE_URL = "https://api.jikan.moe/v4/anime/21";
const BASE_TOTAL = 1164;
const STALE_MS = 24 * 60 * 60 * 1000;

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("sidePanel.setPanelBehavior:", error));

  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 24 * 60 });
  runEpisodeCountSync();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM) runEpisodeCountSync();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "SYNC_EPISODE_COUNT") {
    runEpisodeCountSync({ force: Boolean(message.force) })
      .then(sendResponse)
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }
});

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
