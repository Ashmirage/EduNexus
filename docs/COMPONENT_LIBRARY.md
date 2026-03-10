# EduNexus 组件库指南

## 目录

1. [按钮组件](#按钮组件)
2. [表单组件](#表单组件)
3. [卡片组件](#卡片组件)
4. [反馈组件](#反馈组件)
5. [布局组件](#布局组件)
6. [导航组件](#导航组件)
7. [数据展示组件](#数据展示组件)

---

## 按钮组件

### Button

主要的交互按钮组件，支持多种变体和尺寸。

#### 变体 (Variants)

```tsx
import { Button } from '@/components/ui/button'

// 默认按钮 - 主要操作
<Button variant="default">默认按钮</Button>

// 次要按钮
<Button variant="secondary">次要按钮</Button>

// 轮廓按钮
<Button variant="outline">轮廓按钮</Button>

// 幽灵按钮 - 无背景
<Button variant="ghost">幽灵按钮</Button>

// 链接按钮
<Button variant="link">链接按钮</Button>

// 危险操作
<Button variant="destructive">删除</Button>

// 成功操作
<Button variant="success">确认</Button>

// 警告操作
<Button variant="warning">警告</Button>
```

#### 尺寸 (Sizes)

```tsx
// 小尺寸
<Button size="sm">小按钮</Button>

// 中等尺寸（默认）
<Button size="md">中等按钮</Button>

// 大尺寸
<Button size="lg">大按钮</Button>

// 图标按钮
<Button size="icon">
  <Plus />
</Button>

<Button size="icon-sm">
  <Plus />
</Button>

<Button size="icon-lg">
  <Plus />
</Button>
```

#### 状态

```tsx
// 禁用状态
<Button disabled>禁用按钮</Button>

// 加载状态
<Button loading>加载中...</Button>

// 带图标
<Button>
  <Plus className="mr-2" />
  添加项目
</Button>
```

#### 完整示例

```tsx
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save } from 'lucide-react'

export function ButtonExample() {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await saveData()
    setLoading(false)
  }

  return (
    <div className="flex gap-4">
      <Button onClick={handleSave} loading={loading}>
        <Save className="mr-2" />
        保存
      </Button>

      <Button variant="outline">
        取消
      </Button>

      <Button variant="destructive" size="sm">
        <Trash2 className="mr-2" />
        删除
      </Button>
    </div>
  )
}
```

---

## 表单组件

### Input

文本输入框组件。

#### 基础用法

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">邮箱</Label>
  <Input
    id="email"
    type="email"
    placeholder="请输入邮箱"
  />
</div>
```

#### 尺寸

```tsx
<Input size="sm" placeholder="小尺寸" />
<Input size="md" placeholder="中等尺寸" />
<Input size="lg" placeholder="大尺寸" />
```

#### 状态

```tsx
// 错误状态
<Input variant="error" placeholder="错误状态" />

// 成功状态
<Input variant="success" placeholder="成功状态" />

// 禁用状态
<Input disabled placeholder="禁用状态" />
```

#### 完整表单示例

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          邮箱
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant={errors.email ? 'error' : 'default'}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" variant="required">
          密码
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant={errors.password ? 'error' : 'default'}
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full">
        登录
      </Button>
    </form>
  )
}
```

### Select

下拉选择组件。

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="选择选项" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">选项 1</SelectItem>
    <SelectItem value="option2">选项 2</SelectItem>
    <SelectItem value="option3">选项 3</SelectItem>
  </SelectContent>
</Select>
```

### Switch

开关组件。

```tsx
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">启用通知</Label>
</div>
```

### Checkbox

复选框组件。

```tsx
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">同意服务条款</Label>
</div>
```

---

## 卡片组件

### Card

容器组件，用于组织内容。

#### 基础用法

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
    <CardDescription>卡片描述文本</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

#### 变体

```tsx
// 默认卡片
<Card variant="default">默认卡片</Card>

// 提升卡片
<Card variant="elevated">提升卡片</Card>

// 交互卡片
<Card variant="interactive">可点击卡片</Card>

// 玻璃态卡片
<Card variant="glass">玻璃态卡片</Card>
```

#### 内边距

```tsx
<Card padding="none">无内边距</Card>
<Card padding="sm">小内边距</Card>
<Card padding="md">中等内边距</Card>
<Card padding="lg">大内边距</Card>
```

#### 完整示例

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CourseCard({ course }) {
  return (
    <Card variant="interactive" className="hover:shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{course.title}</CardTitle>
          <Badge variant="success">{course.level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {course.progress}% 完成
          </span>
          <Button size="sm">继续学习</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 反馈组件

### Alert

警告提示组件。

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

// 默认提示
<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>提示</AlertTitle>
  <AlertDescription>这是一条信息提示</AlertDescription>
</Alert>

// 成功提示
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>成功</AlertTitle>
  <AlertDescription>操作已成功完成</AlertDescription>
</Alert>

// 警告提示
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>警告</AlertTitle>
  <AlertDescription>请注意这个操作</AlertDescription>
</Alert>

// 错误提示
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>错误</AlertTitle>
  <AlertDescription>操作失败，请重试</AlertDescription>
</Alert>
```

### Badge

徽章组件，用于标签和状态显示。

```tsx
import { Badge } from '@/components/ui/badge'

// 变体
<Badge variant="default">默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="outline">轮廓</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="info">信息</Badge>

// 尺寸
<Badge size="sm">小</Badge>
<Badge size="md">中</Badge>
<Badge size="lg">大</Badge>
```

### Spinner

加载指示器。

```tsx
import { Spinner } from '@/components/ui/spinner'

// 尺寸
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// 变体
<Spinner variant="default" />
<Spinner variant="secondary" />
<Spinner variant="muted" />
```

### Skeleton

骨架屏组件。

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// 基础用法
<Skeleton className="h-4 w-full" />
<Skeleton className="h-12 w-12 rounded-full" />

// 预设变体
<Skeleton variant="text" />
<Skeleton variant="circle" />
<Skeleton variant="button" />

// 完整示例
<div className="space-y-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
</div>
```

---

## 布局组件

### Separator

分隔线组件。

```tsx
import { Separator } from '@/components/ui/separator'

// 水平分隔线
<Separator orientation="horizontal" />

// 垂直分隔线
<div className="flex h-5 items-center">
  <span>项目 1</span>
  <Separator orientation="vertical" className="mx-2" />
  <span>项目 2</span>
</div>

// 渐变分隔线
<Separator variant="gradient" />
```

---

## 导航组件

### Tabs

标签页组件。

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">标签 1</TabsTrigger>
    <TabsTrigger value="tab2">标签 2</TabsTrigger>
    <TabsTrigger value="tab3">标签 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    标签 1 的内容
  </TabsContent>
  <TabsContent value="tab2">
    标签 2 的内容
  </TabsContent>
  <TabsContent value="tab3">
    标签 3 的内容
  </TabsContent>
</Tabs>
```

---

## 数据展示组件

### Table

表格组件。

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>姓名</TableHead>
      <TableHead>邮箱</TableHead>
      <TableHead>角色</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>张三</TableCell>
      <TableCell>zhang@example.com</TableCell>
      <TableCell>管理员</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 组件组合示例

### 用户资料卡片

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function UserProfileCard({ user }) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <img src={user.avatar} alt={user.name} />
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge variant="success">{user.role}</Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{user.courses}</p>
            <p className="text-sm text-muted-foreground">课程</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.hours}</p>
            <p className="text-sm text-muted-foreground">学时</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user.certificates}</p>
            <p className="text-sm text-muted-foreground">证书</p>
          </div>
        </div>

        <Button className="w-full mt-6">查看详情</Button>
      </CardContent>
    </Card>
  )
}
```

---

## 最佳实践

### 1. 组件组合

优先使用组件组合而不是创建新组件：

```tsx
// ✅ 好的做法
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>内容</CardContent>
</Card>

// ❌ 避免
<CustomCard title="标题" content="内容" />
```

### 2. 保持简洁

组件应该专注于单一职责：

```tsx
// ✅ 好的做法
<Button onClick={handleClick}>点击</Button>

// ❌ 避免
<Button onClick={handleClick} showToast confirmDialog>
  点击
</Button>
```

### 3. 使用变体

使用变体而不是自定义样式：

```tsx
// ✅ 好的做法
<Button variant="destructive">删除</Button>

// ❌ 避免
<Button className="bg-red-500 text-white">删除</Button>
```

### 4. 可访问性

始终考虑可访问性：

```tsx
// ✅ 好的做法
<Button aria-label="关闭对话框">
  <X />
</Button>

// ❌ 避免
<div onClick={handleClose}>
  <X />
</div>
```

---

## 更新日志

### v1.0.0 (2026-03-10)
- 初始版本发布
- 完整的组件库
- 统一的 API 设计
- 完善的文档和示例
