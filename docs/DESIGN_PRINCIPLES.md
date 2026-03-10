# EduNexus 设计原则与最佳实践

## 核心设计原则

### 1. 一致性 (Consistency)

**定义**: 在整个应用中保持统一的视觉语言和交互模式。

**实践指南**:

#### 视觉一致性
- 使用统一的设计令牌（颜色、间距、字体）
- 保持组件样式的一致性
- 统一的图标风格和尺寸

```tsx
// ✅ 好的做法 - 使用设计令牌
<Button variant="primary">主要操作</Button>
<Button variant="secondary">次要操作</Button>

// ❌ 避免 - 自定义样式
<button className="bg-blue-500 text-white">主要操作</button>
<button className="bg-gray-300 text-black">次要操作</button>
```

#### 交互一致性
- 相同的操作使用相同的交互方式
- 统一的反馈机制
- 一致的导航模式

```tsx
// ✅ 好的做法 - 统一的删除确认
const handleDelete = async () => {
  const confirmed = await showConfirmDialog({
    title: '确认删除',
    description: '此操作无法撤销',
    variant: 'destructive',
  })
  if (confirmed) {
    await deleteItem()
  }
}

// ❌ 避免 - 不一致的确认方式
const handleDelete = () => {
  if (window.confirm('确定删除吗？')) {
    deleteItem()
  }
}
```

---

### 2. 可访问性 (Accessibility)

**定义**: 确保所有用户，包括残障人士，都能有效使用应用。

**实践指南**:

#### 键盘导航
- 所有交互元素可通过键盘访问
- 清晰的焦点指示器
- 合理的 Tab 顺序

```tsx
// ✅ 好的做法
<Button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
  className="focus-visible:ring-2 focus-visible:ring-ring"
>
  操作
</Button>

// ❌ 避免
<div onClick={handleClick}>操作</div>
```

#### 颜色对比度
- 文本与背景对比度至少 4.5:1
- 大文本（18px+）对比度至少 3:1
- 不仅依赖颜色传达信息

```tsx
// ✅ 好的做法 - 使用图标和文字
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>错误</AlertTitle>
  <AlertDescription>操作失败</AlertDescription>
</Alert>

// ❌ 避免 - 仅使用颜色
<div className="text-red-500">错误</div>
```

#### ARIA 属性
- 为交互元素提供适当的 ARIA 标签
- 使用语义化 HTML
- 为屏幕阅读器提供上下文

```tsx
// ✅ 好的做法
<button aria-label="关闭对话框" onClick={handleClose}>
  <X className="h-4 w-4" />
</button>

<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
  </ul>
</nav>

// ❌ 避免
<div onClick={handleClose}>
  <X className="h-4 w-4" />
</div>
```

#### 触摸目标
- 最小触摸目标尺寸 44x44px
- 触摸目标之间有足够间距

```tsx
// ✅ 好的做法
<Button className="min-h-touch min-w-touch">
  操作
</Button>

// ❌ 避免
<button className="h-6 w-6 p-0">
  <X className="h-3 w-3" />
</button>
```

---

### 3. 响应式设计 (Responsive Design)

**定义**: 在不同设备和屏幕尺寸上提供优质体验。

**实践指南**:

#### 移动优先
- 从移动端开始设计
- 渐进增强到大屏幕
- 优化触摸交互

```tsx
// ✅ 好的做法 - 移动优先
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    标题
  </h1>
</div>

// ❌ 避免 - 桌面优先
<div className="p-8 sm:p-4">
  <h1 className="text-4xl sm:text-2xl">
    标题
  </h1>
</div>
```

#### 流式布局
- 使用相对单位（%、rem、em）
- 避免固定宽度
- 使用 Flexbox 和 Grid

```tsx
// ✅ 好的做法
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// ❌ 避免
<div style={{ width: '1200px' }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

#### 断点使用
- 使用标准断点
- 考虑内容而非设备
- 测试边界情况

```tsx
// ✅ 好的做法
<nav className="hidden md:flex">
  <DesktopNav />
