"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PublicResource = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<PublicResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/resources", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("failed to fetch resources");
        }
        const payload = (await response.json()) as {
          data?: { resources?: PublicResource[] };
        };
        setResources(payload.data?.resources ?? []);
      })
      .catch(() => {
        setResources([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-lime-50/20 to-teal-50/30">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500 text-white">
            <BookOpenText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">资源中心</h1>
            <p className="text-muted-foreground">公共资源可直接浏览，持续由社区补充。</p>
          </div>
        </div>

        <Card className="p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">公共资源总数</span>
          <Badge variant="secondary">{resources.length}</Badge>
        </Card>

        <div className="space-y-4">
          {loading ? (
            <Card className="p-8 text-center text-muted-foreground">加载中...</Card>
          ) : resources.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">暂无公开资源</Card>
          ) : (
            resources.map((resource) => (
              <Card key={resource.id} className="p-5 space-y-3">
                <h2 className="text-lg font-semibold">{resource.title}</h2>
                <p className="text-sm text-muted-foreground leading-6">
                  {resource.description || "该资源暂未提供描述。"}
                </p>
                {resource.url ? (
                  <Link className="text-sm text-primary underline" href={resource.url}>
                    访问资源
                  </Link>
                ) : null}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
