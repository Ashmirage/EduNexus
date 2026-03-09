/**
 * 知识库存储功能使用示例
 */

import { getKBStorage } from "@/lib/client/kb-storage";

// ============================================
// 示例 1: 基础使用
// ============================================

export async function example1_BasicUsage() {
  const storage = getKBStorage();
  await storage.initialize();

  // 创建知识库
  const vault = await storage.createVault("我的笔记", "~/Documents/我的笔记");

  // 创建文档
  const doc = await storage.createDocument(
    vault.id,
    "每日笔记",
    "# 2026-03-09\n\n今天学习了...",
    ["日记", "学习"]
  );

  console.log("文档创建成功:", doc);
}

// ============================================
// 示例 2: 在 React 组件中使用
// ============================================

import { useState, useEffect } from "react";
import type { KBVault, KBDocument } from "@/lib/client/kb-storage";

export function useKBStorage() {
  const [vaults, setVaults] = useState<KBVault[]>([]);
  const [currentVaultId, setCurrentVaultId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<KBDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const storage = getKBStorage();

  // 初始化
  useEffect(() => {
    const init = async () => {
      try {
        await storage.initialize();
        const allVaults = await storage.getAllVaults();
        setVaults(allVaults);

        const savedVaultId = storage.getCurrentVaultId();
        if (savedVaultId) {
          setCurrentVaultId(savedVaultId);
          const docs = await storage.getDocumentsByVault(savedVaultId);
          setDocuments(docs);
        }
      } catch (error) {
        console.error("初始化失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // 切换知识库
  const switchVault = async (vaultId: string) => {
    setCurrentVaultId(vaultId);
    storage.setCurrentVault(vaultId);
    const docs = await storage.getDocumentsByVault(vaultId);
    setDocuments(docs);
  };

  // 创建文档
  const createDocument = async (title: string, content: string, tags: string[]) => {
    if (!currentVaultId) return null;

    const doc = await storage.createDocument(currentVaultId, title, content, tags);
    setDocuments((prev) => [doc, ...prev]);
    return doc;
  };

  // 更新文档
  const updateDocument = async (doc: KBDocument) => {
    await storage.updateDocument(doc);
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
  };

  // 删除文档
  const deleteDocument = async (docId: string) => {
    await storage.deleteDocument(docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return {
    vaults,
    currentVaultId,
    documents,
    isLoading,
    switchVault,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}

// ============================================
// 示例 3: 批量导入文档
// ============================================

export async function example3_BatchImport() {
  const storage = getKBStorage();
  await storage.initialize();

  const vaultId = storage.getCurrentVaultId();
  if (!vaultId) {
    console.error("请先选择一个知识库");
    return;
  }

  // 创建文件输入
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".md";
  input.multiple = true;

  input.onchange = async (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;

    try {
      const docs = await storage.importMultipleFiles(vaultId, files);
      console.log(`成功导入 ${docs.length} 个文档:`, docs);
    } catch (error) {
      console.error("导入失败:", error);
    }
  };

  input.click();
}

// ============================================
// 示例 4: 搜索文档
// ============================================

export async function example4_SearchDocuments(vaultId: string, query: string) {
  const storage = getKBStorage();
  await storage.initialize();

  const docs = await storage.getDocumentsByVault(vaultId);

  // 简单的全文搜索
  const results = docs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.content.toLowerCase().includes(query.toLowerCase())
  );

  return results;
}

// ============================================
// 示例 5: 按标签筛选
// ============================================

export async function example5_FilterByTags(vaultId: string, tags: string[]) {
  const storage = getKBStorage();
  await storage.initialize();

  const docs = await storage.getDocumentsByVault(vaultId);

  // 筛选包含指定标签的文档
  const results = docs.filter((doc) => tags.some((tag) => doc.tags.includes(tag)));

  return results;
}

// ============================================
// 示例 6: 提取双链关系
// ============================================

export function example6_ExtractBacklinks(
  documents: KBDocument[],
  targetDoc: KBDocument
) {
  const backlinkRegex = /\[\[([^\]]+)\]\]/g;

  // 找到所有引用目标文档的文档
  const backlinks = documents.filter((doc) => {
    const matches = doc.content.matchAll(backlinkRegex);
    for (const match of matches) {
      if (match[1] === targetDoc.title) {
        return true;
      }
    }
    return false;
  });

  return backlinks;
}

// ============================================
// 示例 7: 导出整个知识库
// ============================================

export async function example7_ExportVault(vaultId: string) {
  const storage = getKBStorage();
  await storage.initialize();

  const docs = await storage.getDocumentsByVault(vaultId);

  // 逐个导出文档
  for (const doc of docs) {
    storage.exportDocumentAsMarkdown(doc);
    // 添加延迟避免浏览器阻止多个下载
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`已导出 ${docs.length} 个文档`);
}

// ============================================
// 示例 8: 文档统计
// ============================================

export async function example8_DocumentStats(vaultId: string) {
  const storage = getKBStorage();
  await storage.initialize();

  const docs = await storage.getDocumentsByVault(vaultId);

  // 统计信息
  const stats = {
    totalDocs: docs.length,
    totalWords: docs.reduce((sum, doc) => sum + doc.content.split(/\s+/).length, 0),
    totalTags: new Set(docs.flatMap((doc) => doc.tags)).size,
    avgWordsPerDoc: 0,
    recentDocs: docs
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5),
  };

  stats.avgWordsPerDoc = Math.round(stats.totalWords / stats.totalDocs);

  return stats;
}

// ============================================
// 示例 9: 自动保存
// ============================================

export function example9_AutoSave(doc: KBDocument, content: string) {
  const storage = getKBStorage();

  // 防抖保存
  let saveTimer: NodeJS.Timeout;

  return (newContent: string) => {
    clearTimeout(saveTimer);

    saveTimer = setTimeout(async () => {
      try {
        await storage.updateDocument({
          ...doc,
          content: newContent,
        });
        console.log("自动保存成功");
      } catch (error) {
        console.error("自动保存失败:", error);
      }
    }, 1000); // 1秒后保存
  };
}

// ============================================
// 示例 10: 数据迁移
// ============================================

export async function example10_MigrateData(
  sourceVaultId: string,
  targetVaultId: string
) {
  const storage = getKBStorage();
  await storage.initialize();

  // 获取源知识库的所有文档
  const sourceDocs = await storage.getDocumentsByVault(sourceVaultId);

  // 复制到目标知识库
  for (const doc of sourceDocs) {
    await storage.createDocument(
      targetVaultId,
      doc.title,
      doc.content,
      doc.tags
    );
  }

  console.log(`已迁移 ${sourceDocs.length} 个文档`);
}
