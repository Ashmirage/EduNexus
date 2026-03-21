import type { WordBook, Word } from "./types";

/**
 * Parse API response and throw on error.
 * Mirrors the pattern used in wordsStorage.
 */
async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    const message = payload?.error?.message ?? "Request failed";
    throw new Error(message);
  }
  return payload.data as T;
}

/**
 * Upload a CSV or JSON wordbook file and create a new custom book.
 */
export async function uploadCustomBook(file: File, name?: string, description?: string): Promise<WordBook> {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  
  const response = await fetch("/api/words/import", {
    method: "POST",
    body: formData,
  });
  
  const data = await parseApiResponse<{ book: WordBook }>(response);
  return data.book;
}

/**
 * List all custom wordbooks for the current user.
 */
export async function listCustomBooks(): Promise<WordBook[]> {
  const response = await fetch("/api/words/custom-books", { cache: "no-store" });
  const data = await parseApiResponse<{ books: WordBook[] }>(response);
  return data.books;
}

/**
 * Get a single custom book with its words.
 */
export async function getCustomBook(bookId: string): Promise<{ book: WordBook; words: Word[] }> {
  const response = await fetch(`/api/words/custom-books/${encodeURIComponent(bookId)}`, { cache: "no-store" });
  return parseApiResponse<{ book: WordBook; words: Word[] }>(response);
}

/**
 * Update the name and/or description of a custom book.
 */
export async function updateCustomBookMetadata(
  bookId: string,
  updates: { name?: string; description?: string }
): Promise<WordBook> {
  const response = await fetch(`/api/words/custom-books/${encodeURIComponent(bookId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await parseApiResponse<{ book: WordBook }>(response);
  return data.book;
}

/**
 * Replace the content of a custom book with a new CSV/JSON file.
 */
export async function replaceCustomBook(bookId: string, file: File): Promise<WordBook> {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`/api/words/custom-books/${encodeURIComponent(bookId)}/replace`, {
    method: "POST",
    body: formData,
  });
  
  const data = await parseApiResponse<{ book: WordBook }>(response);
  return data.book;
}

/**
 * Delete a custom book and all its entries.
 */
export async function deleteCustomBook(bookId: string): Promise<void> {
  const response = await fetch(`/api/words/custom-books/${encodeURIComponent(bookId)}`, {
    method: "DELETE",
  });
  await parseApiResponse<{ success: boolean }>(response);
}
