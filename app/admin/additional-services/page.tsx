"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, ChevronUp, ChevronDown, Sparkles, Eye, EyeOff } from "lucide-react";
import type { AdditionalService } from "@/lib/settings";

/**
 * Additional Services Admin Management Page
 *
 * Allows admins to manage "quick" additional services that appear on the homepage.
 * These are separate from the main Services (database-driven).
 *
 * Additional Services are stored in store_settings JSONB as part of RuntimeSettings.
 * They display as simple cards with emoji icons on the homepage.
 *
 * Use Case: Quick service highlights that don't need full service pages.
 *
 * Design Pattern:
 * - Uses settings API for persistence (not a separate table)
 * - Modal-based editing for add/edit operations
 * - Similar pattern to FAQ admin page
 *
 * Performance: O(n) for operations where n = number of additional service items
 */

// Common emoji suggestions for quick selection
const EMOJI_SUGGESTIONS = [
  "🔧", "🛠️", "🔨", "⚡", "🚿", "🏠", "🪟", "🚪",
  "🧹", "🧽", "🪣", "💡", "🔌", "🌡️", "❄️", "🔥",
  "🚗", "🚚", "📦", "🎨", "🪴", "🌳", "✂️", "📐",
  "🧱", "🪵", "🔩", "📱", "💻", "📷", "🎯", "✨"
];

interface FormData {
  title: string;
  description: string;
  icon: string;
}

const emptyFormData: FormData = {
  title: "",
  description: "",
  icon: "🔧",
};

export default function AdditionalServicesAdminPage() {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [sectionTitle, setSectionTitle] = useState("Additional Services");
  const [showSection, setShowSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);

  // Load services from settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setServices(data.settings.additionalServices || []);
            setSectionTitle(data.settings.additionalServicesTitle || "Additional Services");
            setShowSection(data.settings.showAdditionalServices ?? false);
          }
        } else {
          setError("Failed to load settings");
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Save services to settings
  async function saveSettings(
    updatedServices: AdditionalService[],
    title?: string,
    show?: boolean
  ) {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("admin_token");

      // First get current settings
      const getRes = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!getRes.ok) {
        throw new Error("Failed to fetch current settings");
      }

      const currentData = await getRes.json();
      const currentSettings = currentData.settings || {};

      // Merge with updates
      const updatedSettings = {
        ...currentSettings,
        additionalServices: updatedServices,
        additionalServicesTitle: title ?? sectionTitle,
        showAdditionalServices: show ?? showSection,
      };

      // Save back to settings
      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save settings");
      }

      setServices(updatedServices);
      if (title !== undefined) setSectionTitle(title);
      if (show !== undefined) setShowSection(show);
      setSuccess("Changes saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Open modal for adding new service
  function handleAddNew() {
    setFormData(emptyFormData);
    setEditingIndex(null);
    setModalOpen(true);
  }

  // Open modal for editing existing service
  function handleEdit(index: number) {
    const service = services[index];
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
    setEditingIndex(index);
    setModalOpen(true);
  }

  // Save service from modal
  async function handleSaveItem() {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required");
      return;
    }

    let updatedServices: AdditionalService[];

    if (editingIndex !== null) {
      // Update existing
      updatedServices = services.map((service, i) =>
        i === editingIndex ? { ...formData } : service
      );
    } else {
      // Add new
      updatedServices = [...services, { ...formData }];
    }

    await saveSettings(updatedServices);
    setModalOpen(false);
    setFormData(emptyFormData);
    setEditingIndex(null);
  }

  // Delete service
  async function handleDelete(index: number) {
    if (!confirm("Are you sure you want to delete this additional service?")) return;

    const updatedServices = services.filter((_, i) => i !== index);
    await saveSettings(updatedServices);
  }

  // Move service up in order
  async function handleMoveUp(index: number) {
    if (index === 0) return;

    const updatedServices = [...services];
    [updatedServices[index - 1], updatedServices[index]] = [updatedServices[index], updatedServices[index - 1]];
    await saveSettings(updatedServices);
  }

  // Move service down in order
  async function handleMoveDown(index: number) {
    if (index === services.length - 1) return;

    const updatedServices = [...services];
    [updatedServices[index], updatedServices[index + 1]] = [updatedServices[index + 1], updatedServices[index]];
    await saveSettings(updatedServices);
  }

  // Save section settings (title and visibility)
  async function handleSaveSection() {
    await saveSettings(services, sectionTitle, showSection);
  }

  // Toggle section visibility
  async function handleToggleVisibility() {
    const newVisibility = !showSection;
    setShowSection(newVisibility);
    await saveSettings(services, sectionTitle, newVisibility);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/services"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Additional Services</h1>
              <p className="text-gray-500 text-sm">Quick service highlights shown on the homepage</p>
            </div>
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Section Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Section Settings</h2>
          <button
            onClick={handleToggleVisibility}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
              showSection
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}
          >
            {showSection ? (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="text-sm font-medium">Hidden</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Additional Services"
            />
          </div>
          <button
            onClick={handleSaveSection}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {!showSection && services.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              This section is currently hidden on your website. Toggle visibility above to show it.
            </p>
          </div>
        )}
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Services ({services.length})</h2>
        </div>

        {services.length === 0 ? (
          <div className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No additional services yet</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {services.map((service, index) => (
              <div key={index} className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Reorder Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0 || saving}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === services.length - 1 || saving}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {service.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{service.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    disabled={saving}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-1">About Additional Services</h3>
        <p className="text-sm text-blue-700">
          Additional Services are quick highlights that appear on your homepage. They&apos;re perfect for
          showcasing extra offerings without creating full service pages. Use emojis as icons for a
          friendly, approachable look.
        </p>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingIndex !== null ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setFormData(emptyFormData);
                  setEditingIndex(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Icon Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                    {formData.icon}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                    placeholder="Enter emoji or icon"
                    maxLength={4}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_SUGGESTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      className={`w-10 h-10 text-xl rounded-lg hover:bg-gray-100 transition-colors ${
                        formData.icon === emoji ? "bg-brand/20 ring-2 ring-brand" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="e.g., Emergency Repairs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                  placeholder="Brief description of the service..."
                />
              </div>

              {/* Preview */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                <div className="bg-white rounded-xl shadow-md p-4 text-center border-t-4 border-brand">
                  <div className="text-4xl mb-2">{formData.icon || "🔧"}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {formData.title || "Service Title"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formData.description || "Service description goes here."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setFormData(emptyFormData);
                  setEditingIndex(null);
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={saving || !formData.title.trim() || !formData.description.trim()}
                className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : editingIndex !== null ? "Update Service" : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
