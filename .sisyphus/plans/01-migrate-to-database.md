# 计划: 迁移到数据库驱动的文档存储

**Objective**: 实现真正的用户数据隔离，将知识库内容从文件系统 (`vault` 文件夹) 迁移到 PostgreSQL 数据库中，并通过 Prisma ORM 进行管理。

**Status**: Approved

---

### Phase 1: 基础设施与数据模型 (Infrastructure & Data Model)

**目标**: 准备好数据库环境，定义数据结构，并同步到数据库。

- **Task 1.1: [环境] 安装并运行 PostgreSQL**
  - **Status**: `[x] Done`
  - **Details**: 用户已通过 `Postgres.app` 在本地 macOS 环境中安装并运行了 PostgreSQL 服务。

- **Task 1.2: [代码] 安装 Prisma 依赖**
  - **Status**: `[x] Done`
  - **Details**: 已运行 `pnpm add -w prisma @prisma/client`。

- **Task 1.3: [代码] 初始化 Prisma**
  - **Status**: `[x] Done`
  - **Details**: 已运行 `pnpm prisma init`。

- **Task 1.4: [配置] 配置数据库连接**
  - **Status**: `[x] Done`
  - **Details**: `.env` 文件中的 `DATABASE_URL` 已配置为指向本地 PostgreSQL 实例。

- **Task 1.5: [配置] 定义数据模型**
  - **Status**: `[x] Done`
  - **Details**: 已在 `prisma/schema.prisma` 中定义 User 和 Document 模型。

- **Task 1.6: [数据库] 同步 Schema 到数据库**
  - **Status**: `[x] Done`
  - **Details**: 已运行 `pnpm prisma db push`，数据库表已创建。

---

### Phase 2: 后端服务层重构 (Backend Service Layer)

**目标**: 用与数据库交互的 Prisma 服务替换所有旧的文件系统读写逻辑。

- **Task 2.1: [代码] 创建 Prisma Client 单例**
  - **Status**: `[x] Done`
  - **Details**: 已创建 `apps/web/src/lib/server/prisma.ts`。

- **Task 2.2: [代码] 创建 `document-service.ts`**
  - **Status**: `[x] Done`
  - **Details**: 已创建 `apps/web/src/lib/server/document-service.ts`，实现了基于 Prisma 的 CRUD 操作。

- **Task 2.3: [代码] 创建/更新 `user-service.ts`**
  - **Status**: `[x] Done`
  - **Details**: 已重构 `user-service.ts`，使用 Prisma 替代旧的 `store.ts`。

- **Task 2.4: [数据] 创建 Demo 用户**
  - **Status**: `[x] Done`
  - **Details**: 已运行 seed 脚本，创建 `demo@edunexus.com` 用户 (密码: demo123)。

---

### Phase 3: API 与前端重构 (API & Frontend)

**目标**: 更新所有相关的 API 路由和前端组件，使用新的后端服务，并处理身份验证。

- **Task 3.1: [重构] 改造知识库 API 路由**
  - **Status**: `[ ] Pending`
  - **Action**: 逐个重构 `/api/kb/` 下的 API 路由，用 `document-service` 替换 `kb-lite`。
  - **Sub-Task 3.1.1: 重构 `GET /api/kb/doc/[id]`**
    - **Status**: `[x] Done`
    - **File**: `apps/web/src/app/api/kb/doc/[id]/route.ts`
    - **New Content**:
      ```typescript
      import { fail, ok } from "@/lib/server/response";
      import { getCurrentUserId } from "@/lib/server/auth-utils";
      import { getDocument } from "@/lib/server/document-service";

      export const runtime = "nodejs";

      export async function GET(
        _request: Request,
        context: { params: Promise<{ id: string }> }
      ) {
        try {
          const userId = await getCurrentUserId();
          if (!userId) {
            return fail(
              {
                code: "UNAUTHORIZED",
                message: "用户未登录。"
              },
              401
            );
          }
          
          const { id } = await context.params;
          const doc = await getDocument(id, userId);

          if (!doc) {
            return fail(
              {
                code: "DOC_NOT_FOUND",
                message: "未找到对应知识文档，或无权访问。"
              },
              404
            );
          }

          return ok({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            updatedAt: doc.updatedAt,
            type: 'note', 
            domain: 'general',
            tags: [],
            links: [],
            sourceRefs: [],
            owner: doc.authorId,
            backlinks: []
          });
        } catch (error) {
          return fail(
            {
              code: "KB_DOC_FAILED",
              message: "读取知识文档失败。",
              details: error instanceof Error ? error.message : error
            },
            500
          );
        }
      }
      ```
  - **Details**:
    1. 移除所有 `fs` 文件读写和调用旧 `store.ts` 的逻辑。
    2. 在每个路由处理函数开头，使用 `const session = await auth()` 获取会话。
    3. 如果 `!session?.user?.id`，则返回 401 或 403 错误。
    4. 调用 `document-service.ts` 中的新服务，并传入 `session.user.id` 作为参数。
    5. **进度**: 已更新 `workspace/sessions/route.ts`, `workspace/session/[id]/route.ts`, `workspace/session/[id]/stream/route.ts` 添加用户过滤。已重构 `kb/doc/[id]/route.ts`。

  - **Sub-Task 3.1.2: 创建文档列表 API `GET /api/kb/docs`**
    - **Status**: `[x] Done`
    - **File**: `apps/web/src/app/api/kb/docs/route.ts`
    - **Action**: Created new API endpoint that returns list of documents for current user using `listDocuments(userId)`.

  - **Sub-Task 3.1.3: 创建文档创建 API `POST /api/kb/docs`**
    - **Status**: `[x] Done`
    - **File**: `apps/web/src/app/api/kb/docs/route.ts` (POST method)
    - **Action**: Created endpoint to create documents using `createDocument({title, content, authorId})`.

  - **Sub-Task 3.1.4: 重构客户端 kb-storage.ts**
    - **Status**: `[x] Done`
    - **File**: `apps/web/src/lib/client/kb-storage.ts`
    - **Action**: Added server API methods: `fetchDocumentsFromServer()`, `createDocumentOnServer()`, `getDocumentFromServer()`.

  - **Sub-Task 3.1.5: 更新 kb/page.tsx**
    - **Status**: `[x] Done`
    - **File**: `apps/web/src/app/kb/page.tsx`
    - **Action**: Fixed critical bug - now strictly uses `useSession` status to determine data loading. NO fallback to local storage.
      - When `status === 'authenticated'`: Only loads from server API
      - When `status === 'unauthenticated'`: Shows empty list
      - Completely removed local storage fallback

