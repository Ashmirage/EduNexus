type DemoDocumentSeed = {
  title: string;
  content: string;
};

type DemoSessionMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type DemoSessionSeed = {
  id: string;
  title: string;
  lastLevel: number;
  messages: DemoSessionMessage[];
};

type DemoPathBootstrap = {
  goalType: "exam" | "project" | "certificate";
  goal: string;
  tasks: Array<{
    taskId: string;
    title: string;
    reason: string;
    dueDate: string;
    priority: number;
  }>;
};

type DemoPracticeQuestionSeed = {
  type: "multiple_choice" | "fill_in_blank" | "short_answer" | "coding";
  title: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "archived" | "draft";
  tags: string[];
  points: number;
  explanation?: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
};

type DemoPracticeBankSeed = {
  name: string;
  description: string;
  tags: string[];
  questions: DemoPracticeQuestionSeed[];
};

export const DEMO_KB_DOCUMENTS: DemoDocumentSeed[] = [
  {
    title: "数学序列基础",
    content:
      "等差数列与等比数列先判型再代公式。建议先从通项、前 n 项和、递推转化三个角度建立题型识别。"
  },
  {
    title: "函数与映射",
    content:
      "函数关注对应关系与定义域约束。映射题先检查单射/满射条件，再结合图像与代数表达统一分析。"
  }
];

export const DEMO_WORKSPACE_SESSIONS: DemoSessionSeed[] = [
  {
    id: "ws_demo_seq_intro",
    title: "数列专题起步会话",
    lastLevel: 2,
    messages: [
      {
        role: "system",
        content: "欢迎进入数列专题训练。"
      },
      {
        role: "assistant",
        content: "先判断题目给的是通项、递推还是前 n 项和，再选择解题路径。"
      }
    ]
  },
  {
    id: "ws_demo_func_intro",
    title: "函数映射诊断会话",
    lastLevel: 2,
    messages: [
      {
        role: "system",
        content: "欢迎进入函数与映射诊断。"
      },
      {
        role: "assistant",
        content: "先列出定义域和值域，再检查映射性质是否满足题目条件。"
      }
    ]
  }
];

export const DEMO_PATH_BOOTSTRAP: DemoPathBootstrap = {
  goalType: "exam",
  goal: "函数与数列联动冲刺（演示目标）",
  tasks: [
    {
      taskId: "demo_task_seq_1",
      title: "数列判型与公式选择",
      reason: "建立等差/等比快速识别能力",
      dueDate: "2026-03-20",
      priority: 1
    },
    {
      taskId: "demo_task_func_1",
      title: "函数映射与定义域约束",
      reason: "减少函数题中的条件遗漏",
      dueDate: "2026-03-22",
      priority: 2
    }
  ]
};

export const DEMO_PRACTICE_BANKS: DemoPracticeBankSeed[] = [
  {
    name: "函数与数列演示题库",
    description: "演示账号预置题库，用于快速体验练习与错题流程。",
    tags: ["演示", "数列", "函数"],
    questions: [
      {
        type: "multiple_choice",
        title: "先判断数列类型",
        content: "观察题目已知首项与公差时，优先识别为什么数列？",
        difficulty: "easy",
        status: "active",
        tags: ["数列", "判型"],
        points: 5,
        explanation: "首项和公差通常对应等差数列判型入口。",
        options: [
          { id: "a", text: "等差数列", isCorrect: true },
          { id: "b", text: "等比数列", isCorrect: false },
          { id: "c", text: "随机数列", isCorrect: false }
        ]
      },
      {
        type: "short_answer",
        title: "定义域先行检查",
        content: "分析函数映射题时，第一步为什么要先写出定义域和值域？",
        difficulty: "medium",
        status: "active",
        tags: ["函数", "映射"],
        points: 10,
        explanation: "先明确输入输出边界，才能继续判断单射、满射等性质。"
      }
    ]
  }
];
