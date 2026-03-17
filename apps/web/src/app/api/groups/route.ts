import { NextResponse } from "next/server";
import { fail, ok } from "@/lib/server/response";
import { getCurrentUserId } from "@/lib/server/auth-utils";
import { loadDb, saveDb } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createId(prefix: string): string {
  const token = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${token}`;
}

export async function GET() {
  try {
    const db = await loadDb();
    return ok({ groups: db.publicGroups });
  } catch (error) {
    return fail(
      {
        code: "GROUPS_LIST_FAILED",
        message: "获取学习小组失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return fail(
        {
          code: "FORBIDDEN",
          message: "匿名用户不能创建学习小组。"
        },
        403
      );
    }

    const json = await request.json().catch(() => ({}));
    const name = typeof json.name === "string" ? json.name.trim() : "";
    const description = typeof json.description === "string" ? json.description.trim() : "";

    if (!name) {
      return fail(
        {
          code: "INVALID_REQUEST",
          message: "小组名称不能为空。"
        },
        400
      );
    }

    const db = await loadDb();
    const group = {
      id: createId("group"),
      name,
      description,
      memberCount: 1,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    await saveDb({
      ...db,
      publicGroups: [group, ...db.publicGroups]
    });

    return NextResponse.json(
      {
        success: true,
        data: { group }
      },
      { status: 201 }
    );
  } catch (error) {
    return fail(
      {
        code: "GROUP_CREATE_FAILED",
        message: "创建学习小组失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}
