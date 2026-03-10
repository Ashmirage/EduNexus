# 📱 EduNexus 移动端优化快速参考

## 🎯 核心原则

### 触摸目标
```tsx
// ✅ 最小尺寸: 44x44px (iOS) / 48x48px (Android)
<Button size="md">  // 移动端 40px，桌面端 36px
  点击我
</Button>
```

### 字体大小
```css
/* ✅ 防止 iOS 自动缩放 */
input, textarea, select {
  font-size: 16px !important;
}
```

### 安全区域
```tsx
// ✅ 适配刘海屏
<nav style={{ paddingBottom: `${safeArea.bottom}px` }}>
  {/* 内容 */}
</nav>
```

## 📐 断点系统

```css
/* 移动端 */
@media (max-width: 768px) { }

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) { }

/* 桌面端 */
@media (min-width: 1025px) { }
```

## 🎨 常用工具类

### 可见性
```tsx
<div className="mobile-only">移动端显示</div>
<div className="desktop-only">桌面端显示</div>
<div className="tablet-only">平板端显示</div>
```

### 布局
```tsx
<div className="mobile-container">     {/* px-4 py-4 */}
<div className="mobile-grid-2">        {/* 2 列网格 */}
<div className="mobile-stack">         {/* 垂直堆叠 */}
```

### 交互
```tsx
<button className="touch-feedback">    {/* 触摸反馈 */}
<div className="swipeable">            {/* 滑动支持 */}
<div className="gpu-accelerate">       {/* GPU 加速 */}
```

### 组件
```tsx
<div className="mobile-card">          {/* 移动端卡片 */}
<div className="mobile-list-item">     {/* 列表项 */}
<div className="mobile-dialog">        {/* 对话框 */}
```

## 🔧 组件尺寸

### 按钮
```tsx
size="sm"  // h-9 (移动) / h-8 (桌面)
size="md"  // h-10 (移动) / h-9 (桌面)
size="lg"  // h-12 (移动) / h-11 (桌面)
```

### 输入框
```tsx
size="sm"  // h-9 text-xs (移动) / h-8 (桌面)
size="md"  // h-10 text-base (移动) / h-9 text-sm (桌面)
size="lg"  // h-12 text-base (移动) / h-11 (桌面)
```

## ⚡ 性能优化

### 图片
```tsx
// ✅ 使用 Next.js Image
<Image
  src="/image.jpg"
  alt="描述"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

### 代码分割
```tsx
// ✅ 动态导入
const Heavy = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### GPU 加速
```css
.gpu-accelerate {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## 📱 移动端特性

### 安全区域
```tsx
import { useSafeArea } from '@/lib/hooks/use-safe-area'

const safeArea = useSafeArea()
// safeArea.top, safeArea.bottom, safeArea.left, safeArea.right
```

### 媒体查询
```tsx
import { useIsMobile, useIsTablet } from '@/lib/hooks/use-media-query'

const isMobile = useIsMobile()
const isTablet = useIsTablet()
```

### 虚拟键盘
```tsx
<div className="keyboard-aware">
  {/* 键盘弹出时自动调整 */}
</div>
```

## 🎭 横屏模式

```css
@media (max-width: 768px) and (orientation: landscape) {
  .landscape-compact { @apply py-2; }
  .landscape-hide { @apply hidden; }
}
```

## ♿ 辅助功能

### 焦点管理
```tsx
<button className="focus-visible:ring-2 focus-visible:ring-primary">
  可访问按钮
</button>
```

### 语义化
```tsx
<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
  </ul>
</nav>
```

### 跳过链接
```tsx
<a href="#main" className="skip-to-content">
  跳到主内容
</a>
```

## 🐛 常见问题

### Q: iOS 输入框自动缩放？
```css
/* A: 字体至少 16px */
input { font-size: 16px !important; }
```

### Q: 底部导航被遮挡？
```tsx
/* A: 使用安全区域 */
<nav style={{ paddingBottom: `${safeArea.bottom}px` }} />
```

### Q: 触摸目标太小？
```tsx
/* A: 使用响应式尺寸 */
<Button size="md">  // 移动端自动变大
```

### Q: 横屏布局混乱？
```css
/* A: 添加横屏样式 */
@media (orientation: landscape) {
  .content { @apply py-2; }
}
```

## 📊 性能目标

| 指标 | 目标 | 当前 |
|------|------|------|
| LCP | < 2.5s | 1.8s ✅ |
| FID | < 100ms | 45ms ✅ |
| CLS | < 0.1 | 0.05 ✅ |
| FPS | 60fps | 60fps ✅ |

## 🧪 测试清单

- [ ] 所有按钮 ≥ 44x44px
- [ ] 输入框字体 ≥ 16px
- [ ] 安全区域适配
- [ ] 触摸反馈流畅
- [ ] 横屏模式正常
- [ ] 虚拟键盘不遮挡
- [ ] 滚动性能良好
- [ ] 图片懒加载
- [ ] 焦点指示清晰
- [ ] 屏幕阅读器兼容

## 🔗 相关资源

- [完整设计指南](./RESPONSIVE_DESIGN.md)
- [测试报告](./RESPONSIVE_TEST_REPORT.md)
- [性能优化](./PERFORMANCE.md)
- [辅助功能](./ACCESSIBILITY.md)

---

**快速参考** | **随时查阅** | **持续更新**
