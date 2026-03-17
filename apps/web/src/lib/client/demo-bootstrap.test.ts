import { describe, expect, it } from "vitest";

import { buildDemoStarterContent } from "@/lib/client/demo-bootstrap";

describe("demo bootstrap content", () => {
  it("builds starter goal and path from demo bootstrap payload", () => {
    const result = buildDemoStarterContent({
      goalType: "exam",
      goal: "Demo Goal",
      tasks: [
        {
          taskId: "task-1",
          title: "Task 1",
          reason: "Reason 1",
          dueDate: "2026-03-20",
          priority: 1,
        },
      ],
    });

    expect(result.goal.title).toBe("Demo Goal");
    expect(result.path.title).toBe("Demo Goal");
    expect(result.path.tasks).toHaveLength(1);
    expect(result.path.tasks[0]).toMatchObject({
      id: "task-1",
      title: "Task 1",
      description: "Reason 1",
      status: "not_started",
      progress: 0,
    });
  });
});
