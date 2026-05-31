import { getSagaForArc } from "./sagas.js";

/** @typedef {{ primary: string, light: string, pillText: string, completeBg: string, border?: string }} SagaTheme */

/** @type {Record<string, SagaTheme>} */
export const SAGA_THEMES = {
  "east-blue": {
    primary: "#2563eb",
    light: "#dbeafe",
    pillText: "#1e40af",
    completeBg: "#eff6ff",
  },
  alabasta: {
    primary: "#d97706",
    light: "#fef3c7",
    pillText: "#92400e",
    completeBg: "#fffbeb",
  },
  "sky-island": {
    primary: "#ca8a04",
    light: "#fef9c3",
    pillText: "#854d0e",
    completeBg: "#fefce8",
    border: "#e7e5e4",
  },
  "water-7": {
    primary: "#06b6d4",
    light: "#cffafe",
    pillText: "#0e7490",
    completeBg: "#ecfeff",
  },
  "enies-lobby": {
    primary: "#dc2626",
    light: "#fee2e2",
    pillText: "#991b1b",
    completeBg: "#fef2f2",
  },
  "thriller-bark": {
    primary: "#6d28d9",
    light: "#ede9fe",
    pillText: "#3b0764",
    completeBg: "#f5f3ff",
    border: "#1e1b4b",
  },
  "summit-war": {
    primary: "#b91c1c",
    light: "#fecaca",
    pillText: "#7f1d1d",
    completeBg: "#fef2f2",
  },
  "fishman-island": {
    primary: "#14b8a6",
    light: "#ccfbf1",
    pillText: "#0f766e",
    completeBg: "#f0fdfa",
  },
  dressrosa: {
    primary: "#ec4899",
    light: "#fce7f3",
    pillText: "#9d174d",
    completeBg: "#fdf2f8",
  },
  "whole-cake": {
    primary: "#f472b6",
    light: "#fce7f3",
    pillText: "#be185d",
    completeBg: "#fdf2f8",
  },
  reverie: {
    primary: "#c084fc",
    light: "#f3e8ff",
    pillText: "#6b21a8",
    completeBg: "#faf5ff",
  },
  wano: {
    primary: "#dc2626",
    light: "#fef3c7",
    pillText: "#7f1d1d",
    completeBg: "#fff7ed",
    border: "#292524",
  },
  egghead: {
    primary: "#38bdf8",
    light: "#e0f2fe",
    pillText: "#0369a1",
    completeBg: "#f8fafc",
    border: "#e2e8f0",
  },
  elbaph: {
    primary: "#22c55e",
    light: "#dcfce7",
    pillText: "#166534",
    completeBg: "#f0fdf4",
  },
};

const DEFAULT_THEME = SAGA_THEMES["east-blue"];

/** Arc-specific themes (e.g. Enies Lobby within Water 7 saga). */
const ARC_THEME_KEYS = {
  "enies-lobby": "enies-lobby",
  "whole-cake": "whole-cake",
  reverie: "reverie",
  wano: "wano",
  egghead: "egghead",
  elbaph: "elbaph",
};

/**
 * @param {string} arcId
 * @returns {SagaTheme}
 */
export function getArcTheme(arcId) {
  const key = ARC_THEME_KEYS[arcId];
  if (key && SAGA_THEMES[key]) return SAGA_THEMES[key];

  const saga = getSagaForArc(arcId);
  if (saga && SAGA_THEMES[saga.id]) return SAGA_THEMES[saga.id];

  return DEFAULT_THEME;
}

/**
 * @param {string} sagaId
 * @returns {SagaTheme | null}
 */
export function getSagaTheme(sagaId) {
  if (sagaId === "all") return null;
  return SAGA_THEMES[sagaId] ?? null;
}
