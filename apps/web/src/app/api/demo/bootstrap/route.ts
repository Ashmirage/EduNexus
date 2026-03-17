import { auth } from "@/auth";
import { createDocument, listDocuments } from "@/lib/server/document-service";
import {
  DEMO_KB_DOCUMENTS,
  DEMO_PATH_BOOTSTRAP,
  DEMO_PRACTICE_BANKS,
  DEMO_WORKSPACE_SESSIONS
} from "@/lib/server/demo-content";
import { fail, ok } from "@/lib/server/response";
import { loadDb, saveDb } from "@/lib/server/store";

export const runtime = "nodejs";

type SessionPayload = {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastLevel: number;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: string;
  }>;
};

function buildDemoSession(
  seed: (typeof DEMO_WORKSPACE_SESSIONS)[number],
  userId: string,
  now: string
): SessionPayload {
  return {
    id: seed.id,
    title: seed.title,
    userId,
    createdAt: now,
    updatedAt: now,
    lastLevel: seed.lastLevel,
    messages: seed.messages.map((message) => ({
      role: message.role,
      content: message.content,
      createdAt: now
    }))
  };
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return fail({ code: "UNAUTHORIZED", message: "用户未登录。" }, 401);
    }
    if (session.user.isDemo !== true) {
      return fail({ code: "FORBIDDEN", message: "仅演示账号可访问演示内容。" }, 403);
    }

    const userId = session.user.id;
    const existingDocuments = await listDocuments(userId);
    const existingDocumentMap = new Map(existingDocuments.map((doc) => [doc.title, doc]));
    const demoDocuments = [] as Array<{ id: string; title: string }>;

    for (const docSeed of DEMO_KB_DOCUMENTS) {
      const existing = existingDocumentMap.get(docSeed.title);
      if (existing) {
        demoDocuments.push({ id: existing.id, title: existing.title });
        continue;
      }

      const created = await createDocument({
        title: docSeed.title,
        content: docSeed.content,
        authorId: userId
      });
      demoDocuments.push({ id: created.id, title: created.title });
    }

    const db = await loadDb();
    const existingUserSessions = db.sessions.filter((item) => item.userId === userId);
    const existingSessionTitles = new Set(existingUserSessions.map((item) => item.title));
    const now = new Date().toISOString();
    const seededSessions = DEMO_WORKSPACE_SESSIONS.filter(
      (seed) => !existingSessionTitles.has(seed.title)
    ).map((seed) => buildDemoSession(seed, userId, now));

    if (seededSessions.length > 0) {
      db.sessions.unshift(...seededSessions);
      await saveDb(db);
    }

    const workspaceSessions = DEMO_WORKSPACE_SESSIONS.map((seed) => {
      const persisted =
        db.sessions.find((item) => item.userId === userId && item.title === seed.title) ??
        seededSessions.find((item) => item.title === seed.title);
      return {
        id: persisted?.id ?? seed.id,
        title: seed.title
      };
    });

    return ok({
      kb: { documents: demoDocuments },
      workspace: { sessions: workspaceSessions },
      practice: { banks: DEMO_PRACTICE_BANKS },
      path: DEMO_PATH_BOOTSTRAP
    });
  } catch (error) {
    return fail(
      {
        code: "DEMO_BOOTSTRAP_FAILED",
        message: "初始化演示内容失败。",
        details: error instanceof Error ? error.message : error
      },
      500
    );
  }
}
