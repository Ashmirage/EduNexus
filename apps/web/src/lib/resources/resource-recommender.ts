// 资源推荐引擎

import type { Resource } from "./resource-types";
import { getAllResources, getAllBookmarks } from "./resource-storage";

export interface RecommendationResult {
  resource: Resource;
  score: number;
  reason: string;
}

// ==================== 基于标签的推荐 ====================

export function recommendByTags(
  tags: string[],
  limit: number = 10,
  excludeIds: string[] = []
): RecommendationResult[] {
  const resources = getAllResources().filter(
    (r) => r.status === "active" && !excludeIds.includes(r.id)
  );

  const results: RecommendationResult[] = resources.map((resource) => {
    const matchedTags = resource.tags.filter((tag) => tags.includes(tag));
    const score = matchedTags.length / tags.length;

    return {
      resource,
      score,
      reason: matchedTags.length > 0
        ? `匹配标签：${matchedTags.join(", ")}`
        : "相关资源",
    };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ==================== 基于类型的推荐 ====================

export function recommendByType(
  type: Resource["type"],
  limit: number = 10,
  excludeIds: string[] = []
): RecommendationResult[] {
  const resources = getAllResources().filter(
    (r) =>
      r.status === "active" &&
      r.type === type &&
      !excludeIds.includes(r.id)
  );

  return resources
    .sort((a, b) => b.rating - a.rating || b.bookmarkCount - a.bookmarkCount)
    .slice(0, limit)
    .map((resource) => ({
      resource,
      score: 1,
      reason: `热门${getTypeLabel(type)}`,
    }));
}

// ==================== 热门资源推荐 ====================

export function recommendPopular(
  limit: number = 10,
  excludeIds: string[] = []
): RecommendationResult[] {
  const resources = getAllResources().filter(
    (r) => r.status === "active" && !excludeIds.includes(r.id)
  );

  return resources
    .sort((a, b) => {
      // 综合评分：收藏数 * 0.5 + 评分 * 10 + 浏览数 * 0.1
      const scoreA = a.bookmarkCount * 0.5 + a.rating * 10 + a.viewCount * 0.1;
      const scoreB = b.bookmarkCount * 0.5 + b.rating * 10 + b.viewCount * 0.1;
      return scoreB - scoreA;
    })
    .slice(0, limit)
    .map((resource, index) => ({
      resource,
      score: 1 - index * 0.05,
      reason: `社区热门 #${index + 1}`,
    }));
}

// ==================== 基于用户历史的推荐 ====================

export function recommendByUserHistory(
  userId: string,
  limit: number = 10,
  excludeIds: string[] = []
): RecommendationResult[] {
  const bookmarks = getAllBookmarks(userId);

  if (bookmarks.length === 0) {
    return recommendPopular(limit, excludeIds);
  }

  // 收集用户收藏的资源标签
  const resources = getAllResources();
  const bookmarkedResources = bookmarks
    .map((b) => resources.find((r) => r.id === b.resourceId))
    .filter((r): r is Resource => r !== undefined);

  const allTags = bookmarkedResources.flatMap((r) => r.tags);
  const tagFrequency = new Map<string, number>();

  allTags.forEach((tag) => {
    tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
  });

  // 按频率排序标签
  const topTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  // 基于用户偏好标签推荐
  return recommendByTags(topTags, limit, [
    ...excludeIds,
    ...bookmarks.map((b) => b.resourceId),
  ]);
}

// ==================== 相似资源推荐 ====================

export function recommendSimilar(
  resourceId: string,
  limit: number = 6
): RecommendationResult[] {
  const resource = getAllResources().find((r) => r.id === resourceId);
  if (!resource) return [];

  const allResources = getAllResources().filter(
    (r) => r.status === "active" && r.id !== resourceId
  );

  const results: RecommendationResult[] = allResources.map((r) => {
    let score = 0;
    let reasons: string[] = [];

    // 相同类型 +0.3
    if (r.type === resource.type) {
      score += 0.3;
      reasons.push("相同类型");
    }

    // 标签匹配
    const matchedTags = r.tags.filter((tag) => resource.tags.includes(tag));
    if (matchedTags.length > 0) {
      score += matchedTags.length * 0.2;
      reasons.push(`相似标签：${matchedTags.slice(0, 3).join(", ")}`);
    }

    // 相同作者 +0.2
    if (r.author && r.author === resource.author) {
      score += 0.2;
      reasons.push("相同作者");
    }

    // 相同来源 +0.1
    if (r.source && r.source === resource.source) {
      score += 0.1;
      reasons.push("相同来源");
    }

    return {
      resource: r,
      score,
      reason: reasons.join(" · ") || "相关资源",
    };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ==================== AI 个性化推荐 ====================

export function recommendPersonalized(
  userId: string,
  context?: {
    currentTopic?: string;
    learningPath?: string[];
    knowledgeNodes?: string[];
  },
  limit: number = 10
): RecommendationResult[] {
  const userBookmarks = getAllBookmarks(userId);
  const allResources = getAllResources().filter((r) => r.status === "active");

  // 如果用户没有收藏，返回热门推荐
  if (userBookmarks.length === 0) {
    return recommendPopular(limit);
  }

  const bookmarkedIds = userBookmarks.map((b) => b.resourceId);
  const bookmarkedResources = allResources.filter((r) =>
    bookmarkedIds.includes(r.id)
  );

  // 计算用户偏好
  const typePreference = new Map<string, number>();
  const tagPreference = new Map<string, number>();

  bookmarkedResources.forEach((r) => {
    typePreference.set(r.type, (typePreference.get(r.type) || 0) + 1);
    r.tags.forEach((tag) => {
      tagPreference.set(tag, (tagPreference.get(tag) || 0) + 1);
    });
  });

  // 推荐未收藏的资源
  const candidates = allResources.filter((r) => !bookmarkedIds.includes(r.id));

  const results: RecommendationResult[] = candidates.map((resource) => {
    let score = 0;
    let reasons: string[] = [];

    // 类型偏好匹配
    const typeScore = (typePreference.get(resource.type) || 0) / bookmarkedResources.length;
    score += typeScore * 0.3;
    if (typeScore > 0.3) {
      reasons.push("符合你的类型偏好");
    }

    // 标签偏好匹配
    const matchedTags = resource.tags.filter((tag) => tagPreference.has(tag));
    if (matchedTags.length > 0) {
      const tagScore = matchedTags.reduce(
        (sum, tag) => sum + (tagPreference.get(tag) || 0),
        0
      ) / bookmarkedResources.length;
      score += tagScore * 0.4;
      reasons.push(`匹配你关注的：${matchedTags.slice(0, 2).join(", ")}`);
    }

    // 上下文匹配
    if (context?.currentTopic) {
      const topicMatch =
        resource.title.toLowerCase().includes(context.currentTopic.toLowerCase()) ||
        resource.description.toLowerCase().includes(context.currentTopic.toLowerCase());
      if (topicMatch) {
        score += 0.2;
        reasons.push("与当前主题相关");
      }
    }

    if (context?.knowledgeNodes) {
      const nodeMatch = context.knowledgeNodes.some((node) =>
        resource.tags.some((tag) => tag.toLowerCase().includes(node.toLowerCase()))
      );
      if (nodeMatch) {
        score += 0.15;
        reasons.push("与学习路径相关");
      }
    }

    // 质量分数（评分和收藏数）
    const qualityScore = (resource.rating / 5) * 0.5 +
      Math.min(resource.bookmarkCount / 100, 1) * 0.3;
    score += qualityScore * 0.2;

    if (resource.rating >= 4) {
      reasons.push("高评分资源");
    }

    return {
      resource,
      score,
      reason: reasons.length > 0 ? reasons.join(" · ") : "为你推荐",
    };
  });

  return results
    .filter((r) => r.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ==================== 工具函数 ====================

function getTypeLabel(type: Resource["type"]): string {
  const labels: Record<Resource["type"], string> = {
    document: "文档",
    video: "视频",
    tool: "工具",
    website: "网站",
    book: "书籍",
  };
  return labels[type];
}
