"use client";

import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { Category } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { CategoryModal } from "@/components/menu/CategoryModal";

interface CategoriesManagerProps {
  tenantId: string;
}

export function CategoriesManager({ tenantId }: CategoriesManagerProps) {
  const { categories, loading, error, saveCategory, deleteCategory } =
    useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  function handleSaveCategory(name: string, sortOrder: number) {
    return saveCategory(name, sortOrder, editingCategory?.id);
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-full hover:bg-[var(--color-brand-hover)] shadow-sm transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-card border border-border rounded-2xl shadow-sm">
          <span className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl shadow-sm text-center px-4">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bars3Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No categories yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Add your first category to start organizing your menu.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sort Order
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Items
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={`transition-colors hover:bg-muted/40 ${idx < categories.length - 1 ? "border-b border-border/60" : ""
                    }`}
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {cat.name}
                  </td>
                  <td className="px-5 py-3.5 text-center text-muted-foreground">
                    {cat.sortOrder}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                      {cat.items.length}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
}
