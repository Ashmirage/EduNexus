/**
 * Workspace Agent KB Autosave — Adapter
 * Turns a saved assistant reply into a KBDocument in the current vault.
 */

import { getKBStorage } from "./kb-storage";

export type SavedReply = {
  userQuestion: string;
  assistantAnswer: string;
  sessionId: string;
  timestamp: string; // ISO date string
  teacherName?: string;
};

export type SaveResult =
  | { ok: true; documentId: string }
  | { ok: false; error: string };

/**
 * Builds the document content with a minimal source metadata block.
 */
function buildContent(reply: SavedReply): string {
  const meta = [
    "---",
    `source: workspace-saved`,
    `sessionId: ${reply.sessionId}`,
    `timestamp: ${reply.timestamp}`,
    reply.teacherName ? `teacher: ${reply.teacherName}` : null,
    "mode: normal",
    `sourcePage: /workspace`,
    "---",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `${reply.assistantAnswer}\n\n${meta}`;
}

/**
 * Creates a KBDocument from a saved assistant reply in the current vault.
 * Returns an explicit success/error payload — no silent failures.
 */
export async function saveReplyAsKBDocument(reply: SavedReply): Promise<SaveResult> {
  const storage = getKBStorage();
  const vaultId = storage.getCurrentVaultId();

  if (!vaultId) {
    return {
      ok: false,
      error: "No current vault set. Please open or create a knowledge vault first.",
    };
  }

  try {
    const doc = await storage.createDocument(
      vaultId,
      reply.userQuestion, // title = verbatim user question
      buildContent(reply),
      ["workspace-saved"] // default tags
    );

    return { ok: true, documentId: doc.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Failed to create KB document: ${message}` };
  }
}
