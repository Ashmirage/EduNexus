import { fail, ok } from "@/lib/server/response";
import { getCurrentUserId } from "@/lib/server/auth-utils";
import { getDocument } from "@/lib/server/document-service";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return fail(
        {
          code: "UNAUTHORIZED",
          message: "用户未登录。"
        },
        401
      );
    }
    
    const { id } = await context.params;
    const doc = await getDocument(id, userId);

    if (!doc) {
      return fail(
        {
          code: "DOC_NOT_FOUND",
          message: "未找到对应知识文档，或无权访问。"
        },
        404
      );
    }

    return ok({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      updatedAt: doc.updatedAt,
      type: 'note', 
      domain: 'general',
      tags: [],
      links: [],
      sourceRefs: [],
      owner: doc.authorId,
      backlinks: []
    });
  } catch (error) {
    return fail(
      {
        code: "KB_DOC_FAILED",
        message: "读取知识文档失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}
