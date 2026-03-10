# EduNexus 设计系统文档索引

欢迎来到 EduNexus 设计系统！这是一套完整的设计规范和组件库，旨在确保整个应用的视觉一致性、可访问性和可维护性。

## 📚 文档目录

### 核心文档

1. **[设计系统概览](./DESIGN_SYSTEM.md)**
   - 设计原则
   - 颜色系统
   - 间距系统
   - 字体系统
   - 圆角系统
   - 阴影系统
   - 动画系统
   - 响应式设计
   - 可访问性指南

2. **[组件库指南](./COMPONENT_LIBRARY.md)**
   - 按钮组件
   - 表单组件
   - 卡片组件
   - 反馈组件
   - 布局组件
   - 导航组件
   - 数据展示组件
   - 组件组合示例

3. **[图标系统](./ICON_SYSTEM.md)**
   - 图标库介绍
   - 图标尺寸规范
   - 常用图标列表
   - 图标使用指南
   - 可访问性最佳实践

4. **[设计原则与最佳实践](./DESIGN_PRINCIPLES.md)**
   - 核心设计原则
   - 设计模式
   - 用户体验原则
   - 代码规范
   - 检查清单

## 🚀 快速开始

### 安装依赖

项目已经包含所有必要的依赖，无需额外安装。

### 使用设计令牌

```tsx
import { buttonVariants, inputVariants } from '@/lib/design-system'

// 使用按钮变体
<button className={buttonVariants({ variant: 'default', size: 'md' })}>
  点击我
</button>

// 使用输入框变体
<input className={inputVariants({ size: 'md', variant: 'default' })} />
```

### 使用组件

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>表单标题</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="输入内容" />
        <Button className="mt-4">提交</Button>
      </CardContent>
    </Card>
  )
}
```

### 使用图标

```tsx
import { Home, User, Settings } from 'lucide-react'

function Navigation() {
  return (
    <nav>
      <a href="/"><Home className="size-4" /> 首页</a>
      <a href="/profile"><User className="size-4" /> 个人</a>
      <a href="/settings"><Settings className="size-4" /> 设置</a>
    </nav>
  )
}
```

## 🎨 设计令牌

### 颜色

```tsx
// 主色
className="bg-primary text-primary-foreground"

// 辅助色
className="bg-accent text-accent-foreground"

// 语义色
className="bg-destructive text-destructive-foreground" // 错误
className="bg-green-600 text-white" // 成功
className="bg-yellow-600 text-white" // 警告
```

### 间距

```tsx
// 基于 4px 的间距系统
className="p-4"    // 16px
className="m-6"    // 24px
className="gap-8"  // 32px
```

### 字体

```tsx
// 字号
className="text-sm"   // 14px
className="text-base" // 16px
className="text-lg"   // 18px

// 字重
className="font-normal"   // 400
className="font-medium"   // 500
className="font-semibold" // 600
```

### 圆角

```tsx
className="rounded-lg"  // 12px (标准)
className="rounded-xl"  // 16px (卡片)
className="rounded-full" // 圆形
```

## 📦 组件库

### 按钮

```tsx
<Button variant="default">默认按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="destructive">危险按钮</Button>

<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>

<Button loading>加载中...</Button>
<Button disabled>禁用按钮</Button>
```

### 表单

```tsx
<Input placeholder="输入内容" />
<Input size="sm" variant="error" />

<Select>
  <SelectTrigger>
    <SelectValue placeholder="选择选项" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">选项 1</SelectItem>
    <SelectItem value="2">选项 2</SelectItem>
  </SelectContent>
</Select>

<Switch />
<Checkbox />
```

### 反馈

```tsx
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>成功</AlertTitle>
  <AlertDescription>操作已完成</AlertDescription>
</Alert>

<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="destructive">错误</Badge>

<Spinner size="md" />
<Skeleton className="h-4 w-full" />
```

## ♿ 可访问性

### 键盘导航

所有交互元素都支持键盘导航：

```tsx
<Button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  操作
</Button>
```

### ARIA 标签

为辅助技术提供必要的信息：

```tsx
<Button size="icon" aria-label="关闭对话框">
  <X className="h-4 w-4" />
</Button>

<nav aria-label="主导航">
  <ul>...</ul>
</nav>
```

### 触摸目标

移动端触摸目标最小尺寸为 44x44px：

```tsx
<Button className="min-h-touch min-w-touch">
  移动端按钮
</Button>
```

## 📱 响应式设计

### 断点

| 断点 | 最小宽度 | 设备类型 |
|------|----------|----------|
| `sm` | 640px | 大型手机 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 笔记本 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大屏幕 |

### 使用示例

```tsx
// 响应式间距
<div className="p-4 md:p-6 lg:p-8">

// 响应式字号
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// 响应式布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🎯 最佳实践

### 1. 使用设计令牌

❌ 不要使用硬编码的值：
```tsx
<div className="text-[#FF6B6B] p-[20px]">
```

✅ 使用设计令牌：
```tsx
<div className="text-destructive p-5">
```

### 2. 保持一致性

❌ 不要混用不同的样式：
```tsx
<button className="bg-blue-500 text-white">按钮 1</button>
<button className="bg-primary text-primary-foreground">按钮 2</button>
```

✅ 使用统一的组件：
```tsx
<Button variant="default">按钮 1</Button>
<Button variant="default">按钮 2</Button>
```

### 3. 响应式优先

❌ 只考虑桌面端：
```tsx
<div className="text-2xl p-8">
```

✅ 移动优先，渐进增强：
```tsx
<div className="text-xl md:text-2xl p-4 md:p-8">
```

### 4. 可访问性

❌ 缺少可访问性支持：
```tsx
<div onClick={handleClick}>
  <X />
</div>
```

✅ 使用语义化标签和 ARIA：
```tsx
<button onClick={handleClick} aria-label="关闭">
  <X />
</button>
```

## 🔧 开发工具

### VS Code 扩展推荐

- **Tailwind CSS IntelliSense**: 自动完成和语法高亮
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

### 配置文件

- `tailwind.config.ts`: Tailwind 配置
- `apps/web/src/app/globals.css`: 全局样式
- `apps/web/src/lib/design-system/`: 设计系统配置

## 📖 学习资源

### 官方文档

- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Next.js](https://nextjs.org/)

### 设计资源

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Inclusive Components](https://inclusive-components.design/)

## 🤝 贡献指南

### 添加新组件

1. 在 `apps/web/src/components/ui/` 创建组件文件
2. 使用设计系统的变体和令牌
3. 添加 TypeScript 类型
4. 确保可访问性
5. 更新文档

### 修改设计令牌

1. 编辑 `apps/web/src/lib/design-system/tokens.ts`
2. 更新 `tailwind.config.ts`
3. 更新 `globals.css` 中的 CSS 变量
4. 测试所有组件
5. 更新文档

## 📝 更新日志

### v1.0.0 (2026-03-10)

**新增**
- 完整的设计系统文档
- 统一的设计令牌
- 组件变体系统
- 图标系统指南
- 设计原则文档
- 可访问性指南

**优化**
- 统一所有组件的样式
- 改进响应式设计
- 增强可访问性支持
- 优化动画性能

## 📞 联系方式

如有问题或建议，请：

1. 查看相关文档
2. 搜索已有的 Issue
3. 创建新的 Issue
4. 联系设计团队

---

**版本**: 1.0.0
**最后更新**: 2026-03-10
**维护者**: EduNexus 设计团队
