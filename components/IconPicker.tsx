"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  placeholder?: string;
}

// Curated icons organized by business category
const iconCategories: Record<string, { label: string; icons: string[] }> = {
  general: {
    label: "General",
    icons: [
      "check-circle",
      "star",
      "heart",
      "thumbs-up",
      "award",
      "shield",
      "shield-check",
      "badge-check",
      "clock",
      "users",
      "phone",
      "mail",
      "map-pin",
      "calendar",
      "gift",
      "tag",
      "percent",
    ],
  },
  homeServices: {
    label: "Home Services",
    icons: [
      "wrench",
      "hammer",
      "paintbrush",
      "droplet",
      "droplets",
      "zap",
      "thermometer",
      "home",
      "key",
      "lightbulb",
      "plug",
      "flame",
      "fan",
      "air-vent",
      "bath",
      "door-open",
      "fence",
      "trees",
    ],
  },
  construction: {
    label: "Construction",
    icons: [
      "hard-hat",
      "ruler",
      "construction",
      "brick-wall",
      "paint-bucket",
      "shovel",
      "building",
      "building-2",
      "warehouse",
      "factory",
      "crane",
    ],
  },
  automotive: {
    label: "Automotive",
    icons: [
      "car",
      "car-front",
      "truck",
      "bus",
      "bike",
      "settings",
      "fuel",
      "gauge",
      "circle-dot",
      "parking-circle",
    ],
  },
  foodBeverage: {
    label: "Food & Beverage",
    icons: [
      "utensils",
      "utensils-crossed",
      "coffee",
      "cup-soda",
      "pizza",
      "cake",
      "cake-slice",
      "wine",
      "beer",
      "martini",
      "salad",
      "chef-hat",
      "soup",
      "ice-cream",
      "cookie",
      "sandwich",
      "apple",
      "cherry",
      "citrus",
      "grape",
      "egg",
      "fish",
      "beef",
    ],
  },
  beauty: {
    label: "Beauty & Wellness",
    icons: [
      "scissors",
      "sparkles",
      "spray-can",
      "flower",
      "flower-2",
      "heart-pulse",
      "activity",
      "smile",
      "eye",
      "hand",
      "footprints",
      "dumbbell",
      "brain",
    ],
  },
  health: {
    label: "Health & Medical",
    icons: [
      "stethoscope",
      "syringe",
      "pill",
      "thermometer-sun",
      "heart-pulse",
      "ambulance",
      "cross",
      "bandage",
      "microscope",
      "test-tube",
    ],
  },
  tech: {
    label: "Tech & Business",
    icons: [
      "laptop",
      "monitor",
      "smartphone",
      "tablet",
      "wifi",
      "code",
      "terminal",
      "server",
      "database",
      "cloud",
      "briefcase",
      "presentation",
      "pie-chart",
      "bar-chart",
      "trending-up",
      "calculator",
      "printer",
      "scan",
    ],
  },
  creative: {
    label: "Creative",
    icons: [
      "camera",
      "video",
      "film",
      "image",
      "palette",
      "pen-tool",
      "brush",
      "pencil",
      "music",
      "mic",
      "headphones",
      "speaker",
      "guitar",
      "piano",
      "drum",
    ],
  },
  education: {
    label: "Education",
    icons: [
      "graduation-cap",
      "book",
      "book-open",
      "library",
      "school",
      "backpack",
      "notebook",
      "pencil-ruler",
      "globe",
      "languages",
    ],
  },
  nature: {
    label: "Nature & Outdoors",
    icons: [
      "tree",
      "trees",
      "leaf",
      "sprout",
      "sun",
      "moon",
      "cloud",
      "cloud-rain",
      "snowflake",
      "wind",
      "mountain",
      "mountain-snow",
      "waves",
      "fish",
      "bird",
      "dog",
      "cat",
      "paw-print",
    ],
  },
  tools: {
    label: "Tools & Equipment",
    icons: [
      "tool",
      "cog",
      "settings-2",
      "screwdriver",
      "nut",
      "pipette",
      "magnet",
      "compass",
      "scale",
      "trash-2",
      "recycle",
      "package",
      "box",
      "archive",
      "folder",
      "clipboard",
      "clipboard-list",
    ],
  },
  transport: {
    label: "Transport & Logistics",
    icons: [
      "truck",
      "ship",
      "plane",
      "train",
      "cable-car",
      "container",
      "forklift",
      "rocket",
      "send",
      "navigation",
      "compass",
      "map",
    ],
  },
};

// Flatten all icons for search
const allIcons = Object.entries(iconCategories).flatMap(([category, data]) =>
  data.icons.map((icon) => ({ icon, category, categoryLabel: data.label }))
);

export function IconPicker({
  value,
  onChange,
  label,
  placeholder = "Select an icon",
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter icons based on search query
  const filteredIcons = searchQuery
    ? allIcons.filter(
        ({ icon, categoryLabel }) =>
          icon.toLowerCase().includes(searchQuery.toLowerCase()) ||
          categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory
      ? allIcons.filter(({ category }) => category === activeCategory)
      : allIcons;

  // Group filtered icons by category for display
  const groupedIcons = filteredIcons.reduce(
    (acc, { icon, category, categoryLabel }) => {
      if (!acc[category]) {
        acc[category] = { label: categoryLabel, icons: [] };
      }
      acc[category].icons.push(icon);
      return acc;
    },
    {} as Record<string, { label: string; icons: string[] }>
  );

  function selectIcon(iconName: string) {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  }

  // Convert kebab-case to Title Case for display
  function formatIconName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-white text-left"
      >
        {value ? (
          <>
            <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
              <DynamicIcon name={value} className="w-5 h-5 text-gray-700" />
            </span>
            <span className="text-gray-900">{formatIconName(value)}</span>
          </>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[400px] max-w-[500px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveCategory(null);
                }}
                placeholder="Search icons..."
                className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          {!searchQuery && (
            <div className="flex gap-1 p-2 border-b border-gray-100 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === null
                    ? "bg-brand text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {Object.entries(iconCategories).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === key
                      ? "bg-brand text-gray-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Icon Grid */}
          <div className="max-h-[300px] overflow-y-auto p-3">
            {Object.entries(groupedIcons).length === 0 ? (
              <p className="text-center text-gray-500 py-8">No icons found</p>
            ) : (
              Object.entries(groupedIcons).map(([category, { label, icons }]) => (
                <div key={category} className="mb-4 last:mb-0">
                  {!activeCategory && (
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {label}
                    </h4>
                  )}
                  <div className="grid grid-cols-8 gap-1">
                    {icons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => selectIcon(iconName)}
                        title={formatIconName(iconName)}
                        className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                          value === iconName
                            ? "bg-brand text-gray-900 ring-2 ring-brand ring-offset-1"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <DynamicIcon name={iconName} className="w-5 h-5" />
                        {value === iconName && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
            {filteredIcons.length} icons available
          </div>
        </div>
      )}
    </div>
  );
}
