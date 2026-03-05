import { Suspense } from "react";
import { WorkspaceDemo } from "@/components/workspace-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";

const WORKSPACE_QUICK_NAV_ITEMS = [
  { href: "#workspace_sessions", label: "会话历史", hint: "检索/恢复/删除" },
  { href: "#workspace_input_control", label: "输入与控制", hint: "任务清单与引导" },
  { href: "#workspace_session_records", label: "会话记录", hint: "消息与链路回放" }
] as const;

export default function WorkspacePage() {
  return (
    <section className="ecosystem-page">
      <PageHeader
        title="学习工作区"
        description="以过程引导替代直接答案。每次会话都可检索、回放、沉淀并回流到图谱。"
        tags={["Socratic 分层", "LangGraph 流式", "会话回放", "本地沉淀"]}
      />
      <div className="panel-grid">
        <PageQuickNav title="工作区快速导航" items={[...WORKSPACE_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <article className="panel wide">
          <h3>学习会话</h3>
          <Suspense fallback={<div className="result-box">正在加载学习工作区...</div>}>
            <WorkspaceDemo />
          </Suspense>
        </article>
      </div>
    </section>
  );
}
