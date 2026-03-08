"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatErrorMessage, requestJson } from "@/lib/client/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Loader2,
  BookOpen,
  Network,
  Database,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from "lucide-react";

type LessonPlan = {
  title: string;
  objectives: string[];
  outline: string[];
  classAdjustment: string;
  homework: string[];
  reviewChecklist: string[];
  modelHint?: string;
  source: string;
};

type WeaknessTemplate = {
  id: string;
  label: string;
  content: string;
  description: string;
  scope: string;
};

type WeaknessTemplatePayload = {
  subject: string;
  templates: WeaknessTemplate[];
};

const FALLBACK_TEMPLATES: WeaknessTemplate[] = [
  {
    id: "fallback-condition",
    label: "条件识别偏弱",
    content: "条件识别能力弱，易直接套公式",
    description: "常见于概念初学阶段，容易遗漏前提条件。",
    scope: "通用"
  },
  {
    id: "fallback-step",
    label: "步骤书写跳跃",
    content: "步骤书写不完整，跳步严重",
    description: "结果正确但过程不可复查，影响迁移能力。",
    scope: "通用"
  },
  {
    id: "fallback-calc",
    label: "计算准确率偏低",
    content: "计算正确率偏低，粗心错误频发",
    description: "对中间变量缺少检验，常出现符号错误。",
    scope: "通用"
  },
  {
    id: "fallback-transfer",
    label: "迁移能力不足",
    content: "知识点迁移弱，跨题型应用困难",
    description: "跨章节或综合题中策略切换慢。",
    scope: "通用"
  }
];

