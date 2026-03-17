import { NextResponse } from "next/server";
import { runAgentConversation, createChatHistory } from "@/lib/agent/learning-agent";
import { buildWorkspaceGraphContext } from "@/lib/server/workspace-graph-context";
import { auth } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // 最长执行时间 60 秒

function normalizeAgentError(error: unknown): { status: number; message: string } {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lowered = message.toLowerCase();

  if (
    lowered.includes("authentication failed") ||
    lowered.includes("invalid token") ||
    lowered.includes("incorrect api key") ||
    lowered.includes("401") ||
    lowered.includes("unauthorized")
  ) {
    return {
      status: 502,
      message: "模型服务鉴权失败：请检查 ModelScope API Key 是否有效，或改用服务端环境变量密钥。",
    };
  }

  if (lowered.includes("请先在设置中配置 api 密钥") || lowered.includes("missing api key")) {
    return {
      status: 400,
      message: "缺少模型配置：请在设置中填写 API Key/Endpoint，或在服务端配置 MODELSCOPE_API_KEY。",
    };
  }

  return { status: 500, message };
}

/**
 * Agent 对话 API
 * POST /api/workspace/agent/chat
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, images, history = [], config = {}, taskContext } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // 转换历史消息格式
    const chatHistory = createChatHistory(history);

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const graphContext = await buildWorkspaceGraphContext({
      userId,
      taskId: typeof taskContext?.taskId === "string" ? taskContext.taskId : undefined,
      taskTitle: typeof taskContext?.taskTitle === "string" ? taskContext.taskTitle : undefined,
    });

    const mergedConfig = {
      ...config,
      apiKey:
        typeof config.apiKey === "string" && config.apiKey.trim()
          ? config.apiKey.trim()
          : process.env.MODELSCOPE_API_KEY ?? "",
      apiEndpoint:
        typeof config.apiEndpoint === "string" && config.apiEndpoint.trim()
          ? config.apiEndpoint.trim()
          : process.env.MODELSCOPE_BASE_URL ?? "https://api-inference.modelscope.cn/v1",
      modelName:
        typeof config.modelName === "string" && config.modelName.trim()
          ? config.modelName.trim()
          : process.env.MODELSCOPE_CHAT_MODEL ?? "Qwen/Qwen3.5-122B-A10B",
      userId,
      taskContext,
      graphContext,
    };

    // 执行 Agent 对话（支持多模态）
    const result = await runAgentConversation(message, chatHistory, mergedConfig, images);

    return NextResponse.json({
      success: true,
      response: result.output,
      thinking: result.thinking,
      steps: result.intermediateSteps,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Agent chat error:", error);
    const normalized = normalizeAgentError(error);

    // 返回详细错误信息
    return NextResponse.json({
      success: false,
      error: normalized.message,
      response:
        "抱歉，处理你的请求时出现了错误。请检查：\n\n1. API 密钥与端点配置\n2. 模型服务可用性\n3. 网络连接是否正常\n\n错误详情：" + normalized.message,
    }, { status: normalized.status });
  }
}
