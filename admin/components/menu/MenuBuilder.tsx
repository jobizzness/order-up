"use client";

import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { CategoryModal } from "./CategoryModal";
import { MenuItemModal } from "./MenuItemModal";

interface Category {
  id: string;
  name: string;
  sortOrder: number;
}

interface MenuItem {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isPopular: boolean;
  allergens: string[];
}

interface MenuBuilderProps {
  tenantId: string;
}

export function MenuBuilder({ tenantId }: MenuBuilderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters / Search
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, itemsRes] = await Promise.all([
        fetch("/api/categories?all=true"),
        fetch("/api/menu?all=true"),
      ]);

      if (!catsRes.ok || !itemsRes.ok) {
        throw new Error("Failed to load menu data");
      }

      const catsData = await catsRes.json();
      const itemsData = await itemsRes.json();

      setCategories(catsData);
      setMenuItems(itemsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching the menu.");
    } finally {
      setLoading(false);
    }
  }

  // Category Save / Delete
  async function handleSaveCategory(name: string, sortOrder: number) {
    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories";
    const method = editingCategory ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sortOrder }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save category");
    }

    await loadData();
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (
      !confirm(
        `Are you sure you want to delete the category "${name}"? Any items inside this category will become Uncategorized.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete category");
      }

      await loadData();
      if (selectedCategoryId === id) {
        setSelectedCategoryId("all");
      }
    } catch (err: any) {
      alert(err.message || "Could not delete category");
    }
  }

  // Menu Item Save / Delete / Toggles
  async function handleSaveItem(data: Partial<MenuItem>) {
    const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";
    const method = editingItem ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save menu item");
    }

    await loadData();
  }

  async function handleDeleteItem(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      await loadData();
    } catch (err: any) {
      alert(err.message || "Could not delete item");
    }
  }

  async function toggleAvailability(item: MenuItem) {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });

      if (!res.ok) throw new Error("Failed to update availability");

      // Optimistic update
      setMenuItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update availability status");
    }
  }

  async function togglePopular(item: MenuItem) {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !item.isPopular }),
      });

      if (!res.ok) throw new Error("Failed to update popularity");

      // Optimistic update
      setMenuItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isPopular: !i.isPopular } : i
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not update popularity badge");
    }
  }

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategoryId === "all" ||
      (selectedCategoryId === "uncategorized" && !item.categoryId) ||
      item.categoryId === selectedCategoryId;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative w-full sm:max-w-md">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dish or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input text-foreground border border-transparent rounded-full pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-input rounded-full text-sm font-semibold hover:bg-muted transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsItemModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-[var(--color-brand-hover)] shadow-sm transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Navigation (Left Column) */}
        <div className="lg:col-span-1 bg-card rounded-2xl p-4 shadow-sm border border-border space-y-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Categories
          </h3>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategoryId === "all"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>All Items</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {menuItems.length}
              </span>
            </button>

            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className={`group flex items-center justify-between rounded-xl transition-all ${
                    selectedCategoryId === cat.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <button
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className="flex-1 text-left px-3 py-2 text-sm font-medium"
                  >
                    {cat.name}
                  </button>

                  <div className="flex items-center gap-1 pr-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground group-hover:hidden">
                      {count}
                    </span>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                      className="hidden group-hover:inline-block p-1 rounded-md hover:bg-black/5 text-muted-foreground hover:text-foreground transition-all"
                      title="Edit Category"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="hidden group-hover:inline-block p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      title="Delete Category"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setSelectedCategoryId("uncategorized")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategoryId === "uncategorized"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>Uncategorized</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {menuItems.filter((i) => !i.categoryId).length}
              </span>
            </button>
          </div>
        </div>

        {/* Menu Items Grid (Right Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedCategoryId === "all"
                ? "All Menu Items"
                : selectedCategoryId === "uncategorized"
                ? "Uncategorized Items"
                : categories.find((c) => c.id === selectedCategoryId)?.name ||
                  "Menu Items"}
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              Showing {filteredItems.length} of {menuItems.length} items
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl shadow-sm">
              <span className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="mt-3 text-sm text-muted-foreground">Loading menu items...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl">
              {error}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl shadow-sm text-center px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <TagIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">No menu items found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {searchQuery
                  ? "We couldn't find any dishes matching your search query."
                  : "Get started by adding items to your menu."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`group relative flex gap-4 bg-card p-4 rounded-2xl shadow-sm border transition-all ${
                    item.isAvailable
                      ? "border-border hover:shadow-md"
                      : "border-border/50 bg-card/60 opacity-80"
                  }`}
                >
                  {/* Popular Indicator */}
                  {item.isPopular && (
                    <div className="absolute top-2.5 right-2.5 z-10 bg-amber-500 text-white rounded-full p-1 shadow-sm" title="Popular dish">
                      <StarSolidIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <TagIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-foreground truncate" title={item.name}>
                          {item.name}
                        </h4>
                        <span className="text-sm font-extrabold text-primary shrink-0">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Row (Allergens & Actions) */}
                    <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-border/50">
                      {/* Allergens */}
                      <div className="flex flex-wrap gap-1 overflow-hidden max-h-5">
                        {item.allergens && item.allergens.length > 0 ? (
                          item.allergens.slice(0, 3).map((all) => (
                            <span
                              key={all}
                              className="text-[9px] font-semibold bg-muted text-muted-foreground px-1.5 py-0.5 rounded"
                            >
                              {all}
                            </span>
                          ))
                        ) : (
                          <span className="text-[9px] text-muted-foreground/60 italic">
                            No allergens
                          </span>
                        )}
                        {item.allergens && item.allergens.length > 3 && (
                          <span className="text-[9px] text-muted-foreground/80 font-bold">
                            +{item.allergens.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        {/* Toggle Popular */}
                        <button
                          onClick={() => togglePopular(item)}
                          className={`p-1.5 rounded-lg transition-all ${
                            item.isPopular
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                          title={item.isPopular ? "Remove popular badge" : "Mark as popular"}
                        >
                          <StarIcon className="w-4 h-4" />
                        </button>

                        {/* Toggle Availability */}
                        <button
                          onClick={() => toggleAvailability(item)}
                          className={`p-1.5 rounded-lg transition-all ${
                            item.isAvailable
                              ? "text-primary hover:bg-primary/10"
                              : "text-destructive hover:bg-destructive/10"
                          }`}
                          title={item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                        >
                          {item.isAvailable ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeSlashIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Edit Item */}
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsItemModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                          title="Edit Item"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>

                        {/* Delete Item */}
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                          title="Delete Item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        categories={categories}
        menuItem={editingItem}
        tenantId={tenantId}
      />
    </div>
  );
}