</nav>
<nav className="md:hidden">
  <MobileNav />
</nav>

// ❌ 避免
<nav className="hidden" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
  <DesktopNav />
</nav>
```

---

### 4. 性能优化 (Performance)

**定义**: 确保应用快速响应，提供流畅体验。

**实践指南**:

#### 组件优化
- 使用 React.memo 避免不必要的重渲染
- 合理使用 useMemo 和 useCallback
- 懒加载非关键组件

```tsx
// ✅ 好的做法
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return processData(data)
  }, [data])

  return <div>{processedData}</div>
})

// 懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

#### 动画性能
- 使用 transform 和 opacity
- 避免触发重排的属性
- 使用 will-change 提示浏览器

```tsx
// ✅ 好的做法 - 使用 transform
<div className="transition-transform hover:scale-105">
  内容
</div>

// ❌ 避免 - 使用 width/height
<div className="transition-all hover:w-[200px]">
  内容
</div>
```

#### 图片优化
- 使用适当的图片格式
- 响应式图片
- 懒加载图片

```tsx
// ✅ 好的做法
<img
  src={image.src}
  srcSet={`${image.src} 1x, ${image.src2x} 2x`}
  loading="lazy"
  alt={image.alt}
/>

// 使用 Next.js Image
<Image
  src={image.src}
  alt={image.alt}
  width={800}
  height={600}
  loading="lazy"
/>
```

---

### 5. 可维护性 (Maintainability)

**定义**: 代码易于理解、修改和扩展。

**实践指南**:

#### 组件化
- 单一职责原则
- 可复用的组件
- 清晰的组件层次

```tsx
// ✅ 好的做法 - 组件化
function UserCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <UserAvatar user={user} />
        <UserInfo user={user} />
      </CardHeader>
      <CardContent>
        <UserStats user={user} />
      </CardContent>
    </Card>
  )
}

// ❌ 避免 - 单体组件
function UserCard({ user }) {
  return (
    <div className="card">
      <div className="header">
        <img src={user.avatar} />
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="content">
        <div>课程: {user.courses}</div>
        <div>学时: {user.hours}</div>
      </div>
    </div>
  )
}
```

#### 命名规范
- 使用描述性名称
- 遵循一致的命名约定
- 避免缩写

```tsx
// ✅ 好的做法
const [isLoading, setIsLoading] = useState(false)
const [userProfile, setUserProfile] = useState(null)

function handleSubmitForm() {
  // ...
}

// ❌ 避免
const [loading, setLoading] = useState(false)
const [usr, setUsr] = useState(null)

function submit() {
  // ...
}
```

#### 文档注释
- 为复杂逻辑添加注释
- 使用 JSDoc 注释
- 保持注释更新

```tsx
// ✅ 好的做法
/**
 * 计算用户的学习进度百分比
 * @param completedLessons - 已完成的课程数
 * @param totalLessons - 总课程数
 * @returns 进度百分比 (0-100)
 */
function calculateProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

// ❌ 避免
function calc(a, b) {
  return (a / b) * 100
}
```

---

## 设计模式

### 1. 渐进式披露 (Progressive Disclosure)

只在需要时显示信息，避免信息过载。

