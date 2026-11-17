import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function getMobileMediaQuery() {
  return window.matchMedia(MOBILE_MEDIA_QUERY);
}

function subscribe(onStoreChange: () => void) {
  const mediaQuery = getMobileMediaQuery();
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return getMobileMediaQuery().matches;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}
