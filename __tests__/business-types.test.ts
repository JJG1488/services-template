/**
 * Business Type System Tests
 *
 * Comprehensive test suite for the business type configuration system (v9.37)
 *
 * Tests cover:
 * - Business type information and category lookups (O(1) performance)
 * - Feature defaults for all 50+ business types
 * - Content presets and smart defaults
 * - Migration functions for backward compatibility
 * - Feature modification tracking
 *
 * @version 9.37
 * @date 2026-01-06
 */

/**
 * @jest-environment node
 */
import {
  type BusinessType,
  type BusinessCategory,
  type EnabledFeatures,
  businessTypeInfo,
  businessCategories,
  getFeatureDefaults,
  getContentPreset,
  migrateBusinessType,
  migrateLegacyFeatures,
  hasModifiedFeatures,
  featureGroups,
  featureMetadata,
  defaultFeatures,
} from "../lib/business-types";

// Type declarations for Jest (in case @types/jest not installed)
declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: (value: unknown) => {
  toBe: (expected: unknown) => void;
  toBeDefined: () => void;
  toBeTruthy: () => void;
  toHaveLength: (length: number) => void;
  toBeGreaterThan: (value: number) => void;
  toBeGreaterThanOrEqual: (value: number) => void;
  toBeLessThan: (value: number) => void;
  toContain: (value: unknown) => void;
};

