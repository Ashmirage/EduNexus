# EduNexus 设计系统快速参考

## 🎨 颜色

```tsx
// 主色
bg-primary text-primary-foreground

// 辅助色
bg-accent text-accent-foreground

// 语义色
bg-destructive text-destructive-foreground  // 错误
bg-green-600 text-white                     // 成功
bg-yellow-600 text-white                    // 警告
bg-blue-600 text-white                      // 信息

// 中性色
bg-background text-foreground
bg-muted text-muted-foreground
border-border
```

## 📏 间距

```tsx
p-4   // 16px 内边距
m-6   // 24px 外边距
gap-8 // 32px 间隙

// 常用间距
0, 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px), 12(48px)
```

## 🔤 字体

```tsx
// 字号
text-xs   // 12px
text-sm   // 14px
text-base // 16px
text-lg   // 18px
text-xl   // 20px
text-2xl  // 24px

// 字重
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700
```

## 🔘 按钮

```tsx
import { Button } from '@/components/ui/button'

// 变体
<Button variant="default">默认</Button>
<Button variant="destructive">危险</Button>
<Button variant="outline">轮廓</Button>
<Button variant="secondary">次要</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="link">链接</Button>
<Button variant="success">成功</Button>
<Button variant="warning">警告</Button>

// 尺寸
<Button size="sm">小</Button>
<Button size="md">中</Button>
<Button size="lg">大</Button>
<Button size="icon"><Icon /></Button>

// 状态
<Button loading>加载中</Button>
<Button disabled>禁用</Button>
```

## 📝 输入框

```tsx
import { Input } from '@/components/ui/input'

// 尺寸
<Input size="sm" />
<Input size="md" />
<Input size="lg" />

// 状态
<Input variant="default" />
<Input variant="error" />
<Input variant="success" />
```

## 🎴 卡片

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// 变体
<Card variant="default">默认</Card>
<Card variant="elevated">提升</Card>
<Card variant="interactive">交互</Card>
<Card variant="glass">玻璃态</Card>

// 内边距
<Card padding="none">无</Card>
<Card padding="sm">小</Card>
<Card padding="md">中</Card>
<Card padding="lg">大</Card>
```

## 🏷️ 徽章

```tsx
import { Badge } from '@/components/ui/badge'

// 变体
<Badge variant="default">默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="outline">轮廓</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="info">信息</Badge>

// 尺寸
<Badge size="sm">小</Badge>
<Badge size="md">中</Badge>
<Badge size="lg">大</Badge>
```

## ⚠️ 警告框

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert variant="default">
  <AlertTitle>标题</AlertTitle>
  <AlertDescription>描述</AlertDescription>
</Alert>

<Alert variant="destructive">错误</Alert>
<Alert variant="success">成功</Alert>
<Alert variant="warning">警告</Alert>
<Alert variant="info">信息</Alert>
```

## 🔄 加载

```tsx
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'

// 加载指示器
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// 骨架屏
<Skeleton className="h-4 w-full" />
<Skeleton variant="circle" />
<Skeleton variant="button" />
```

## 🎯 图标

```tsx
import { Home, User, Settings } from 'lucide-react'

// 尺寸
<Home className="size-3.5" /> // 14px
<User className="size-4" />   // 16px
<Settings className="size-6" /> // 24px

// 颜色
<Icon className="text-foreground" />
<Icon className="text-muted-foreground" />
<Icon className="text-primary" />
<Icon className="text-destructive" />
```

## 📱 响应式

```tsx
// 断点: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)

// 间距
<div className="p-4 md:p-6 lg:p-8">

// 字号
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// 布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// 显示/隐藏
<div className="hidden md:block">桌面端显示</div>
<div className="md:hidden">移动端显示</div>
```

## ♿ 可访问性

```tsx
// 焦点状态
<Button className="focus-visible:ring-2 focus-visible:ring-ring">

// ARIA 标签
<Button aria-label="关闭对话框">
  <X />
</Button>

// 触摸目标
<Button className="min-h-touch min-w-touch">

// 语义化 HTML
<button>按钮</button>
<nav aria-label="主导航">
```

## 🎨 工具类

```tsx
// 玻璃态
<div className="glass">
<div className="glass-card">

// 渐变文字
<h1 className="gradient-text">

// 卡片悬停
<Card className="card-hover">

// 分隔线
<div className="divider" />

// 滚动条
<div className="scrollbar-thin">
```

## 📚 文档

- [设计系统概览](./docs/DESIGN_SYSTEM.md)
- [组件库指南](./docs/COMPONENT_LIBRARY.md)
- [图标系统](./docs/ICON_SYSTEM.md)
- [设计原则](./docs/DESIGN_PRINCIPLES.md)
- [完整索引](./docs/DESIGN_SYSTEM_INDEX.md)

## 🔗 快速链接

```tsx
// 导入设计令牌
import { buttonVariants, inputVariants } from '@/lib/design-system'

// 导入组件
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

// 导入图标
import { Home, User, Settings } from 'lucide-react'
```

---

**提示**: 始终使用设计令牌和组件，避免硬编码样式！
