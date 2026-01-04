"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Calendar,
} from "lucide-react";
import { MultiImageUpload, type PortfolioImage } from "@/components/MultiImageUpload";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { portfolioCategories, type PortfolioItem } from "@/types/portfolio";
import type { Service } from "@/data/services";

interface FormData {
  title: string;
  description: string;
  client_name: string;
  service_id: string;
  category: string;
  images: PortfolioImage[];
  before_image_url: string;
  after_image_url: string;
  external_url: string;
  project_date: string;
  results: string;
  tags: string;
  is_featured: boolean;
  is_active: boolean;
  testimonial_quote: string;
  testimonial_author: string;
  testimonial_role: string;
  testimonial_rating: number;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  client_name: "",
  service_id: "",
  category: "",
  images: [],
  before_image_url: "",
  after_image_url: "",
  external_url: "",
  project_date: "",
  results: "",
  tags: "",
  is_featured: false,
  is_active: true,
  testimonial_quote: "",
  testimonial_author: "",
  testimonial_role: "",
  testimonial_rating: 5,
};

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [previewBefore, setPreviewBefore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem("admin_token");
      const [portfolioRes, servicesRes] = await Promise.all([
        fetch("/api/admin/portfolio", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/services", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (portfolioRes.ok) {
        const data = await portfolioRes.json();
        setItems(data);
      }

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormData(initialFormData);
    setModalOpen(true);
  }

  function openEditModal(item: PortfolioItem) {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      client_name: item.client_name || "",
      service_id: item.service_id || "",
      category: item.category || "",
      images: item.images || [],
      before_image_url: item.before_image_url || "",
      after_image_url: item.after_image_url || "",
      external_url: item.external_url || "",
      project_date: item.project_date ? item.project_date.split("T")[0] : "",
      results: item.results || "",
      tags: (item.tags || []).join(", "),
      is_featured: item.is_featured || false,
      is_active: item.is_active !== false,
      testimonial_quote: item.testimonial?.quote || "",
      testimonial_author: item.testimonial?.author || "",
      testimonial_role: item.testimonial?.role || "",
      testimonial_rating: item.testimonial?.rating || 5,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");

      // Build testimonial object if quote is provided
      const testimonial =
        formData.testimonial_quote.trim()
          ? {
              quote: formData.testimonial_quote,
              author: formData.testimonial_author || "Anonymous",
              role: formData.testimonial_role || undefined,
              rating: formData.testimonial_rating || undefined,
            }
          : null;

      const body = {
        title: formData.title,
        description: formData.description || null,
        client_name: formData.client_name || null,
        service_id: formData.service_id || null,
        category: formData.category || null,
        images: formData.images,
        before_image_url: formData.before_image_url || null,
        after_image_url: formData.after_image_url || null,
        external_url: formData.external_url || null,
        project_date: formData.project_date || null,
        results: formData.results || null,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        testimonial,
      };

      const url = editingItem
        ? `/api/admin/portfolio/${editingItem.id}`
        : "/api/admin/portfolio";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error saving portfolio item:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  }

  async function toggleActive(item: PortfolioItem) {
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`/api/admin/portfolio/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      fetchData();
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  }

  async function toggleFeatured(item: PortfolioItem) {
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`/api/admin/portfolio/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_featured: !item.is_featured }),
      });
      fetchData();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-gray-500 mt-1">
            Showcase your work with project galleries and before/after comparisons
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No portfolio items yet</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-100 relative">
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : item.before_image_url && item.after_image_url ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                    Before/After Available
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {item.is_featured && (
                    <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {!item.is_active && (
                    <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                {item.client_name && (
                  <p className="text-sm text-gray-500">Client: {item.client_name}</p>
                )}
                {item.service_name && (
                  <p className="text-sm text-gray-500">{item.service_name}</p>
                )}
                {item.category && (
                  <p className="text-xs text-gray-400 mt-1 capitalize">{item.category}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleFeatured(item)}
                    className={`p-2 rounded-lg ${
                      item.is_featured
                        ? "text-yellow-600 bg-yellow-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={item.is_featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className={`p-2 rounded-lg ${
                      item.is_active
                        ? "text-green-600 bg-green-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={item.is_active ? "Hide from portfolio" : "Show on portfolio"}
                  >
                    {item.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {item.external_url && (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                      title="View external link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold">
                {editingItem ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Kitchen Renovation for Smith Family"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({ ...formData, client_name: e.target.value })
                      }
                      placeholder="e.g., John Smith"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Date
                    </label>
                    <input
                      type="date"
                      value={formData.project_date}
                      onChange={(e) =>
                        setFormData({ ...formData, project_date: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Related Service
                    </label>
                    <select
                      value={formData.service_id}
                      onChange={(e) =>
                        setFormData({ ...formData, service_id: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="">None</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="">None</option>
                      {portfolioCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Describe the project, challenges, and solutions..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Results / Outcomes
                  </label>
                  <textarea
                    value={formData.results}
                    onChange={(e) =>
                      setFormData({ ...formData, results: e.target.value })
                    }
                    rows={2}
                    placeholder="e.g., Increased home value by 15%, Completed 2 weeks ahead of schedule..."
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., renovation, residential, kitchen"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Project Images
                </h3>

                <MultiImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={10}
                  label="Gallery Images"
                />
              </div>

              {/* Before/After */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Before & After (Optional)
                </h3>
                <p className="text-sm text-gray-500">
                  Add before and after images for an interactive comparison slider
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Before Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.before_image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, before_image_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      After Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.after_image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, after_image_url: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>

                {formData.before_image_url && formData.after_image_url && (
                  <div className="mt-4">
                    <button
                      onClick={() => setPreviewBefore(!previewBefore)}
                      className="text-sm text-brand hover:underline mb-2"
                    >
                      {previewBefore ? "Hide Preview" : "Show Preview"}
                    </button>
                    {previewBefore && (
                      <BeforeAfterSlider
                        beforeImage={formData.before_image_url}
                        afterImage={formData.after_image_url}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* External Link */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  External Link (Optional)
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Live Demo / Project URL
                  </label>
                  <input
                    type="url"
                    value={formData.external_url}
                    onChange={(e) =>
                      setFormData({ ...formData, external_url: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Client Testimonial (Optional)
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote
                  </label>
                  <textarea
                    value={formData.testimonial_quote}
                    onChange={(e) =>
                      setFormData({ ...formData, testimonial_quote: e.target.value })
                    }
                    rows={2}
                    placeholder="What did the client say about the project?"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                {formData.testimonial_quote && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={formData.testimonial_author}
                        onChange={(e) =>
                          setFormData({ ...formData, testimonial_author: e.target.value })
                        }
                        placeholder="Client name"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role/Title
                      </label>
                      <input
                        type="text"
                        value={formData.testimonial_role}
                        onChange={(e) =>
                          setFormData({ ...formData, testimonial_role: e.target.value })
                        }
                        placeholder="e.g., Homeowner"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <select
                        value={formData.testimonial_rating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            testimonial_rating: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Visibility
                </h3>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-700">Show on portfolio page</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-700">Featured project</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title.trim()}
                className="px-6 py-2 bg-brand text-gray-900 font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : editingItem ? "Update Project" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
