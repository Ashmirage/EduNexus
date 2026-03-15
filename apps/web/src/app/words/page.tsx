"use client";

import { useMemo, useState } from "react";
import { BookOpen, Flame, ListTodo, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookSelector,
  ProgressRing,
  StatsCard,
  StreakCalendar,
} from "@/components/words";
import {
  getWordsByBookId,
  mockLearningRecords,
  mockStudyEvents,
  mockWordBooks,
} from "@/lib/words/mock-data";
import { calculateStreakDays, calculateTodayProgress } from "@/lib/words/stats";

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function WordsDashboardPage() {
  const router = useRouter();
  const [selectedBookId, setSelectedBookId] = useState<string>(mockWordBooks[0]?.id ?? "");
  const today = getTodayIsoDate();

  const progressByBook = useMemo(() => {
    return mockWordBooks.reduce<Record<string, number>>((acc, book) => {
      const records = mockLearningRecords.filter((record) => record.bookId === book.id);
      const words = getWordsByBookId(book.id);
      const learned = records.filter((record) => record.status === "mastered").length;
      acc[book.id] = words.length === 0 ? 0 : Math.round((learned / words.length) * 100);
      return acc;
    }, {});
  }, []);

  const dueByBook = useMemo(() => {
    return mockWordBooks.reduce<Record<string, number>>((acc, book) => {
      acc[book.id] = mockLearningRecords.filter(
        (record) => record.bookId === book.id && record.nextReviewDate <= today
      ).length;
      return acc;
    }, {});
  }, [today]);

  const todayProgress = calculateTodayProgress(mockStudyEvents, today);
  const activeDates = Array.from(new Set(mockStudyEvents.map((event) => event.date))).sort();
  const streakDays = calculateStreakDays(activeDates, today);
  const totalDueToday = Object.values(dueByBook).reduce((sum, value) => sum + value, 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ecfeff_0%,_transparent_40%),radial-gradient(circle_at_bottom_right,_#ecfdf5_0%,_transparent_45%),linear-gradient(160deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-cyan-700">Words Learning Lab</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">单词学习仪表盘</h1>
              <p className="text-sm text-slate-600">聚焦今日任务，持续保持学习节奏。</p>
            </div>
            <ProgressRing value={Math.min(100, (todayProgress.learned + todayProgress.reviewed) * 10)} label="Today" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard icon={Flame} label="连续学习天数" value={streakDays} trend={8} accentClassName="from-amber-500/15 to-orange-500/10 border-amber-200" />
            <StatsCard icon={ListTodo} label="今日待复习" value={totalDueToday} trend={-4} accentClassName="from-rose-500/15 to-orange-500/10 border-rose-200" />
            <StatsCard icon={BookOpen} label="今日学习" value={todayProgress.learned} accentClassName="from-cyan-500/15 to-sky-500/10 border-cyan-200" />
            <StatsCard icon={PlayCircle} label="今日复习" value={todayProgress.reviewed} accentClassName="from-emerald-500/15 to-teal-500/10 border-emerald-200" />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={() =>
                router.push(`/words/learn/${selectedBookId || mockWordBooks[0]?.id || "cet4-core"}`)
              }
            >
              快速开始学习
            </Button>
            <Button variant="outline" onClick={() => router.push("/words/review")}>
              进入复习模式
            </Button>
          </div>
        </section>

        <StreakCalendar activeDates={activeDates} />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">词库选择</h2>
            <p className="text-xs text-slate-500">选择后将用于“快速开始学习”</p>
          </div>
          <BookSelector
            books={mockWordBooks}
            selectedBookId={selectedBookId}
            progressByBook={progressByBook}
            dueByBook={dueByBook}
            onSelect={setSelectedBookId}
          />
        </section>
      </div>
    </div>
  );
}
