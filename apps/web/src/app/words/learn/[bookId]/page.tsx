"use client";

import { use, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewButtons, WordCard } from "@/components/words";
import { getWordsByBookId } from "@/lib/words/mock-data";
import type { Word } from "@/lib/words/types";

type LearnPageProps = {
  params: Promise<{ bookId: string }>;
};

function buildLearningQueue(words: Word[], size = 20): Word[] {
  if (words.length === 0) {
    return [];
  }
  if (words.length >= size) {
    return words.slice(0, size);
  }

  const queue: Word[] = [];
  while (queue.length < size) {
    queue.push(words[queue.length % words.length]);
  }
  return queue;
}

export default function LearnWordsPage({ params }: LearnPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [unknownCount, setUnknownCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const bookId = resolvedParams?.bookId ?? "cet4-core";
  const queue = useMemo(() => buildLearningQueue(getWordsByBookId(bookId), 20), [bookId]);
  const currentWord = queue[currentIndex];
  const progress = queue.length === 0 ? 0 : ((currentIndex + 1) / queue.length) * 100;

  const moveNext = (isKnown: boolean) => {
    if (isKnown) {
      setKnownCount((count) => count + 1);
    } else {
      setUnknownCount((count) => count + 1);
    }

    if (currentIndex >= queue.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setKnownCount(0);
    setUnknownCount(0);
    setFinished(false);
  };

  if (!currentWord) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <p className="text-base font-medium text-slate-900">当前词库暂无可学习单词</p>
          <Button className="mt-4" onClick={() => router.push("/words")}>
            返回仪表盘
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(170deg,_#ecfeff_0%,_#eff6ff_45%,_#f8fafc_100%)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
        <header className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-700">
            <span>学习进度</span>
            <span className="font-semibold">
              {Math.min(currentIndex + 1, queue.length)}/{queue.length}
            </span>
          </div>
          <Progress value={progress} />
        </header>

        <WordCard word={currentWord} />

        <ReviewButtons onKnow={() => moveNext(true)} onDontKnow={() => moveNext(false)} />
      </div>

      <Dialog open={finished} onOpenChange={setFinished}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              今日学习完成
            </DialogTitle>
            <DialogDescription>
              你已完成本轮学习，下面是本次学习报告。
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-emerald-700">认识</p>
              <p className="text-2xl font-bold text-emerald-800">{knownCount}</p>
            </div>
            <div className="rounded-lg bg-rose-50 p-3">
              <p className="text-rose-700">不认识</p>
              <p className="text-2xl font-bold text-rose-800">{unknownCount}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => router.push("/words")}>
              返回首页
            </Button>
            <Button className="gap-2" onClick={restart}>
              <RotateCcw className="h-4 w-4" />
              再学一轮
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
