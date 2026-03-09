"use client";

import { ResourceCard } from "./resource-card";
import type { Resource } from "@/lib/resources/resource-types";
import { FileQuestion } from "lucide-react";

interface ResourceListProps {
  resources: Resource[];
  onRefresh?: () => void;
}

export function ResourceList({ resources, onRefresh }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileQuestion className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">暂无资源</h3>
        <p className="text-sm text-muted-foreground">
          添加你的第一个学习资源，开始构建知识库
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onDelete={onRefresh}
          onEdit={onRefresh}
          onBookmark={onRefresh}
        />
      ))}
    </div>
  );
}
