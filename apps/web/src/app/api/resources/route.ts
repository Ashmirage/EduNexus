import { fail, ok } from "@/lib/server/response";
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
