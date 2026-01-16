"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Save, Plus, X, GripVertical, Star, Lock, Check, Sparkles, ExternalLink, ChevronDown, ChevronUp, Upload, Loader2, Image as ImageIcon, Type } from "lucide-react";
import { allThemes } from "@/lib/themes";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { BusinessTypeSelector } from "@/components/BusinessTypeSelector";
import type {
  ProcessStep,
  StatItem,
  TrustBadge,
  SpecialtyItem,
  CommitmentBadge,
  Testimonial,
} from "@/lib/settings";
import {
  type BusinessType,
  type EnabledFeatures,
  getFeatureDefaults,
  getContentPreset,
} from "@/lib/business-types";

interface Settings {
  // Business Type System (Enhanced v9.37)
  businessType: BusinessType;
  enabledFeatures: EnabledFeatures;
  featuresModified?: boolean;

  // Logo & Branding
  logoUrl?: string;
  useTextLogo: boolean;

  // General
  tagline: string;
  aboutText: string;
  businessHours: string;
  serviceAreas: string[];

  // Contact
  contactMode: string;
  calendlyUrl: string;
  phoneNumber: string;

  // Booking
  bookingUrl: string;
  bookingDisplayMode: string;
  bookingButtonText: string;
  bookingDescription: string;
  showBookingOnHero: boolean;
  showBookingOnServicePages: boolean;
  showBookingPage: boolean;

  // Section toggles
  showProcess: boolean;
  showStats: boolean;
  showTeam: boolean;
  showTestimonials: boolean;
  showFaq: boolean;
  showWhyChooseUs: boolean;
  showSpecialties: boolean;
  showBadges: boolean;
  showMapEmbed: boolean;

  // Process
  process: ProcessStep[];
  processTitle: string;
  processSubtitle: string;
  processCTAText: string;

  // Stats
  stats: StatItem[];

  // Appearance
  brandColor: string;

  // Hero
  themePreset: string;
  heroStyle: string;
  heroImageUrl: string;
  heroVideoUrl: string;
  heroBadgeText: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroSubheading: string;
  trustBadges: TrustBadge[];
  heroCTAText: string;
  heroSecondaryCTAText: string;

  // Why Choose Us
  whyChooseUsTitle: string;
  whyChooseUsHeading: string;
  whyChooseUsText: string;
  emergencyBannerText: string;
  emergencyBannerEnabled: boolean;

  // Specialties
  specialtiesTitle: string;
  specialties: SpecialtyItem[];

  // Badges
  badgesTitle: string;
  badgesSubtitle: string;
  badges: CommitmentBadge[];

  // Testimonials
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  overallRating: number;
  reviewCount: number;
  googleReviewsUrl: string;
  testimonials: Testimonial[];

  // Footer
  mapEmbedUrl: string;
  mapTitle: string;
  address: string;
}

