// Tiny wrapper around Umami's browser API. Does nothing if the tracking
// script is not configured, not loaded yet, or blocked by the visitor.

type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
  }
}

export function track(name: string, data?: EventData) {
  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics must never break the page.
  }
}
