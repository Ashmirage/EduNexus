import type {
  LearningRecord,
  StudyEvent,
  WordMasteryInput,
} from "./types";

export function calculateTotalLearned(
  records: Array<Pick<LearningRecord, "status">>
): number {
  return records.filter((record) => record.status === "mastered").length;
}

export function calculateTodayProgress(
  events: StudyEvent[],
  today: string
): { learned: number; reviewed: number; accuracy: number } {
  const todayEvents = events.filter((event) => event.date === today);
  const learned = todayEvents.filter((event) => event.type === "learn").length;
  const reviewed = todayEvents.filter((event) => event.type === "review").length;
  const successCount = todayEvents.filter((event) => event.success).length;
  const accuracy = todayEvents.length === 0 ? 0 : successCount / todayEvents.length;

  return { learned, reviewed, accuracy };
}

export function calculateStreakDays(activeDates: string[], today: string): number {
  const set = new Set(activeDates);
  let streak = 0;
  const cursor = new Date(`${today}T00:00:00.000Z`);

  while (true) {
    const iso = cursor.toISOString().split("T")[0];
    if (!set.has(iso)) {
      break;
    }
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export function calculateWordMastery(input: WordMasteryInput): number {
  const reviewComponent = Math.min(1, input.reviewCount / 10);
  const easeComponent = Math.min(1, Math.max(0, (input.easeFactor - 1.3) / 1.7));
  const successComponent = Math.min(1, Math.max(0, input.successRate));

  const score = reviewComponent * 0.4 + easeComponent * 0.2 + successComponent * 0.4;
  return Math.min(1, Math.max(0, score));
}