const defaultSettings: Settings = {
  businessType: "custom",
  enabledFeatures: getFeatureDefaults("custom"),
  featuresModified: false,
  logoUrl: undefined,
  useTextLogo: true,
  tagline: "",
  aboutText: "",
  businessHours: "Mon-Fri 9am-5pm",
  serviceAreas: [],
  contactMode: "form",
  calendlyUrl: "",
  phoneNumber: "",
  bookingUrl: "",
  bookingDisplayMode: "embed",
  bookingButtonText: "Book Now",
  bookingDescription: "Schedule your appointment online",
  showBookingOnHero: false,
  showBookingOnServicePages: false,
  showBookingPage: true,
  showProcess: true,
  showStats: true,
  showTeam: false,
  showTestimonials: true,
  showFaq: true,
  showWhyChooseUs: true,
  showSpecialties: false,
  showBadges: true,
  showMapEmbed: false,
  process: [
    { step: 1, title: "Get a Free Estimate", description: "Contact us for a no-obligation quote", icon: "clipboard" },
    { step: 2, title: "We Recommend Options", description: "Our experts suggest the best solutions", icon: "message-square" },
    { step: 3, title: "We Get It Done", description: "Professional service delivered on time", icon: "check-circle" },
  ],
  processTitle: "Our Simple Process",
  processSubtitle: "From consultation to completion, we make it easy",
  processCTAText: "Get Your Free Estimate",
  stats: [
    { value: "10+", label: "Years Experience" },
    { value: "500+", label: "Happy Customers" },
    { value: "100%", label: "Satisfaction Rate" },
  ],
  brandColor: "#FFD700",
  themePreset: "default",
  heroStyle: "gradient",
  heroImageUrl: "",
  heroVideoUrl: "",
  heroBadgeText: "Trusted Local Business",
  heroHeading: "Professional Services",
  heroHeadingAccent: "You Can Trust",
  heroSubheading: "",
  trustBadges: [
    { text: "Licensed", icon: "shield" },
    { text: "Insured", icon: "shield-check" },
    { text: "Satisfaction Guaranteed", icon: "star" },
  ],
  heroCTAText: "Get a Free Quote",
  heroSecondaryCTAText: "Our Services",
  whyChooseUsTitle: "Why Choose Us?",
  whyChooseUsHeading: "Quality You Can Trust",
  whyChooseUsText: "",
  emergencyBannerText: "Available for Emergency Services!",
  emergencyBannerEnabled: false,
  specialtiesTitle: "Our Specialties",
  specialties: [],
  badgesTitle: "Our Commitment to Excellence",
  badgesSubtitle: "Why customers choose us for their service needs",
  badges: [
    { icon: "shield", title: "Fully Insured", description: "Complete protection for your peace of mind", color: "#0ea5e9" },
    { icon: "award", title: "Certified Experts", description: "Licensed professionals you can count on", color: "#10b981" },
    { icon: "wrench", title: "Quality Work", description: "Premium materials and expert craftsmanship", color: "#f59e0b" },
    { icon: "check-circle", title: "Guaranteed", description: "100% satisfaction guaranteed", color: "#8b5cf6" },
  ],
  testimonialsTitle: "What Our Customers Say",
  testimonialsSubtitle: "Real reviews from satisfied customers",
  overallRating: 5.0,
  reviewCount: 0,
  googleReviewsUrl: "",
  testimonials: [],
  mapEmbedUrl: "",
  mapTitle: "Our Service Area",
  address: "",
};

