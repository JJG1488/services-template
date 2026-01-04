import { Leaf, Wheat, Fish, Egg, Milk, Nut, Flame, AlertTriangle } from "lucide-react";
import type { DietaryTag, Allergen, dietaryTagConfig, allergenConfig } from "@/types/menu";

// Import configs from menu types
const tagConfig: typeof dietaryTagConfig = {
  vegetarian: {
    label: "Vegetarian",
    icon: "leaf",
    color: "green",
  },
  vegan: {
    label: "Vegan",
    icon: "leaf",
    color: "green",
  },
  "gluten-free": {
    label: "GF",
    icon: "wheat-off",
    color: "yellow",
  },
  spicy: {
    label: "Spicy",
    icon: "flame",
    color: "red",
  },
  "nut-free": {
    label: "Nut-Free",
    icon: "alert-triangle",
    color: "blue",
  },
  "dairy-free": {
    label: "DF",
    icon: "milk-off",
    color: "blue",
  },
};

const allergenIcons: Record<string, typeof Leaf> = {
  "leaf": Leaf,
  "wheat-off": Wheat,
  "flame": Flame,
  "alert-triangle": AlertTriangle,
  "milk-off": Milk,
  "fish": Fish,
  "egg": Egg,
  "nut": Nut,
};

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

interface DietaryBadgeProps {
  tag: DietaryTag;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function DietaryBadge({ tag, size = "sm", showLabel = true }: DietaryBadgeProps) {
  const config = tagConfig[tag];
  if (!config) return null;

  const colors = colorClasses[config.color] || colorClasses.gray;
  const IconComponent = allergenIcons[config.icon] || Leaf;
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} ${colors.bg} ${colors.text} ${colors.border} border rounded font-medium ${textSize}`}
      title={config.label}
    >
      <IconComponent className={iconSize} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

interface AllergenBadgeProps {
  allergen: Allergen;
  size?: "sm" | "md";
}

const allergenDetails: Record<Allergen, { label: string; icon: string; color: string }> = {
  nuts: { label: "Nuts", icon: "nut", color: "yellow" },
  dairy: { label: "Dairy", icon: "milk-off", color: "blue" },
  gluten: { label: "Gluten", icon: "wheat-off", color: "yellow" },
  shellfish: { label: "Shellfish", icon: "fish", color: "red" },
  eggs: { label: "Eggs", icon: "egg", color: "yellow" },
  soy: { label: "Soy", icon: "alert-triangle", color: "green" },
};

export function AllergenBadge({ allergen, size = "sm" }: AllergenBadgeProps) {
  const config = allergenDetails[allergen];
  if (!config) return null;

  const colors = colorClasses[config.color] || colorClasses.gray;
  const IconComponent = allergenIcons[config.icon] || AlertTriangle;
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} ${colors.bg} ${colors.text} ${colors.border} border rounded font-medium ${textSize}`}
      title={`Contains ${config.label}`}
    >
      <IconComponent className={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}
