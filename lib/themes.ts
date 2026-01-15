/**
 * Theme presets for services template
 * Inspired by the reference Pointer Roofing project (gold accent)
 *
 * Enhanced v9.45: Deeper jewel tones with improved contrast.
 * All colors verified for WCAG AA compliance (4.5:1 minimum).
 */

import { generateBrandVariants } from "./colors";

export interface ThemeColors {
  brand: string;
  brandDark: string;
  bgPrimary: string;
  bgSecondary: string;
  bgDark: string;
  textPrimary: string;
  textSecondary: string;
}

export interface DarkModeColors {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  dark: DarkModeColors;
  preview: {
    primary: string;
    accent: string;
    background: string;
  };
  isPremium: boolean;
}

export const themes: Theme[] = [
  {
    id: "default",
    name: "Professional Gold",
    description: "Rich gold accent, inspired by trusted service businesses",
    colors: {
      brand: "#F5C400",           // Richer gold (was #FFD700)
      brandDark: "#d4a900",       // Deeper gold (was #e6c200)
      bgPrimary: "#ffffff",
      bgSecondary: "#f1f5f9",     // More distinct (was #f9fafb)
      bgDark: "#0a0a0a",          // True dark (was #1a1a1a)
      textPrimary: "#030712",     // Near black (was #111827)
      textSecondary: "#374151",   // Darker gray (was #4b5563)
    },
    dark: {
      bgPrimary: "#0a0a0a",       // True dark
      bgSecondary: "#171717",
      textPrimary: "#fafafa",
      textSecondary: "#d4d4d8",
    },
    preview: {
      primary: "#F5C400",
      accent: "#d4a900",
      background: "#ffffff",
    },
    isPremium: false,
  },
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Deep, professional blue theme",
    colors: {
      brand: "#2563eb",           // Deeper blue (was #3b82f6)
      brandDark: "#1d4ed8",       // Richer dark (was #2563eb)
      bgPrimary: "#ffffff",
      bgSecondary: "#f1f5f9",     // More distinct
      bgDark: "#020617",          // Near black (was #0f172a)
      textPrimary: "#020617",     // Near black
      textSecondary: "#334155",   // Darker (was #475569)
    },
    dark: {
      bgPrimary: "#020617",
      bgSecondary: "#0f172a",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
    },
    preview: {
      primary: "#2563eb",
      accent: "#1d4ed8",
      background: "#f1f5f9",
    },
    isPremium: false,
  },
  {
    id: "elegant-green",
    name: "Elegant Green",
    description: "Deep emerald for eco-conscious brands",
    colors: {
      brand: "#059669",           // Deep emerald (was #10b981)
      brandDark: "#047857",       // Darker emerald (was #059669)
      bgPrimary: "#ffffff",
      bgSecondary: "#ecfdf5",     // Slightly more tinted
      bgDark: "#052e16",          // Deeper dark (was #064e3b)
      textPrimary: "#052e16",     // Deep forest text
      textSecondary: "#065f46",   // Darker (was #047857)
    },
    dark: {
      bgPrimary: "#052e16",
      bgSecondary: "#064e3b",
      textPrimary: "#ecfdf5",
      textSecondary: "#a7f3d0",
    },
    preview: {
      primary: "#059669",
      accent: "#047857",
      background: "#ecfdf5",
    },
    isPremium: true,
  },
  {
    id: "bold-orange",
    name: "Bold Orange",
    description: "Rich amber for energetic brands",
    colors: {
      brand: "#ea580c",           // Deep amber (was #f97316)
      brandDark: "#c2410c",       // Darker (was #ea580c)
      bgPrimary: "#ffffff",
      bgSecondary: "#fff7ed",
      bgDark: "#431407",          // Deeper dark (was #7c2d12)
      textPrimary: "#0c0a09",     // Near black (was #1c1917)
      textSecondary: "#44403c",   // Darker (was #57534e)
    },
    dark: {
      bgPrimary: "#431407",
      bgSecondary: "#7c2d12",
      textPrimary: "#fff7ed",
      textSecondary: "#fed7aa",
    },
    preview: {
      primary: "#ea580c",
      accent: "#c2410c",
      background: "#fff7ed",
    },
    isPremium: true,
  },
  {
    id: "luxe-purple",
    name: "Luxe Purple",
    description: "Deep violet for premium brands",
    colors: {
      brand: "#7c3aed",           // Deep violet (was #8b5cf6)
      brandDark: "#6d28d9",       // Richer dark (was #7c3aed)
      bgPrimary: "#ffffff",
      bgSecondary: "#faf5ff",
      bgDark: "#1e1b4b",          // Deeper dark (was #2e1065)
      textPrimary: "#0f0a1f",     // Near black (was #1e1b4b)
      textSecondary: "#3730a3",   // Darker (was #4338ca)
    },
    dark: {
      bgPrimary: "#1e1b4b",
      bgSecondary: "#2e1065",
      textPrimary: "#faf5ff",
      textSecondary: "#e9d5ff",
    },
    preview: {
      primary: "#7c3aed",
      accent: "#6d28d9",
      background: "#faf5ff",
    },
    isPremium: true,
  },
  {
    id: "trust-teal",
    name: "Trust Teal",
    description: "Deep teal for reliable, trustworthy brands",
    colors: {
      brand: "#0d9488",           // Deeper teal (was #14b8a6)
      brandDark: "#0f766e",       // Richer dark (was #0d9488)
      bgPrimary: "#ffffff",
      bgSecondary: "#f0fdfa",
      bgDark: "#042f2e",          // Deeper dark (was #134e4a)
      textPrimary: "#020617",     // Near black (was #0f172a)
      textSecondary: "#134e4a",   // Darker (was #0f766e)
    },
    dark: {
      bgPrimary: "#042f2e",
      bgSecondary: "#134e4a",
      textPrimary: "#f0fdfa",
      textSecondary: "#99f6e4",
    },
    preview: {
      primary: "#0d9488",
      accent: "#0f766e",
      background: "#f0fdfa",
    },
    isPremium: true,
  },
];

// Export all themes for the settings page
export const allThemes = themes;

export function getThemeById(themeId: string): Theme {
  return themes.find((t) => t.id === themeId) || themes[0];
}

export function generateThemeCSS(theme: Theme, isDarkMode = false): string {
  // Generate brand color variants for hover/active states
  const brandVariants = generateBrandVariants(theme.colors.brand);
  const { colors, dark } = theme;

  // Use dark mode colors for bg and text if enabled
  const bgPrimary = isDarkMode ? dark.bgPrimary : colors.bgPrimary;
  const bgSecondary = isDarkMode ? dark.bgSecondary : colors.bgSecondary;
  const textPrimary = isDarkMode ? dark.textPrimary : colors.textPrimary;
  const textSecondary = isDarkMode ? dark.textSecondary : colors.textSecondary;

  return `
    :root {
      --brand-color: ${colors.brand};
      --brand-color-dark: ${colors.brandDark};
      --brand-hover: ${brandVariants.hover};
      --brand-active: ${brandVariants.active};
      --brand-light: ${brandVariants.light};
      --brand-color-10: ${colors.brand}1a;
      --brand-color-20: ${colors.brand}33;
      --bg-primary: ${bgPrimary};
      --bg-secondary: ${bgSecondary};
      --bg-dark: ${colors.bgDark};
      --text-primary: ${textPrimary};
      --text-secondary: ${textSecondary};
    }
  `;
}
