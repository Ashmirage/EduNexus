import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StreakCalendarProps = {
  activeDates: string[];
  days?: number;
};

function getRecentDates(days: number): string[] {
  const dateList: string[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(cursor);
    date.setUTCDate(cursor.getUTCDate() - index);
    dateList.push(date.toISOString().slice(0, 10));
  }
  return dateList;
}

export function StreakCalendar({ activeDates, days = 28 }: StreakCalendarProps) {
  const recentDates = getRecentDates(days);
  const activeSet = new Set(activeDates);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">学习日历</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {recentDates.map((date) => {
            const isActive = activeSet.has(date);
            return (
              <div
                key={date}
                title={date}
                className={cn(
                  "h-7 rounded-md border",
                  isActive
                    ? "border-emerald-400 bg-emerald-400/80"
                    : "border-slate-200 bg-slate-100"
                )}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
