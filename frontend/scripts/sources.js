export const SOURCES = {
  MANGADEX: "mangadex",
  FIREBASE: "firebase",
  COMICK: "comick"
};

export function getSourceLabel(source) {
  const labels = {
    mangadex: "MangaDex",
    firebase: "KairoDEX",
    comick: "Comick"
  };

  return labels[source] || "Fonte desconhecida";
}

export function getSourceBadge(source) {
  const badges = {
    mangadex: "MangaDex",
    firebase: "KairoDEX",
    comick: "Comick"
  };

  return badges[source] || "Fonte";
}