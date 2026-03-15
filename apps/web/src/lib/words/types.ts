export type WordDifficulty = "easy" | "medium" | "hard";

export type LearningStatus = "new" | "learning" | "reviewing" | "mastered";

export type WordBookCategory = "cet" | "exam" | "general";

export type Word = {
  id: string;
  word: string;
  phonetic: string;
  definition: string;
  example: string;
  exampleZh?: string;
  bookId: string;
  difficulty: WordDifficulty;
};

export type WordBook = {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  category: WordBookCategory;
};

export type LearningRecord = {
  wordId: string;
  bookId: string;
  learnDate: string;
  status: LearningStatus;
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  successCount: number;
  failureCount: number;
  lastReviewedAt: string;
  retentionScore: 0 | 1;
};

export type ReviewSchedule = {
  date: string;
  wordIds: string[];
  newCount: number;
  reviewCount: number;
};

export type LearningStats = {
  totalBooks: number;
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  dueToday: number;
  accuracy: number;
  streakDays: number;
};

export type Stats = LearningStats;

export type StudyEvent = {
  date: string;
  type: "learn" | "review";
  success: boolean;
};

export type WordMasteryInput = {
  reviewCount: number;
  easeFactor: number;
  successRate: number;
};
