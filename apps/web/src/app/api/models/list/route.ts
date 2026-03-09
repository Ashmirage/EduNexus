import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 获取 ModelScope 可用模型列表
 * GET /api/models/list
 */
export async function GET() {
  try {
    // 调用 ModelScope API 获取模型列表
    const response = await fetch("https://api-inference.modelscope.cn/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.MODELSCOPE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`ModelScope API error: ${response.status} ${response.statusText}`);
      throw new Error(`ModelScope API error: ${response.statusText}`);
    }

    const data = await response.json();

    // 直接返回所有模型，不要过滤
    const models = (data.data || []).map((model: any) => {
      const id = model.id || "";
      const name = id.split("/").pop() || id;

      // Qwen3.5 系列都是多模态（不需要 VL 后缀）
      const isQwen35 = id.includes("Qwen3.5");
      const isVL = id.includes("-VL") || id.includes("VL-");
      const isMultimodal = isQwen35 || isVL;

      return {
        id: model.id,
        name,
        description: `${name}`,
        provider: "ModelScope",
        multimodal: isMultimodal,
        created: model.created,
      };
    });

    return NextResponse.json({
      success: true,
      models,
      total: models.length,
      source: "api",
    });
  } catch (error) {
    console.error("Failed to fetch models from API:", error);

    // 如果 API 调用失败，返回空列表并提示用户
    return NextResponse.json({
      success: false,
      models: [],
      total: 0,
      source: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      message: "无法获取模型列表，请检查 MODELSCOPE_API_KEY 是否配置正确",
    }, { status: 500 });
  }
}
