import { describe, expect, it, vi } from "vitest";

import { getGraphViewState, loadPrivateGraphView } from "./view-state";

describe("graph view state", () => {
  it("loads the authenticated graph from the private graph API", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: {
          nodes: [],
          edges: [],
        },
      }),
    });

    await expect(loadPrivateGraphView(fetcher)).resolves.toEqual({
      nodes: [],
      edges: [],
    });
    expect(fetcher).toHaveBeenCalledWith("/api/graph/view", {
      credentials: "include",
    });
  });

  it("returns the graph empty state when the user has no KB-backed graph nodes", () => {
    expect(
      getGraphViewState({
        isLoading: false,
        nodes: [],
      })
    ).toEqual({
      kind: "empty",
      title: "你的知识星图还是空的",
      description: "先在知识库中创建或导入文档，系统才会为你生成图谱关系。",
    });
  });

  it("returns empty graph for 401 unauthorized response", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(loadPrivateGraphView(fetcher)).resolves.toEqual({
      nodes: [],
      edges: [],
    });
    expect(fetcher).toHaveBeenCalledWith("/api/graph/view", {
      credentials: "include",
    });
  });

  it("throws with status message on non-OK non-401 responses", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(loadPrivateGraphView(fetcher)).rejects.toThrow(
      "Failed to fetch graph view: 500"
    );
  });

  it("throws with status message on 503 service unavailable", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(loadPrivateGraphView(fetcher)).rejects.toThrow(
      "Failed to fetch graph view: 503"
    );
  });
});