```tsx
// ✅ 好的做法
function CourseCard({ course }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{course.summary}</p>
        {showDetails && (
          <div className="mt-4">
            <h4>详细信息</h4>
            <p>{course.description}</p>
            <ul>
              {course.topics.map(topic => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '收起' : '查看详情'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

### 2. 即时反馈 (Immediate Feedback)

为用户操作提供即时的视觉反馈。

```tsx
// ✅ 好的做法
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    setIsLoading(true)
    setLiked(!liked) // 乐观更新

    try {
      await likePost(postId)
    } catch (error) {
      setLiked(liked) // 回滚
      toast.error('操作失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLike}
      disabled={isLoading}
      className={liked ? 'text-red-500' : ''}
    >
      <Heart className={liked ? 'fill-current' : ''} />
      {isLoading && <Spinner className="ml-2" />}
    </Button>
  )
}
```

### 3. 防御性设计 (Defensive Design)

预防错误，提供清晰的错误处理。

```tsx
// ✅ 好的做法
function DeleteButton({ itemId, itemName }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = await showConfirmDialog({
      title: '确认删除',
      description: `确定要删除 "${itemName}" 吗？此操作无法撤销。`,
      confirmText: '删除',
      cancelText: '取消',
      variant: 'destructive',
    })

    if (!confirmed) return

    setIsDeleting(true)

    try {
      await deleteItem(itemId)
      toast.success('删除成功')
    } catch (error) {
      toast.error('删除失败，请重试')
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      loading={isDeleting}
      disabled={isDeleting}
    >
      <Trash2 className="mr-2" />
      删除
    </Button>
  )
}
```

### 4. 空状态设计 (Empty States)

为空状态提供有意义的内容和引导。

```tsx
// ✅ 好的做法
function CourseList({ courses }) {
  if (courses.length === 0) {
    return (
      <Card className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          还没有课程
        </h3>
        <p className="text-muted-foreground mb-6">
          开始创建你的第一个课程吧
        </p>
        <Button>
          <Plus className="mr-2" />
          创建课程
        </Button>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
```

---

## 用户体验原则

### 1. 清晰的层次结构

使用视觉层次引导用户注意力。

```tsx
// ✅ 好的做法
<div className="space-y-6">
  <h1 className="text-4xl font-bold">页面标题</h1>
  <p className="text-lg text-muted-foreground">页面描述</p>

  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">章节标题</h2>
    <p className="text-base">章节内容</p>
  </div>
</div>
```

### 2. 减少认知负担

简化界面，减少用户需要记忆的信息。

```tsx
// ✅ 好的做法 - 使用默认值和提示
<Input
  type="email"
  placeholder="your@email.com"
  defaultValue={user?.email}
/>

// ✅ 好的做法 - 提供上下文帮助
<div className="space-y-2">
  <Label htmlFor="password">密码</Label>
  <Input id="password" type="password" />
  <p className="text-sm text-muted-foreground">
    至少 8 个字符，包含字母和数字
  </p>
</div>
```

### 3. 提供撤销选项

允许用户撤销操作，减少焦虑。

```tsx
// ✅ 好的做法
function deleteWithUndo(itemId) {
  const item = getItem(itemId)

  // 软删除
  markAsDeleted(itemId)

  // 显示撤销提示
  toast.success('已删除', {
    action: {
      label: '撤销',
      onClick: () => {
        restoreItem(itemId)
        toast.success('已恢复')
      },
    },
    duration: 5000,
  })

  // 5秒后永久删除
  setTimeout(() => {
    permanentlyDelete(itemId)
  }, 5000)
}
```

---

## 检查清单

### 设计检查清单

- [ ] 使用统一的设计令牌
- [ ] 保持视觉和交互一致性
- [ ] 符合 WCAG 2.1 AA 标准
- [ ] 支持键盘导航
- [ ] 提供清晰的焦点指示器
- [ ] 颜色对比度符合标准
- [ ] 触摸目标至少 44x44px
- [ ] 响应式设计，移动优先
- [ ] 优化性能，避免不必要的重渲染
- [ ] 使用语义化 HTML
- [ ] 提供适当的 ARIA 标签
- [ ] 为空状态提供引导
- [ ] 为错误提供清晰的反馈
- [ ] 允许撤销重要操作
- [ ] 提供加载状态指示

### 代码检查清单

- [ ] 组件职责单一
- [ ] 使用描述性命名
- [ ] 添加必要的注释
- [ ] 遵循项目代码规范
- [ ] 避免硬编码值
- [ ] 使用 TypeScript 类型
- [ ] 处理边界情况
- [ ] 添加错误处理
- [ ] 优化性能
- [ ] 编写可测试的代码

---

## 参考资源

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project](https://www.a11yproject.com/)

---

## 更新日志

### v1.0.0 (2026-03-10)
- 初始版本发布
- 核心设计原则
- 设计模式
- 用户体验原则
- 检查清单
