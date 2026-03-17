type DemoDocumentSeed = {
  title: string;
  content: string;
};

type DemoGraphNodeSeed = {
  id: string;
  label: string;
  domain: string;
  mastery: number;
  risk: number;
};

type DemoGraphEdgeSeed = {
  id: string;
  source: string;
  target: string;
  weight: number;
};

type DemoGraphBootstrap = {
  nodes: DemoGraphNodeSeed[];
  edges: DemoGraphEdgeSeed[];
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

type DemoPathTaskResourceSeed = {
  id: string;
  title: string;
  type: "article" | "video" | "document";
  url: string;
};

type DemoPathTaskSeed = {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  dependencies: string[];
  resources: DemoPathTaskResourceSeed[];
  notes: string;
};

type DemoPathMilestoneSeed = {
  id: string;
  title: string;
  taskIds: string[];
};

type DemoPathSeed = {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  tags: string[];
  goalId: string;
  tasks: DemoPathTaskSeed[];
  milestones: DemoPathMilestoneSeed[];
};

type DemoGoalSeed = {
  id: string;
  title: string;
  description: string;
  goalType: DemoPathBootstrap["goalType"];
  category: "exam" | "skill" | "project" | "habit" | "other";
  linkedPathIds: string[];
  smart: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timeBound: string;
  };
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "completed" | "paused" | "cancelled";
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

export const DEMO_GRAPH_BOOTSTRAP: DemoGraphBootstrap = {
  nodes: [
    { id: "demo_node_html_basics", label: "HTML 基础", domain: "frontend", mastery: 0.92, risk: 0.12 },
    { id: "demo_node_css_basics", label: "CSS 基础", domain: "frontend", mastery: 0.68, risk: 0.35 },
    { id: "demo_node_js_fundamentals", label: "JavaScript 基础", domain: "frontend", mastery: 0.42, risk: 0.58 },
    { id: "demo_node_flexbox", label: "Flexbox 布局", domain: "frontend", mastery: 0.55, risk: 0.44 },
    { id: "demo_node_grid", label: "Grid 布局", domain: "frontend", mastery: 0.22, risk: 0.66 },
    { id: "demo_node_react_intro", label: "React 入门", domain: "frontend", mastery: 0.2, risk: 0.72 },
    { id: "demo_node_responsive", label: "响应式设计", domain: "frontend", mastery: 0.18, risk: 0.7 },
    { id: "demo_node_accessibility", label: "Web 无障碍", domain: "frontend", mastery: 0.1, risk: 0.83 }
  ],
  edges: [
    { id: "demo_edge_html_css", source: "demo_node_html_basics", target: "demo_node_css_basics", weight: 0.92 },
    {
      id: "demo_edge_css_flex",
      source: "demo_node_css_basics",
      target: "demo_node_flexbox",
      weight: 0.82
    },
    { id: "demo_edge_css_grid", source: "demo_node_css_basics", target: "demo_node_grid", weight: 0.79 },
    {
      id: "demo_edge_js_react",
      source: "demo_node_js_fundamentals",
      target: "demo_node_react_intro",
      weight: 0.86
    },
    {
      id: "demo_edge_flex_responsive",
      source: "demo_node_flexbox",
      target: "demo_node_responsive",
      weight: 0.84
    },
    {
      id: "demo_edge_grid_responsive",
      source: "demo_node_grid",
      target: "demo_node_responsive",
      weight: 0.82
    },
    {
      id: "demo_edge_html_accessibility",
      source: "demo_node_html_basics",
      target: "demo_node_accessibility",
      weight: 0.74
    },
    {
      id: "demo_edge_react_accessibility",
      source: "demo_node_react_intro",
      target: "demo_node_accessibility",
      weight: 0.63
    }
  ]
};

export const DEMO_PATH_SEEDS: DemoPathSeed[] = [
  {
    id: "demo_path_frontend_foundations",
    title: "前端基础冲刺路径",
    description: "从 HTML/CSS 到响应式布局，完成可交付的前端基础项目。",
    status: "in_progress",
    progress: 46,
    tags: ["演示", "前端", "基础"],
    goalId: "demo_goal_1",
    tasks: [
      {
        id: "demo_task_html_semantics",
        title: "HTML 语义化结构",
        description: "使用语义化标签重构页面结构并提升可读性。",
        estimatedTime: "2小时",
        progress: 100,
        status: "completed",
        dependencies: [],
        resources: [
          {
            id: "demo_res_mdn_html",
            title: "MDN HTML 指南",
            type: "article",
            url: "https://developer.mozilla.org/zh-CN/docs/Web/HTML"
          }
        ],
        notes: "已完成页面结构重构。"
      },
      {
        id: "demo_task_css_layout",
        title: "CSS 布局基础",
        description: "掌握盒模型、定位和常见布局模式。",
        estimatedTime: "3小时",
        progress: 70,
        status: "in_progress",
        dependencies: ["demo_task_html_semantics"],
        resources: [
          {
            id: "demo_res_mdn_css",
            title: "MDN CSS 文档",
            type: "article",
            url: "https://developer.mozilla.org/zh-CN/docs/Web/CSS"
          }
        ],
        notes: "正在优化页面间距体系。"
      },
      {
        id: "demo_task_responsive_layout",
        title: "响应式页面实战",
        description: "完成移动端与桌面端双端适配。",
        estimatedTime: "4小时",
        progress: 20,
        status: "in_progress",
        dependencies: ["demo_task_css_layout"],
        resources: [
          {
            id: "demo_res_refactoring_ui",
            title: "Refactoring UI",
            type: "document",
            url: "https://www.refactoringui.com/"
          }
        ],
        notes: "断点策略已确定，待完善细节。"
      }
    ],
    milestones: [
      { id: "demo_milestone_frontend_1", title: "页面基础可用", taskIds: ["demo_task_html_semantics", "demo_task_css_layout"] },
      { id: "demo_milestone_frontend_2", title: "完成响应式改造", taskIds: ["demo_task_responsive_layout"] }
    ]
  },
  {
    id: "demo_path_react_project",
    title: "React 项目落地路径",
    description: "围绕组件化、状态管理与性能优化完成 React 小项目。",
    status: "not_started",
    progress: 0,
    tags: ["演示", "React", "项目"],
    goalId: "demo_goal_2",
    tasks: [
      {
        id: "demo_task_js_refresh",
        title: "JavaScript 核心复盘",
        description: "复盘作用域、闭包与异步流程，巩固 React 前置知识。",
        estimatedTime: "3小时",
        progress: 0,
        status: "not_started",
        dependencies: [],
        resources: [
          {
            id: "demo_res_js_info",
            title: "JavaScript.info 现代教程",
            type: "article",
            url: "https://zh.javascript.info/"
          }
        ],
        notes: ""
      },
      {
        id: "demo_task_react_core",
        title: "React 组件与 Hooks",
        description: "用函数组件和 Hooks 构建可复用模块。",
        estimatedTime: "5小时",
        progress: 0,
        status: "not_started",
        dependencies: ["demo_task_js_refresh"],
        resources: [
          {
            id: "demo_res_react_docs",
            title: "React 官方文档",
            type: "document",
            url: "https://react.dev/"
          }
        ],
        notes: ""
      },
      {
        id: "demo_task_react_delivery",
        title: "React 页面交付",
        description: "输出包含表单、列表、路由的最小可交付项目。",
        estimatedTime: "6小时",
        progress: 0,
        status: "not_started",
        dependencies: ["demo_task_react_core"],
        resources: [
          {
            id: "demo_res_vscode",
            title: "VS Code",
            type: "document",
            url: "https://code.visualstudio.com/"
          }
        ],
        notes: ""
      }
    ],
    milestones: [
      { id: "demo_milestone_react_1", title: "搭建 React 基础框架", taskIds: ["demo_task_js_refresh", "demo_task_react_core"] },
      { id: "demo_milestone_react_2", title: "输出可演示项目", taskIds: ["demo_task_react_delivery"] }
    ]
  },
  {
    id: "demo_path_exam_focus",
    title: "数学函数与数列冲刺",
    description: "针对函数与数列题型进行限时训练，提升考试稳定度。",
    status: "in_progress",
    progress: 38,
    tags: ["演示", "考试", "数学"],
    goalId: "demo_goal_3",
    tasks: [
      {
        id: "demo_task_seq_pattern",
        title: "数列判型与公式应用",
        description: "在限定时间内完成数列判型与通项计算训练。",
        estimatedTime: "2小时",
        progress: 60,
        status: "in_progress",
        dependencies: [],
        resources: [
          {
            id: "demo_res_seq_doc",
            title: "数学序列基础",
            type: "document",
            url: "/kb"
          }
        ],
        notes: "高频错点已整理。"
      },
      {
        id: "demo_task_function_mapping",
        title: "函数映射与定义域",
        description: "强化函数映射题中的定义域和值域分析。",
        estimatedTime: "3小时",
        progress: 15,
        status: "in_progress",
        dependencies: ["demo_task_seq_pattern"],
        resources: [
          {
            id: "demo_res_func_doc",
            title: "函数与映射",
            type: "document",
            url: "/kb"
          }
        ],
        notes: "需要继续强化单射/满射判定。"
      }
    ],
    milestones: [
      {
        id: "demo_milestone_exam_1",
        title: "完成基础题型诊断",
        taskIds: ["demo_task_seq_pattern", "demo_task_function_mapping"]
      }
    ]
  }
];

export const DEMO_GOAL_SEEDS: DemoGoalSeed[] = [
  {
    id: "demo_goal_1",
    title: "在两周内完成前端基础站点",
    description: "聚焦 HTML/CSS/响应式布局，产出一个可展示的学习主页。",
    goalType: "project",
    category: "project",
    linkedPathIds: ["demo_path_frontend_foundations"],
    smart: {
      specific: "完成语义化页面和响应式适配",
      measurable: "完成 3 个关键任务与 2 个里程碑",
      achievable: "每晚投入 1-2 小时",
      relevant: "支撑后续 React 项目开发",
      timeBound: "2026-03-31"
    },
    startDate: "2026-03-17",
    endDate: "2026-03-31",
    progress: 46,
    status: "active"
  },
  {
    id: "demo_goal_2",
    title: "完成 React 项目并形成作品集",
    description: "完成一个可交互 React 页面，整理成可展示作品。",
    goalType: "project",
    category: "skill",
    linkedPathIds: ["demo_path_react_project"],
    smart: {
      specific: "实现组件化页面与基础状态管理",
      measurable: "完成 3 个任务并提交项目仓库",
      achievable: "按路径逐步推进",
      relevant: "对接求职和能力展示",
      timeBound: "2026-04-12"
    },
    startDate: "2026-03-24",
    endDate: "2026-04-12",
    progress: 0,
    status: "active"
  },
  {
    id: "demo_goal_3",
    title: "函数与数列专题得分率提升到 80%",
    description: "通过专题训练降低函数与数列题的失分率。",
    goalType: "exam",
    category: "exam",
    linkedPathIds: ["demo_path_exam_focus"],
    smart: {
      specific: "完成函数与数列的专项题型训练",
      measurable: "近三次训练正确率达到 80%",
      achievable: "利用演示题库与会话诊断",
      relevant: "直接提升考试表现",
      timeBound: "2026-03-28"
    },
    startDate: "2026-03-17",
    endDate: "2026-03-28",
    progress: 38,
    status: "active"
  }
];

export const DEMO_PATH_BOOTSTRAP: DemoPathBootstrap = {
  goalType: DEMO_GOAL_SEEDS[0].goalType,
  goal: DEMO_PATH_SEEDS[0].title,
  tasks: DEMO_PATH_SEEDS[0].tasks.map((task, index) => ({
    taskId: task.id,
    title: task.title,
    reason: task.description,
    dueDate: DEMO_GOAL_SEEDS[0].endDate,
    priority: index + 1
  }))
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
