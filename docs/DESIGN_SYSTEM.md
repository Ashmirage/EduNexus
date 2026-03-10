# EduNexus 设计系统

## 概述

EduNexus 设计系统是一套完整的设计规范和组件库，旨在确保整个应用的视觉一致性、可访问性和可维护性。

## 设计原则

### 1. 一致性 (Consistency)
- 所有组件使用统一的设计令牌
- 保持交互模式的一致性
- 统一的视觉语言

### 2. 可访问性 (Accessibility)
- 符合 WCAG 2.1 AA 标准
- 最小触摸目标尺寸 44x44px
- 适当的颜色对比度
- 键盘导航支持
- 屏幕阅读器友好

### 3. 响应式 (Responsive)
- 移动优先设计
- 流畅的跨设备体验
- 自适应布局

### 4. 性能 (Performance)
- 优化的动画性能
- 最小化重绘和重排
- 懒加载和代码分割

### 5. 可维护性 (Maintainability)
- 模块化组件
- 清晰的命名规范
- 完善的文档

---

## 颜色系统

### 主题色

#### 主色 (Primary)
- **用途**: 主要操作按钮、链接、重要信息强调
- **Light**: `hsl(15, 86%, 65%)` - 温暖的橙粉色
- **Dark**: `hsl(15, 86%, 65%)`
- **使用场景**: CTA 按钮、活动状态、品牌元素

#### 辅助色 (Accent)
- **用途**: 次要强调、装饰元素
- **Light**: `hsl(35, 100%, 70%)` - 柔和的金色
- **Dark**: `hsl(35, 100%, 70%)`
- **使用场景**: 悬停状态、次要按钮、标签

### 语义色

#### 成功 (Success)
- **Light**: `hsl(142, 76%, 36%)`
- **Dark**: `hsl(142, 71%, 45%)`
- **使用场景**: 成功提示、完成状态、正向反馈

#### 警告 (Warning)
- **Light**: `hsl(38, 92%, 50%)`
- **Dark**: `hsl(48, 96%, 53%)`
- **使用场景**: 警告信息、需要注意的内容

#### 错误 (Destructive)
- **Light**: `hsl(0, 84%, 60%)`
- **Dark**: `hsl(0, 84%, 60%)`
- **使用场景**: 错误提示、删除操作、危险操作

#### 信息 (Info)
- **Light**: `hsl(199, 89%, 48%)`
- **Dark**: `hsl(199, 89%, 58%)`
- **使用场景**: 信息提示、帮助文本

### 中性色

#### 背景色 (Background)
- **Light**: `hsl(210, 40%, 98%)`
- **Dark**: `hsl(222, 47%, 4%)`

#### 前景色 (Foreground)
- **Light**: `hsl(222, 47%, 11%)`
- **Dark**: `hsl(210, 40%, 98%)`

#### 柔和色 (Muted)
- **Light**: `hsl(210, 40%, 96%)`
- **Dark**: `hsl(215, 28%, 17%)`

#### 边框色 (Border)
- **Light**: `hsl(214, 32%, 91%)`
- **Dark**: `hsl(215, 28%, 17%)`

### 颜色使用指南

```tsx
// 使用 Tailwind 类名
<div className="bg-primary text-primary-foreground">主色背景</div>
<div className="bg-destructive text-destructive-foreground">错误状态</div>
<div className="border border-border">边框</div>

// 使用 CSS 变量
<div style={{ backgroundColor: 'hsl(var(--primary))' }}>主色背景</div>
```

---

## 间距系统

基于 **4px** 基准的间距系统，确保视觉节奏的一致性。

### 间距比例

| Token | 值 | 像素 | 使用场景 |
|-------|-----|------|----------|
| `0` | 0 | 0px | 无间距 |
| `1` | 0.25rem | 4px | 最小间距 |
| `2` | 0.5rem | 8px | 紧凑间距 |
| `3` | 0.75rem | 12px | 小间距 |
| `4` | 1rem | 16px | 标准间距 |
| `6` | 1.5rem | 24px | 中等间距 |
| `8` | 2rem | 32px | 大间距 |
| `12` | 3rem | 48px | 超大间距 |
| `16` | 4rem | 64px | 区块间距 |

### 使用示例

```tsx
// 内边距
<div className="p-4">标准内边距 (16px)</div>
<div className="px-6 py-3">水平 24px，垂直 12px</div>

// 外边距
<div className="mt-8 mb-4">上边距 32px，下边距 16px</div>

// 间隙
<div className="flex gap-4">子元素间距 16px</div>
```

---

## 字体系统

### 字体家族

#### 无衬线字体 (Sans)
```css
font-family: var(--font-sans);
/* Inter, Noto Sans SC, Source Han Sans SC, PingFang SC, Microsoft YaHei, system-ui, sans-serif */
```

#### 等宽字体 (Mono)
```css
font-family: var(--font-mono);
/* JetBrains Mono, Fira Code, Cascadia Code, Consolas, monospace */
```

### 字号比例

| 类名 | 字号 | 行高 | 使用场景 |
|------|------|------|----------|
| `text-xs` | 12px | 16px | 辅助文本、标签 |
| `text-sm` | 14px | 20px | 正文、表单 |
| `text-base` | 16px | 24px | 标准正文 |
| `text-lg` | 18px | 28px | 强调文本 |
| `text-xl` | 20px | 28px | 小标题 |
| `text-2xl` | 24px | 32px | 中标题 |
| `text-3xl` | 30px | 36px | 大标题 |
| `text-4xl` | 36px | 40px | 页面标题 |

### 字重

