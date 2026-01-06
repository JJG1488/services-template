import { createFreshAdminClient, getStoreId, isBuildTime } from "@/lib/supabase";
import { getStoreConfig } from "@/lib/store";

// Re-export types and utilities from business-types module for backward compatibility
export {
  type BusinessType,
  type BusinessCategory,
  type EnabledFeatures,
  defaultFeatures,
  businessCategories,
  businessTypeInfo,
  categoryContentPresets,
  getBusinessTypeInfo,
  getCategoryForType,
  getTypesInCategory,
  getContentPreset,
  getFeatureDefaults,
  hasModifiedFeatures,
  getModifiedFeatures,
  featureMetadata,
  featureGroups,
  legacyTypeMapping,
  migrateBusinessType,
  migrateLegacyFeatures,
} from "./business-types";

import {
  type BusinessType,
  type EnabledFeatures,
  defaultFeatures,
  getFeatureDefaults,
  getContentPreset,
  businessTypeInfo,
  migrateBusinessType,
  migrateLegacyFeatures,
} from "./business-types";

/**
 * Legacy business type presets for backward compatibility
 * @deprecated Use businessTypeInfo from business-types.ts instead
 */
export const businessTypePresets: Record<string, EnabledFeatures> = {
  restaurant: getFeatureDefaults("restaurant"),
  catering: getFeatureDefaults("catering"),
  contractor: getFeatureDefaults("general_contractor"),
  salon: getFeatureDefaults("salon"),
  professional: getFeatureDefaults("consultant"),
  cleaning: getFeatureDefaults("cleaning"),
  custom: defaultFeatures,
};

/**
 * Legacy business type labels for backward compatibility
 * @deprecated Use businessTypeInfo from business-types.ts instead
 */
export const businessTypeLabels: Record<string, string> = {
  restaurant: "Restaurant / Food Service",
  catering: "Catering / Events",
  contractor: "Contractor / Home Services",
  salon: "Salon / Spa / Beauty",
  professional: "Professional Services",
  cleaning: "Cleaning Service",
  custom: "Custom (Configure Manually)",
};

/**
 * Process step for the "How It Works" section
 */
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon?: string;
}

/**
 * Stat/counter for the stats section
 */
export interface StatItem {
  value: string;
  label: string;
}

/**
 * Trust badge for hero section
 */
export interface TrustBadge {
  text: string;
  icon: string; // 'shield' | 'award' | 'star' | 'check-circle'
}

/**
 * Specialty item (generic materials/products/focuses)
 */
export interface SpecialtyItem {
  id: string;
  name: string;
  description: string;
}

/**
 * Additional service quick item
 */
export interface AdditionalService {
  title: string;
  description: string;
  icon: string; // emoji or lucide icon name
}

/**
 * Commitment badge
 */
export interface CommitmentBadge {
  icon: string;
  title: string;
  description: string;
  color: string; // hex color
}

/**
 * Testimonial/review
 */
export interface Testimonial {
  id: string;
  rating: number; // 1-5
  text: string;
  reviewerName: string;
  date?: string;
}

/**
 * Runtime store settings for services template
 */
export interface RuntimeSettings {
  // Business Type System (Enhanced v9.37)
  businessType: BusinessType;
  businessCategory?: string; // New: stores category for UI display
  enabledFeatures: EnabledFeatures;
  featuresModified?: boolean; // Track if user customized features from defaults

  // Branding
  themePreset: string;
  brandColor: string; // Admin-configurable brand color (hex)
  logoUrl: string;

  // Content
  tagline: string;
  aboutText: string;

  // Contact configuration
  contactMode: 'form' | 'calendly' | 'phone';
  calendlyUrl: string;
  phoneNumber: string;

  // Booking configuration (Enhanced v9.37)
  bookingUrl: string;
  bookingDisplayMode: 'embed' | 'popup' | 'link';
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
  showPortfolio: boolean;
  showFaq: boolean;
  showWhyChooseUs: boolean;
  showSpecialties: boolean;
  showAdditionalServices: boolean;
  showBadges: boolean;
  showMapEmbed: boolean;
  showEmergencyBanner: boolean; // New: linked to emergencyServices feature

  // Process steps (How It Works)
  process: ProcessStep[];
  processTitle: string;
  processSubtitle: string;
  processCTAText: string;

  // Stats section
  stats: StatItem[];

  // Hero configuration
  heroStyle: 'image' | 'video' | 'gradient';
  heroImageUrl: string;
  heroVideoUrl: string;
  heroBadgeText: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroSubheading: string;
  trustBadges: TrustBadge[];
  heroCTAText: string;
  heroSecondaryCTAText: string;

  // Why Choose Us section
  whyChooseUsTitle: string;
  whyChooseUsHeading: string;
  whyChooseUsText: string;
  emergencyBannerText: string;
  emergencyBannerEnabled: boolean;

