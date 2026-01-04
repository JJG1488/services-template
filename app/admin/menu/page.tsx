"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Save,
  Loader2,
  Utensils,
  FileText,
  X,
} from "lucide-react";
import type { MenuCategory, MenuItem, MenuItemVariation, DietaryTag } from "@/types/menu";
import { formatMenuPrice, dietaryTagConfig } from "@/types/menu";

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<(MenuCategory & { items: MenuItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [showNewItemForm, setShowNewItemForm] = useState<string | null>(null);

  // Fetch menu data
  useEffect(() => {
    async function fetchMenu() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/menu/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const cats = await res.json();

          // Fetch items for each category
          const catsWithItems = await Promise.all(
            cats.map(async (cat: MenuCategory) => {
              const itemsRes = await fetch(
                `/api/admin/menu/items?category=${cat.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const items = itemsRes.ok ? await itemsRes.json() : [];
              return { ...cat, items };
            })
          );

          setCategories(catsWithItems);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleCreateCategory(name: string) {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/menu/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newCat = await res.json();
        setCategories((prev) => [...prev, { ...newCat, items: [] }]);
        setShowNewCategoryForm(false);
        setExpandedCategories((prev) => new Set(prev).add(newCat.id));
      }
    } catch (err) {
      console.error("Error creating category:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category and all its items?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`/api/admin/menu/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  }

  async function handleCreateItem(categoryId: string, item: Partial<MenuItem>) {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/menu/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item, category_id: categoryId }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? { ...cat, items: [...cat.items, newItem] }
              : cat
          )
        );
        setShowNewItemForm(null);
      }
    } catch (err) {
      console.error("Error creating item:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateItem(item: MenuItem) {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/menu/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        const updated = await res.json();
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((i) => (i.id === item.id ? { ...i, ...updated } : i)),
          }))
        );
        setEditingItem(null);
      }
    } catch (err) {
      console.error("Error updating item:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(itemId: string, categoryId: string) {
    if (!confirm("Delete this item?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`/api/admin/menu/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
            : cat
        )
      );
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Utensils className="w-7 h-7 text-brand" />
          <h1 className="text-2xl font-bold">Menu Builder</h1>
        </div>
        <button
          onClick={() => setShowNewCategoryForm(true)}
          className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New Category Form */}
      {showNewCategoryForm && (
        <NewCategoryForm
          onSubmit={handleCreateCategory}
          onCancel={() => setShowNewCategoryForm(false)}
          saving={saving}
        />
      )}

      {/* Categories List */}
      {categories.length === 0 && !showNewCategoryForm ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No menu categories yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding a category like &quot;Appetizers&quot; or &quot;Main Courses&quot;
          </p>
          <button
            onClick={() => setShowNewCategoryForm(true)}
            className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              expanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
              onDelete={() => handleDeleteCategory(category.id)}
              onAddItem={() => setShowNewItemForm(category.id)}
              onEditItem={setEditingItem}
              onDeleteItem={(itemId) => handleDeleteItem(itemId, category.id)}
              showNewItemForm={showNewItemForm === category.id}
              onCreateItem={(item) => handleCreateItem(category.id, item)}
              onCancelNewItem={() => setShowNewItemForm(null)}
              saving={saving}
            />
          ))}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <ItemEditModal
          item={editingItem}
          categories={categories}
          onSave={handleUpdateItem}
          onCancel={() => setEditingItem(null)}
          saving={saving}
        />
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function NewCategoryForm({
  onSubmit,
  onCancel,
  saving,
}: {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="font-semibold mb-4">New Category</h3>
      <div className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Appetizers, Main Courses, Desserts"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          autoFocus
        />
        <button
          onClick={() => name.trim() && onSubmit(name.trim())}
          disabled={!name.trim() || saving}
          className="px-4 py-2 bg-brand text-gray-900 font-semibold rounded-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  expanded,
  onToggle,
  onDelete,
  onAddItem,
  onEditItem,
  onDeleteItem,
  showNewItemForm,
  onCreateItem,
  onCancelNewItem,
  saving,
}: {
  category: MenuCategory & { items: MenuItem[] };
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  showNewItemForm: boolean;
  onCreateItem: (item: Partial<MenuItem>) => void;
  onCancelNewItem: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Category Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <GripVertical className="w-5 h-5 text-gray-300" />
          <h3 className="font-semibold text-lg">{category.name}</h3>
          <span className="text-sm text-gray-500">
            ({category.items.length} items)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Items List */}
      {expanded && (
        <div className="border-t border-gray-100">
          {category.items.length === 0 && !showNewItemForm ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="mb-3">No items in this category</p>
              <button
                onClick={onAddItem}
                className="text-brand hover:text-brand-dark font-medium"
              >
                + Add first item
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.dietary_tags && item.dietary_tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.dietary_tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                            >
                              {dietaryTagConfig[tag]?.label || tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      {formatMenuPrice(item.price)}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        item.is_available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-brand hover:text-brand-dark text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* New Item Form */}
              {showNewItemForm && (
                <NewItemForm
                  onSubmit={onCreateItem}
                  onCancel={onCancelNewItem}
                  saving={saving}
                />
              )}

              {/* Add Item Button */}
              {!showNewItemForm && (
                <div className="px-6 py-3">
                  <button
                    onClick={onAddItem}
                    className="flex items-center gap-2 text-brand hover:text-brand-dark font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewItemForm({
  onSubmit,
  onCancel,
  saving,
}: {
  onSubmit: (item: Partial<MenuItem>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="px-6 py-4 bg-gray-50">
      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          autoFocus
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (e.g., 12.99)"
          step="0.01"
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() =>
            name.trim() &&
            onSubmit({
              name: name.trim(),
              price: price ? Math.round(parseFloat(price) * 100) : undefined,
              description: description.trim() || undefined,
            })
          }
          disabled={!name.trim() || saving}
          className="px-4 py-2 bg-brand text-gray-900 font-semibold rounded-lg disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ItemEditModal({
  item,
  categories,
  onSave,
  onCancel,
  saving,
}: {
  item: MenuItem;
  categories: MenuCategory[];
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    ...item,
    price: item.price ? (item.price / 100).toString() : "",
    dietary_tags: item.dietary_tags || [],
  });

  const allDietaryTags: DietaryTag[] = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "spicy",
    "nut-free",
    "dairy-free",
  ];

  function toggleDietaryTag(tag: DietaryTag) {
    setFormData((prev) => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter((t) => t !== tag)
        : [...prev.dietary_tags, tag],
    }));
  }

  function handleSave() {
    onSave({
      ...formData,
      price: formData.price ? Math.round(parseFloat(formData.price) * 100) : undefined,
    } as MenuItem);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Edit Item</h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Leave empty for Market Price"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category_id || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allDietaryTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDietaryTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.dietary_tags.includes(tag)
                      ? "bg-brand text-gray-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {dietaryTagConfig[tag]?.label || tag}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_available: e.target.checked }))
                }
                className="w-4 h-4 text-brand rounded"
              />
              <span>Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
                }
                className="w-4 h-4 text-brand rounded"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-brand text-gray-900 font-semibold rounded-lg disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
