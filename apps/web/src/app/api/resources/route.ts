import { fail, ok } from "@/lib/server/response";
import { createResource } from "@/lib/server/resources-service";
import { loadDb } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await loadDb();
    return ok({ resources: db.publicResources });
  } catch (error) {
    return fail(
      {
        code: "RESOURCES_LIST_FAILED",
        message: "获取公共资源失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(
      {
        code: "RESOURCES_CREATE_INVALID_JSON",
        message: "请求体必须是 JSON。"
      },
      400
    );
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const createdBy = typeof payload.createdBy === "string" ? payload.createdBy.trim() : "";

  if (!title) {
    return fail(
      {
        code: "RESOURCES_CREATE_VALIDATION_FAILED",
        message: "title 为必填字段。",
        details: {
          title: Boolean(title)
        }
      },
      400
    );
  }

  const description = typeof payload.description === "string" ? payload.description : undefined;
  const url = typeof payload.url === "string" ? payload.url : undefined;

  try {
    const resource = await createResource({
      title,
      description,
      url,
      createdBy: createdBy || `guest_${Date.now()}`
    });
    return ok({ resource });
  } catch (error) {
    return fail(
      {
        code: "RESOURCES_CREATE_FAILED",
        message: "创建公共资源失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}
