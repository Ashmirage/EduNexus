# EduNexus UI 动画使用指南

## 快速开始

本指南提供了 EduNexus 项目中使用的动画模式和最佳实践。

---

## 1. 基础动画模式

### 1.1 淡入动画
用于内容首次出现时：

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>
```

### 1.2 滑入动画
用于面板、侧边栏等：

```typescript
// 从左侧滑入
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// 从右侧滑入
<motion.div
  initial={{ x: 20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// 从上方滑入
<motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>
```

### 1.3 缩放动画
用于按钮、图标等小元素：

```typescript
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 200 }}
/>
```

### 1.4 旋转动画
用于加载指示器、图标等：

```typescript
<motion.div
  initial={{ rotate: -180 }}
  animate={{ rotate: 0 }}
  transition={{ duration: 0.5 }}
/>
```

---

## 2. 交互动画

### 2.1 悬停效果

```typescript
// 放大
<motion.div whileHover={{ scale: 1.05 }}>
  按钮
</motion.div>

// 移动
<motion.div whileHover={{ x: 4 }}>
  列表项
</motion.div>

// 旋转
<motion.div whileHover={{ rotate: 10 }}>
  图标
</motion.div>

// 组合效果
<motion.div whileHover={{ scale: 1.02, y: -2 }}>
  卡片
</motion.div>
```

### 2.2 点击效果

```typescript
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  按钮
</motion.div>
```

### 2.3 拖拽效果

```typescript
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.2}
>
  可拖拽元素
</motion.div>
```

---

## 3. 列表动画

### 3.1 错开出现

```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### 3.2 使用延迟

```typescript
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {item.content}
  </motion.div>
))}
```

---

## 4. 进出动画

### 4.1 基础进出

```typescript
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      内容
    </motion.div>
  )}
</AnimatePresence>
```

### 4.2 模态框动画

```typescript
<AnimatePresence>
  {isOpen && (
    <>
      {/* 背景遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
      />

      {/* 模态框 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        模态框内容
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4.3 侧边栏滑入

```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-96"
    >
      侧边栏内容
    </motion.div>
  )}
</AnimatePresence>
```

---

## 5. 内容切换动画

### 5.1 标签切换

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {tabContent}
  </motion.div>
</AnimatePresence>
```

### 5.2 页面切换

```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {pageContent}
  </motion.div>
</AnimatePresence>
```

---

## 6. 复杂动画序列

### 6.1 多步骤动画

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{
    opacity: [0, 1, 1],
    scale: [0.8, 1.1, 1],
  }}
  transition={{
    duration: 0.6,
    times: [0, 0.5, 1],
  }}
/>
```

### 6.2 路径动画

```typescript
<motion.path
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 2, ease: "easeInOut" }}
/>
```

---

## 7. 弹簧动画

### 7.1 基础弹簧

```typescript
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 100, damping: 10 }}
/>
```

### 7.2 弹簧参数

- `stiffness`: 弹簧刚度 (默认: 100)
  - 低值 (50-100): 柔和、缓慢
  - 中值 (100-200): 平衡
  - 高值 (200-500): 快速、有力

- `damping`: 阻尼 (默认: 10)
  - 低值 (5-10): 更多弹跳
  - 中值 (10-20): 平衡
  - 高值 (20-50): 快速停止

- `mass`: 质量 (默认: 1)
  - 影响动画的惯性

```typescript
// 柔和弹簧
transition={{ type: "spring", stiffness: 80, damping: 15 }}

// 快速弹簧
transition={{ type: "spring", stiffness: 300, damping: 20 }}

// 有弹性的弹簧
transition={{ type: "spring", stiffness: 200, damping: 8 }}
```

---

## 8. 性能优化

### 8.1 使用 GPU 加速属性

优先使用这些属性，它们会触发 GPU 加速：
- `transform` (translate, scale, rotate)
- `opacity`

避免使用这些属性，它们会触发重排：
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`

