const DEBUG_TODAY_KEY = "edunexus_words_debug_today";

function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function getWordsToday(): string {
  if (typeof window !== "undefined") {
    try {
      const debug = localStorage.getItem(DEBUG_TODAY_KEY);
      if (debug && isIsoDate(debug)) {
        return debug;
      }
    } catch {
      // ignore localStorage errors
    }
  }

  return toIsoDate(new Date());
}

export function getWordsDebugTodayKey(): string {
  return DEBUG_TODAY_KEY;
}
