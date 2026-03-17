import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.fn();
const listDocuments = vi.fn();
const createDocument = vi.fn();
const loadDb = vi.fn();
const saveDb = vi.fn();

vi.mock("@/auth", () => ({
  auth
}));

vi.mock("@/lib/server/document-service", () => ({
  listDocuments,
  createDocument
}));

vi.mock("@/lib/server/store", () => ({
  loadDb,
  saveDb
}));

const { POST: bootstrapDemo } = await import("./route");

describe("demo bootstrap api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.mockResolvedValue({ user: { id: "demo-user", isDemo: true } });
    loadDb.mockResolvedValue({ sessions: [], plans: [], masteryByNode: {} });
    listDocuments.mockResolvedValue([]);
    createDocument.mockImplementation(async ({ title, content, authorId }) => ({
      id: `doc-${title}`,
      title,
      content,
      authorId
    }));
  });

  it("returns 403 for authenticated non-demo users", async () => {
    auth.mockResolvedValue({ user: { id: "normal-user", isDemo: false } });

    const response = await bootstrapDemo();

    expect(response.status).toBe(403);
    expect(createDocument).not.toHaveBeenCalled();
    expect(saveDb).not.toHaveBeenCalled();
  });

  it("seeds curated demo docs and starter sessions for demo user", async () => {
    const response = await bootstrapDemo();

    expect(response.status).toBe(200);
    expect(listDocuments).toHaveBeenCalledWith("demo-user");
    expect(createDocument).toHaveBeenCalledTimes(2);
    expect(createDocument).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ title: "数学序列基础", authorId: "demo-user" })
    );
    expect(createDocument).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ title: "函数与映射", authorId: "demo-user" })
    );

    expect(saveDb).toHaveBeenCalledTimes(1);
    const savedDb = saveDb.mock.calls[0][0] as {
      sessions: Array<{ title: string; userId: string }>;
    };
    expect(savedDb.sessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "数列专题起步会话",
          userId: "demo-user"
        }),
        expect.objectContaining({
          title: "函数映射诊断会话",
          userId: "demo-user"
        })
      ])
    );

    const payload = (await response.json()) as {
      data: {
        kb: { documents: Array<{ title: string }> };
        workspace: { sessions: Array<{ title: string }> };
        practice: { banks: Array<{ name: string; questions: Array<{ title: string }> }> };
        path: { goal: string };
      };
    };
    expect(payload.data.kb.documents.map((item) => item.title)).toEqual([
      "数学序列基础",
      "函数与映射"
    ]);
    expect(payload.data.workspace.sessions.map((item) => item.title)).toEqual([
      "数列专题起步会话",
      "函数映射诊断会话"
    ]);
    expect(payload.data.practice.banks).toHaveLength(1);
    expect(payload.data.practice.banks[0]?.name).toBe("函数与数列演示题库");
    expect(payload.data.practice.banks[0]?.questions.map((item) => item.title)).toEqual([
      "先判断数列类型",
      "定义域先行检查"
    ]);
    expect(payload.data.path.goal).toContain("函数与数列");
  });

  it("is idempotent when demo content already exists", async () => {
    listDocuments.mockResolvedValue([
      {
        id: "doc-seq",
        title: "数学序列基础",
        content: "existing",
        authorId: "demo-user"
      },
      {
        id: "doc-func",
        title: "函数与映射",
        content: "existing",
        authorId: "demo-user"
      }
    ]);
    loadDb.mockResolvedValue({
      sessions: [
        {
          id: "ws_demo_seq_intro",
          title: "数列专题起步会话",
          userId: "demo-user",
          createdAt: "2026-03-16T00:00:00.000Z",
          updatedAt: "2026-03-16T00:00:00.000Z",
          lastLevel: 1,
          messages: []
        },
        {
          id: "ws_demo_func_intro",
          title: "函数映射诊断会话",
          userId: "demo-user",
          createdAt: "2026-03-16T00:00:00.000Z",
          updatedAt: "2026-03-16T00:00:00.000Z",
          lastLevel: 1,
          messages: []
        }
      ],
      plans: [],
      masteryByNode: {}
    });

    const response = await bootstrapDemo();

    expect(response.status).toBe(200);
    expect(createDocument).not.toHaveBeenCalled();
    expect(saveDb).not.toHaveBeenCalled();
  });
});