const iconOptions = [
  { value: "shield", label: "Shield" },
  { value: "shield-check", label: "Shield Check" },
  { value: "award", label: "Award" },
  { value: "star", label: "Star" },
  { value: "check-circle", label: "Check Circle" },
  { value: "wrench", label: "Wrench" },
  { value: "hammer", label: "Hammer" },
  { value: "users", label: "Users" },
  { value: "clock", label: "Clock" },
  { value: "heart", label: "Heart" },
  { value: "thumbs-up", label: "Thumbs Up" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [newArea, setNewArea] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hero: true,
    sections: false,
    process: false,
    whychooseus: false,
    specialties: true,
    badges: false,
    testimonials: false,
    stats: false,
    footer: false,
  });
  const flags = useFeatureFlags();

  function toggleSection(section: string) {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          // API returns wrapped response: { settings: {...} }
          setSettings({ ...defaultSettings, ...data.settings });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Logo upload handler
  async function handleLogoUpload(file: File) {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      setLogoError("Please upload a JPG, PNG, WebP, or SVG image.");
      return;
    }

    // Validate file size (2MB max for logos)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Logo must be less than 2MB.");
      return;
    }

    setUploadingLogo(true);
    setLogoError("");

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await res.json();
      setSettings((prev) => ({ ...prev, logoUrl: url, useTextLogo: false }));
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingLogo(false);
    }
  }

  function handleLogoFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
    // Reset input
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  function handleRemoveLogo() {
    setSettings((prev) => ({ ...prev, logoUrl: undefined, useTextLogo: true }));
    setLogoError("");
  }

  function updateProcess(index: number, field: keyof ProcessStep, value: string | number) {
    setSettings((prev) => ({
      ...prev,
      process: prev.process.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  }

  function updateStat(index: number, field: keyof StatItem, value: string) {
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }));
  }

  function updateTrustBadge(index: number, field: keyof TrustBadge, value: string) {
    setSettings((prev) => ({
      ...prev,
      trustBadges: prev.trustBadges.map((badge, i) =>
        i === index ? { ...badge, [field]: value } : badge
      ),
    }));
  }

  function addTrustBadge() {
    setSettings((prev) => ({
      ...prev,
      trustBadges: [...prev.trustBadges, { text: "", icon: "check-circle" }],
    }));
  }

  function removeTrustBadge(index: number) {
    setSettings((prev) => ({
      ...prev,
      trustBadges: prev.trustBadges.filter((_, i) => i !== index),
    }));
  }

  function updateSpecialty(index: number, field: keyof SpecialtyItem, value: string) {
    setSettings((prev) => ({
      ...prev,
      specialties: prev.specialties.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addSpecialty() {
    setSettings((prev) => ({
      ...prev,
      specialties: [...prev.specialties, { id: Date.now().toString(), name: "", description: "" }],
    }));
  }

  function removeSpecialty(index: number) {
    setSettings((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  }

  function updateBadge(index: number, field: keyof CommitmentBadge, value: string) {
    setSettings((prev) => ({
      ...prev,
      badges: prev.badges.map((badge, i) =>
        i === index ? { ...badge, [field]: value } : badge
      ),
    }));
  }

  function updateTestimonial(index: number, field: keyof Testimonial, value: string | number) {
    setSettings((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addTestimonial() {
    setSettings((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        { id: Date.now().toString(), rating: 5, text: "", reviewerName: "", date: "" },
      ],
    }));
  }

  function removeTestimonial(index: number) {
    setSettings((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index),
    }));
  }

  function addServiceArea() {
    if (newArea.trim()) {
      setSettings((prev) => ({
        ...prev,
        serviceAreas: [...(prev.serviceAreas || []), newArea.trim()],
      }));
      setNewArea("");
    }
  }

  function removeServiceArea(index: number) {
    setSettings((prev) => ({
      ...prev,
      serviceAreas: (prev.serviceAreas || []).filter((_, i) => i !== index),
    }));
  }

  /**
   * Business Type Handlers (Enhanced v9.37)
   *
   * These handlers integrate with the BusinessTypeSelector component to:
   * - Change business type and optionally apply content presets
   * - Toggle individual features while tracking modifications
   * - Reset features to business type defaults
   *
   * Performance: O(1) for type lookup, O(n) for feature comparison where n = feature count
   */
  const handleBusinessTypeChange = useCallback((type: BusinessType, applyContentDefaults?: boolean) => {
    const newFeatures = getFeatureDefaults(type);
    const contentPreset = applyContentDefaults ? getContentPreset(type) : null;

    setSettings((prev) => ({
      ...prev,
      businessType: type,
      enabledFeatures: newFeatures,
      featuresModified: false,
      // Apply content presets if requested
      ...(contentPreset && {
        heroHeading: contentPreset.heroHeading,
        heroHeadingAccent: contentPreset.heroHeadingAccent,
        heroCTAText: contentPreset.heroCTAText,
        processTitle: contentPreset.processTitle,
        processSubtitle: contentPreset.processSubtitle,
        processCTAText: contentPreset.processCTAText,
        trustBadges: contentPreset.trustBadges,
        process: contentPreset.processSteps,
      }),
    }));
  }, []);

  const handleFeatureChange = useCallback((features: EnabledFeatures) => {
    setSettings((prev) => ({
      ...prev,
      enabledFeatures: features,
      featuresModified: true,
    }));
  }, []);

  const handleResetToDefaults = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      enabledFeatures: getFeatureDefaults(prev.businessType),
      featuresModified: false,
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General" },
    { id: "appearance", label: "Appearance" },
    { id: "homepage", label: "Homepage" },
    { id: "services", label: "Services & Trust" },
    { id: "contact", label: "Contact & Footer" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-4">
          {saved && (
            <span className="text-green-600 text-sm font-medium">Settings saved!</span>
          )}
          {error && (
            <span className="text-red-600 text-sm font-medium">{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={"px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors " + (
              activeTab === tab.id
                ? "bg-brand text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* Business Type Section - Enhanced v9.37 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <BusinessTypeSelector
              selectedType={settings.businessType}
              enabledFeatures={settings.enabledFeatures}
              onTypeChange={handleBusinessTypeChange}
              onFeatureChange={handleFeatureChange}
              onResetToDefaults={handleResetToDefaults}
            />
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-semibold text-gray-900">General Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline
              </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Quality workmanship, reliable service"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Text
            </label>
            <textarea
              value={settings.aboutText}
              onChange={(e) => setSettings((prev) => ({ ...prev, aboutText: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Tell your customers about your business..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) => setSettings((prev) => ({ ...prev, businessHours: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Mon-Fri 9am-5pm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Areas
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addServiceArea())}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Add a service area..."
              />
              <button
                type="button"
                onClick={addServiceArea}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {settings.serviceAreas && settings.serviceAreas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.serviceAreas.map((area, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {area}
                    <button
                      type="button"
                      onClick={() => removeServiceArea(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-6">
          {/* Logo & Branding Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">Logo & Branding</h3>
              <p className="text-sm text-gray-500">Upload your business logo or use text-based branding</p>
            </div>

            {/* Logo Type Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, useTextLogo: false }))}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  !settings.useTextLogo
                    ? "border-brand bg-brand/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <ImageIcon className={`w-5 h-5 ${!settings.useTextLogo ? "text-brand" : "text-gray-400"}`} />
                <span className={`font-medium ${!settings.useTextLogo ? "text-gray-900" : "text-gray-600"}`}>
                  Image Logo
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, useTextLogo: true }))}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  settings.useTextLogo
                    ? "border-brand bg-brand/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Type className={`w-5 h-5 ${settings.useTextLogo ? "text-brand" : "text-gray-400"}`} />
                <span className={`font-medium ${settings.useTextLogo ? "text-gray-900" : "text-gray-600"}`}>
                  Text Logo
                </span>
              </button>
            </div>

            {/* Image Logo Upload */}
            {!settings.useTextLogo && (
              <div>
                {settings.logoUrl ? (
                  <div className="flex items-center gap-6">
                    {/* Logo Preview */}
                    <div className="w-32 h-32 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img
                        src={settings.logoUrl}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-3">
                        Current logo uploaded. Click below to change or remove it.
                      </p>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploadingLogo}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {uploadingLogo ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Change Logo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      uploadingLogo
                        ? "border-brand bg-brand/5 pointer-events-none"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {uploadingLogo ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
                        <p className="text-sm text-gray-500">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload your logo
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, WebP, or SVG (max 2MB)
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Recommended: 200x200px or larger, square or horizontal
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleLogoFileSelect}
                  className="hidden"
                />

                {/* Error Message */}
                {logoError && <p className="text-red-500 text-sm mt-3">{logoError}</p>}
              </div>
            )}

            {/* Text Logo Info */}
            {settings.useTextLogo && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Your business name will be displayed as the logo in your site header.
                  You can change your business name in the General tab.
                </p>
              </div>
            )}
          </div>

          {/* Theme Selection Grid */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Site Theme</h3>
                <p className="text-sm text-gray-500">Choose a color scheme for your site</p>
              </div>
              {!flags.premiumThemesEnabled && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Pro Feature
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allThemes.map((theme) => {
                const isSelected = settings.themePreset === theme.id;
                const isLocked = theme.isPremium && !flags.premiumThemesEnabled;

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      if (!isLocked) {
                        setSettings({ ...settings, themePreset: theme.id });
                      }
                    }}
                    disabled={isLocked}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-brand bg-brand/5"
                        : isLocked
                        ? "border-gray-200 opacity-60 cursor-not-allowed"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Theme preview swatches */}
                    <div className="flex gap-1.5 mb-3">
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: theme.preview.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: theme.preview.accent }}
                      />
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200"
                        style={{ backgroundColor: theme.preview.background }}
                      />
                    </div>

                    {/* Theme info */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{theme.name}</span>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                      {isSelected && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <p className="text-xs text-gray-500">{theme.description}</p>

                    {/* Premium badge (shown when unlocked) */}
                    {theme.isPremium && !isLocked && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Pro
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Upgrade prompt for non-Pro users */}
            {!flags.premiumThemesEnabled && (
              <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Upgrade to Pro for Premium Themes</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Unlock 4 additional designer themes to make your site stand out.
                    </p>
                    <a
                      href="https://gosovereign.io/wizard/preview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Upgrade Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Brand Color Override Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">Custom Brand Color</h3>
              <p className="text-sm text-gray-500">Override the theme&apos;s primary color with your own</p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <input
                type="color"
                value={settings.brandColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, brandColor: e.target.value }))}
                className="w-16 h-12 rounded-lg cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={settings.brandColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, brandColor: e.target.value }))}
                placeholder="#FFD700"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { color: "#FFD700", name: "Gold" },
                  { color: "#3B82F6", name: "Blue" },
                  { color: "#10B981", name: "Green" },
                  { color: "#EF4444", name: "Red" },
                  { color: "#8B5CF6", name: "Purple" },
                  { color: "#F97316", name: "Orange" },
                  { color: "#EC4899", name: "Pink" },
                  { color: "#14B8A6", name: "Teal" },
                ].map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, brandColor: preset.color }))}
                    className={"flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors " + (
                      settings.brandColor.toLowerCase() === preset.color.toLowerCase()
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Note */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-1">Theme Preview</h4>
            <p className="text-sm text-blue-700">
              After saving, the selected theme will be applied to your site.
              Visit your site to see the changes in action.
            </p>
          </div>
        </div>
      )}

      {/* Homepage Tab - Merged Hero, Sections, Process, Why Choose Us */}
      {activeTab === "homepage" && (
        <div className="space-y-4">
          {/* Hero Section - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("hero")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Hero Section</h3>
              {expandedSections.hero ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.hero && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge Text (above heading)
                    </label>
                    <input
                      type="text"
                      value={settings.heroBadgeText}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroBadgeText: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Trusted Since 2010"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Style
                    </label>
                    <select
                      value={settings.heroStyle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroStyle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="gradient">Gradient Background</option>
                      <option value="image">Background Image</option>
                      <option value="video">Background Video</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={settings.heroHeading}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroHeading: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Professional Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heading Accent (colored)
                    </label>
                    <input
                      type="text"
                      value={settings.heroHeadingAccent}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroHeadingAccent: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="You Can Trust"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subheading / Secondary Text
                  </label>
                  <input
                    type="text"
                    value={settings.heroSubheading}
                    onChange={(e) => setSettings((prev) => ({ ...prev, heroSubheading: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Quality workmanship, reliable service, and complete customer satisfaction guaranteed."
                  />
                </div>

                {settings.heroStyle === "image" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={settings.heroImageUrl}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="https://example.com/hero-image.jpg"
                    />
                  </div>
                )}

                {settings.heroStyle === "video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Video URL
                    </label>
                    <input
                      type="url"
                      value={settings.heroVideoUrl}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroVideoUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="https://example.com/hero-video.mp4"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary CTA Text
                    </label>
                    <input
                      type="text"
                      value={settings.heroCTAText}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroCTAText: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Get a Free Quote"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary CTA Text
                    </label>
                    <input
                      type="text"
                      value={settings.heroSecondaryCTAText}
                      onChange={(e) => setSettings((prev) => ({ ...prev, heroSecondaryCTAText: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Our Services"
                    />
                  </div>
                </div>

                {/* Trust Badges */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Trust Badges (shown below heading)
                    </label>
                    <button
                      type="button"
                      onClick={addTrustBadge}
                      className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark"
                    >
                      <Plus className="w-4 h-4" /> Add Badge
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.trustBadges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <select
                          value={badge.icon}
                          onChange={(e) => updateTrustBadge(index, "icon", e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                        >
                          {iconOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={badge.text}
                          onChange={(e) => updateTrustBadge(index, "text", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                          placeholder="Badge text"
                        />
                        <button
                          type="button"
                          onClick={() => removeTrustBadge(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section Visibility - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("sections")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Section Visibility</h3>
              {expandedSections.sections ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.sections && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Toggle which sections appear on your homepage
                </p>
                {[
                  { key: "showProcess", label: "How It Works / Process Steps" },
                  { key: "showWhyChooseUs", label: "Why Choose Us" },
                  { key: "showSpecialties", label: "Specialties / Materials" },
                  { key: "showBadges", label: "Commitment Badges" },
                  { key: "showStats", label: "Stats / Counters" },
                  { key: "showTestimonials", label: "Testimonials" },
                  { key: "showTeam", label: "Team Members" },
                  { key: "showFaq", label: "FAQ Section" },
                  { key: "showMapEmbed", label: "Footer Map Embed" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof Settings] as boolean}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="w-5 h-5 text-brand focus:ring-brand rounded"
                    />
                    <span className="text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Process Steps - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("process")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">How It Works</h3>
              {expandedSections.process ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.process && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.processTitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, processTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Our Simple Process"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.processCTAText}
                      onChange={(e) => setSettings((prev) => ({ ...prev, processCTAText: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Get Your Free Estimate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.processSubtitle}
                    onChange={(e) => setSettings((prev) => ({ ...prev, processSubtitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="From consultation to completion, we make it easy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Process Steps
                  </label>
                  <div className="space-y-4">
                    {settings.process.map((step, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <GripVertical className="w-5 h-5 text-gray-400 mt-3" />
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Step {index + 1} Title
                            </label>
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => updateProcess(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={step.description}
                              onChange={(e) => updateProcess(index, "description", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Why Choose Us - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("whychooseus")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Why Choose Us</h3>
              {expandedSections.whychooseus ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.whychooseus && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.whyChooseUsTitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, whyChooseUsTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Why Choose Us?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={settings.whyChooseUsHeading}
                      onChange={(e) => setSettings((prev) => ({ ...prev, whyChooseUsHeading: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Quality You Can Trust"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Text
                  </label>
                  <textarea
                    value={settings.whyChooseUsText}
                    onChange={(e) => setSettings((prev) => ({ ...prev, whyChooseUsText: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Tell customers why they should choose your business..."
                  />
                </div>

                <div className="border-t pt-6">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={settings.emergencyBannerEnabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, emergencyBannerEnabled: e.target.checked }))}
                      className="w-5 h-5 text-brand focus:ring-brand rounded"
                    />
                    <span className="text-gray-700 font-medium">Show Emergency Services Banner</span>
                  </label>

                  {settings.emergencyBannerEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Text
                      </label>
                      <input
                        type="text"
                        value={settings.emergencyBannerText}
                        onChange={(e) => setSettings((prev) => ({ ...prev, emergencyBannerText: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                        placeholder="Available for Emergency Services!"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services & Trust Tab - Merged Specialties, Badges, Testimonials */}
      {activeTab === "services" && (
        <div className="space-y-4">
          {/* Specialties & Services - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("specialties")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Specialties & Services</h3>
              {expandedSections.specialties ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.specialties && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={settings.specialtiesTitle}
                    onChange={(e) => setSettings((prev) => ({ ...prev, specialtiesTitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Our Specialties"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Specialty Items
                    </label>
                    <button
                      type="button"
                      onClick={addSpecialty}
                      className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark"
                    >
                      <Plus className="w-4 h-4" /> Add Specialty
                    </button>
                  </div>

                  <div className="space-y-4">
                    {settings.specialties.map((item, index) => (
                      <div key={item.id || index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-medium text-gray-500">Item {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeSpecialty(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateSpecialty(index, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="Specialty name"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => updateSpecialty(index, "description", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="Description"
                          />
                        </div>
                      </div>
                    ))}

                    {settings.specialties.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-8">
                        No specialties added yet. Click &quot;Add Specialty&quot; to add one.
                      </p>
                    )}
                  </div>
                </div>

                {/* Services Link */}
                <div className="border-t pt-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">Manage Your Services</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Add, edit, and organize your services with full details including pricing, features, and images.
                    </p>
                    <a
                      href="/admin/services"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Go to Services
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Badges & Stats - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("badges")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Trust Badges & Stats</h3>
              {expandedSections.badges ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.badges && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.badgesTitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, badgesTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Our Commitment to Excellence"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={settings.badgesSubtitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, badgesSubtitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Why customers choose us"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Commitment Badges
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settings.badges.map((badge, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
                            <select
                              value={badge.icon}
                              onChange={(e) => updateBadge(index, "icon", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            >
                              {iconOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                            <input
                              type="color"
                              value={badge.color}
                              onChange={(e) => updateBadge(index, "color", e.target.value)}
                              className="w-full h-10 border border-gray-200 rounded-lg cursor-pointer"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={badge.title}
                            onChange={(e) => updateBadge(index, "title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="Badge title"
                          />
                          <input
                            type="text"
                            value={badge.description}
                            onChange={(e) => updateBadge(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="Badge description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Statistics (shown in dark bar below badges)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {settings.stats.map((stat, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => updateStat(index, "value", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="10+"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => updateStat(index, "label", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="Years Experience"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Testimonials - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("testimonials")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Testimonials</h3>
              {expandedSections.testimonials ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.testimonials && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.testimonialsTitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, testimonialsTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="What Our Customers Say"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={settings.testimonialsSubtitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, testimonialsSubtitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Real reviews from satisfied customers"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={settings.overallRating}
                      onChange={(e) => setSettings((prev) => ({ ...prev, overallRating: parseFloat(e.target.value) || 5 }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Review Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.reviewCount}
                      onChange={(e) => setSettings((prev) => ({ ...prev, reviewCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Reviews Link
                    </label>
                    <input
                      type="url"
                      value={settings.googleReviewsUrl}
                      onChange={(e) => setSettings((prev) => ({ ...prev, googleReviewsUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="https://g.page/..."
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Testimonials
                    </label>
                    <button
                      type="button"
                      onClick={addTestimonial}
                      className="flex items-center gap-1 text-sm text-brand hover:text-brand-dark"
                    >
                      <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                  </div>

                  <div className="space-y-4">
                    {settings.testimonials.map((item, index) => (
                      <div key={item.id || index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Review {index + 1}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => updateTestimonial(index, "rating", star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= item.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTestimonial(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <textarea
                            value={item.text}
                            onChange={(e) => updateTestimonial(index, "text", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                            placeholder="Customer review text..."
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={item.reviewerName}
                              onChange={(e) => updateTestimonial(index, "reviewerName", e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                              placeholder="Reviewer name"
                            />
                            <input
                              type="text"
                              value={item.date || ""}
                              onChange={(e) => updateTestimonial(index, "date", e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                              placeholder="Date (optional)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {settings.testimonials.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-8">
                        No testimonials added yet. Click &quot;Add Testimonial&quot; to add one.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact & Footer Tab - Merged Contact and Footer */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          {/* Contact Settings - Always visible */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h3 className="font-semibold text-gray-900">Contact Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Mode
              </label>
              <select
                value={settings.contactMode}
                onChange={(e) => setSettings((prev) => ({ ...prev, contactMode: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="form">Contact Form</option>
                <option value="calendly">Calendly Scheduling</option>
                <option value="phone">Phone Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="(555) 123-4567"
              />
            </div>

            {settings.contactMode === "calendly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calendly URL
                </label>
                <input
                  type="url"
                  value={settings.calendlyUrl}
                  onChange={(e) => setSettings((prev) => ({ ...prev, calendlyUrl: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="https://calendly.com/yourbusiness"
                />
              </div>
            )}
          </div>

          {/* Booking Integration */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Booking Integration</h3>
              <p className="text-sm text-gray-500">
                Connect a third-party booking system like Calendly, Cal.com, Acuity, or any scheduling tool
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking URL
              </label>
              <input
                type="url"
                value={settings.bookingUrl}
                onChange={(e) => setSettings((prev) => ({ ...prev, bookingUrl: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="https://calendly.com/yourbusiness or https://cal.com/yourname"
              />
              <p className="text-sm text-gray-500 mt-2">
                Supports Calendly, Cal.com, Acuity, Square, and most other booking platforms
              </p>
            </div>

            {settings.bookingUrl && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Mode
                    </label>
                    <select
                      value={settings.bookingDisplayMode}
                      onChange={(e) => setSettings((prev) => ({ ...prev, bookingDisplayMode: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="embed">Embed (inline calendar)</option>
                      <option value="popup">Popup (modal window)</option>
                      <option value="link">Link (opens in new tab)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={settings.bookingButtonText}
                      onChange={(e) => setSettings((prev) => ({ ...prev, bookingButtonText: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Book Now"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description Text (shown above booking widget)
                  </label>
                  <input
                    type="text"
                    value={settings.bookingDescription}
                    onChange={(e) => setSettings((prev) => ({ ...prev, bookingDescription: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Schedule your appointment online"
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Where to Show Booking
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showBookingOnHero}
                        onChange={(e) => setSettings((prev) => ({ ...prev, showBookingOnHero: e.target.checked }))}
                        className="w-5 h-5 text-brand focus:ring-brand rounded"
                      />
                      <span className="text-gray-700">Show booking button in Hero section</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showBookingOnServicePages}
                        onChange={(e) => setSettings((prev) => ({ ...prev, showBookingOnServicePages: e.target.checked }))}
                        className="w-5 h-5 text-brand focus:ring-brand rounded"
                      />
                      <span className="text-gray-700">Show booking widget on individual service pages</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showBookingPage}
                        onChange={(e) => setSettings((prev) => ({ ...prev, showBookingPage: e.target.checked }))}
                        className="w-5 h-5 text-brand focus:ring-brand rounded"
                      />
                      <span className="text-gray-700">Create dedicated /booking page</span>
                    </label>
                  </div>
                </div>

                {/* Preview */}
                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Preview
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {settings.bookingDisplayMode === "embed" ? (
                      <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p>Calendar embed will appear here</p>
                        <p className="text-sm mt-1">Height: 630px</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
                      >
                        {settings.bookingButtonText || "Book Now"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer & Map - Collapsible */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("footer")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Footer & Map</h3>
              {expandedSections.footer ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.footer && (
              <div className="p-6 pt-2 border-t border-gray-100 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="123 Main Street, City, State 12345"
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Map Embed</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Map Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.mapTitle}
                      onChange={(e) => setSettings((prev) => ({ ...prev, mapTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="Our Service Area"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps Embed URL
                    </label>
                    <input
                      type="url"
                      value={settings.mapEmbedUrl}
                      onChange={(e) => setSettings((prev) => ({ ...prev, mapEmbedUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