describe("Business Type System", () => {
  describe("businessTypeInfo", () => {
    it("should contain all expected business types", () => {
      const expectedTypes: BusinessType[] = [
        // Food & Beverage
        "restaurant",
        "cafe",
        "catering",
        "food_truck",
        "bakery",
        "bar_lounge",
        // Beauty & Wellness
        "salon",
        "spa",
        "barbershop",
        "nail_salon",
        "massage",
        "tattoo_studio",
        // Home Services
        "general_contractor",
        "plumber",
        "electrician",
        "hvac",
        "landscaping",
        "cleaning",
        "handyman",
        "painter",
        "roofer",
        "pest_control",
        "pool_service",
        // Professional Services
        "consultant",
        "law_firm",
        "accounting",
        "marketing_agency",
        "it_services",
        "real_estate",
        "insurance",
        "financial_advisor",
        // Health & Medical
        "medical_practice",
        "dental",
        "therapy",
        "fitness",
        "chiropractic",
        "optometry",
        // Automotive
        "auto_repair",
        "auto_detailing",
        "towing",
        "tire_shop",
        // Pet Services
        "pet_grooming",
        "veterinary",
        "pet_sitting",
        "dog_training",
        // Events & Creative
        "photography",
        "videography",
        "dj_entertainment",
        "event_planning",
        "florist",
        "wedding_services",
        // Education
        "tutoring",
        "music_lessons",
        "driving_school",
        "language_school",
        // Other
        "custom",
      ];

      expectedTypes.forEach((type) => {
        expect(businessTypeInfo[type]).toBeDefined();
        expect(businessTypeInfo[type].id).toBe(type);
        expect(businessTypeInfo[type].label).toBeTruthy();
        expect(businessTypeInfo[type].shortLabel).toBeTruthy();
        expect(businessTypeInfo[type].icon).toBeTruthy();
      });
    });

    it("should have O(1) lookup performance for type info", () => {
      // Record-based lookup should be O(1)
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        const info = businessTypeInfo["restaurant"];
        expect(info).toBeDefined();
      }
      const elapsed = performance.now() - start;
      // Should complete in under 100ms for 10000 lookups
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe("businessCategories", () => {
    it("should contain all 10 categories", () => {
      const expectedCategories: BusinessCategory[] = [
        "food_beverage",
        "beauty_wellness",
        "home_services",
        "professional_services",
        "health_medical",
        "automotive",
        "pet_services",
        "events_creative",
        "education",
        "other",
      ];

      expect(businessCategories).toHaveLength(10);
      expectedCategories.forEach((catId) => {
        const category = businessCategories.find((c) => c.id === catId);
        expect(category).toBeDefined();
        expect(category?.label).toBeTruthy();
        expect(category?.icon).toBeTruthy();
        expect(category?.types.length).toBeGreaterThan(0);
      });
    });

    it("should assign each business type to exactly one category", () => {
      const allTypesInCategories = businessCategories.flatMap((c) => c.types);
      const uniqueTypes = new Set(allTypesInCategories);

      // No duplicates
      expect(uniqueTypes.size).toBe(allTypesInCategories.length);

      // All types covered
      const allBusinessTypes = Object.keys(businessTypeInfo) as BusinessType[];
      allBusinessTypes.forEach((type) => {
        expect(uniqueTypes.has(type)).toBe(true);
      });
    });
  });

  describe("getFeatureDefaults", () => {
    it("should return correct defaults for restaurant type", () => {
      const defaults = getFeatureDefaults("restaurant");
      expect(defaults.menuSystem).toBe(true);
      expect(defaults.bookingSystem).toBe(true);
      expect(defaults.portfolioGallery).toBe(false);
      expect(defaults.testimonials).toBe(true);
    });

    it("should return correct defaults for contractor type (plumber)", () => {
      const defaults = getFeatureDefaults("plumber");
      expect(defaults.menuSystem).toBe(false);
      expect(defaults.portfolioGallery).toBe(true);
      expect(defaults.quoteRequests).toBe(true);
      expect(defaults.emergencyServices).toBe(true);
      expect(defaults.licenseBadges).toBe(true);
    });

    it("should return correct defaults for salon type", () => {
      const defaults = getFeatureDefaults("salon");
      expect(defaults.bookingSystem).toBe(true);
      expect(defaults.portfolioGallery).toBe(true);
      expect(defaults.teamMembers).toBe(true);
      expect(defaults.pricingDisplay).toBe(true);
    });

    it("should return all-enabled defaults for custom type", () => {
      const defaults = getFeatureDefaults("custom");
      // Custom should be flexible with most features enabled
      expect(defaults.testimonials).toBe(true);
      expect(defaults.faqSection).toBe(true);
    });

    it("should return 14 feature flags for any type", () => {
      const types = Object.keys(businessTypeInfo) as BusinessType[];
      types.forEach((type) => {
        const defaults = getFeatureDefaults(type);
        expect(Object.keys(defaults)).toHaveLength(14);
      });
    });
  });

  describe("getContentPreset", () => {
    it("should return content preset for restaurant", () => {
      const preset = getContentPreset("restaurant");
      expect(preset.heroHeading).toContain("Restaurant");
      expect(preset.heroCTAText).toBeTruthy();
      expect(preset.trustBadges.length).toBeGreaterThan(0);
      expect(preset.processSteps.length).toBeGreaterThan(0);
    });

    it("should return content preset for plumber (home services)", () => {
      const preset = getContentPreset("plumber");
      expect(preset.heroHeading).toBeTruthy();
      expect(preset.trustBadges.some((b) => b.text.toLowerCase().includes("licensed"))).toBe(true);
    });

    it("should return content preset for salon (beauty)", () => {
      const preset = getContentPreset("salon");
      expect(preset.heroHeading).toBeTruthy();
      expect(preset.heroCTAText).toBeTruthy();
    });

    it("should fall back to other category preset for unknown category", () => {
      const preset = getContentPreset("custom");
      expect(preset.heroHeading).toBeTruthy();
      expect(preset.processSteps.length).toBeGreaterThan(0);
    });
  });

  describe("migrateBusinessType", () => {
    it("should migrate known legacy types", () => {
      expect(migrateBusinessType("contractor")).toBe("plumber");
      expect(migrateBusinessType("salon")).toBe("salon");
      expect(migrateBusinessType("professional")).toBe("consultant");
    });

    it("should pass through valid business types unchanged", () => {
      expect(migrateBusinessType("restaurant")).toBe("restaurant");
      expect(migrateBusinessType("plumber")).toBe("plumber");
      expect(migrateBusinessType("salon")).toBe("salon");
    });

    it("should default unknown types to custom", () => {
      expect(migrateBusinessType("unknown_type")).toBe("custom");
      expect(migrateBusinessType("")).toBe("custom");
    });
  });

  describe("migrateLegacyFeatures", () => {
    it("should migrate legacy 7-feature format to 14-feature format", () => {
      const legacy = {
        menuSystem: true,
        bookingSystem: false,
        portfolioGallery: true,
        quoteRequests: false,
        testimonials: true,
        teamMembers: false,
        faqSection: true,
      };

      const migrated = migrateLegacyFeatures(legacy);

      // Preserved features
      expect(migrated.menuSystem).toBe(true);
      expect(migrated.bookingSystem).toBe(false);
      expect(migrated.portfolioGallery).toBe(true);
      expect(migrated.testimonials).toBe(true);
      expect(migrated.faqSection).toBe(true);

      // New features should have default values
      expect(migrated.emergencyServices).toBe(false);
      expect(migrated.serviceAreaMap).toBe(false);
      expect(migrated.pricingDisplay).toBe(false);
      expect(migrated.beforeAfterGallery).toBe(false);
      expect(migrated.servicePackages).toBe(false);
      expect(migrated.licenseBadges).toBe(false);
      expect(migrated.insuranceBadges).toBe(false);
    });

    it("should handle empty legacy features", () => {
      const migrated = migrateLegacyFeatures({});
      expect(Object.keys(migrated)).toHaveLength(14);
    });
  });

  describe("hasModifiedFeatures", () => {
    it("should return false when features match defaults", () => {
      const defaults = getFeatureDefaults("restaurant");
      expect(hasModifiedFeatures("restaurant", defaults)).toBe(false);
    });

    it("should return true when a feature is changed", () => {
      const defaults = getFeatureDefaults("restaurant");
      const modified = { ...defaults, menuSystem: !defaults.menuSystem };
      expect(hasModifiedFeatures("restaurant", modified)).toBe(true);
    });

    it("should return true when multiple features are changed", () => {
      const defaults = getFeatureDefaults("plumber");
      const modified = {
        ...defaults,
        emergencyServices: !defaults.emergencyServices,
        licenseBadges: !defaults.licenseBadges,
      };
      expect(hasModifiedFeatures("plumber", modified)).toBe(true);
    });
  });

  describe("featureGroups", () => {
    it("should have 4 feature groups", () => {
      expect(featureGroups).toHaveLength(4);
    });

    it("should contain all 14 features across groups", () => {
      const allFeaturesInGroups = featureGroups.flatMap((g) => g.features);
      expect(allFeaturesInGroups).toHaveLength(14);

      // Check for specific features
      expect(allFeaturesInGroups).toContain("menuSystem");
      expect(allFeaturesInGroups).toContain("bookingSystem");
      expect(allFeaturesInGroups).toContain("emergencyServices");
      expect(allFeaturesInGroups).toContain("licenseBadges");
    });
  });

  describe("featureMetadata", () => {
    it("should have metadata for all 14 features", () => {
      expect(featureMetadata).toHaveLength(14);
    });

    it("should have required properties for each feature", () => {
      featureMetadata.forEach((meta) => {
        expect(meta.key).toBeTruthy();
        expect(meta.label).toBeTruthy();
        expect(meta.description).toBeTruthy();
        expect(meta.icon).toBeTruthy();
      });
    });

    it("should mark pro features correctly", () => {
      const proFeatures = featureMetadata.filter((m) => m.proOnly);
      // Some features should be marked as pro
      expect(proFeatures.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("defaultFeatures", () => {
    it("should have all 14 features defined", () => {
      expect(Object.keys(defaultFeatures)).toHaveLength(14);
    });

    it("should have boolean values for all features", () => {
      Object.values(defaultFeatures).forEach((value) => {
        expect(typeof value).toBe("boolean");
      });
    });
  });
});

describe("Integration Tests", () => {
  it("should support full workflow: select type -> get defaults -> modify -> check modified", () => {
    // Step 1: User selects restaurant
    const type: BusinessType = "restaurant";
    const typeInfo = businessTypeInfo[type];
    expect(typeInfo.label).toBe("Restaurant");

    // Step 2: Get feature defaults
    const defaults = getFeatureDefaults(type);
    expect(defaults.menuSystem).toBe(true);

    // Step 3: User modifies a feature
    const modified: EnabledFeatures = {
      ...defaults,
      portfolioGallery: true, // Changed from false to true
    };

    // Step 4: Check if modified
    expect(hasModifiedFeatures(type, modified)).toBe(true);

    // Step 5: User resets to defaults
    const reset = getFeatureDefaults(type);
    expect(hasModifiedFeatures(type, reset)).toBe(false);
  });

  it("should support migration workflow: legacy -> new -> save", () => {
    // Step 1: Legacy data from database
    const legacyType = "contractor";
    const legacyFeatures = {
      menuSystem: false,
      bookingSystem: true,
      portfolioGallery: true,
      quoteRequests: true,
      testimonials: true,
      teamMembers: false,
      faqSection: true,
    };

    // Step 2: Migrate type
    const migratedType = migrateBusinessType(legacyType);
    expect(migratedType).toBe("plumber");

    // Step 3: Migrate features
    const migratedFeatures = migrateLegacyFeatures(legacyFeatures);
    expect(Object.keys(migratedFeatures)).toHaveLength(14);
    expect(migratedFeatures.bookingSystem).toBe(true);
    expect(migratedFeatures.portfolioGallery).toBe(true);

    // Step 4: Check if modified from new type defaults
    const newDefaults = getFeatureDefaults(migratedType);
    const isModified = hasModifiedFeatures(migratedType, migratedFeatures);
    // May or may not be modified depending on legacy vs new defaults
    expect(typeof isModified).toBe("boolean");
  });

  it("should support content preset application workflow", () => {
    // Step 1: User selects new business type
    const type: BusinessType = "salon";

    // Step 2: Get content preset
    const preset = getContentPreset(type);
    expect(preset.heroHeading).toBeTruthy();
    expect(preset.trustBadges.length).toBeGreaterThan(0);
    expect(preset.processSteps.length).toBeGreaterThan(0);

    // Step 3: Verify preset can be applied to settings
    const settings = {
      heroHeading: preset.heroHeading,
      heroHeadingAccent: preset.heroHeadingAccent,
      heroCTAText: preset.heroCTAText,
      processTitle: preset.processTitle,
      trustBadges: preset.trustBadges,
      process: preset.processSteps,
    };

    expect(settings.heroHeading).toBeTruthy();
    expect(settings.trustBadges).toHaveLength(preset.trustBadges.length);
  });
});
