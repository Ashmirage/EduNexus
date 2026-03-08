import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Copy, X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

type StatusTone = "info" | "success" | "warning" | "error";
type StatusCopyState = "idle" | "done" | "failed";

type StatusMessageBoxProps = {
  message: string;
  tone: StatusTone;
  copyState: StatusCopyState;
  onCopy: () => void;
  onClose: () => void;
};

const toneConfig = {
  error: { variant: "destructive" as const, label: "错误", icon: AlertCircle },
  warning: { variant: "default" as const, label: "注意", icon: AlertTriangle },
  success: { variant: "default" as const, label: "完成", icon: CheckCircle2 },
  info: { variant: "default" as const, label: "提示", icon: Info }
};

export function StatusMessageBox({
  message,
  tone,
  copyState,
  onCopy,
  onClose
}: StatusMessageBoxProps) {
  if (!message) {
    return null;
  }

  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className="relative">
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-3">
        <div>
          <strong className="block mb-1">{config.label}</strong>
          <p className="text-sm">{message}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCopy}>
            <Copy className="mr-2 h-3 w-3" />
            复制提示
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="mr-2 h-3 w-3" />
            关闭
          </Button>
        </div>
        {copyState === "done" && (
          <small className="text-xs text-muted-foreground">已复制到剪贴板。</small>
        )}
        {copyState === "failed" && (
          <small className="text-xs text-destructive">
            复制失败，请手动选择文本复制。
          </small>
        )}
      </AlertDescription>
    </Alert>
  );
}
