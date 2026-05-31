/**
 * One Piece anime arcs with inclusive episode ranges.
 * Update `end` on the latest arc as new episodes air.
 */
export const ARCS = [
  { id: "romance-dawn", name: "Romance Dawn", start: 1, end: 3 },
  { id: "orange-town", name: "Orange Town", start: 4, end: 8 },
  { id: "syrup-village", name: "Syrup Village", start: 9, end: 18 },
  { id: "baratie", name: "Baratie", start: 19, end: 30 },
  { id: "arlong-park", name: "Arlong Park", start: 31, end: 44 },
  { id: "loguetown", name: "Loguetown", start: 45, end: 53 },
  { id: "warship-island", name: "Warship Island", start: 54, end: 61 },
  { id: "reverse-mountain", name: "Reverse Mountain", start: 62, end: 63 },
  { id: "whisky-peak", name: "Whisky Peak", start: 64, end: 67 },
  { id: "koby-helmeppo", name: "Koby & Helmeppo", start: 68, end: 69 },
  { id: "little-garden", name: "Little Garden", start: 70, end: 77 },
  { id: "drum-island", name: "Drum Island", start: 78, end: 91 },
  { id: "alabasta", name: "Alabasta", start: 92, end: 130 },
  { id: "post-alabasta", name: "Post-Alabasta", start: 131, end: 135 },
  { id: "goat-island", name: "Goat Island", start: 136, end: 138 },
  { id: "ruluka-island", name: "Ruluka Island", start: 139, end: 143 },
  { id: "jaya", name: "Jaya", start: 144, end: 152 },
  { id: "skypiea", name: "Skypiea", start: 153, end: 195 },
  { id: "g8", name: "G-8", start: 196, end: 206 },
  { id: "long-ring-long-land", name: "Long Ring Long Land", start: 207, end: 219 },
  { id: "oceans-dream", name: "Ocean's Dream", start: 220, end: 224 },
  { id: "foxys-return", name: "Foxy's Return", start: 225, end: 226 },
  { id: "water-7", name: "Water 7", start: 227, end: 263 },
  { id: "enies-lobby", name: "Enies Lobby", start: 264, end: 312 },
  { id: "post-enies-lobby", name: "Post-Enies Lobby", start: 313, end: 325 },
  { id: "ice-hunter", name: "Ice Hunter", start: 326, end: 336 },
  { id: "thriller-bark", name: "Thriller Bark", start: 337, end: 381 },
  { id: "spa-island", name: "Spa Island", start: 382, end: 384 },
  { id: "sabaody", name: "Sabaody Archipelago", start: 385, end: 407 },
  { id: "amazon-lily", name: "Amazon Lily", start: 408, end: 417 },
  { id: "impel-down", name: "Impel Down", start: 418, end: 456 },
  { id: "marineford", name: "Marineford", start: 457, end: 489 },
  { id: "post-war", name: "Post-War", start: 490, end: 516 },
  { id: "return-sabaody", name: "Return to Sabaody", start: 517, end: 522 },
  { id: "fishman-island", name: "Fish-Man Island", start: 523, end: 574 },
  { id: "zs-ambition", name: "Z's Ambition", start: 575, end: 578 },
  { id: "punk-hazard", name: "Punk Hazard", start: 579, end: 628 },
  { id: "caesar-retrieval", name: "Caesar Retrieval", start: 629, end: 632 },
  { id: "dressrosa", name: "Dressrosa", start: 633, end: 746 },
  { id: "silver-mine", name: "Silver Mine", start: 747, end: 750 },
  { id: "zou", name: "Zou", start: 751, end: 779 },
  { id: "marine-rookie", name: "Marine Rookie", start: 780, end: 782 },
  { id: "whole-cake", name: "Whole Cake Island", start: 783, end: 877 },
  { id: "reverie", name: "Reverie", start: 878, end: 891 },
  { id: "wano", name: "Wano Country", start: 892, end: 1088 },
  { id: "egghead", name: "Egghead", start: 1089, end: 1155 },
  { id: "elbaph", name: "Elbaph", start: 1156, end: 1164 },
];

export const TOTAL_EPISODES = ARCS[ARCS.length - 1].end;

export function getArcEpisodeCount(arc) {
  return arc.end - arc.start + 1;
}

export function getArcById(id) {
  return ARCS.find((a) => a.id === id);
}
