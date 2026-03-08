import { Suspense } from "react";
import { PathDemo } from "@/components/path-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Route, Network, Loader2 } from "lucide-react";

const PATH_QUICK_NAV_ITEMS = [
  { href: "/graph", label: "知识图谱", hint: "查看风险链路与来源" },
  { href: "/workspace", label: "学习工作区", hint: "继续引导与沉淀" },
  { href: "/kb", label: "本地知识库", hint: "检索历史笔记与证据" },
  { href: "#path_focus_panel", label: "当前页面分区", hint: "下滑后由分区锚点接管" }
] as const;

export default function PathPage() {
  return (
    <section className="page-container space-y-8 animate-in">
      <PageHeader
        title="学习路径"
        description="把目标、风险与掌握度统一成可执行任务序列，并在执行后持续回写图谱。"
        tags={["7 日计划", "动态重排", "图谱回写", "批次队列"]}
        actions={
          <>
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/workspace">
                <Route className="mr-2 h-4 w-4" />
                开始执行
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/graph">
                <Network className="mr-2 h-4 w-4" />
                查看图谱
              </Link>
            </Button>
          </>
        }
      />

      <div className="panel-grid">
        <PageQuickNav title="路径页快速导航" items={[...PATH_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <Card className="col-span-12 glass-card">
          <CardContent className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">正在加载路径模块...</span>
                </div>
              }
            >
              <PathDemo />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
