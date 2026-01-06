"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  type BusinessType,
  type BusinessCategory,
  type EnabledFeatures,
  businessCategories,
  businessTypeInfo,
  getFeatureDefaults,
  getContentPreset,
  featureGroups,
  featureMetadata,
  hasModifiedFeatures,
} from "@/lib/business-types";
import { DynamicIcon } from "./DynamicIcon";

interface BusinessTypeSelectorProps {
  selectedType: BusinessType;
  enabledFeatures: EnabledFeatures;
  onTypeChange: (type: BusinessType, applyContentDefaults?: boolean) => void;
  onFeatureChange: (features: EnabledFeatures) => void;
  onResetToDefaults: () => void;
}

/**
 * Business Type Selector Component
 *
 * Enterprise-grade component for selecting business types with:
 * - Category-based organization (O(1) lookup via memoization)
 * - Feature toggle grid with modification tracking
 * - Content preset preview and application
 * - Responsive design for mobile and desktop
 */
export function BusinessTypeSelector({
  selectedType,
  enabledFeatures,
  onTypeChange,
  onFeatureChange,
  onResetToDefaults,
}: BusinessTypeSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<BusinessCategory | null>(null);
  const [showContentPreview, setShowContentPreview] = useState(false);

  // Memoize selected type info for O(1) access
  const selectedTypeInfo = useMemo(() => businessTypeInfo[selectedType], [selectedType]);
  const contentPreset = useMemo(() => getContentPreset(selectedType), [selectedType]);
  const featuresModified = useMemo(
    () => hasModifiedFeatures(selectedType, enabledFeatures),
    [selectedType, enabledFeatures]
  );

  // Find which category the selected type belongs to
  const selectedCategory = useMemo(() => {
    return businessCategories.find((cat) => cat.types.includes(selectedType));
  }, [selectedType]);

  // Handle category expansion toggle
  const toggleCategory = (categoryId: BusinessCategory) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Handle type selection
  const handleTypeSelect = (type: BusinessType) => {
    onTypeChange(type, true); // Apply content defaults by default
    setExpandedCategory(null); // Collapse after selection
  };

  // Handle feature toggle
  const handleFeatureToggle = (featureKey: keyof EnabledFeatures) => {
    onFeatureChange({
      ...enabledFeatures,
      [featureKey]: !enabledFeatures[featureKey],
    });
  };

  return (
    <div className="space-y-6">
      {/* Business Type Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Business Type</h3>
            <p className="text-sm text-gray-500">
              Select your business type to get recommended features and content
            </p>
          </div>
          {selectedType !== "custom" && (
            <button
              type="button"
              onClick={() => setShowContentPreview(!showContentPreview)}
              className="text-sm text-brand hover:text-brand-dark flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              {showContentPreview ? "Hide Preview" : "Preview Content"}
            </button>
          )}
        </div>

        {/* Currently Selected Type Display */}
        <div className="mb-4 p-4 bg-brand/5 border border-brand/20 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
              <DynamicIcon name={selectedTypeInfo?.icon || "settings"} className="w-5 h-5 text-brand" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {selectedTypeInfo?.label || "Custom"}
                </span>
                {featuresModified && (
                  <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                    Features Modified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{selectedTypeInfo?.description}</p>
            </div>
            {selectedCategory && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {selectedCategory.label}
              </span>
            )}
          </div>
        </div>

        {/* Content Preview (when enabled) */}
        {showContentPreview && selectedType !== "custom" && (
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              Content Defaults Preview
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Hero Headline:</span>
                <p className="font-medium">{contentPreset.heroHeading} <span className="text-brand">{contentPreset.heroHeadingAccent}</span></p>
              </div>
              <div>
                <span className="text-gray-500">CTA Button:</span>
                <p className="font-medium">{contentPreset.heroCTAText}</p>
              </div>
              <div>
                <span className="text-gray-500">Process Title:</span>
                <p className="font-medium">{contentPreset.processTitle}</p>
              </div>
              <div>
                <span className="text-gray-500">Trust Badges:</span>
                <p className="font-medium">{contentPreset.trustBadges.map(b => b.text).join(", ")}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              These content defaults will be applied when you select this business type.
              You can customize them in the Homepage tab.
            </p>
          </div>
        )}

        {/* Category-Based Type Selector */}
        <div className="space-y-2">
          {businessCategories.map((category) => {
            const isExpanded = expandedCategory === category.id;
            const hasSelectedType = category.types.includes(selectedType);
            const typesInCategory = category.types.map((t) => businessTypeInfo[t]);

            return (
              <div
                key={category.id}
                className={`border rounded-xl overflow-hidden transition-colors ${
                  hasSelectedType ? "border-brand/30 bg-brand/5" : "border-gray-200"
                }`}
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      hasSelectedType ? "bg-brand/20 text-brand" : "bg-gray-100 text-gray-500"
                    }`}>
                      <DynamicIcon name={category.icon} className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className={`font-medium ${hasSelectedType ? "text-brand" : "text-gray-900"}`}>
                        {category.label}
                      </span>
                      <p className="text-xs text-gray-500">{category.types.length} types</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSelectedType && (
                      <Check className="w-4 h-4 text-brand" />
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Type List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {typesInCategory.map((typeInfo) => {
                      const isSelected = selectedType === typeInfo.id;
                      return (
                        <button
                          key={typeInfo.id}
                          type="button"
                          onClick={() => handleTypeSelect(typeInfo.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "border-brand bg-brand/10 ring-1 ring-brand"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <DynamicIcon
                              name={typeInfo.icon}
                              className={`w-4 h-4 ${isSelected ? "text-brand" : "text-gray-400"}`}
                            />
                            <span className={`text-sm font-medium ${isSelected ? "text-brand" : "text-gray-700"}`}>
                              {typeInfo.shortLabel}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-brand ml-auto" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900">Enabled Features</h4>
            <p className="text-sm text-gray-500">
              Toggle features on/off for your site. Changes are tracked as modifications.
            </p>
          </div>
          {featuresModified && (
            <button
              type="button"
              onClick={onResetToDefaults}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          )}
        </div>

        {/* Feature Groups */}
        <div className="space-y-6">
          {featureGroups.map((group) => (
            <div key={group.id}>
              <h5 className="text-sm font-medium text-gray-700 mb-3">{group.label}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.features.map((featureKey) => {
                  const metadata = featureMetadata.find((f) => f.key === featureKey);
                  if (!metadata) return null;

                  const isEnabled = enabledFeatures[featureKey];
                  const defaultValue = getFeatureDefaults(selectedType)[featureKey];
                  const isModified = isEnabled !== defaultValue;

                  return (
                    <label
                      key={featureKey}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isEnabled
                          ? "border-brand/30 bg-brand/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleFeatureToggle(featureKey)}
                        className="w-5 h-5 mt-0.5 text-brand focus:ring-brand rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <DynamicIcon
                            name={metadata.icon}
                            className={`w-4 h-4 ${isEnabled ? "text-brand" : "text-gray-400"}`}
                          />
                          <span className="font-medium text-gray-900">{metadata.label}</span>
                          {isModified && (
                            <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                              Modified
                            </span>
                          )}
                          {metadata.proOnly && (
                            <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                              Pro
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{metadata.description}</p>
                        {metadata.adminNavLabel && isEnabled && (
                          <p className="text-xs text-brand mt-1">
                            + Admin: {metadata.adminNavLabel}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Summary */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">
                <strong>{Object.values(enabledFeatures).filter(Boolean).length}</strong> features enabled.
                {featuresModified && (
                  <span className="text-blue-700">
                    {" "}You have customized the defaults for {selectedTypeInfo?.label || "your business type"}.
                  </span>
                )}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Enabled features will appear in your admin navigation and on your public site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessTypeSelector;
