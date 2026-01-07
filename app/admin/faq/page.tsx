"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, GripVertical, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { FAQItem } from "@/lib/settings";

/**
 * FAQ Admin Management Page
 *
 * Allows admins to manage FAQ items that appear on the public /faq page.
 * FAQs are stored in store_settings JSONB as part of RuntimeSettings.
 *
 * Design Pattern:
 * - Uses settings API for persistence (not a separate table)
 * - Inline editing with modal for add/edit operations
 * - Drag-and-drop reordering support (future enhancement)
 *
 * Performance: O(n) for operations where n = number of FAQ items
 */

interface FAQFormData {
  id: string;
  question: string;
  answer: string;
}

const emptyFormData: FAQFormData = {
  id: "",
  question: "",
  answer: "",
};

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqTitle, setFaqTitle] = useState("Frequently Asked Questions");
  const [faqSubtitle, setFaqSubtitle] = useState("Find answers to common questions about our services.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FAQFormData>(emptyFormData);

  // Expanded state for accordion preview
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Load FAQs from settings
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
            setFaqs(data.settings.faqs || []);
            setFaqTitle(data.settings.faqTitle || "Frequently Asked Questions");
            setFaqSubtitle(data.settings.faqSubtitle || "Find answers to common questions about our services.");
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

  // Save FAQs to settings
  async function saveSettings(updatedFaqs: FAQItem[], title?: string, subtitle?: string) {
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

      // Merge with FAQ updates
      const updatedSettings = {
        ...currentSettings,
        faqs: updatedFaqs,
        faqTitle: title ?? faqTitle,
        faqSubtitle: subtitle ?? faqSubtitle,
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

      setFaqs(updatedFaqs);
      if (title) setFaqTitle(title);
      if (subtitle) setFaqSubtitle(subtitle);
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

  // Open modal for adding new FAQ
  function handleAddNew() {
    setFormData({
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
    });
    setEditingIndex(null);
    setModalOpen(true);
  }

  // Open modal for editing existing FAQ
  function handleEdit(index: number) {
    const faq = faqs[index];
    setFormData({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    });
    setEditingIndex(index);
    setModalOpen(true);
  }

  // Save FAQ from modal
  async function handleSaveItem() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Question and answer are required");
      return;
    }

    let updatedFaqs: FAQItem[];

    if (editingIndex !== null) {
      // Update existing
      updatedFaqs = faqs.map((faq, i) =>
        i === editingIndex ? { ...formData } : faq
      );
    } else {
      // Add new
      updatedFaqs = [...faqs, { ...formData }];
    }

    await saveSettings(updatedFaqs);
    setModalOpen(false);
    setFormData(emptyFormData);
    setEditingIndex(null);
  }

  // Delete FAQ
  async function handleDelete(index: number) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    const updatedFaqs = faqs.filter((_, i) => i !== index);
    await saveSettings(updatedFaqs);
  }

  // Move FAQ up in order
  async function handleMoveUp(index: number) {
    if (index === 0) return;

    const updatedFaqs = [...faqs];
    [updatedFaqs[index - 1], updatedFaqs[index]] = [updatedFaqs[index], updatedFaqs[index - 1]];
    await saveSettings(updatedFaqs);
  }

  // Move FAQ down in order
  async function handleMoveDown(index: number) {
    if (index === faqs.length - 1) return;

    const updatedFaqs = [...faqs];
    [updatedFaqs[index], updatedFaqs[index + 1]] = [updatedFaqs[index + 1], updatedFaqs[index]];
    await saveSettings(updatedFaqs);
  }

  // Save section title/subtitle
  async function handleSaveHeader() {
    await saveSettings(faqs, faqTitle, faqSubtitle);
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
          href="/admin/settings"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage FAQs</h1>
              <p className="text-gray-500 text-sm">Add, edit, and organize frequently asked questions</p>
            </div>
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add FAQ
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

      {/* Section Header Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Section Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={faqTitle}
              onChange={(e) => setFaqTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Frequently Asked Questions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={faqSubtitle}
              onChange={(e) => setFaqSubtitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="Find answers to common questions..."
            />
          </div>
          <button
            onClick={handleSaveHeader}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Header"}
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">FAQ Items ({faqs.length})</h2>
        </div>

        {faqs.length === 0 ? (
          <div className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No FAQs yet</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First FAQ
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="group">
                <div className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  {/* Reorder Controls */}
                  <div className="flex flex-col gap-1 pt-1">
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
                      disabled={index === faqs.length - 1 || saving}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* FAQ Content */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          Q{index + 1}
                        </span>
                        <p className="font-medium text-gray-900 line-clamp-1">{faq.question}</p>
                        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedIndex === index ? "rotate-180" : ""}`} />
                      </div>
                    </button>

                    {/* Expanded Answer */}
                    {expandedIndex === index && (
                      <div className="mt-3 pl-8 pb-2">
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{faq.answer}</p>
                      </div>
                    )}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingIndex !== null ? "Edit FAQ" : "Add New FAQ"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="What is your question?"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                  placeholder="Provide a detailed answer..."
                />
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
                disabled={saving || !formData.question.trim() || !formData.answer.trim()}
                className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : editingIndex !== null ? "Update FAQ" : "Add FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
