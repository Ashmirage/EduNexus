# 编程实验室功能文档

## 概述

编程实验室是 EduNexus 的高级代码编辑和执行环境，集成了 Monaco Editor（VS Code 的编辑器核心）和多语言代码执行能力。

## 主要功能

### 1. Monaco Editor 集成

- **专业代码编辑器**：使用 VS Code 同款编辑器
- **多语言支持**：JavaScript、TypeScript、Python、HTML、CSS、JSON、Markdown
- **智能功能**：
  - 语法高亮
  - 代码自动补全
  - 代码格式化
  - 代码折叠
  - 行号显示
  - 迷你地图导航

### 2. 主题和外观

- **浅色主题** (vs-light)
- **深色主题** (vs-dark)
- **高对比度主题** (hc-black)
- **可调字体大小**：12px - 20px

### 3. 多语言代码执行

#### JavaScript/TypeScript
- 浏览器内执行
- 支持 console.log 输出
- 错误捕获和显示
- 返回值显示

#### Python
- 使用 Pyodide 在浏览器中运行
- 完整的 Python 3.11 环境
- 支持标准输入输出
- 5秒执行超时保护
- 错误提示和调试信息

### 4. 项目管理

#### 多文件项目
- 文件树结构导航
- 创建、删除、重命名文件和文件夹
- 文件内容自动保存到本地存储

#### 项目模板
1. **React 项目**
   - App.tsx
   - index.tsx
   - package.json

2. **Python 项目**
   - main.py
   - utils.py

3. **HTML 项目**
   - index.html
   - style.css
   - script.js

4. **空白项目**
   - 从零开始

#### 项目导入导出
- 导出为 JSON 格式
- 导入已有项目
- 项目数据持久化

## 使用指南

### 创建新项目

1. 点击"新建项目"按钮
2. 输入项目名称和描述
3. 选择项目模板（可选）
4. 点击"创建项目"

### 编辑代码

1. 在文件树中选择文件
2. 在 Monaco Editor 中编辑代码
3. 使用工具栏切换语言和主题
4. 点击"格式化"按钮美化代码

### 执行代码

1. 切换到"执行器"标签
2. 编写或粘贴代码
3. 选择编程语言
4. 点击"运行代码"按钮
5. 查看输出结果

### 文件操作

- **新建文件**：点击文件夹旁的 + 图标
- **新建文件夹**：点击文件夹图标
- **重命名**：点击编辑图标
- **删除**：点击删除图标（需确认）

### 项目操作

- **导出项目**：点击下载图标，保存为 JSON 文件
- **导入项目**：点击上传图标，选择 JSON 文件
- **删除项目**：点击删除图标（需确认）

## 技术实现

### 核心依赖

```json
{
  "@monaco-editor/react": "^4.7.0",
  "pyodide": "^0.26.4"
}
```

### 组件架构

```
ProgrammingLab (主容器)
├── ProjectTemplates (项目模板选择)
├── FileTree (文件树导航)
├── MonacoEditor (代码编辑器)
└── EnhancedCodeExecutor (代码执行器)
    ├── JavaScript 执行器
    └── Python 执行器 (Pyodide)
```

### 数据存储

- 使用 localStorage 持久化项目数据
- 自动保存文件内容
- 项目元数据包括：
  - 项目 ID、名称、描述
  - 文件树结构
  - 文件内容和语言
  - 创建和更新时间

## 示例代码

### JavaScript 示例

```javascript
// 计算斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("前 10 个斐波那契数:");
for (let i = 0; i < 10; i++) {
  console.log(`F(${i}) = ${fibonacci(i)}`);
}
```

### Python 示例

```python
# 计算质数
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print("前 20 个质数:")
count = 0
num = 2
while count < 20:
    if is_prime(num):
        print(num, end=" ")
        count += 1
    num += 1
```

## 性能优化

1. **Monaco Editor**
   - 按需加载
   - 自动布局调整
   - 虚拟滚动

2. **Pyodide**
   - 首次加载时异步初始化
   - 单例模式复用实例
   - 执行超时保护

3. **项目管理**
   - 增量保存
   - 延迟加载文件内容
   - 树结构优化

## 限制和注意事项

1. **Python 执行**
   - 首次加载需要下载 Pyodide（约 10MB）
   - 不支持文件系统操作
   - 不支持网络请求（除非使用 Pyodide 的 fetch API）
   - 执行超时限制为 5 秒

2. **JavaScript 执行**
   - 在当前页面上下文中执行
   - 可能影响页面状态
   - 建议使用 console.log 输出

3. **存储限制**
   - localStorage 通常限制为 5-10MB
   - 大型项目可能需要导出备份

## 未来改进

- [ ] 支持更多编程语言（Java、C++、Go）
- [ ] 代码协作和分享
- [ ] 集成 Git 版本控制
- [ ] 代码片段库
- [ ] 自动保存到云端
- [ ] 代码运行历史记录
- [ ] 性能分析工具
- [ ] 调试器集成

## 相关文件

- `apps/web/src/components/workspace/programming-lab.tsx` - 主容器
- `apps/web/src/components/workspace/monaco-editor.tsx` - Monaco 编辑器
- `apps/web/src/components/workspace/enhanced-code-executor.tsx` - 代码执行器
- `apps/web/src/components/workspace/file-tree.tsx` - 文件树
- `apps/web/src/components/workspace/project-templates.tsx` - 项目模板
- `apps/web/src/lib/workspace/python-executor.ts` - Python 执行器
- `apps/web/src/lib/workspace/project-manager.ts` - 项目管理器
