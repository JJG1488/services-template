/**
 * Portfolio Types
 * Types for the portfolio/case study system
 */

export interface PortfolioImage {
  url: string;
  alt?: string;
  caption?: string;
  is_before?: boolean;
  is_after?: boolean;
  position: number;
}

export interface PortfolioTestimonial {
  quote: string;
  author: string;
  role?: string;
  rating?: number; // 1-5
}

export interface PortfolioItem {
  id: string;
  store_id: string;
  service_id?: string;
  title: string;
  slug: string;
  client_name?: string;
  description?: string;
  images: PortfolioImage[];
  video_url?: string;
  results?: string;
  tags: string[];
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Extended fields from modular migration
  before_image_url?: string;
  after_image_url?: string;
  external_url?: string;
  project_date?: string;
  category?: string;
  testimonial?: PortfolioTestimonial;
  // Joined data
  service_name?: string;
}

// Categories for filtering portfolio items
export const portfolioCategories = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "renovation", label: "Renovation" },
  { value: "new-construction", label: "New Construction" },
  { value: "repair", label: "Repair" },
  { value: "maintenance", label: "Maintenance" },
  { value: "transformation", label: "Transformation" },
  { value: "styling", label: "Styling" },
  { value: "web-design", label: "Web Design" },
  { value: "web-development", label: "Web Development" },
  { value: "branding", label: "Branding" },
  { value: "photography", label: "Photography" },
  { value: "other", label: "Other" },
] as const;

export type PortfolioCategory = typeof portfolioCategories[number]["value"];

/**
 * Generate URL-safe slug from title
 */
export function generatePortfolioSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}
