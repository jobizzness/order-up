"use client";

import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase-browser";

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number | any;
  imageUrl: string | null;
  isAvailable: boolean;
  isPopular: boolean;
  allergens: string[];
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MenuItem>) => Promise<void>;
  categories: Category[];
  menuItem?: MenuItem | null;
  tenantId: string;
}

export function MenuItemModal({
  isOpen,
  onClose,
  onSave,
  categories,
  menuItem,
  tenantId,
}: MenuItemModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [allergensText, setAllergensText] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name);
      setPrice(menuItem.price ? menuItem.price.toString() : "");
      setCategoryId(menuItem.categoryId || "");
      setDescription(menuItem.description || "");
      setImageUrl(menuItem.imageUrl || "");
      setIsAvailable(menuItem.isAvailable);
      setIsPopular(menuItem.isPopular);
      setAllergensText(menuItem.allergens ? menuItem.allergens.join(", ") : "");
    } else {
      setName("");
      setPrice("");
      setCategoryId(categories[0]?.id || "");
      setDescription("");
      setImageUrl("");
      setIsAvailable(true);
      setIsPopular(false);
      setAllergensText("");
    }
    setError(null);
  }, [menuItem, isOpen, categories]);

  if (!isOpen) return null;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `tenants/${tenantId}/menus/${fileName}`;

      // Upload file to the 'menus' bucket
      const { error: uploadError } = await supabase.storage
        .from("menus")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        // Bucket might not exist, let's try creating it
        console.log("Bucket might not exist, attempting to create 'menus' bucket...");
        const { error: bucketError } = await supabase.storage.createBucket("menus", {
          public: true,
          allowedMimeTypes: ["image/*"],
        });

        if (bucketError && !bucketError.message.includes("already exists")) {
          throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
        }

        // Retry the file upload
        const retryResult = await supabase.storage
          .from("menus")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (retryResult.error) {
          throw retryResult.error;
        }
      }

      // Get public Url
      const { data: { publicUrl } } = supabase.storage
        .from("menus")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Item name is required");
      return;
    }
    const itemPrice = parseFloat(price);
    if (isNaN(itemPrice) || itemPrice < 0) {
      setError("Please enter a valid price");
      return;
    }

    setSaving(true);
    setError(null);

    const allergens = allergensText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      await onSave({
        name: name.trim(),
        price: itemPrice,
        categoryId: categoryId || null,
        description: description.trim() || null,
        imageUrl: imageUrl || null,
        isAvailable,
        isPopular,
        allergens,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-xl border border-border my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {menuItem ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Upload Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Item Picture
            </label>
            <div className="flex gap-4 items-center">
              <div className="relative w-24 h-24 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <PhotoIcon className="w-8 h-8 text-muted-foreground" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 border border-input rounded-xl text-sm font-medium hover:bg-muted hover:text-foreground transition-all disabled:opacity-50"
                >
                  {imageUrl ? "Change Picture" : "Upload Picture"}
                </button>
                <p className="text-[10px] text-muted-foreground">
                  Recommended size: 500x500px. PNG, JPG, or WEBP.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Name & Price */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="item-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Item Name *
              </label>
              <input
                id="item-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Avocado Toast"
                className="w-full bg-input text-foreground border border-transparent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="item-price" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Price ($) *
              </label>
              <input
                id="item-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
                className="w-full bg-input text-foreground border border-transparent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label htmlFor="item-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Category
            </label>
            <select
              id="item-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-input text-foreground border border-transparent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="item-desc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Description
            </label>
            <textarea
              id="item-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the taste, ingredients, portion size..."
              className="w-full bg-input text-foreground border border-transparent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>

          {/* Allergens */}
          <div className="space-y-1.5">
            <label htmlFor="item-allergens" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Allergens (comma separated)
            </label>
            <input
              id="item-allergens"
              type="text"
              value={allergensText}
              onChange={(e) => setAllergensText(e.target.value)}
              placeholder="e.g. Gluten, Nuts, Dairy"
              className="w-full bg-input text-foreground border border-transparent rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-primary bg-input border-transparent rounded focus:ring-primary cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground block">Available</span>
                <span className="text-[10px] text-muted-foreground block">Show item on client menu</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 text-primary bg-input border-transparent rounded focus:ring-primary cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground block">Popular Item</span>
                <span className="text-[10px] text-muted-foreground block">Highlights item with a badge</span>
              </div>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium text-muted-foreground border border-input rounded-xl hover:bg-muted hover:text-foreground transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-[var(--color-brand-hover)] py-2.5 text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Menu Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
