# Plan: Fix Broken References After Vault Deletion

**Objective**: Systematically refactor all files that were broken by the deletion of `vault/` and `kb-lite.ts`, redirecting them to use the new Prisma database services (`document-service.ts`) and ensuring user isolation.

**Strategy**: Each major file refactoring will be its own task. Each task will be committed atomically upon completion to ensure a clean Git history and provide safe rollback points.

**Pre-computation**:
- `git checkout -b refactor/database-migration`
- `rm -rf vault/ apps/web/src/lib/server/kb-lite.ts`

---

### Task 1: Refactor `graph-service.ts`

- **File**: `apps/web/src/lib/server/graph-service.ts`
- **Status**: `[x] Done`
- **TDD Steps**:
    1.  **Write**: Replace the content of the file with the Prisma-based implementation that fetches documents for a given `userId`. `buildGraphFromVault` is replaced by a `prisma.document.findMany` call.
    2.  **Verify**: Run `pnpm typecheck` and ensure errors related to `graph-service.ts` are resolved.
    3.  **Commit**: `git commit -m "refactor(graph): migrate graph-service to use database"`

---

### Task 2: Refactor `langgraph-agent.ts`

- **File**: `apps/web/src/lib/server/langgraph-agent.ts`
- **Status**: `[x] Done`
- **TDD Steps**:
    1.  **Write**: Identify where `kb-lite` was used (likely for context fetching). Replace these calls with `document-service.ts` functions to fetch relevant documents for the user.
    2.  **Verify**: Run `pnpm typecheck` to resolve errors in this file.
    3.  **Commit**: `git commit -m "refactor(ai): migrate langgraph-agent to use database context"`

---

### Task 3: Refactor KB API Routes

This task groups the refactoring of all knowledge base API endpoints.

- **Files**:
    - `apps/web/src/app/api/kb/search/route.ts`
    - `apps/web/src/app/api/kb/tags/route.ts`
    - `apps/web/src/app/api/kb/backlinks/graph/route.ts`
    - `apps/web/src/app/api/kb/index/rebuild/route.ts`
- **Status**: `[x] Done`
- **TDD Steps**:
    1.  **Write (search)**: Rewrite `search/route.ts` to use `prisma.document.findMany` with a `where` clause for full-text search on the `title` and `content` fields, filtered by `authorId`.
    2.  **Write (tags)**: Rewrite `tags/route.ts`. This will now require a database query to get all documents for a user and aggregate the tags. For the MVP, this can return an empty array.
    3.  **Write (backlinks)**: The concept of backlinks from files is gone. This API should be modified to return an empty graph or be disabled.
    4.  **Write (rebuild)**: The concept of a file-based index is obsolete. This API endpoint should be modified to do nothing and return a success message (a no-op).
    5.  **Verify**: After fixing all four files, run `pnpm typecheck`.
    6.  **Commit**: `git commit -m "refactor(api): migrate all kb APIs to use database"`

---

### Task 4: Refactor Workspace API Routes

This task groups the refactoring of workspace-related endpoints that previously touched the vault.

- **Files**:
    - `apps/web/src/app/api/workspace/note/save/route.ts`
    - `apps/web/src/app/api/workspace/socratic/next/route.ts`
    - `apps/web/src/app/api/workspace/socratic/unlock-final/route.ts`
- **Status**: `[x] Done`
- **TDD Steps**:
    1.  **Write (note/save)**: This should be entirely replaced by the new `POST /api/kb/docs` endpoint. This file can likely be deleted, and the frontend call redirected.
    2.  **Write (socratic/*)**: These used `kb-lite` for context. They must be refactored to use `document-service` to fetch documents belonging to the current user.
    3.  **Verify**: Run `pnpm typecheck` after modifying the files.
    4.  **Commit**: `git commit -m "refactor(api): migrate workspace APIs to use database"`

---

### Task 5: Final Verification and Cleanup

- **Status**: `[ ] Pending`
- **TDD Steps**:
    1.  **Verify**: Run a final, full `pnpm typecheck` to ensure no errors remain.
    2.  **Test**: Manually perform the end-to-end test flow: register a new user, create a document, log out, log in as another user, and confirm the document is not visible.
    3.  **Cleanup**: Delete any remaining dead code or empty API route files that are no longer needed.
    4.  **Commit**: `git commit -m "chore: complete database migration and cleanup"`