```typescript
// ✅ 好的做法
<motion.div animate={{ x: 100, opacity: 0.5 }} />

// ❌ 避免
<motion.div animate={{ left: 100, width: 200 }} />
```

### 8.2 使用 layoutId 共享元素

```typescript
<motion.div layoutId="shared-element">
  内容
</motion.div>

// 在另一个位置
<motion.div layoutId="shared-element">
  相同内容
</motion.div>
```

### 8.3 减少动画复杂度

```typescript
// 移动端简化动画
const isMobile = window.innerWidth < 768;

<motion.div
  initial={isMobile ? {} : { opacity: 0, y: 20 }}
  animate={isMobile ? {} : { opacity: 1, y: 0 }}
/>
```

---

## 9. 可访问性

### 9.1 尊重用户偏好

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.05 }}
/>
```

### 9.2 提供替代方案

```typescript
// 创建自定义 hook
function useMotion() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  return prefersReducedMotion ? {} : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };
}

// 使用
const motionProps = useMotion();
<motion.div {...motionProps}>内容</motion.div>
```

---

## 10. EduNexus 动画规范

### 10.1 持续时间

```typescript
// 微交互 (按钮、图标)
duration: 0.2

// 内容切换 (标签、面板)
duration: 0.3

// 页面过渡
duration: 0.5

// 复杂动画 (时间线、序列)
duration: 1.0
```

### 10.2 缓动函数

```typescript
// 默认 - 平滑进出
ease: "easeInOut"

// 快速开始 - 用于退出动画
ease: "easeIn"

// 快速结束 - 用于进入动画
ease: "easeOut"

// 弹簧 - 用于交互元素
type: "spring"
```

### 10.3 延迟

```typescript
// 单个元素
delay: 0.1

// 列表项 (错开)
delay: index * 0.05

// 复杂序列
delay: 0.3 + index * 0.1
```

### 10.4 颜色规范

```typescript
// 主色调 - 橙色到玫瑰色渐变
className="bg-gradient-to-r from-orange-500 to-rose-500"

// 辅助色 - 橙色到琥珀色渐变
className="bg-gradient-to-r from-orange-500 to-amber-500"

// 强调色 - 主色到辅助色渐变
className="bg-gradient-to-r from-primary to-accent"
```

---

## 11. 常见模式

### 11.1 卡片悬停

```typescript
<motion.div
  whileHover={{ scale: 1.02, y: -2 }}
  className="card"
>
  卡片内容
</motion.div>
```

### 11.2 按钮交互

```typescript
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <Button>点击我</Button>
</motion.div>
```

### 11.3 面板滑入

```typescript
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
  className="panel"
>
  面板内容
</motion.div>
```

### 11.4 列表错开

```typescript
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {item.content}
  </motion.div>
))}
```

### 11.5 模态框

```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      模态框内容
    </motion.div>
  )}
</AnimatePresence>
```

---

## 12. 调试技巧

### 12.1 使用 Chrome DevTools

1. 打开 Performance 面板
2. 录制动画
3. 查看帧率和性能指标
4. 确保保持 60 FPS

### 12.2 添加调试边框

```typescript
<motion.div
  style={{ border: "2px solid red" }}
  animate={{ x: 100 }}
/>
```

### 12.3 慢动作播放

```typescript
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 2 }} // 放慢动画
/>
```

---

## 13. 资源

- [Framer Motion 文档](https://www.framer.com/motion/)
- [动画缓动函数可视化](https://easings.net/)
- [CSS 触发器](https://csstriggers.com/)
- [Web 动画性能](https://web.dev/animations/)

---

## 14. 示例代码库

查看以下文件获取实际示例：
- `apps/web/src/app/workspace/page.tsx` - 工作区动画
- `apps/web/src/app/path/page.tsx` - 路径页面动画
- `apps/web/src/app/graph/enhanced-page.tsx` - 星图动画

---

**记住**: 好的动画应该是微妙的、有目的的，并且增强用户体验，而不是分散注意力。
