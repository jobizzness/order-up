import { useState, useEffect } from "react";
import { Category, MenuItem } from "@/types";

export function useMenuData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, itemsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/menu"),
      ]);

      if (!catsRes.ok || !itemsRes.ok) {
        throw new Error("Failed to load menu data");
      }

      const catsData = await catsRes.json();
      const itemsData = await itemsRes.json();

      setCategories(catsData);
      setItems(itemsData);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return { categories, items, loading, error };
}
