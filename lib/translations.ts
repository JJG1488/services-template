// Lightweight i18n for deployed stores
// Reads NEXT_PUBLIC_LOCALE env var, loads the matching translation file

const locale = process.env.NEXT_PUBLIC_LOCALE || "en";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let messages: Record<string, any>;
try {
  // Dynamic require based on locale
  messages = require(`../messages/${locale}.json`);
} catch {
  // Fallback to English if locale file doesn't exist
  messages = require("../messages/en.json");
}

/**
 * Get a translated string by dot-notation key.
 * Supports simple placeholder replacement: t("cart.ariaLabel", { count: 3 })
 *
 * @example t("nav.shop") => "Shop"
 * @example t("cartIcon.ariaLabel", { count: 3 }) => "Cart with 3 items"
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = messages;
  for (const k of keys) {
    value = value?.[k];
  }

  if (typeof value !== "string") {
    return key; // Return key as fallback if not found
  }

  // Replace {placeholder} with values
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, name) =>
      params[name] !== undefined ? String(params[name]) : `{${name}}`
    );
  }

  return value;
}

/**
 * Get the current locale code
 */
export function getLocale(): string {
  return locale;
}

/**
 * Get text direction for the current locale
 */
export function getDir(): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
