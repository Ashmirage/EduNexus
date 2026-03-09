"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Loader2,
  Brain,
  Lightbulb,
  BookOpen,
  Target,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  timestamp: Date;
};

export default function WorkspacePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是你的智能学习助手。我使用 ReAct Agent 模式工作，可以帮你：\n\n- 🔍 搜索知识库和图谱\n- 📝 生成个性化练习题\n- 🗺️ 规划学习路径\n- 💡 解释复杂概念\n- 🤔 通过提问引导思考\n\n有什么想学习或探讨的吗？",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socraticMode, setSocraticMode] = useState(true);
  const [showThinking, setShowThinking] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/workspace/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          config: {
            socraticMode,
            temperature: 0.7,
            maxIterations: 5,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          thinking: data.thinking,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，处理你的请求时出现了错误。请稍后重试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Brain, label: "解释概念", prompt: "请解释一下" },
    { icon: Lightbulb, label: "生成练习", prompt: "我想练习" },
    { icon: BookOpen, label: "学习路径", prompt: "我想学习" },
    { icon: Target, label: "检查理解", prompt: "测试我对...的理解" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-rose-50/30">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-white/80 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">学习工作区</h1>
                <p className="text-sm text-muted-foreground">
                  React Agent · 智能学习助手
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="socratic"
                  checked={socraticMode}
                  onCheckedChange={setSocraticMode}
                />
                <Label htmlFor="socratic" className="text-sm cursor-pointer">
                  苏格拉底模式
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="thinking"
                  checked={showThinking}
                  onCheckedChange={setShowThinking}
                />
                <Label htmlFor="thinking" className="text-sm cursor-pointer">
                  显示思考
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    "rounded-lg p-4 max-w-[80%]",
                    message.role === "user"
                      ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                      : "bg-white border"
                  )}
                >
                  {message.thinking && showThinking && (
                    <details className="mb-3 text-sm">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        思考过程
                      </summary>
                      <div className="mt-2 p-3 bg-muted/50 rounded text-xs whitespace-pre-wrap">
                        {message.thinking}
                      </div>
                    </details>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="p-2 rounded-full bg-gray-200 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="p-2 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">正在思考...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputValue(action.prompt)}
                    className="flex-shrink-0"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  socraticMode
                    ? "提出你的问题，我会引导你思考..."
                    : "输入你的问题..."
                }
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {socraticMode ? (
                <span>💡 苏格拉底模式：我会通过提问引导你思考</span>
              ) : (
                <span>📚 直接教学模式：我会直接解答你的问题</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info Panel */}
      <div className="w-80 border-l bg-white/50 backdrop-blur-sm p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Agent 状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">工作模式</span>
              <Badge variant={socraticMode ? "default" : "secondary"}>
                {socraticMode ? "苏格拉底" : "直接教学"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">对话轮数</span>
              <Badge variant="outline">{messages.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">状态</span>
              <Badge variant={isLoading ? "default" : "secondary"}>
                {isLoading ? "思考中" : "就绪"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">可用工具</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="p-1 rounded bg-blue-100">
                <BookOpen className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">搜索知识库</div>
                <div className="text-muted-foreground">查找相关文档</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 rounded bg-purple-100">
                <Brain className="h-3 w-3 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">查询图谱</div>
                <div className="text-muted-foreground">获取知识关系</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 rounded bg-green-100">
                <Target className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <div className="font-medium">生成练习</div>
                <div className="text-muted-foreground">个性化题目</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 rounded bg-orange-100">
                <Lightbulb className="h-3 w-3 text-orange-600" />
              </div>
              <div>
                <div className="font-medium">学习路径</div>
                <div className="text-muted-foreground">智能规划</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">使用提示</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>• 苏格拉底模式会引导你思考</p>
            <p>• 可以查看 Agent 的思考过程</p>
            <p>• 使用快捷按钮快速开始</p>
            <p>• Shift+Enter 换行，Enter 发送</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
