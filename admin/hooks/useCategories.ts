import { useState, useEffect } from "react";
import { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories?all=true");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(
    name: string,
    sortOrder: number,
    editingId?: string
  ) {
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sortOrder }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save category");
    }

    await load();
  }

  async function deleteCategory(id: string, name: string) {
    if (
      !confirm(
        `Delete category "${name}"? Any items inside will become Uncategorized.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      await load();
    } catch (err: any) {
      alert(err.message || "Could not delete category");
    }
  }

  return { categories, loading, error, saveCategory, deleteCategory };
}
