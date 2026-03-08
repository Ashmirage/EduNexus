import { TeacherPlanDemo } from "@/components/teacher-plan-demo";
import { PageHeader } from "@/components/page-header";
import { PageQuickNav } from "@/components/page-quick-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Settings } from "lucide-react";

const TEACHER_QUICK_NAV_ITEMS = [
  { href: "#teacher_input_panel", label: "输入配置", hint: "主题与难度" },
  { href: "#teacher_template_panel", label: "薄弱点模板", hint: "模板刷新与套用" },
  { href: "#teacher_result_panel", label: "教案结果", hint: "目标流程与作业" },
  { href: "#teacher_error_panel", label: "状态反馈", hint: "错误提示" }
] as const;

export default function TeacherPage() {
  return (
    <section className="page-container space-y-8 animate-in">
      <PageHeader
        title="教师工作台"
        description="围绕教学准备与课堂改进生成结构化方案，减少重复整理时间。"
        tags={["备课生成", "结构化教案", "班级薄弱点", "可沉淀输出"]}
        actions={
          <>
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/dashboard">
                <FileText className="mr-2 h-4 w-4" />
                查看看板
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                配置模板
              </Link>
            </Button>
          </>
        }
      />

      <div className="panel-grid">
        <PageQuickNav title="教师工作台快速导航" items={[...TEACHER_QUICK_NAV_ITEMS]} />
      </div>

      <div className="panel-grid">
        <Card className="col-span-12 glass-card">
          <CardContent className="p-6">
            <TeacherPlanDemo />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
