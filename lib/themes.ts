// Theme presets for services template
// Inspired by the reference Pointer Roofing project (gold accent)

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
    description: "Classic gold accent, inspired by trusted service businesses",
    colors: {
      brand: "#FFD700",
      brandDark: "#e6c200",
      bgPrimary: "#ffffff",
      bgSecondary: "#f9fafb",
      bgDark: "#1a1a1a",
      textPrimary: "#111827",
      textSecondary: "#4b5563",
    },
    dark: {
      bgPrimary: "#111827",
      bgSecondary: "#1f2937",
      textPrimary: "#f9fafb",
      textSecondary: "#d1d5db",
    },
    preview: {
      primary: "#FFD700",
      accent: "#e6c200",
      background: "#ffffff",
    },
    isPremium: false,
  },
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Clean, professional blue theme",
    colors: {
      brand: "#3b82f6",
      brandDark: "#2563eb",
      bgPrimary: "#ffffff",
      bgSecondary: "#f8fafc",
      bgDark: "#0f172a",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
    },
    dark: {
      bgPrimary: "#0f172a",
      bgSecondary: "#1e293b",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
    },
    preview: {
      primary: "#3b82f6",
      accent: "#2563eb",
      background: "#f8fafc",
    },
    isPremium: false,
  },
  {
    id: "elegant-green",
    name: "Elegant Green",
    description: "Fresh, eco-friendly appearance",
    colors: {
      brand: "#10b981",
      brandDark: "#059669",
      bgPrimary: "#ffffff",
      bgSecondary: "#f0fdf4",
      bgDark: "#064e3b",
      textPrimary: "#064e3b",
      textSecondary: "#047857",
    },
    dark: {
      bgPrimary: "#064e3b",
      bgSecondary: "#065f46",
      textPrimary: "#f0fdf4",
      textSecondary: "#a7f3d0",
    },
    preview: {
      primary: "#10b981",
      accent: "#059669",
      background: "#f0fdf4",
    },
    isPremium: true,
  },
  {
    id: "bold-orange",
    name: "Bold Orange",
    description: "Energetic and attention-grabbing",
    colors: {
      brand: "#f97316",
      brandDark: "#ea580c",
      bgPrimary: "#ffffff",
      bgSecondary: "#fff7ed",
      bgDark: "#7c2d12",
      textPrimary: "#1c1917",
      textSecondary: "#57534e",
    },
    dark: {
      bgPrimary: "#7c2d12",
      bgSecondary: "#9a3412",
      textPrimary: "#fff7ed",
      textSecondary: "#fed7aa",
    },
    preview: {
      primary: "#f97316",
      accent: "#ea580c",
      background: "#fff7ed",
    },
    isPremium: true,
  },
  {
    id: "luxe-purple",
    name: "Luxe Purple",
    description: "Premium, sophisticated feel",
    colors: {
      brand: "#8b5cf6",
      brandDark: "#7c3aed",
      bgPrimary: "#ffffff",
      bgSecondary: "#faf5ff",
      bgDark: "#2e1065",
      textPrimary: "#1e1b4b",
      textSecondary: "#4338ca",
    },
    dark: {
      bgPrimary: "#2e1065",
      bgSecondary: "#3b0764",
      textPrimary: "#faf5ff",
      textSecondary: "#e9d5ff",
    },
    preview: {
      primary: "#8b5cf6",
      accent: "#7c3aed",
      background: "#faf5ff",
    },
    isPremium: true,
  },
  {
    id: "trust-teal",
    name: "Trust Teal",
    description: "Calm, reliable, trustworthy",
    colors: {
      brand: "#14b8a6",
      brandDark: "#0d9488",
      bgPrimary: "#ffffff",
      bgSecondary: "#f0fdfa",
      bgDark: "#134e4a",
      textPrimary: "#0f172a",
      textSecondary: "#0f766e",
    },
    dark: {
      bgPrimary: "#134e4a",
      bgSecondary: "#115e59",
      textPrimary: "#f0fdfa",
      textSecondary: "#99f6e4",
    },
    preview: {
      primary: "#14b8a6",
      accent: "#0d9488",
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