| 类名 | 字重 | 使用场景 |
|------|------|----------|
| `font-normal` | 400 | 正文 |
| `font-medium` | 500 | 强调文本 |
| `font-semibold` | 600 | 标题、按钮 |
| `font-bold` | 700 | 重要标题 |

### 排版示例

```tsx
// 标题
<h1 className="text-4xl font-bold">页面标题</h1>
<h2 className="text-3xl font-semibold">章节标题</h2>
<h3 className="text-2xl font-semibold">小节标题</h3>

// 正文
<p className="text-base font-normal">标准正文内容</p>
<p className="text-sm text-muted-foreground">辅助说明文本</p>

// 代码
<code className="font-mono text-sm">const example = true;</code>
```

---

## 圆角系统

统一的圆角系统，基于 `--radius` 变量（默认 12px）。

| 类名 | 值 | 使用场景 |
|------|-----|----------|
| `rounded-sm` | ~8px | 小元素 |
| `rounded-md` | ~10px | 中等元素 |
| `rounded-lg` | 12px | 标准圆角 |
| `rounded-xl` | ~16px | 卡片、面板 |
| `rounded-2xl` | ~20px | 大型容器 |
| `rounded-full` | 9999px | 圆形、药丸形 |

### 使用示例

```tsx
<Button className="rounded-lg">标准按钮</Button>
<Card className="rounded-xl">卡片</Card>
<Avatar className="rounded-full">头像</Avatar>
```

---

## 阴影系统

层次化的阴影系统，用于表现元素的深度和层级。

| 类名 | 使用场景 |
|------|----------|
| `shadow-sm` | 轻微提升，如输入框 |
| `shadow` | 标准提升，如按钮 |
| `shadow-md` | 中等提升，如卡片 |
| `shadow-lg` | 明显提升，如悬浮卡片 |
| `shadow-xl` | 强烈提升，如模态框 |
| `shadow-2xl` | 最强提升，如弹出层 |

### 使用示例

```tsx
<Card className="shadow-md">标准卡片</Card>
<Button className="shadow hover:shadow-lg">悬停提升</Button>
<Dialog className="shadow-2xl">模态框</Dialog>
```

---

## 动画系统

### 动画时长

| Token | 值 | 使用场景 |
|-------|-----|----------|
| `duration-75` | 75ms | 微交互 |
| `duration-150` | 150ms | 快速过渡 |
| `duration-200` | 200ms | 标准过渡 |
| `duration-300` | 300ms | 慢速过渡 |
| `duration-500` | 500ms | 复杂动画 |

### 缓动函数

| 类名 | 使用场景 |
|------|----------|
| `ease-linear` | 匀速运动 |
| `ease-in` | 加速进入 |
| `ease-out` | 减速退出 |
| `ease-in-out` | 平滑过渡 |

### 预设动画

```tsx
// 淡入
<div className="animate-fade-in">淡入效果</div>

// 缩放进入
<div className="animate-zoom-in">缩放进入</div>

// 滑动进入
<div className="animate-slide-up">从下滑入</div>
<div className="animate-slide-down">从上滑入</div>
```

---

## 响应式设计

### 断点

| 断点 | 最小宽度 | 设备类型 |
|------|----------|----------|
| `sm` | 640px | 大型手机 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 笔记本 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大屏幕 |

### 响应式使用

```tsx
// 响应式间距
<div className="p-4 md:p-6 lg:p-8">响应式内边距</div>

// 响应式字号
<h1 className="text-2xl md:text-3xl lg:text-4xl">响应式标题</h1>

// 响应式布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  响应式网格
</div>
```

---

## 可访问性

### 焦点状态

所有交互元素必须有清晰的焦点状态：

```tsx
<Button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  可访问按钮
</Button>
```

### 触摸目标

移动端触摸目标最小尺寸为 44x44px：

```tsx
<Button className="min-h-touch min-w-touch">移动端按钮</Button>
```

### 语义化 HTML

使用正确的 HTML 语义标签：

```tsx
<button>按钮</button>
<nav>导航</nav>
<main>主内容</main>
<article>文章</article>
```

### ARIA 属性

为辅助技术提供额外信息：

```tsx
<button aria-label="关闭对话框">
  <X />
</button>

<div role="alert" aria-live="polite">
  提示信息
</div>
```

---

## 最佳实践

### 1. 使用设计令牌

❌ 不要使用硬编码的值：
```tsx
<div className="text-[#FF6B6B]">错误示例</div>
```

✅ 使用设计令牌：
```tsx
<div className="text-destructive">正确示例</div>
```

### 2. 保持一致性

❌ 不要混用不同的间距：
```tsx
<div className="p-3">
  <div className="mt-5">不一致的间距</div>
</div>
```

✅ 使用统一的间距系统：
```tsx
<div className="p-4">
  <div className="mt-4">一致的间距</div>
</div>
```

### 3. 响应式优先

❌ 只考虑桌面端：
```tsx
<div className="text-2xl">标题</div>
```

✅ 移动优先，渐进增强：
```tsx
<div className="text-xl md:text-2xl lg:text-3xl">标题</div>
```

### 4. 可访问性

❌ 缺少可访问性支持：
```tsx
<div onClick={handleClick}>点击</div>
```

✅ 使用语义化标签和键盘支持：
```tsx
<button onClick={handleClick} onKeyDown={handleKeyDown}>
  点击
</button>
```

---

## 组件使用指南

详细的组件使用指南请参考：
- [按钮组件](./components/button.md)
- [表单组件](./components/forms.md)
- [卡片组件](./components/card.md)
- [反馈组件](./components/feedback.md)

---

## 更新日志

### v1.0.0 (2026-03-10)
- 初始版本发布
- 完整的设计令牌系统
- 统一的组件变体
- 响应式设计支持
- 可访问性优化
