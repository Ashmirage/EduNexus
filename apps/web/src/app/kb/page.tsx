import { Suspense } from "react";
import { KbDemo } from "@/components/kb-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Network, Search, Loader2 } from "lucide-react";

const KB_QUICK_NAV_ITEMS = [
  { href: "#kb_search_panel", label: "检索控制", hint: "关键词与过滤" },
  { href: "#kb_doc_panel", label: "文档阅读", hint: "双链与摘录" },
  { href: "#kb_graph_panel", label: "关系图谱", hint: "反链图与热度" },
  { href: "#kb_index_panel", label: "索引摘要", hint: "重建与统计" }
] as const;

export default function KbPage() {
  return (
    <section className="page-container space-y-8 animate-in">
      <PageHeader
        title="本地知识库"
        description="以 Markdown 双链为核心组织个人知识资产，支持检索、关系导航与上下文引用。"
        tags={["Local-first", "双链关系", "轻量检索", "时间脉络"]}
        actions={
          <>
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/workspace">
                <Search className="mr-2 h-4 w-4" />
                开始检索
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
        <PageQuickNav title="知识库快速导航" items={[...KB_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <Card className="col-span-12 glass-card">
          <CardContent className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">正在加载知识库...</span>
                </div>
              }
            >
              <KbDemo />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
