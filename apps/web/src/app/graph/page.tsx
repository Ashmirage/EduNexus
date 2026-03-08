import { GraphDemo } from "@/components/graph-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Network, Play } from "lucide-react";

const GRAPH_QUICK_NAV_ITEMS = [
  { href: "#graph_controls", label: "图谱控制", hint: "筛选/热力/缩放" },
  { href: "#graph_view_switcher", label: "工作台视图", hint: "总览/回放/历史" },
  { href: "#graph_canvas_panel", label: "图谱画布", hint: "节点关系与焦点" },
  { href: "#graph_overview_panel", label: "总览侧栏", hint: "聚类/高风险/焦点" },
  { href: "#graph_bridge_panel", label: "关系链侧栏", hint: "建议与回放" },
  { href: "#graph_history_panel", label: "历史侧栏", hint: "批次与演化" }
] as const;

export default function GraphPage() {
  return (
    <section className="page-container space-y-8 animate-in">
      <PageHeader
        title="知识图谱"
        description="把学习行为和知识关系放进同一画布，实时定位风险链路并一键联动到路径与工作区。"
        tags={["风险热力", "关系链回放", "批次复推", "跨页定位"]}
        actions={
          <>
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/workspace">
                <Network className="mr-2 h-4 w-4" />
                开始分析
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/path">
                <Play className="mr-2 h-4 w-4" />
                查看路径
              </Link>
            </Button>
          </>
        }
      />

      <div className="panel-grid">
        <PageQuickNav title="图谱快速导航" items={[...GRAPH_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <div className="col-span-12">
          <GraphDemo />
        </div>
      </div>
    </section>
  );
}