- **Task 3.3: [重构] 修复 `graph-service.ts`**
    - **Status**: `[ ] Pending`
    - **File**: `apps/web/src/lib/server/graph-service.ts`
    - **Issue**: 该文件依赖于已被删除的 `kb-lite.ts` 和 `buildGraphFromVault`。
    - **Action**: 重构 `getGraphView` 和 `getGraphNodeDetail` 函数，使其从数据库读取 `Document` 数据，并为当前用户构建图谱。
    - **New Content**:
      ```typescript
      import { prisma } from './prisma';

      const MAX_NODES_PER_USER = 200;

      export async function getGraphView(userId: string, input?: { domain?: string }) {
        const documents = await prisma.document.findMany({
          where: {
            authorId: userId,
          },
          take: MAX_NODES_PER_USER,
          orderBy: {
            updatedAt: 'desc',
          },
        });

        const nodes = documents.map((doc) => ({
          id: doc.id,
          label: doc.title,
          mastery: 0.5,
          risk: 0.5,
          domain: 'general',
        }));

        const edges: Array<{ source: string; target: string; weight: number }> = [];

        return {
          nodes,
          edges,
        };
      }

      export async function getGraphNodeDetail(nodeId: string, userId: string) {
        const doc = await prisma.document.findFirst({
          where: { id: nodeId, authorId: userId },
        });
        
        if (!doc) return null;

        return {
          node: {
            id: doc.id,
            label: doc.title,
            mastery: 0.5,
            risk: 0.5,
            domain: 'general',
          },
          evidences: [
            {
              sourceId: `db:${doc.id}`,
              chunkRef: "summary",
              quote: `节点「${doc.title}」来自用户的知识库。`,
            },
          ],
        };
      }
      ```
---
- **Task 3.2: [重构] 更新前端组件的数据获取逻辑**
  - **Status**: `[ ] Pending`
  - **Action**: （此任务已被新的子任务覆盖和细化）

---

### Phase 5: 最终验证 (Final Verification)

**目标**: 进行端到端测试，确保整个系统按预期工作。

- **Task 5.1: [测试] 端到端功能测试**
  - **Status**: `[ ] Pending**
  - **Action**: 手动执行以下测试用例：
    1. **注册**: 注册一个新用户 A。
    2. **创建**: 用户 A 登录并创建一篇新文档。
    3. **隔离验证**: 退出登录，注册并登录为新用户 B，确认用户 B **看不到** 用户 A 的文档。
    4. **Demo 用户验证**: 退出登录，使用 `demo@edunexus.com` 登录，确认能看到从 `vault` 迁移过来的所有文档。
    5. **编辑/删除**: 测试文档的编辑和删除功能是否正常。

- **Task 5.2: [代码质量] 最终检查**
  - **Status**: `[x] Done**
  - **Action**: 运行 `pnpm typecheck` 和 `pnpm lint`，确保没有类型错误或格式问题。
  - **Result**: 0 errors, 559 warnings (pre-existing)

---

### Phase 4: 数据迁移与清理 (Migration & Cleanup)

**目标**: 将旧 `vault` 文件夹中的内容导入到新数据库中，并清理废弃的代码和文件。

- **Task 4.1: [脚本] 创建数据迁移脚本**
  - **Status**: `[x] Done`
  - **Action**: 创建 `scripts/migrate-vault.ts`。

- **Task 4.2: [执行] 运行迁移脚本**
  - **Status**: `[x] Done`
  - **Action**: 运行 `node scripts/migrate-vault.ts`。
  - **Verification**: 成功导入 3 篇文档到数据库 demo 用户账户下。

- **Task 4.3: [清理] 移除废弃代码和文件**
  - **Status**: `[ ] Pending`
  - **Action**: 在确认整个流程正常工作后，删除 `vault/` 文件夹，并删除代码库中所有与旧文件系统存储相关的函数和逻辑。

---

### Phase 5: 最终验证 (Final Verification)

**目标**: 进行端到端测试，确保整个系统按预期工作。

- **Task 5.1: [测试] 端到端功能测试**
  - **Status**: `[ ] Pending`
  - **Action**: 手动执行以下测试用例：
    1. **注册**: 注册一个新用户 A。
    2. **创建**: 用户 A 登录并创建一篇新文档。
    3. **隔离验证**: 退出登录，注册并登录为新用户 B，确认用户 B **看不到** 用户 A 的文档。
    4. **Demo 用户验证**: 退出登录，使用 `demo@edunexus.com` 登录，确认能看到从 `vault` 迁移过来的所有文档。
    5. **编辑/删除**: 测试文档的编辑和删除功能是否正常。

- **Task 5.2: [代码质量] 最终检查**
  - **Status**: `[ ] Pending`
  - **Action**: 运行 `pnpm typecheck` 和 `pnpm lint`，确保没有类型错误或格式问题。

