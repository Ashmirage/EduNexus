import type { Goal, GoalCategory, GoalType } from "@/lib/goals/goal-storage";
import type { LearningPath, Task } from "@/lib/client/path-storage";
import {
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
  type PracticeStorageManager,
  type Question,
  type QuestionBank
} from "@/lib/client/practice-storage";
import type { ChatMessage, ChatSession } from "@/lib/workspace/chat-history-storage";

type DemoBootstrapTask = {
  taskId: string;
  title: string;
  reason: string;
  dueDate: string;
  priority: number;
};

export type DemoPathBootstrap = {
  goalType: "exam" | "project" | "certificate";
  goal: string;
  tasks: DemoBootstrapTask[];
};

export type DemoWorkspaceBootstrapSession = {
  id: string;
  title: string;
  lastLevel: number;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    createdAt?: string;
  }>;
};

export type DemoPracticeBootstrapBank = {
  name: string;
  description: string;
  tags: string[];
  questions: Array<{
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
  }>;
};

export type DemoBootstrapPayload = {
  workspace: { sessions: DemoWorkspaceBootstrapSession[] };
  practice: { banks: DemoPracticeBootstrapBank[] };
  path: DemoPathBootstrap;
};

type DemoBootstrapResponse = {
  success?: boolean;
  data?: Partial<DemoBootstrapPayload>;
};

function mapGoalType(goalType: DemoPathBootstrap["goalType"]): GoalType {
  if (goalType === "exam") {
    return "short-term";
  }
  if (goalType === "project") {
    return "mid-term";
  }
  return "long-term";
}

function mapGoalCategory(goalType: DemoPathBootstrap["goalType"]): GoalCategory {
  if (goalType === "exam") {
    return "exam";
  }
  if (goalType === "project") {
    return "project";
  }
  return "other";
}

export function buildDemoStarterContent(bootstrap: DemoPathBootstrap): {
  goal: Goal;
  path: Omit<LearningPath, "id" | "createdAt" | "updatedAt">;
} {
  const now = new Date().toISOString();
  const goalId = `demo_goal_${bootstrap.goal.replace(/\s+/g, "_").toLowerCase()}`;

  const goal: Goal = {
    id: goalId,
    title: bootstrap.goal,
    description: "演示账号预置目标",
    type: mapGoalType(bootstrap.goalType),
    category: mapGoalCategory(bootstrap.goalType),
    status: "active",
    smart: {
      specific: bootstrap.goal,
      measurable: "完成演示任务清单",
      achievable: "按任务逐步完成",
      relevant: "帮助快速体验平台流程",
      timeBound: bootstrap.tasks[0]?.dueDate ?? now,
    },
    progress: 0,
    linkedPathIds: [],
    relatedKnowledge: [],
    startDate: now,
    endDate: bootstrap.tasks[bootstrap.tasks.length - 1]?.dueDate ?? now,
    createdAt: now,
    updatedAt: now,
  };

  const tasks: Task[] = bootstrap.tasks.map((item) => ({
    id: item.taskId,
    title: item.title,
    description: item.reason,
    estimatedTime: `${Math.max(1, item.priority)}小时`,
    progress: 0,
    status: "not_started",
    dependencies: [],
    resources: [],
    notes: "",
    createdAt: new Date(),
  }));

  const path: Omit<LearningPath, "id" | "createdAt" | "updatedAt"> = {
    title: bootstrap.goal,
    description: "演示账号预置学习路径",
    status: "not_started",
    progress: 0,
    tags: ["演示", bootstrap.goalType],
    goalId,
    tasks,
    milestones: [],
  };

  return { goal, path };
}

export async function fetchDemoPathBootstrap(
  fetcher: typeof fetch = fetch
): Promise<DemoPathBootstrap | null> {
  const payload = await fetchDemoBootstrap(fetcher);
  return payload?.path ?? null;
}

export async function fetchDemoBootstrap(
  fetcher: typeof fetch = fetch
): Promise<DemoBootstrapPayload | null> {
  const response = await fetcher("/api/demo/bootstrap", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as DemoBootstrapResponse;
  if (!payload.data?.path || !payload.data?.workspace || !payload.data?.practice) {
    return null;
  }

  return {
    path: payload.data.path,
    workspace: payload.data.workspace,
    practice: payload.data.practice
  };
}

export async function fetchDemoWorkspaceBootstrap(
  fetcher: typeof fetch = fetch
): Promise<DemoWorkspaceBootstrapSession[]> {
  const payload = await fetchDemoBootstrap(fetcher);
  return payload?.workspace.sessions ?? [];
}

export async function fetchDemoPracticeBootstrap(
  fetcher: typeof fetch = fetch
): Promise<DemoPracticeBootstrapBank[]> {
  const payload = await fetchDemoBootstrap(fetcher);
  return payload?.practice.banks ?? [];
}

export function buildDemoWorkspaceStarterSessions(
  sessions: DemoWorkspaceBootstrapSession[]
): ChatSession[] {
  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    createdAt: new Date(session.messages[0]?.createdAt ?? Date.now()),
    updatedAt: new Date(session.messages[session.messages.length - 1]?.createdAt ?? Date.now()),
    socraticMode: true,
    messages: session.messages.map(
      (message, index): ChatMessage => ({
        id: `${session.id}_${index}`,
        role: message.role === "system" ? "assistant" : message.role,
        content: message.content,
        timestamp: new Date(message.createdAt ?? Date.now())
      })
    )
  }));
}

function mapQuestionType(type: DemoPracticeBootstrapBank["questions"][number]["type"]): QuestionType {
  return QuestionType[type.toUpperCase() as keyof typeof QuestionType] ?? QuestionType.SHORT_ANSWER;
}

function mapQuestionDifficulty(
  difficulty: DemoPracticeBootstrapBank["questions"][number]["difficulty"]
): QuestionDifficulty {
  return QuestionDifficulty[difficulty.toUpperCase() as keyof typeof QuestionDifficulty] ?? QuestionDifficulty.MEDIUM;
}

function mapQuestionStatus(
  status: DemoPracticeBootstrapBank["questions"][number]["status"]
): QuestionStatus {
  return QuestionStatus[status.toUpperCase() as keyof typeof QuestionStatus] ?? QuestionStatus.ACTIVE;
}

export async function seedDemoPracticeContent(
  storage: PracticeStorageManager,
  banks: DemoPracticeBootstrapBank[]
): Promise<QuestionBank[]> {
  const createdBanks: QuestionBank[] = [];

  for (const bankSeed of banks) {
    const bank = await storage.createBank(bankSeed.name, bankSeed.description, bankSeed.tags);
    createdBanks.push(bank);

    for (const questionSeed of bankSeed.questions) {
      const question: Omit<Question, "id" | "createdAt" | "updatedAt"> = {
        bankId: bank.id,
        type: mapQuestionType(questionSeed.type),
        title: questionSeed.title,
        content: questionSeed.content,
        difficulty: mapQuestionDifficulty(questionSeed.difficulty),
        status: mapQuestionStatus(questionSeed.status),
        tags: questionSeed.tags,
        points: questionSeed.points,
        explanation: questionSeed.explanation,
        options: questionSeed.options
      };
      await storage.createQuestion(question);
    }
  }

  return createdBanks;
}
