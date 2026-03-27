import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getKBStorageMock } = vi.hoisted(() => ({
  getKBStorageMock: vi.fn(),
}));

vi.mock("@/lib/client/kb-storage", () => ({
  getKBStorage: getKBStorageMock,
}));

vi.mock("./kb-storage", () => ({
  getKBStorage: getKBStorageMock,
}));

import { saveReplyAsKBDocument } from "./workspace-kb-adapter";

describe("workspace-kb-adapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("saveReplyAsKBDocument creates document with question as title and answer+metadata as content", async () => {
    const createDocument = vi.fn().mockResolvedValue({ id: "doc-1" });
    getKBStorageMock.mockReturnValue({
      getCurrentVaultId: () => "vault-1",
      createDocument,
    });

    const reply = {
      userQuestion: "What is a closure?",
      assistantAnswer: "A closure is...",
      sessionId: "session-123",
      timestamp: "2026-03-27T00:00:00.000Z",
      teacherName: "Socratic",
    };

    await expect(saveReplyAsKBDocument(reply)).resolves.toEqual({
      ok: true,
      documentId: "doc-1",
    });

    expect(createDocument).toHaveBeenCalledTimes(1);
    const [vaultId, title, content, tags] = createDocument.mock.calls[0] ?? [];

    expect(vaultId).toBe("vault-1");
    expect(title).toBe(reply.userQuestion);
    expect(tags).toEqual(["workspace-saved"]);

    expect(String(content)).toContain(reply.assistantAnswer);
    expect(String(content)).toContain("source: workspace-saved");
    expect(String(content)).toContain(`sessionId: ${reply.sessionId}`);
    expect(String(content)).toContain(`timestamp: ${reply.timestamp}`);
    expect(String(content)).toContain(`teacher: ${reply.teacherName}`);
    expect(String(content)).toContain("mode: normal");
    expect(String(content)).toContain("sourcePage: /workspace");
  });

  it("saveReplyAsKBDocument returns explicit error when no current vault", async () => {
    const createDocument = vi.fn();
    getKBStorageMock.mockReturnValue({
      getCurrentVaultId: () => null,
      createDocument,
    });

    await expect(
      saveReplyAsKBDocument({
        userQuestion: "Q",
        assistantAnswer: "A",
        sessionId: "s",
        timestamp: "2026-03-27T00:00:00.000Z",
      })
    ).resolves.toEqual({
      ok: false,
      error: expect.stringContaining("No current vault"),
    });

    expect(createDocument).not.toHaveBeenCalled();
  });
});