export function TeacherPlanDemo() {
  const router = useRouter();
  const [subject, setSubject] = useState("高中数学");
  const [topic, setTopic] = useState("等差数列求和");
  const [grade, setGrade] = useState("高一");
  const [difficulty, setDifficulty] = useState<"基础" | "中等" | "提升">("中等");
  const [classWeakness, setClassWeakness] = useState("条件识别能力弱，易直接套公式");
  const [templates, setTemplates] = useState<WeaknessTemplate[]>(FALLBACK_TEMPLATES);
  const [templateSubject, setTemplateSubject] = useState("通用");
  const [templateLoading, setTemplateLoading] = useState(false);
  const [result, setResult] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("input");

  async function loadTemplates(targetSubject = subject) {
    setTemplateLoading(true);
    try {
      const data = await requestJson<WeaknessTemplatePayload>(
        `/api/teacher/lesson-plan/templates?subject=${encodeURIComponent(targetSubject)}`
      );
      if (data.templates.length > 0) {
        setTemplates(data.templates);
      }
      setTemplateSubject(data.subject || "通用");
      setError("");
    } catch (err) {
      setTemplates(FALLBACK_TEMPLATES);
      setTemplateSubject("通用");
      setError(formatErrorMessage(err, "加载薄弱点模板失败，已切换到内置模板。"));
      console.error(err);
    } finally {
      setTemplateLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTemplates(subject);
    }, 220);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await requestJson<LessonPlan>("/api/teacher/lesson-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          grade,
          difficulty,
          classWeakness
        })
      });
      setResult(data);
      setActiveTab("result");
    } catch (err) {
      setError(formatErrorMessage(err, "生成备课草案失败。"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function exportMarkdown() {
    if (!result) {
      setError("请先生成备课草案。");
      return;
    }

    const markdown = [
      "---",
      `subject: ${subject}`,
      `topic: ${topic}`,
      `grade: ${grade}`,
      `difficulty: ${difficulty}`,
      `class_weakness: ${classWeakness || "未填写"}`,
      `generated_at: ${new Date().toISOString()}`,
      "---",
      "",
      `# ${result.title}`,
      "",
      "## 教学目标",
      ...result.objectives.map((item) => `- ${item}`),
      "",
      "## 课堂流程",
      ...result.outline.map((item) => `- ${item}`),
      "",
      "## 班级调节建议",
      result.classAdjustment,
      "",
      "## 作业建议",
      ...result.homework.map((item) => `- ${item}`),
      "",
      "## 复核清单",
      ...result.reviewChecklist.map((item) => `- ${item}`),
      "",
      `> 生成来源：${result.source}`,
      result.modelHint ? `\n## 模型补充建议\n${result.modelHint}` : ""
    ].join("\n");

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.replace(/[\\/:*?"<>|]/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* 快捷链接 */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => router.push("/graph?from=teacher")}>
          <Network className="h-4 w-4 mr-2" />
          查看图谱总览
        </Button>
        <Button variant="outline" size="sm" onClick={() => router.push("/workspace?from=teacher")}>
          <BookOpen className="h-4 w-4 mr-2" />
          进入学习工作区
        </Button>
        <Button variant="outline" size="sm" onClick={() => router.push("/kb?from=teacher")}>
          <Database className="h-4 w-4 mr-2" />
          打开知识库检索
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">
            <FileText className="h-4 w-4 mr-2" />
            输入配置
          </TabsTrigger>
          <TabsTrigger value="template">
            <Sparkles className="h-4 w-4 mr-2" />
            薄弱点模板
            <Badge variant="secondary" className="ml-2">{templates.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="result" disabled={!result}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            教案结果
            {result && <Badge variant="secondary" className="ml-2">已生成</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* 输入配置 */}
        <TabsContent value="input" className="space-y-6">
          <Card id="teacher_input_panel">
            <CardHeader>
              <CardTitle>基础信息配置</CardTitle>
              <CardDescription>填写教学主题和班级基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">科目</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="例如：高中数学"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">年级</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger id="grade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="高一">高一</SelectItem>
                      <SelectItem value="高二">高二</SelectItem>
                      <SelectItem value="高三">高三</SelectItem>
                      <SelectItem value="初一">初一</SelectItem>
                      <SelectItem value="初二">初二</SelectItem>
                      <SelectItem value="初三">初三</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">教学主题</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="例如：等差数列求和"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">难度</Label>
                  <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="基础">基础</SelectItem>
                      <SelectItem value="中等">中等</SelectItem>
                      <SelectItem value="提升">提升</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classWeakness">班级薄弱点描述</Label>
                <Textarea
                  id="classWeakness"
                  value={classWeakness}
                  onChange={(e) => setClassWeakness(e.target.value)}
                  placeholder="描述班级在该主题上的薄弱环节..."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  onClick={generate}
                  disabled={loading || !topic.trim()}
                  className="btn-primary"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      生成教案
                    </>
                  )}
                </Button>
                {result && (
                  <Button variant="outline" onClick={() => setActiveTab("result")}>
                    查看结果
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 薄弱点模板 */}
        <TabsContent value="template" className="space-y-6">
          <Card id="teacher_template_panel">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>薄弱点模板库</CardTitle>
                  <CardDescription>
                    当前科目：{templateSubject} · {templates.length} 个模板
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadTemplates()}
                  disabled={templateLoading}
                >
                  {templateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="card-hover cursor-pointer"
                    onClick={() => {
                      setClassWeakness(template.content);
                      setActiveTab("input");
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{template.label}</CardTitle>
                        <Badge variant="outline">{template.scope}</Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{template.content}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 教案结果 */}
        <TabsContent value="result" className="space-y-6">
          {result && (
            <Card id="teacher_result_panel">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{result.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge>{subject}</Badge>
                      <Badge variant="outline">{grade}</Badge>
                      <Badge variant="outline">{difficulty}</Badge>
                    </div>
                  </div>
                  <Button onClick={exportMarkdown} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    导出 Markdown
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 教学目标 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    教学目标
                  </h3>
                  <ul className="space-y-2">
                    {result.objectives.map((obj, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* 课堂流程 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    课堂流程
                  </h3>
                  <ul className="space-y-2">
                    {result.outline.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* 班级调节建议 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">班级调节建议</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="leading-relaxed">{result.classAdjustment}</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* 作业建议 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">作业建议</h3>
                  <ul className="space-y-2">
                    {result.homework.map((hw, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{hw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* 复核清单 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">复核清单</h3>
                  <div className="space-y-2">
                    {result.reviewChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.modelHint && (
                  <>
                    <Separator />
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        <strong className="block mb-2">模型补充建议</strong>
                        {result.modelHint}
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                <Separator />

                <p className="text-sm text-muted-foreground">
                  生成来源：{result.source}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