  // Specialties section
  specialtiesTitle: string;
  specialties: SpecialtyItem[];

  // Additional Services section
  additionalServicesTitle: string;
  additionalServices: AdditionalService[];

  // Commitment Badges section
  badgesTitle: string;
  badgesSubtitle: string;
  badges: CommitmentBadge[];

  // Testimonials section
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

  // Business info
  businessHours: string;
  serviceAreas: string[];

  // Social links
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
}

/**
 * Default settings from environment variables
 * Uses content presets from business-types module
 */
function getDefaultSettings(): RuntimeSettings {
  const config = getStoreConfig();
  const defaultType: BusinessType = "custom";
  const contentPreset = getContentPreset(defaultType);

  return {
    // Business Type System (Enhanced v9.37)
    businessType: defaultType,
    businessCategory: undefined,
    enabledFeatures: defaultFeatures,
    featuresModified: false,

    // Branding
    themePreset: config.themePreset || "default",
    brandColor: config.primaryColor || "#FFD700",
    logoUrl: config.logoUrl || "",
    tagline: config.tagline || "",
    aboutText: config.aboutText || "",

    // Contact defaults
    contactMode: 'form',
    calendlyUrl: "",
    phoneNumber: config.contactPhone || "",

    // Booking configuration (Enhanced v9.37)
    bookingUrl: "",
    bookingDisplayMode: 'embed',
    bookingButtonText: "Book Now",
    bookingDescription: "Schedule your appointment online",
    showBookingOnHero: false,
    showBookingOnServicePages: false,
    showBookingPage: true,

    // Section defaults
    showProcess: true,
    showStats: true,
    showTeam: false,
    showTestimonials: true,
    showPortfolio: false,
    showFaq: true,
    showWhyChooseUs: true,
    showSpecialties: false,
    showAdditionalServices: false,
    showBadges: true,
    showMapEmbed: false,
    showEmergencyBanner: contentPreset.emergencyBannerEnabled,

    // Process steps
    process: [
      { step: 1, title: "Get a Free Estimate", description: "Contact us for a no-obligation quote", icon: "clipboard" },
      { step: 2, title: "We Recommend Options", description: "Our experts suggest the best solutions", icon: "message-square" },
      { step: 3, title: "We Get It Done", description: "Professional service delivered on time", icon: "check-circle" },
    ],
    processTitle: "Our Simple Process",
    processSubtitle: "From consultation to completion, we make it easy",
    processCTAText: "Get Your Free Estimate",

    // Stats
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "500+", label: "Happy Customers" },
      { value: "100%", label: "Satisfaction Rate" },
    ],

    // Hero
    heroStyle: 'gradient',
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

    // Why Choose Us
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Quality You Can Trust",
    whyChooseUsText: "We are committed to providing exceptional service with integrity, professionalism, and attention to detail. Our team of experts brings years of experience to every project.",
    emergencyBannerText: "Available for Emergency Services!",
    emergencyBannerEnabled: false,

    // Specialties
    specialtiesTitle: "Our Specialties",
    specialties: [],

    // Additional Services
    additionalServicesTitle: "Additional Services",
    additionalServices: [],

    // Commitment Badges
    badgesTitle: "Our Commitment to Excellence",
    badgesSubtitle: "Why customers choose us for their service needs",
    badges: [
      { icon: "shield", title: "Fully Insured", description: "Complete protection for your peace of mind", color: "#0ea5e9" },
      { icon: "award", title: "Certified Experts", description: "Licensed professionals you can count on", color: "#10b981" },
      { icon: "wrench", title: "Quality Work", description: "Premium materials and expert craftsmanship", color: "#f59e0b" },
      { icon: "check-circle", title: "Guaranteed", description: "100% satisfaction guaranteed", color: "#8b5cf6" },
    ],

    // Testimonials
    testimonialsTitle: "What Our Customers Say",
    testimonialsSubtitle: "Real reviews from satisfied customers",
    overallRating: 5.0,
    reviewCount: 0,
    googleReviewsUrl: "",
    testimonials: [],

    // Footer
    mapEmbedUrl: "",
    mapTitle: "Our Service Area",
    address: config.address || "",

    // Business info
    businessHours: "Mon-Fri 9am-5pm",
    serviceAreas: [],

    // Social links
    instagramUrl: config.instagramUrl || "",
    facebookUrl: config.facebookUrl || "",
    twitterUrl: config.twitterUrl || "",
    linkedinUrl: config.linkedinUrl || "",
  };
}

/**
 * Fetches all runtime settings from the database.
 * Falls back to environment variables if database is unavailable.
 * Includes migration logic for legacy 7-type business type system.
 */
