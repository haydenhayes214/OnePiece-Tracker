import { getOverallStats } from "./progress.js";

/**
 * @param {string | null} targetDate ISO date string (YYYY-MM-DD)
 * @param {number} remainingEpisodes
 * @returns {{
 *   weeksRemaining: number,
 *   daysRemaining: number,
 *   episodesPerWeek: number | null,
 *   episodesPerDay: number | null,
 *   isPast: boolean,
 *   isToday: boolean,
 *   message: string | null
 * } | null}
 */
export function calculateCatchup(targetDate, remainingEpisodes) {
  if (!targetDate || remainingEpisodes <= 0) {
    return null;
  }

  const today = startOfDay(new Date());
  const target = startOfDay(new Date(targetDate + "T12:00:00"));

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil((target - today) / msPerDay);

  if (daysRemaining < 0) {
    return {
      weeksRemaining: 0,
      daysRemaining,
      episodesPerWeek: null,
      episodesPerDay: null,
      isPast: true,
      isToday: false,
      message: "That date is in the past. Pick a future catch-up date.",
    };
  }

  if (daysRemaining === 0) {
    return {
      weeksRemaining: 0,
      daysRemaining: 0,
      episodesPerWeek: remainingEpisodes,
      episodesPerDay: remainingEpisodes,
      isPast: false,
      isToday: true,
      message: `Catch up today: watch all ${remainingEpisodes} remaining episode${
        remainingEpisodes === 1 ? "" : "s"
      }.`,
    };
  }

  const weeksRemaining = daysRemaining / 7;
  const episodesPerWeek = Math.ceil(remainingEpisodes / weeksRemaining);
  const episodesPerDay = Math.ceil(remainingEpisodes / daysRemaining);

  return {
    weeksRemaining: Math.round(weeksRemaining * 10) / 10,
    daysRemaining,
    episodesPerWeek,
    episodesPerDay,
    isPast: false,
    isToday: false,
    message: null,
  };
}

export function getCatchupFromProgress(targetDate, arcProgress, medium = "anime") {
  const { remaining } = getOverallStats(arcProgress, medium);
  return calculateCatchup(targetDate, remaining);
}

function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}
