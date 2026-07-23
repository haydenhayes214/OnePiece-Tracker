/**
 * One Piece arcs with inclusive anime episode ranges and manga chapter ranges.
 * The latest arc end is extended automatically via episode sync.
 */
export const LATEST_ARC_ID = "elbaph";
export const LATEST_MANGA_CHAPTER = 1188;

export const ARCS = [
  { id: "romance-dawn", name: "Romance Dawn", start: 1, end: 3, mangaStart: 1, mangaEnd: 7 },
  { id: "orange-town", name: "Orange Town", start: 4, end: 8, mangaStart: 8, mangaEnd: 21 },
  { id: "syrup-village", name: "Syrup Village", start: 9, end: 18, mangaStart: 22, mangaEnd: 41 },
  { id: "baratie", name: "Baratie", start: 19, end: 30, mangaStart: 42, mangaEnd: 68 },
  { id: "arlong-park", name: "Arlong Park", start: 31, end: 44, mangaStart: 69, mangaEnd: 95 },
  { id: "loguetown", name: "Loguetown", start: 45, end: 53, mangaStart: 96, mangaEnd: 100 },
  { id: "warship-island", name: "Warship Island", start: 54, end: 61 },
  { id: "reverse-mountain", name: "Reverse Mountain", start: 62, end: 63, mangaStart: 101, mangaEnd: 105 },
  { id: "whisky-peak", name: "Whisky Peak", start: 64, end: 67, mangaStart: 106, mangaEnd: 114 },
  { id: "koby-helmeppo", name: "Koby & Helmeppo", start: 68, end: 69 },
  { id: "little-garden", name: "Little Garden", start: 70, end: 77, mangaStart: 115, mangaEnd: 129 },
  { id: "drum-island", name: "Drum Island", start: 78, end: 91, mangaStart: 130, mangaEnd: 154 },
  { id: "alabasta", name: "Alabasta", start: 92, end: 130, mangaStart: 155, mangaEnd: 217 },
  { id: "post-alabasta", name: "Post-Alabasta", start: 131, end: 135 },
  { id: "goat-island", name: "Goat Island", start: 136, end: 138 },
  { id: "ruluka-island", name: "Ruluka Island", start: 139, end: 143 },
  { id: "jaya", name: "Jaya", start: 144, end: 152, mangaStart: 218, mangaEnd: 236 },
  { id: "skypiea", name: "Skypiea", start: 153, end: 195, mangaStart: 237, mangaEnd: 302 },
  { id: "g8", name: "G-8", start: 196, end: 206 },
  { id: "long-ring-long-land", name: "Long Ring Long Land", start: 207, end: 219, mangaStart: 303, mangaEnd: 321 },
  { id: "oceans-dream", name: "Ocean's Dream", start: 220, end: 224 },
  { id: "foxys-return", name: "Foxy's Return", start: 225, end: 226 },
  { id: "water-7", name: "Water 7", start: 227, end: 263, mangaStart: 322, mangaEnd: 374 },
  { id: "enies-lobby", name: "Enies Lobby", start: 264, end: 312, mangaStart: 375, mangaEnd: 430 },
  { id: "post-enies-lobby", name: "Post-Enies Lobby", start: 313, end: 325, mangaStart: 431, mangaEnd: 441 },
  { id: "ice-hunter", name: "Ice Hunter", start: 326, end: 336 },
  { id: "thriller-bark", name: "Thriller Bark", start: 337, end: 381, mangaStart: 442, mangaEnd: 489 },
  { id: "spa-island", name: "Spa Island", start: 382, end: 384 },
  { id: "sabaody", name: "Sabaody Archipelago", start: 385, end: 407, mangaStart: 490, mangaEnd: 513 },
  { id: "amazon-lily", name: "Amazon Lily", start: 408, end: 417, mangaStart: 514, mangaEnd: 524 },
  { id: "impel-down", name: "Impel Down", start: 418, end: 456, mangaStart: 525, mangaEnd: 549 },
  { id: "marineford", name: "Marineford", start: 457, end: 489, mangaStart: 550, mangaEnd: 580 },
  { id: "post-war", name: "Post-War", start: 490, end: 516, mangaStart: 581, mangaEnd: 597 },
  { id: "return-sabaody", name: "Return to Sabaody", start: 517, end: 522, mangaStart: 598, mangaEnd: 602 },
  { id: "fishman-island", name: "Fish-Man Island", start: 523, end: 574, mangaStart: 603, mangaEnd: 653 },
  { id: "zs-ambition", name: "Z's Ambition", start: 575, end: 578 },
  { id: "punk-hazard", name: "Punk Hazard", start: 579, end: 628, mangaStart: 654, mangaEnd: 699 },
  { id: "caesar-retrieval", name: "Caesar Retrieval", start: 629, end: 632 },
  { id: "dressrosa", name: "Dressrosa", start: 633, end: 746, mangaStart: 700, mangaEnd: 801 },
  { id: "silver-mine", name: "Silver Mine", start: 747, end: 750 },
  { id: "zou", name: "Zou", start: 751, end: 779, mangaStart: 802, mangaEnd: 824 },
  { id: "marine-rookie", name: "Marine Rookie", start: 780, end: 782 },
  { id: "whole-cake", name: "Whole Cake Island", start: 783, end: 877, mangaStart: 825, mangaEnd: 902 },
  { id: "reverie", name: "Reverie", start: 878, end: 891, mangaStart: 903, mangaEnd: 908 },
  { id: "wano", name: "Wano Country", start: 892, end: 1088, mangaStart: 909, mangaEnd: 1057 },
  { id: "egghead", name: "Egghead", start: 1089, end: 1155, mangaStart: 1058, mangaEnd: 1125 },
  { id: "elbaph", name: "Elbaph", start: 1156, end: 1164, mangaStart: 1126, mangaEnd: LATEST_MANGA_CHAPTER },
];

export const BASE_TOTAL_EPISODES = ARCS[ARCS.length - 1].end;

export function getArcEpisodeCount(arc) {
  return arc.end - arc.start + 1;
}

export function getArcChapterCount(arc) {
  if (!arc.mangaStart || !arc.mangaEnd) return 0;
  return arc.mangaEnd - arc.mangaStart + 1;
}

export function getArcById(id) {
  return ARCS.find((a) => a.id === id);
}
