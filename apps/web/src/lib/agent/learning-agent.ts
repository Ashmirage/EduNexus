/**
 * 学习工作区 React Agent
 *
 * 使用 ReAct (Reasoning + Acting) 模式
 * 结合 LangGraph 进行状态管理
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { getAllTools, getToolsDescription } from "./tools";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

/**
 * Agent 配置
 */
export interface AgentConfig {
  modelName?: string;
  temperature?: number;
  maxIterations?: number;
  socraticMode?: boolean;
}

/**
 * Agent 状态
 */
export interface AgentState {
  messages: BaseMessage[];
  currentTopic?: string;
  userLevel?: "beginner" | "intermediate" | "advanced";
  learningGoal?: string;
  sessionContext: Record<string, any>;
}

/**
 * 创建学习 Agent
 */
export async function createLearningAgent(config: AgentConfig = {}) {
  const {
    modelName = process.env.MODELSCOPE_CHAT_MODEL || "Qwen/Qwen3-8B",
    temperature = 0.7,
    maxIterations = 5,
    socraticMode = true,
  } = config;

  // 初始化模型（使用 ModelScope）
  const model = new ChatOpenAI({
    modelName,
    temperature,
    openAIApiKey: process.env.MODELSCOPE_API_KEY,
    configuration: {
      baseURL: process.env.MODELSCOPE_BASE_URL || "https://api-inference.modelscope.cn/v1",
    },
  });

  // 获取工具
  const tools = getAllTools();
  const toolsDesc = getToolsDescription();

  // 创建提示词模板
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `你是 EduNexus 的智能学习助手，使用 ReAct (Reasoning + Acting) 模式工作。

## 你的角色
- 学习引导者：通过提问引导学生思考，而不是直接给答案
- 知识导航员：帮助学生在知识图谱中找到学习路径
- 个性化教练：根据学生水平调整教学策略

## 工作模式
${socraticMode ? `
### 苏格拉底模式（当前启用）
1. 不要直接给答案，而是通过问题引导思考
2. 鼓励学生自己探索和发现
3. 提供提示和线索，而不是完整解答
4. 当学生真正卡住时，才提供更直接的帮助
` : `
### 直接教学模式
1. 可以直接解释概念和提供答案
2. 提供详细的步骤和示例
3. 主动推荐学习资源
`}

## 可用工具
${toolsDesc}

## ReAct 工作流程
1. **Thought**: 分析用户问题，思考需要什么信息
2. **Action**: 选择合适的工具获取信息
3. **Observation**: 观察工具返回的结果
4. **Thought**: 基于观察结果继续思考
5. **Final Answer**: 给出最终回复

## 回复格式
- 使用 Markdown 格式
- 代码块使用语法高亮
- 重要概念用**粗体**标注
- 提供具体例子和类比

## 注意事项
- 始终保持友好和鼓励的语气
- 根据学生的理解程度调整解释深度
- 主动关联相关知识点
- 记录学习进度和难点`,
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  // 创建 Agent
  const agent = await createReactAgent({
    llm: model,
    tools,
    prompt,
  });

  // 创建 Agent 执行器
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    maxIterations,
    verbose: true,
    returnIntermediateSteps: true,
  });

  return agentExecutor;
}

/**
 * 执行 Agent 对话
 */
export async function runAgentConversation(
  input: string,
  chatHistory: BaseMessage[] = [],
  config: AgentConfig = {}
): Promise<{
  output: string;
  intermediateSteps: any[];
  thinking?: string;
}> {
  try {
    const agent = await createLearningAgent(config);

    const result = await agent.invoke({
      input,
      chat_history: chatHistory,
    });

    // 提取思考过程
    const thinking = result.intermediateSteps
      ?.map((step: any) => {
        if (step.action) {
          return `**思考**: ${step.action.log}\n**工具**: ${step.action.tool}\n**结果**: ${step.observation}`;
        }
        return null;
      })
      .filter(Boolean)
      .join("\n\n");

    return {
      output: result.output,
      intermediateSteps: result.intermediateSteps || [],
      thinking,
    };
  } catch (error) {
    console.error("Agent execution error:", error);
    throw error;
  }
}

/**
 * 流式执行 Agent（用于实时响应）
 */
export async function* streamAgentConversation(
  input: string,
  chatHistory: BaseMessage[] = [],
  config: AgentConfig = {}
): AsyncGenerator<{
  type: "thinking" | "action" | "observation" | "output";
  content: string;
}> {
  try {
    const agent = await createLearningAgent(config);

    // 使用流式执行
    const stream = await agent.stream({
      input,
      chat_history: chatHistory,
    });

    for await (const chunk of stream) {
      if (chunk.intermediateSteps) {
        for (const step of chunk.intermediateSteps) {
          if (step.action) {
            yield {
              type: "thinking",
              content: step.action.log,
            };
            yield {
              type: "action",
              content: `使用工具: ${step.action.tool}`,
            };
          }
          if (step.observation) {
            yield {
              type: "observation",
              content: step.observation,
            };
          }
        }
      }

      if (chunk.output) {
        yield {
          type: "output",
          content: chunk.output,
        };
      }
    }
  } catch (error) {
    console.error("Agent streaming error:", error);
    yield {
      type: "output",
      content: "抱歉，处理请求时出现错误。请稍后重试。",
    };
  }
}

/**
 * 创建对话历史
 */
export function createChatHistory(messages: Array<{ role: string; content: string }>): BaseMessage[] {
  return messages.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else {
      return new AIMessage(msg.content);
    }
  });
}
