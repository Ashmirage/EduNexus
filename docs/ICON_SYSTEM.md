# EduNexus 图标系统指南

## 概述

EduNexus 使用 [Lucide React](https://lucide.dev/) 作为主要图标库，提供一致、清晰的图标系统。

## 图标库

### Lucide React

Lucide 是一个开源的图标库，提供超过 1000 个精心设计的图标。

**特点：**
- 一致的设计风格
- 可定制的尺寸和颜色
- 优秀的可访问性
- 轻量级（按需加载）
- TypeScript 支持

## 图标尺寸

### 标准尺寸

| 尺寸 | 像素 | 使用场景 |
|------|------|----------|
| `size-3` | 12px | 极小图标 |
| `size-3.5` | 14px | 小图标 |
| `size-4` | 16px | 标准图标 |
| `size-5` | 20px | 中等图标 |
| `size-6` | 24px | 大图标 |
| `size-8` | 32px | 超大图标 |

### 使用示例

```tsx
import { Home, User, Settings } from 'lucide-react'

// 小图标
<Home className="size-3.5" />

// 标准图标（默认）
<User className="size-4" />

// 大图标
<Settings className="size-6" />
```

## 图标颜色

### 语义颜色

```tsx
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// 成功
<CheckCircle className="text-green-600" />

// 错误
<AlertCircle className="text-destructive" />

// 信息
<Info className="text-blue-600" />

// 警告
<AlertTriangle className="text-yellow-600" />
```

### 中性颜色

```tsx
// 前景色（默认）
<Icon className="text-foreground" />

// 柔和色
<Icon className="text-muted-foreground" />

// 主色
<Icon className="text-primary" />

// 辅助色
<Icon className="text-accent" />
```

## 常用图标

### 导航图标

```tsx
import {
  Home,
  BookOpen,
  Target,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
} from 'lucide-react'

// 首页
<Home className="size-4" />

// 知识库
<BookOpen className="size-4" />

// 目标
<Target className="size-4" />

// 分析
<BarChart3 className="size-4" />

// 设置
<Settings className="size-4" />

// 用户
<User className="size-4" />

// 菜单
<Menu className="size-4" />

// 关闭
<X className="size-4" />
```

### 操作图标

```tsx
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

// 添加
<Plus className="size-4" />

// 编辑
<Edit className="size-4" />

// 删除
<Trash2 className="size-4" />

// 保存
<Save className="size-4" />

// 下载
<Download className="size-4" />

// 上传
<Upload className="size-4" />

// 复制
<Copy className="size-4" />

// 确认
<Check className="size-4" />

// 展开
<ChevronRight className="size-4" />
<ChevronDown className="size-4" />
```

### 状态图标

```tsx
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
} from 'lucide-react'

// 成功
<CheckCircle className="size-4 text-green-600" />

// 失败
<XCircle className="size-4 text-destructive" />

// 错误
<AlertCircle className="size-4 text-destructive" />

// 警告
<AlertTriangle className="size-4 text-yellow-600" />

// 信息
<Info className="size-4 text-blue-600" />

// 加载
<Loader2 className="size-4 animate-spin" />
```

### 文件图标

```tsx
import {
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  Folder,
  FolderOpen,
} from 'lucide-react'

// 文件
<File className="size-4" />

// 文本文件
<FileText className="size-4" />

// 代码文件
<FileCode className="size-4" />

// 图片文件
<FileImage className="size-4" />

// 视频文件
<FileVideo className="size-4" />

// 音频文件
<FileAudio className="size-4" />

// 文件夹
<Folder className="size-4" />
<FolderOpen className="size-4" />
```

## 图标在组件中的使用

### 按钮中的图标

```tsx
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Download } from 'lucide-react'

// 图标在左侧
<Button>
  <Plus className="mr-2 size-4" />
  添加项目
</Button>

// 图标在右侧
<Button>
  下载
  <Download className="ml-2 size-4" />
</Button>

// 仅图标按钮
<Button size="icon">
  <Trash2 className="size-4" />
</Button>
```

### 输入框中的图标

```tsx
import { Input } from '@/components/ui/input'
import { Search, Mail } from 'lucide-react'

<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
  <Input className="pl-9" placeholder="搜索..." />
</div>

<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
  <Input type="email" className="pl-9" placeholder="邮箱" />
</div>
```

### 警告框中的图标

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

<Alert variant="success">
  <CheckCircle className="size-4" />
  <AlertTitle>成功</AlertTitle>
  <AlertDescription>操作已成功完成</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="size-4" />
  <AlertTitle>错误</AlertTitle>
  <AlertDescription>操作失败，请重试</AlertDescription>
</Alert>

<Alert variant="info">
  <Info className="size-4" />
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>这是一条信息提示</AlertDescription>
</Alert>
```

### 徽章中的图标

```tsx
import { Badge } from '@/components/ui/badge'
import { Star, Crown, Award } from 'lucide-react'

<Badge>
  <Star className="mr-1 size-3" />
  热门
</Badge>

<Badge variant="success">
  <Crown className="mr-1 size-3" />
  VIP
</Badge>

<Badge variant="warning">
  <Award className="mr-1 size-3" />
  认证
</Badge>
```

## 图标动画

### 旋转动画

```tsx
import { Loader2, RefreshCw } from 'lucide-react'

// 持续旋转
<Loader2 className="size-4 animate-spin" />

// 点击旋转
<button onClick={handleRefresh}>
  <RefreshCw className="size-4 transition-transform hover:rotate-180" />
</button>
```

### 缩放动画

```tsx
<button className="group">
  <Plus className="size-4 transition-transform group-hover:scale-110" />
</button>
```

### 颜色过渡

```tsx
<button className="group">
  <Heart className="size-4 text-muted-foreground transition-colors group-hover:text-red-500" />
</button>
```

## 自定义图标组件

### 创建图标包装器

```tsx
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconProps {
  icon: LucideIcon
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-6',
}

export function Icon({ icon: IconComponent, className, size = 'md' }: IconProps) {
  return (
    <IconComponent
      className={cn(sizeMap[size], className)}
      aria-hidden="true"
    />
  )
}

// 使用
import { Home } from 'lucide-react'

<Icon icon={Home} size="md" className="text-primary" />
```

### 创建状态图标组件

```tsx
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusIconProps {
  status: 'success' | 'error' | 'warning' | 'loading'
  className?: string
}

export function StatusIcon({ status, className }: StatusIconProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    loading: Loader2,
  }

  const colors = {
    success: 'text-green-600',
    error: 'text-destructive',
    warning: 'text-yellow-600',
    loading: 'text-muted-foreground',
  }

  const Icon = icons[status]

  return (
    <Icon
      className={cn(
        'size-4',
        colors[status],
        status === 'loading' && 'animate-spin',
        className
      )}
    />
  )
}

