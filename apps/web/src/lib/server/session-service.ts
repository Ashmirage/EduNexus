import { createTraceId } from "./trace";
import { loadDb, saveDb } from "./store";

export async function createSession(input: { title?: string }, userId: string) {
  if (!userId) throw new Error('userId is required');
  const db = await loadDb();
  const now = new Date().toISOString();
  const session = {
    id: `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    title: input.title ?? "未命名学习会话",
    userId: userId,
    createdAt: now,
    updatedAt: now,
    lastLevel: 1,
    messages: [
      {
        role: "system" as const,
        content: "学习会话已创建，请先提交当前思路。",
        createdAt: now
      }
    ]
  };
  db.sessions.unshift(session);
  await saveDb(db);
  return session;
}

export async function updateSessionLevel(sessionId: string, level: number) {
  const db = await loadDb();
  const target = db.sessions.find((item) => item.id === sessionId);
  if (!target) {
    return null;
  }
  target.lastLevel = level;
  target.updatedAt = new Date().toISOString();
  await saveDb(db);
  return target;
}

export async function getSession(sessionId: string, userId: string) {
  if (!userId) throw new Error('userId is required');
  const db = await loadDb();
  const session = db.sessions.find((item) => item.id === sessionId) ?? null;
  if (!session) return null;
  if (session.userId !== userId) return null;
  return session;
}

export async function listSessions(query: string | undefined, userId: string) {
  if (!userId) throw new Error('userId is required');
  const db = await loadDb();
  const normalized = query?.trim().toLowerCase();
  const sessions = db.sessions
    .filter((session) => {
      if (session.userId !== userId) return false;
      if (!normalized) return true;
      return (
        session.title.toLowerCase().includes(normalized) ||
        session.id.toLowerCase().includes(normalized) ||
        session.messages.some((msg) => msg.content.toLowerCase().includes(normalized))
      );
    })
    .slice()
    .sort((a, b) => Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt)));

  return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      lastLevel: session.lastLevel,
      updatedAt: session.updatedAt,
      createdAt: session.createdAt,
      messageCount: session.messages.length
    }));
}

export async function appendSessionMessage(
  sessionId: string,
  input: {
    role: "user" | "assistant" | "system";
    content: string;
  },
  userId: string
) {
  if (!userId) throw new Error('userId is required');
  const db = await loadDb();
  const target = db.sessions.find((item) => item.id === sessionId);
  if (!target) {
    return null;
  }
  if (target.userId !== userId) {
    return null;
  }

  target.messages.push({
    role: input.role,
    content: input.content,
    createdAt: new Date().toISOString()
  });
  target.updatedAt = new Date().toISOString();
  await saveDb(db);
  return target;
}

export async function getSessionDetail(sessionId: string, userId: string) {
  if (!userId) throw new Error('userId is required');
  const session = await getSession(sessionId, userId);
  if (!session) {
    return null;
  }
  return {
    id: session.id,
    title: session.title,
    userId: session.userId,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    lastLevel: session.lastLevel,
    messages: session.messages
  };
}

export async function renameSession(sessionId: string, title: string, userId: string) {
  if (!userId) throw new Error('userId is required');
  const db = await loadDb();
  const target = db.sessions.find((item) => item.id === sessionId);
  if (!target) {
    return null;
  }
  if (target.userId !== userId) {
    return null;
  }
  target.title = title;
  target.updatedAt = new Date().toISOString();
  await saveDb(db);
  return target;
}

export async function deleteSession(sessionId: string, userId: string) {
  if (!userId) throw new Error('userId is required');
  const db = await loadDb();
  const target = db.sessions.find((item) => item.id === sessionId);
  if (!target) {
    return false;
  }
  if (target.userId !== userId) {
    return false;
  }
  const index = db.sessions.findIndex((item) => item.id === sessionId);
  if (index < 0) {
    return false;
  }
  db.sessions.splice(index, 1);
  await saveDb(db);
  return true;
}

export function mockSseStream(input: {
  sessionId: string;
  content: string;
  intro?: string;
}) {
  const encoder = new TextEncoder();
  const tokenSource = input.content
    .split(/(?<=[。！？])/)
    .map((item) => item.trim())
    .filter(Boolean);
  const chunks = [
    { type: "trace", sessionId: input.sessionId, traceId: createTraceId() },
    { type: "token", value: input.intro ?? "开始生成流式学习引导。" },
    ...tokenSource.map((item) => ({ type: "token", value: item })),
    { type: "done", value: "【流式输出结束】" }
  ];

  return new ReadableStream({
    start(controller) {
      let index = 0;
      const timer = setInterval(() => {
        if (index >= chunks.length) {
          clearInterval(timer);
          controller.close();
          return;
        }
        const payload = chunks[index];
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        index += 1;
      }, 250);
    }
  });
}
