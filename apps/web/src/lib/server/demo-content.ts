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
    title: "前端开发入门路线",
    content:
      "建议先完成 HTML 语义化，再进入 CSS 布局，最后用 JavaScript 串起交互流程。每个阶段都要有可交付练习页面。"
  },
  {
    title: "React 项目实战清单",
    content:
      "React 路径建议按 JavaScript 复盘 -> 组件与 Hooks -> 最小可交付项目推进，并在每一步保留复盘笔记与代码提交。"
  }
];

export const DEMO_WORKSPACE_SESSIONS: DemoSessionSeed[] = [
  {
    id: "ws_demo_frontend_intro",
    title: "前端开发入门会话",
    lastLevel: 2,
    messages: [
      {
        role: "system",
        content: "欢迎进入前端开发入门学习。"
      },
      {
        role: "assistant",
        content: "先从 HTML 语义化结构开始，再推进 CSS 布局和 JavaScript 基础，按任务逐步完成。"
      }
    ]
  },
  {
    id: "ws_demo_react_intro",
    title: "React 项目推进会话",
    lastLevel: 2,
    messages: [
      {
        role: "system",
        content: "欢迎进入 React 项目实战路径。"
      },
      {
        role: "assistant",
        content: "先复盘 JavaScript 核心，再拆分组件与 Hooks，最后完成可演示的 React 页面交付。"
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
    id: "demo_path_data_structures",
    title: "数据结构与算法路径",
    description: "从数组链表到树图与算法练习，建立系统化的算法基础。",
    status: "in_progress",
    progress: 35,
    tags: ["演示", "算法", "进阶"],
    goalId: "demo_goal_3",
    tasks: [
      {
        id: "demo_task_array_list",
        title: "数组与链表基础",
        description: "掌握数组与链表的核心操作和适用场景。",
        estimatedTime: "4小时",
        progress: 80,
        status: "in_progress",
        dependencies: [],
        resources: [
          {
            id: "demo_res_algo_array",
            title: "数组与链表入门",
            type: "document",
            url: "https://leetcode.cn/"
          }
        ],
        notes: "双指针与链表遍历已完成一轮练习。"
      },
      {
        id: "demo_task_stack_queue",
        title: "栈与队列",
        description: "掌握 LIFO/FIFO 结构并能解决基础题型。",
        estimatedTime: "3小时",
        progress: 30,
        status: "in_progress",
        dependencies: ["demo_task_array_list"],
        resources: [
          {
            id: "demo_res_algo_stack",
            title: "栈队列专题",
            type: "document",
            url: "https://leetcode.cn/"
          }
        ],
        notes: "已完成基础实现，待补充单调栈题型。"
      },
      {
        id: "demo_task_tree_graph",
        title: "树与图遍历",
        description: "练习 DFS/BFS 并建立图模型思维。",
        estimatedTime: "5小时",
        progress: 0,
        status: "not_started",
        dependencies: ["demo_task_stack_queue"],
        resources: [
          {
            id: "demo_res_algo_tree",
            title: "树与图基础",
            type: "document",
            url: "https://leetcode.cn/"
          }
        ],
        notes: ""
      }
    ],
    milestones: [
      {
        id: "demo_milestone_exam_1",
        title: "完成基础结构训练",
        taskIds: ["demo_task_array_list", "demo_task_stack_queue", "demo_task_tree_graph"]
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
    title: "在三周内完成算法基础路径",
    description: "完成数据结构核心任务并建立基础题型解题习惯。",
    goalType: "project",
    category: "skill",
    linkedPathIds: ["demo_path_data_structures"],
    smart: {
      specific: "完成数组链表、栈队列、树图三个核心模块",
      measurable: "完成 3 个任务并产出阶段性笔记",
      achievable: "每天投入 1 小时练习",
      relevant: "补齐前端工程中的算法基础能力",
      timeBound: "2026-04-10"
    },
    startDate: "2026-03-17",
    endDate: "2026-04-10",
    progress: 35,
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
    name: "前端与算法演示题库",
    description: "演示账号预置题库，用于体验前端与算法练习流程。",
    tags: ["演示", "前端", "算法"],
    questions: [
      {
        type: "multiple_choice",
        title: "语义化标签选择",
        content: "页面主导航区域应优先使用哪个语义化标签？",
        difficulty: "easy",
        status: "active",
        tags: ["HTML", "语义化"],
        points: 5,
        explanation: "主导航语义化标签应优先使用 nav。",
        options: [
          { id: "a", text: "nav", isCorrect: true },
          { id: "b", text: "aside", isCorrect: false },
          { id: "c", text: "footer", isCorrect: false }
        ]
      },
      {
        type: "short_answer",
        title: "为什么先复盘 JavaScript 再学 React？",
        content: "请说明在 React 路径中先复盘 JavaScript 核心概念的意义。",
        difficulty: "medium",
        status: "active",
        tags: ["JavaScript", "React"],
        points: 10,
        explanation: "React 的组件与 Hooks 依赖闭包、状态更新与异步机制的扎实基础。"
      }
    ]
  }
];