// 使用
<StatusIcon status="success" />
<StatusIcon status="loading" />
```

## 可访问性

### ARIA 标签

对于仅图标的按钮，必须提供 `aria-label`：

```tsx
<Button size="icon" aria-label="关闭对话框">
  <X className="size-4" />
</Button>

<Button size="icon" aria-label="删除项目">
  <Trash2 className="size-4" />
</Button>
```

### 隐藏装饰性图标

对于纯装饰性的图标，使用 `aria-hidden`：

```tsx
<Button>
  <Plus className="mr-2 size-4" aria-hidden="true" />
  添加项目
</Button>
```

### 屏幕阅读器文本

```tsx
<button>
  <Search className="size-4" />
  <span className="sr-only">搜索</span>
</button>
```

## 图标命名规范

### 一致的命名

使用 Lucide 的标准命名：

```tsx
// ✅ 好的做法
import { Home, User, Settings } from 'lucide-react'

// ❌ 避免
import { Home as HomeIcon, User as UserIcon } from 'lucide-react'
```

### 语义化命名

选择语义清晰的图标：

```tsx
// ✅ 好的做法
<Trash2 /> // 删除
<Edit /> // 编辑
<Save /> // 保存

// ❌ 避免
<X /> // 用于删除（应该用于关闭）
```

## 性能优化

### 按需导入

只导入需要的图标：

```tsx
// ✅ 好的做法
import { Home, User } from 'lucide-react'

// ❌ 避免
import * as Icons from 'lucide-react'
```

### 图标复用

对于频繁使用的图标，考虑创建常量：

```tsx
// icons.ts
export { Home, User, Settings, Plus, Edit, Trash2 } from 'lucide-react'

// 使用
import { Home, User } from '@/lib/icons'
```

## 最佳实践

### 1. 保持一致性

在整个应用中使用相同的图标表示相同的操作：

```tsx
// ✅ 始终使用 Plus 表示添加
<Plus className="size-4" />

// ✅ 始终使用 Trash2 表示删除
<Trash2 className="size-4" />
```

### 2. 适当的尺寸

根据上下文选择合适的图标尺寸：

```tsx
// 按钮中的图标
<Button>
  <Plus className="size-4" />
  添加
</Button>

// 标题中的图标
<h2 className="flex items-center gap-2">
  <BookOpen className="size-6" />
  知识库
</h2>
```

### 3. 颜色对比

确保图标与背景有足够的对比度：

```tsx
// ✅ 好的做法
<div className="bg-background">
  <Icon className="text-foreground" />
</div>

// ❌ 避免
<div className="bg-gray-100">
  <Icon className="text-gray-200" /> {/* 对比度不足 */}
</div>
```

### 4. 响应式图标

在移动端使用稍大的图标以提高可点击性：

```tsx
<Button size="icon" className="size-10 md:size-9">
  <Plus className="size-5 md:size-4" />
</Button>
```

## 图标资源

- [Lucide 官方网站](https://lucide.dev/)
- [Lucide 图标搜索](https://lucide.dev/icons/)
- [Lucide GitHub](https://github.com/lucide-icons/lucide)

## 更新日志

### v1.0.0 (2026-03-10)
- 初始版本发布
- 完整的图标系统指南
- 常用图标列表
- 可访问性指南
- 最佳实践
