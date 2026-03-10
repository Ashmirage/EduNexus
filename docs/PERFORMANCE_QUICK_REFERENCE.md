# 性能优化快速参考

## 🚀 立即可用的优化工具

### 1. 懒加载组件
```typescript
import { LazyMonacoEditor, LazyReactFlow } from '@/lib/performance/lazy-components';
```

### 2. 优化图片
```typescript
import { OptimizedImage } from '@/lib/performance/image-optimization';
<OptimizedImage src="/img.jpg" alt="..." width={800} height={600} lazy />
```

### 3. 防抖/节流
```typescript
import { useDebounce, useThrottle } from '@/lib/performance/hooks';
const debouncedValue = useDebounce(value, 300);
```

### 4. 虚拟化列表
```typescript
import { useVirtualList } from '@/lib/performance/hooks';
const { visibleItems, totalHeight, handleScroll } = useVirtualList(items, {
  itemHeight: 50, containerHeight: 500
});
```

### 5. 优化 IndexedDB
```typescript
import { createOptimizedDB } from '@/lib/performance/optimized-idb';
const db = createOptimizedDB('mydb', 1);
await db.set('store', 'key', value); // 自动批量优化
```

### 6. 错误边界
```typescript
import { ErrorBoundary } from '@/components/error-boundary';
<ErrorBoundary>{children}</ErrorBoundary>
```

### 7. 错误日志
```typescript
import { logError } from '@/lib/error-logger';
logError(error, { severity: 'high', context: {...} });
```

### 8. 可访问性
```typescript
import { useFocusTrap, useKeyboardNavigation, aria } from '@/lib/accessibility';
const containerRef = useFocusTrap(isOpen);
<div {...aria.expanded(isOpen)} />
```

### 9. SEO 元数据
```typescript
import { generateMetadata, seoPresets } from '@/lib/seo';
export const metadata = generateMetadata(seoPresets.workspace);
```

### 10. 性能监控
```typescript
import { getPerformanceMonitor } from '@/lib/performance/monitor';
const monitor = getPerformanceMonitor();
monitor.mark('start');
monitor.measure('duration', 'start');
```

## 📊 性能目标

| 指标 | 目标 | 当前 |
|------|------|------|
| Lighthouse | > 90 | ~65 |
| FCP | < 1.5s | ~2.5s |
| LCP | < 2.5s | ~3.5s |
| TTI | < 3s | ~4.5s |
| CLS | < 0.1 | ~0.15 |
| FID | < 100ms | ~150ms |
| 包大小 | < 500KB | ~800KB |

## 🔧 NPM 脚本

```bash
npm run build:analyze    # 分析包大小
npm run perf:audit       # Lighthouse 审计
npm run perf:monitor     # 性能监控
npm run typecheck        # 类型检查
```

## 📚 文档

- 📄 [性能优化报告](./PERFORMANCE_OPTIMIZATION_REPORT.md)
- 📖 [优化建议文档](./PERFORMANCE_OPTIMIZATION_GUIDE.md)
- ✅ [优化检查清单](./PERFORMANCE_OPTIMIZATION_CHECKLIST.md)
- 📝 [实施总结](./PERFORMANCE_OPTIMIZATION_SUMMARY.md)

## ⚠️ 注意事项

1. 先修复现有 TypeScript 错误
2. 渐进式应用优化
3. 每次优化后测试
4. 监控性能指标
5. 保持功能完整性

## 🎯 优先级

🔴 **高优先级** (立即执行)
- 修复 TypeScript 错误
- 应用字体优化
- 添加错误边界
- 启用性能监控

🟡 **中优先级** (1-2 周)
- 应用懒加载组件
- 优化图片
- React 性能优化
- IndexedDB 优化
- SEO 元数据

🟢 **低优先级** (长期)
- 性能测试
- 可访问性改进
- 持续优化
