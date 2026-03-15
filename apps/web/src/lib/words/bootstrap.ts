import { LOCAL_WORD_BOOK_SOURCES } from "@/data/words";

import { wordsStorage } from "./storage";

const WORDS_DATA_VERSION = "kylebing-cet4-cet6-v1";
const WORDS_DATA_VERSION_KEY = "edunexus_words_data_version";

export async function ensureWordsBootstrap(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const currentVersion = localStorage.getItem(WORDS_DATA_VERSION_KEY);
      if (currentVersion === WORDS_DATA_VERSION) {
        return;
      }
    } catch {
      // ignore localStorage read errors and continue sync
    }
  }

  for (const source of LOCAL_WORD_BOOK_SOURCES) {
    const book = {
      ...source.book,
      wordCount: source.words.length,
    };
    await wordsStorage.saveWordBook(book);
    await wordsStorage.saveWords(source.words);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(WORDS_DATA_VERSION_KEY, WORDS_DATA_VERSION);
    } catch {
      // ignore localStorage write errors
    }
  }
}
