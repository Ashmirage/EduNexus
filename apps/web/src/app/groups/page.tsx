"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PublicGroup = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
};

export default function GroupsPage() {
  const [groups, setGroups] = useState<PublicGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/groups", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("failed to fetch groups");
        }
        const payload = (await response.json()) as {
          data?: { groups?: PublicGroup[] };
        };
        setGroups(payload.data?.groups ?? []);
      })
      .catch(() => {
        setGroups([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/40 via-sky-50/20 to-blue-50/40">
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">学习小组</h1>
            <p className="text-muted-foreground">公开浏览小组，登录后创建并加入。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <Card className="p-8 text-center text-muted-foreground md:col-span-2">加载中...</Card>
          ) : groups.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground md:col-span-2">暂无公开小组</Card>
          ) : (
            groups.map((group) => (
              <Card key={group.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold text-lg">{group.name}</h2>
                  <Badge variant="secondary">{group.memberCount} 成员</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-6">
                  {group.description || "这个小组正在筹备学习活动。"}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