export async function getStoreSettingsFromDB(): Promise<RuntimeSettings> {
  const defaults = getDefaultSettings();

  if (isBuildTime()) {
    return defaults;
  }

  try {
    const supabase = createFreshAdminClient();
    const storeId = getStoreId();

    if (!supabase || !storeId) {
      return defaults;
    }

    const { data: rows } = await supabase
      .from("store_settings")
      .select("settings")
      .eq("store_id", storeId)
      .limit(1);
    const data = rows?.[0] || null;

    if (data?.settings) {
      const s = data.settings;

      // Migration: Convert legacy business type to new system
      let businessType = s.businessType || defaults.businessType;
      let enabledFeatures = s.enabledFeatures || defaults.enabledFeatures;

      // Check if this is a legacy 7-type business type (restaurant, catering, contractor, salon, professional, cleaning, custom)
      const legacyTypes = ["restaurant", "catering", "contractor", "salon", "professional", "cleaning", "custom"];
      if (legacyTypes.includes(businessType) && !businessTypeInfo[businessType as BusinessType]) {
        // Migrate to new type system
        businessType = migrateBusinessType(businessType);
      }

      // Migrate legacy 7-feature system to new 14-feature system
      if (enabledFeatures && !("emergencyServices" in enabledFeatures)) {
        enabledFeatures = migrateLegacyFeatures(enabledFeatures);
      }

      // Merge database settings with defaults (DB takes precedence)
      return {
        // Business Type System (Enhanced v9.37)
        businessType: businessType as BusinessType,
        businessCategory: s.businessCategory,
        enabledFeatures,
        featuresModified: s.featuresModified ?? false,

        // Branding
        themePreset: s.themePreset || defaults.themePreset,
        brandColor: s.brandColor || defaults.brandColor,
        logoUrl: s.logoUrl || defaults.logoUrl,
        tagline: s.tagline ?? defaults.tagline,
        aboutText: s.aboutText ?? defaults.aboutText,

        // Contact
        contactMode: s.contactMode || defaults.contactMode,
        calendlyUrl: s.calendlyUrl ?? defaults.calendlyUrl,
        phoneNumber: s.phoneNumber ?? defaults.phoneNumber,

        // Booking configuration (Enhanced v9.37)
        bookingUrl: s.bookingUrl ?? defaults.bookingUrl,
        bookingDisplayMode: s.bookingDisplayMode || defaults.bookingDisplayMode,
        bookingButtonText: s.bookingButtonText ?? defaults.bookingButtonText,
        bookingDescription: s.bookingDescription ?? defaults.bookingDescription,
        showBookingOnHero: s.showBookingOnHero ?? defaults.showBookingOnHero,
        showBookingOnServicePages: s.showBookingOnServicePages ?? defaults.showBookingOnServicePages,
        showBookingPage: s.showBookingPage ?? defaults.showBookingPage,

        // Section toggles
        showProcess: s.showProcess ?? defaults.showProcess,
        showStats: s.showStats ?? defaults.showStats,
        showTeam: s.showTeam ?? defaults.showTeam,
        showTestimonials: s.showTestimonials ?? defaults.showTestimonials,
        showPortfolio: s.showPortfolio ?? defaults.showPortfolio,
        showFaq: s.showFaq ?? defaults.showFaq,
        showWhyChooseUs: s.showWhyChooseUs ?? defaults.showWhyChooseUs,
        showSpecialties: s.showSpecialties ?? defaults.showSpecialties,
        showAdditionalServices: s.showAdditionalServices ?? defaults.showAdditionalServices,
        showBadges: s.showBadges ?? defaults.showBadges,
        showMapEmbed: s.showMapEmbed ?? defaults.showMapEmbed,
        showEmergencyBanner: s.showEmergencyBanner ?? s.emergencyBannerEnabled ?? defaults.showEmergencyBanner,

        // Process steps
        process: s.process || defaults.process,
        processTitle: s.processTitle ?? defaults.processTitle,
        processSubtitle: s.processSubtitle ?? defaults.processSubtitle,
        processCTAText: s.processCTAText ?? defaults.processCTAText,

        // Stats
        stats: s.stats || defaults.stats,

        // Hero
        heroStyle: s.heroStyle || defaults.heroStyle,
        heroImageUrl: s.heroImageUrl ?? defaults.heroImageUrl,
        heroVideoUrl: s.heroVideoUrl ?? defaults.heroVideoUrl,
        heroBadgeText: s.heroBadgeText ?? defaults.heroBadgeText,
        heroHeading: s.heroHeading ?? defaults.heroHeading,
        heroHeadingAccent: s.heroHeadingAccent ?? defaults.heroHeadingAccent,
        heroSubheading: s.heroSubheading ?? defaults.heroSubheading,
        trustBadges: s.trustBadges || defaults.trustBadges,
        heroCTAText: s.heroCTAText ?? defaults.heroCTAText,
        heroSecondaryCTAText: s.heroSecondaryCTAText ?? defaults.heroSecondaryCTAText,

        // Why Choose Us
        whyChooseUsTitle: s.whyChooseUsTitle ?? defaults.whyChooseUsTitle,
        whyChooseUsHeading: s.whyChooseUsHeading ?? defaults.whyChooseUsHeading,
        whyChooseUsText: s.whyChooseUsText ?? defaults.whyChooseUsText,
        emergencyBannerText: s.emergencyBannerText ?? defaults.emergencyBannerText,
        emergencyBannerEnabled: s.emergencyBannerEnabled ?? defaults.emergencyBannerEnabled,

        // Specialties
        specialtiesTitle: s.specialtiesTitle ?? defaults.specialtiesTitle,
        specialties: s.specialties || defaults.specialties,

        // Additional Services
        additionalServicesTitle: s.additionalServicesTitle ?? defaults.additionalServicesTitle,
        additionalServices: s.additionalServices || defaults.additionalServices,

        // Commitment Badges
        badgesTitle: s.badgesTitle ?? defaults.badgesTitle,
        badgesSubtitle: s.badgesSubtitle ?? defaults.badgesSubtitle,
        badges: s.badges || defaults.badges,

        // Testimonials
        testimonialsTitle: s.testimonialsTitle ?? defaults.testimonialsTitle,
        testimonialsSubtitle: s.testimonialsSubtitle ?? defaults.testimonialsSubtitle,
        overallRating: s.overallRating ?? defaults.overallRating,
        reviewCount: s.reviewCount ?? defaults.reviewCount,
        googleReviewsUrl: s.googleReviewsUrl ?? defaults.googleReviewsUrl,
        testimonials: s.testimonials || defaults.testimonials,

        // Footer
        mapEmbedUrl: s.mapEmbedUrl ?? defaults.mapEmbedUrl,
        mapTitle: s.mapTitle ?? defaults.mapTitle,
        address: s.address ?? defaults.address,

        // Business info
        businessHours: s.businessHours ?? defaults.businessHours,
        serviceAreas: s.serviceAreas || defaults.serviceAreas,

        // Social
        instagramUrl: s.instagramUrl ?? defaults.instagramUrl,
        facebookUrl: s.facebookUrl ?? defaults.facebookUrl,
        twitterUrl: s.twitterUrl ?? defaults.twitterUrl,
        linkedinUrl: s.linkedinUrl ?? defaults.linkedinUrl,
      };
    }
  } catch (error) {
    console.error("Failed to fetch settings from DB:", error);
  }

  return defaults;
}

