import { getArcs } from "../lib/arcCatalog.js";

/** @type {{ id: string, name: string, arcIds: string[] }[]} */
export const SAGAS = [
  {
    id: "east-blue",
    name: "East Blue",
    arcIds: [
      "romance-dawn",
      "orange-town",
      "syrup-village",
      "baratie",
      "arlong-park",
      "loguetown",
      "warship-island",
    ],
  },
  {
    id: "alabasta",
    name: "Alabasta",
    arcIds: [
      "reverse-mountain",
      "whisky-peak",
      "koby-helmeppo",
      "little-garden",
      "drum-island",
      "alabasta",
      "post-alabasta",
      "goat-island",
      "ruluka-island",
    ],
  },
  {
    id: "sky-island",
    name: "Sky Island",
    arcIds: ["jaya", "skypiea", "g8"],
  },
  {
    id: "water-7",
    name: "Water 7",
    arcIds: [
      "long-ring-long-land",
      "oceans-dream",
      "foxys-return",
      "water-7",
      "enies-lobby",
      "post-enies-lobby",
      "ice-hunter",
    ],
  },
  {
    id: "thriller-bark",
    name: "Thriller Bark",
    arcIds: ["thriller-bark", "spa-island"],
  },
  {
    id: "summit-war",
    name: "Summit War",
    arcIds: [
      "sabaody",
      "amazon-lily",
      "impel-down",
      "marineford",
      "post-war",
      "return-sabaody",
    ],
  },
  {
    id: "fishman-island",
    name: "Fish-Man Island",
    arcIds: ["fishman-island", "zs-ambition"],
  },
  {
    id: "dressrosa",
    name: "Dressrosa",
    arcIds: [
      "punk-hazard",
      "caesar-retrieval",
      "dressrosa",
      "silver-mine",
      "zou",
      "marine-rookie",
    ],
  },
  {
    id: "yonko",
    name: "Yonko",
    arcIds: ["whole-cake", "reverie", "wano"],
  },
  {
    id: "final",
    name: "Final Saga",
    arcIds: ["egghead", "elbaph"],
  },
];

export function getSagaForArc(arcId) {
  return SAGAS.find((s) => s.arcIds.includes(arcId));
}

export function getSagaName(arcId) {
  return getSagaForArc(arcId)?.name ?? "Unknown";
}

export function getArcsForSaga(sagaId) {
  const arcs = getArcs();
  if (sagaId === "all") return arcs;
  const saga = SAGAS.find((s) => s.id === sagaId);
  if (!saga) return [];
  return arcs.filter((a) => saga.arcIds.includes(a.id));
}

export const SAGA_TABS = [{ id: "all", name: "All Arcs" }, ...SAGAS.map((s) => ({ id: s.id, name: s.name }))];
