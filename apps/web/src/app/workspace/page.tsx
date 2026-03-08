import { Suspense } from "react";
import { WorkspaceDemo } from "@/components/workspace-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Route, Loader2 } from "lucide-react";

const WORKSPACE_QUICK_NAV_ITEMS = [
  { href: "/graph", label: "知识图谱", hint: "查看关系链批次来源" },
  { href: "/path", label: "学习路径", hint: "回到计划任务与重排" },
  { href: "/kb", label: "本地知识库", hint: "检索沉淀笔记" },
  { href: "#workspace_sessions", label: "当前页面分区", hint: "下滑后由分区锚点接管" }
] as const;

export default function WorkspacePage() {
  return (
    <section className="page-container space-y-8 animate-in">
      <PageHeader
        title="学习工作区"
        description="以过程引导替代直接答案。每次会话都可检索、回放、沉淀并回流到图谱。"
        tags={["Socratic 分层", "LangGraph 流式", "会话回放", "本地沉淀"]}
        actions={
          <>
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/path">
                <Route className="mr-2 h-4 w-4" />
                查看路径
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/kb">
                <BookOpen className="mr-2 h-4 w-4" />
                知识库
              </Link>
            </Button>
          </>
        }
      />

      <div className="panel-grid">
        <PageQuickNav title="工作区快速导航" items={[...WORKSPACE_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <Card className="col-span-12 glass-card">
          <CardContent className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">正在加载学习工作区...</span>
                </div>
              }
            >
              <WorkspaceDemo />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
