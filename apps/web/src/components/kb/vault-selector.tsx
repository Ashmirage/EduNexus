"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Plus, Trash2, Check, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getKBStorage, type KBVault } from "@/lib/client/kb-storage";

type VaultSelectorProps = {
  currentVaultId: string | null;
  onVaultChange: (vaultId: string) => void;
};

export function VaultSelector({ currentVaultId, onVaultChange }: VaultSelectorProps) {
  const [vaults, setVaults] = useState<KBVault[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newVaultName, setNewVaultName] = useState("");
  const [newVaultPath, setNewVaultPath] = useState("");

  const storage = getKBStorage();

  // 加载知识库列表
  useEffect(() => {
    loadVaults();
  }, []);

  const loadVaults = async () => {
    try {
      const allVaults = await storage.getAllVaults();
      setVaults(allVaults);

      // 如果没有当前知识库且有可用知识库，自动选择第一个
      if (!currentVaultId && allVaults.length > 0) {
        onVaultChange(allVaults[0].id);
      }
    } catch (error) {
      console.error("Failed to load vaults:", error);
    }
  };

  const handleCreateVault = async () => {
    if (!newVaultName.trim()) return;

    try {
      const vault = await storage.createVault(
        newVaultName.trim(),
        newVaultPath.trim() || `~/Documents/EduNexus/${newVaultName.trim()}`
      );

      setVaults((prev) => [...prev, vault]);
      onVaultChange(vault.id);
      setIsCreating(false);
      setNewVaultName("");
      setNewVaultPath("");
    } catch (error) {
      console.error("Failed to create vault:", error);
    }
  };

  const handleDeleteVault = async (vaultId: string) => {
    if (!confirm("确定要删除这个知识库吗？所有文档将被删除。")) return;

    try {
      await storage.deleteVault(vaultId);
      setVaults((prev) => prev.filter((v) => v.id !== vaultId));

      if (currentVaultId === vaultId) {
        const remaining = vaults.filter((v) => v.id !== vaultId);
        onVaultChange(remaining.length > 0 ? remaining[0].id : "");
      }
    } catch (error) {
      console.error("Failed to delete vault:", error);
    }
  };

  const handleSelectVault = (vaultId: string) => {
    onVaultChange(vaultId);
    storage.setCurrentVault(vaultId);
    setIsOpen(false);
  };

  const currentVault = vaults.find((v) => v.id === currentVaultId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-amber-300 hover:bg-amber-50 justify-start"
        >
          <Database className="w-4 h-4 mr-2" />
          <span className="truncate">
            {currentVault ? currentVault.name : "选择知识库"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>知识库管理</DialogTitle>
          <DialogDescription>
            选择或创建一个知识库来存储你的文档
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 知识库列表 */}
          <div className="space-y-2">
            {vaults.map((vault) => (
              <div
                key={vault.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  currentVaultId === vault.id
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                }`}
                onClick={() => handleSelectVault(vault.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FolderOpen className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {vault.name}
                      </span>
                      {currentVaultId === vault.id && (
                        <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{vault.path}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVault(vault.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {vaults.length === 0 && !isCreating && (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>还没有知识库，创建一个开始吧</p>
              </div>
            )}
          </div>

          {/* 创建新知识库表单 */}
          {isCreating && (
            <div className="space-y-3 p-4 border border-amber-200 rounded-lg bg-amber-50/50">
              <div>
                <Label htmlFor="vault-name">知识库名称</Label>
                <Input
                  id="vault-name"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  placeholder="例如：我的笔记"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vault-path">存储路径（可选）</Label>
                <Input
                  id="vault-path"
                  value={newVaultPath}
                  onChange={(e) => setNewVaultPath(e.target.value)}
                  placeholder="默认：~/Documents/EduNexus/知识库名称"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleCreateVault}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  创建
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewVaultName("");
                    setNewVaultPath("");
                  }}
                >
                  取消
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              新建知识库
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