/**
 * Apply content presets from a business type to settings
 * Used when user selects a new business type
 */
export function applyBusinessTypePresets(
  currentSettings: Partial<RuntimeSettings>,
  type: BusinessType,
  applyContentDefaults: boolean = true
): Partial<RuntimeSettings> {
  const info = businessTypeInfo[type];
  if (!info) return currentSettings;

  const contentPreset = getContentPreset(type);
  const updatedSettings: Partial<RuntimeSettings> = {
    ...currentSettings,
    businessType: type,
    businessCategory: info.category,
    enabledFeatures: info.features,
    featuresModified: false,
  };

  // Optionally apply content defaults (hero text, badges, process steps)
  if (applyContentDefaults) {
    updatedSettings.heroHeading = contentPreset.heroHeading;
    updatedSettings.heroHeadingAccent = contentPreset.heroHeadingAccent;
    updatedSettings.heroSubheading = contentPreset.heroSubheading;
    updatedSettings.heroBadgeText = contentPreset.heroBadgeText;
    updatedSettings.heroCTAText = contentPreset.heroCTAText;
    updatedSettings.heroSecondaryCTAText = contentPreset.heroSecondaryCTAText;
    updatedSettings.trustBadges = contentPreset.trustBadges;
    updatedSettings.process = contentPreset.processSteps;
    updatedSettings.processTitle = contentPreset.processTitle;
    updatedSettings.processSubtitle = contentPreset.processSubtitle;
    updatedSettings.processCTAText = contentPreset.processCTAText;
    updatedSettings.whyChooseUsTitle = contentPreset.whyChooseUsTitle;
    updatedSettings.whyChooseUsHeading = contentPreset.whyChooseUsHeading;
    updatedSettings.whyChooseUsText = contentPreset.whyChooseUsText;
    updatedSettings.emergencyBannerText = contentPreset.emergencyBannerText;
    updatedSettings.emergencyBannerEnabled = contentPreset.emergencyBannerEnabled;
    updatedSettings.showEmergencyBanner = contentPreset.emergencyBannerEnabled;
  }

  return updatedSettings;
}
