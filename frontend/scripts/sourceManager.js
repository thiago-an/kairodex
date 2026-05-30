import {
  SOURCES
} from "./sources.js";

export function isSupportedSource(source) {
  return Object.values(SOURCES).includes(source);
}

export function getDefaultSource() {
  return SOURCES.MANGADEX;
}

export function normalizeSource(source) {
  if (isSupportedSource(source)) {
    return source;
  }

  return getDefaultSource();
}

export function canReadSource(source) {
  return [
    SOURCES.MANGADEX,
    SOURCES.FIREBASE
  ].includes(source);
}

export function isExternalSource(source) {
  return source !== SOURCES.FIREBASE;
}