import { streamAgentConversation, createChatHistory } from "@/lib/agent/learning-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Agent 流式对话 API
 * POST /api/workspace/agent/stream
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history = [], config = {} } = body;

    if (!message || typeof message !== "string") {
      return new Response("Invalid message", { status: 400 });
    }

    // 转换历史消息格式
    const chatHistory = createChatHistory(history);

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAgentConversation(message, chatHistory, config)) {
            const data = JSON.stringify(chunk) + "\n";
            controller.enqueue(encoder.encode(data));
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          const errorData = JSON.stringify({
            type: "error",
            content: "处理请求时出现错误",
          }) + "\n";
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Agent stream error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
