/**
 * Menu Types for Services Template
 */

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "spicy"
  | "nut-free"
  | "dairy-free"
  | "keto"
  | "halal"
  | "kosher";

export type Allergen =
  | "nuts"
  | "dairy"
  | "gluten"
  | "shellfish"
  | "eggs"
  | "soy"
  | "fish"
  | "sesame";

/**
 * Dietary tag display configuration
 */
export const dietaryTagConfig: Record<
  DietaryTag,
  { label: string; icon: string; color: string }
> = {
  vegetarian: { label: "Vegetarian", icon: "leaf", color: "#22c55e" },
  vegan: { label: "Vegan", icon: "sprout", color: "#16a34a" },
  "gluten-free": { label: "Gluten Free", icon: "wheat-off", color: "#f59e0b" },
  spicy: { label: "Spicy", icon: "flame", color: "#ef4444" },
  "nut-free": { label: "Nut Free", icon: "circle-slash", color: "#a16207" },
  "dairy-free": { label: "Dairy Free", icon: "droplet-off", color: "#3b82f6" },
  keto: { label: "Keto", icon: "bacon", color: "#8b5cf6" },
  halal: { label: "Halal", icon: "check-circle", color: "#059669" },
  kosher: { label: "Kosher", icon: "star", color: "#0891b2" },
};

/**
 * Menu category (e.g., Appetizers, Entrees, Desserts)
 */
export interface MenuCategory {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Populated by API
  items?: MenuItem[];
  item_count?: number;
}

/**
 * Size/price variation for a menu item
 */
export interface MenuItemVariation {
  id: string;
  menu_item_id: string;
  name: string; // e.g., "Small", "Medium", "Large"
  price: number; // In cents
  description?: string; // e.g., "8 oz", "12 oz"
  is_default: boolean;
  display_order: number;
  is_available: boolean;
}

/**
 * Individual menu item
 */
export interface MenuItem {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  price?: number; // In cents, null = "Market Price"
  price_note?: string; // e.g., "per pound", "serves 4-6"
  image_url?: string;
  dietary_tags: DietaryTag[];
  allergens?: Allergen[];
  spice_level?: number; // 0-5 scale
  calories?: number;
  is_featured: boolean;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Populated by API
  variations?: MenuItemVariation[];
  category_name?: string;
}

/**
 * PDF menu document
 */
export interface MenuPdf {
  id: string;
  store_id: string;
  name: string;
  file_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Full menu structure for frontend display
 */
export interface MenuDisplay {
  categories: (MenuCategory & { items: MenuItem[] })[];
  pdfs: MenuPdf[];
}

/**
 * Menu settings stored in RuntimeSettings
 */
export interface MenuSettings {
  showMenu: boolean;
  menuTitle: string;
  menuSubtitle: string;
  menuStyle: "grid" | "list" | "compact";
  showMenuPrices: boolean;
  showDietaryTags: boolean;
  showAllergens: boolean;
}

/**
 * Format price in cents to display string
 */
export function formatMenuPrice(priceInCents: number | null | undefined): string {
  if (priceInCents === null || priceInCents === undefined) {
    return "Market Price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceInCents / 100);
}

/**
 * Generate slug from name
 */
export function generateMenuSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
