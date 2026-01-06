/**
 * Business Type System - Enterprise-Grade Configuration
 *
 * Architecture Overview:
 * - Business types organized in categories for intuitive selection
 * - Each type has feature presets, content defaults, and industry-specific settings
 * - Users can override any defaults while maintaining type context
 * - Changes are tracked with "modified" indicators
 *
 * Performance: O(1) lookups via Record types
 * Memory: ~15KB for full configuration (acceptable for admin pages)
 */

// ============================================================================
// CORE TYPE DEFINITIONS
// ============================================================================

/**
 * Business type category - top-level grouping
 */
export type BusinessCategory =
  | "food_beverage"
  | "beauty_wellness"
  | "home_services"
  | "professional_services"
  | "health_medical"
  | "automotive"
  | "pet_services"
  | "events_creative"
  | "education"
  | "other";

/**
 * Business type - specific business within a category
 */
export type BusinessType =
  // Food & Beverage
  | "restaurant"
  | "cafe"
  | "catering"
  | "food_truck"
  | "bakery"
  | "bar_lounge"
  // Beauty & Wellness
  | "salon"
  | "spa"
  | "barbershop"
  | "nail_salon"
  | "massage"
  | "tattoo_studio"
  // Home Services
  | "general_contractor"
  | "plumber"
  | "electrician"
  | "hvac"
  | "landscaping"
  | "cleaning"
  | "handyman"
  | "painter"
  | "roofer"
  | "pest_control"
  | "pool_service"
  // Professional Services
  | "consultant"
  | "law_firm"
  | "accounting"
  | "marketing_agency"
  | "it_services"
  | "real_estate"
  | "insurance"
  | "financial_advisor"
  // Health & Medical
  | "medical_practice"
  | "dental"
  | "therapy"
  | "fitness"
  | "chiropractic"
  | "optometry"
  // Automotive
  | "auto_repair"
  | "auto_detailing"
  | "towing"
  | "tire_shop"
  // Pet Services
  | "pet_grooming"
  | "veterinary"
  | "pet_sitting"
  | "dog_training"
  // Events & Creative
  | "photography"
  | "videography"
  | "dj_entertainment"
  | "event_planning"
  | "florist"
  | "wedding_services"
  // Education
  | "tutoring"
  | "music_lessons"
  | "driving_school"
  | "language_school"
  // Other
  | "custom";

/**
 * Extended feature flags for granular control
 */
export interface EnabledFeatures {
  // Content Features
  menuSystem: boolean;           // Food/service menus
  portfolioGallery: boolean;     // Project/work showcase
  testimonials: boolean;         // Customer reviews
  teamMembers: boolean;          // Staff profiles
  faqSection: boolean;           // FAQ content

  // Booking & Contact Features
  bookingSystem: boolean;        // Appointment scheduling
  quoteRequests: boolean;        // Quote/estimate requests
  emergencyServices: boolean;    // 24/7 emergency contact

  // Display Features
  serviceAreaMap: boolean;       // Google Maps service area
  pricingDisplay: boolean;       // Show service prices
  beforeAfterGallery: boolean;   // Before/after comparisons
  servicePackages: boolean;      // Bundled service packages

  // Trust Features
  licenseBadges: boolean;        // Licenses/certifications display
  insuranceBadges: boolean;      // Insurance verification display
}

/**
 * Default features - all false for explicit opt-in
 */
export const defaultFeatures: EnabledFeatures = {
  menuSystem: false,
  portfolioGallery: false,
  testimonials: false,
  teamMembers: false,
  faqSection: false,
  bookingSystem: false,
  quoteRequests: false,
  emergencyServices: false,
  serviceAreaMap: false,
  pricingDisplay: false,
  beforeAfterGallery: false,
  servicePackages: false,
  licenseBadges: false,
  insuranceBadges: false,
};

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

export interface CategoryInfo {
  id: BusinessCategory;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  types: BusinessType[];
}

export const businessCategories: CategoryInfo[] = [
  {
    id: "food_beverage",
    label: "Food & Beverage",
    icon: "utensils",
    description: "Restaurants, cafes, catering, and food services",
    types: ["restaurant", "cafe", "catering", "food_truck", "bakery", "bar_lounge"],
  },
  {
    id: "beauty_wellness",
    label: "Beauty & Wellness",
    icon: "sparkles",
    description: "Salons, spas, and personal care services",
    types: ["salon", "spa", "barbershop", "nail_salon", "massage", "tattoo_studio"],
  },
  {
    id: "home_services",
    label: "Home Services",
    icon: "home",
    description: "Contractors, repairs, and maintenance",
    types: [
      "general_contractor", "plumber", "electrician", "hvac",
      "landscaping", "cleaning", "handyman", "painter",
      "roofer", "pest_control", "pool_service"
    ],
  },
  {
    id: "professional_services",
    label: "Professional Services",
    icon: "briefcase",
    description: "Consulting, legal, financial, and business services",
    types: [
      "consultant", "law_firm", "accounting", "marketing_agency",
      "it_services", "real_estate", "insurance", "financial_advisor"
    ],
  },
  {
    id: "health_medical",
    label: "Health & Medical",
    icon: "heart-pulse",
    description: "Medical practices, therapy, and fitness",
    types: ["medical_practice", "dental", "therapy", "fitness", "chiropractic", "optometry"],
  },
  {
    id: "automotive",
    label: "Automotive",
    icon: "car",
    description: "Auto repair, detailing, and vehicle services",
    types: ["auto_repair", "auto_detailing", "towing", "tire_shop"],
  },
  {
    id: "pet_services",
    label: "Pet Services",
    icon: "dog",
    description: "Grooming, veterinary, and pet care",
    types: ["pet_grooming", "veterinary", "pet_sitting", "dog_training"],
  },
  {
    id: "events_creative",
    label: "Events & Creative",
    icon: "camera",
    description: "Photography, entertainment, and event services",
    types: ["photography", "videography", "dj_entertainment", "event_planning", "florist", "wedding_services"],
  },
  {
    id: "education",
    label: "Education",
    icon: "graduation-cap",
    description: "Tutoring, lessons, and training",
    types: ["tutoring", "music_lessons", "driving_school", "language_school"],
  },
  {
    id: "other",
    label: "Other / Custom",
    icon: "settings",
    description: "Configure features manually",
    types: ["custom"],
  },
];

// ============================================================================
// BUSINESS TYPE METADATA
// ============================================================================

export interface BusinessTypeInfo {
  id: BusinessType;
  label: string;
  shortLabel: string;
  category: BusinessCategory;
  description: string;
  icon: string;
  features: EnabledFeatures;
}

/**
 * Complete business type definitions with smart defaults
 * O(1) lookup performance via Record
 */
export const businessTypeInfo: Record<BusinessType, BusinessTypeInfo> = {
  // Food & Beverage
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    shortLabel: "Restaurant",
    category: "food_beverage",
    description: "Full-service or quick-service restaurant",
    icon: "utensils",
    features: {
      ...defaultFeatures,
      menuSystem: true,
      testimonials: true,
      faqSection: true,
      bookingSystem: true,  // Reservations
      serviceAreaMap: true,
    },
  },
  cafe: {
    id: "cafe",
    label: "Cafe / Coffee Shop",
    shortLabel: "Cafe",
    category: "food_beverage",
    description: "Coffee shop or casual cafe",
    icon: "coffee",
    features: {
      ...defaultFeatures,
      menuSystem: true,
      testimonials: true,
      serviceAreaMap: true,
    },
  },
  catering: {
    id: "catering",
    label: "Catering Service",
    shortLabel: "Catering",
    category: "food_beverage",
    description: "Event and corporate catering",
    icon: "chefs-hat",
    features: {
      ...defaultFeatures,
      menuSystem: true,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      servicePackages: true,
    },
  },
  food_truck: {
    id: "food_truck",
    label: "Food Truck",
    shortLabel: "Food Truck",
    category: "food_beverage",
    description: "Mobile food service",
    icon: "truck",
    features: {
      ...defaultFeatures,
      menuSystem: true,
      testimonials: true,
      serviceAreaMap: true,
    },
  },
  bakery: {
    id: "bakery",
    label: "Bakery",
    shortLabel: "Bakery",
    category: "food_beverage",
    description: "Bakery and pastry shop",
    icon: "cake",
    features: {
      ...defaultFeatures,
      menuSystem: true,
      portfolioGallery: true,
      testimonials: true,
      serviceAreaMap: true,
      pricingDisplay: true,
    },
  },
  bar_lounge: {
    id: "bar_lounge",
    label: "Bar / Lounge",
    shortLabel: "Bar",
    category: "food_beverage",
    description: "Bar, pub, or lounge",
    icon: "wine",
    features: {
      ...defaultFeatures,
      menuSystem: true,
      testimonials: true,
      faqSection: true,
      serviceAreaMap: true,
    },
  },

  // Beauty & Wellness
  salon: {
    id: "salon",
    label: "Hair Salon",
    shortLabel: "Salon",
    category: "beauty_wellness",
    description: "Hair styling and beauty services",
    icon: "scissors",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      beforeAfterGallery: true,
    },
  },
  spa: {
    id: "spa",
    label: "Spa",
    shortLabel: "Spa",
    category: "beauty_wellness",
    description: "Day spa and wellness center",
    icon: "flower",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      servicePackages: true,
    },
  },
  barbershop: {
    id: "barbershop",
    label: "Barbershop",
    shortLabel: "Barbershop",
    category: "beauty_wellness",
    description: "Men's grooming and haircuts",
    icon: "scissors",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      bookingSystem: true,
      pricingDisplay: true,
    },
  },
  nail_salon: {
    id: "nail_salon",
    label: "Nail Salon",
    shortLabel: "Nail Salon",
    category: "beauty_wellness",
    description: "Manicure and pedicure services",
    icon: "sparkles",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      bookingSystem: true,
      pricingDisplay: true,
    },
  },
  massage: {
    id: "massage",
    label: "Massage Therapy",
    shortLabel: "Massage",
    category: "beauty_wellness",
    description: "Massage and bodywork",
    icon: "hand",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      servicePackages: true,
      licenseBadges: true,
    },
  },
  tattoo_studio: {
    id: "tattoo_studio",
    label: "Tattoo Studio",
    shortLabel: "Tattoo",
    category: "beauty_wellness",
    description: "Tattoo and body art",
    icon: "pen-tool",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      licenseBadges: true,
    },
  },

  // Home Services
  general_contractor: {
    id: "general_contractor",
    label: "General Contractor",
    shortLabel: "Contractor",
    category: "home_services",
    description: "Construction and renovation",
    icon: "hard-hat",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      quoteRequests: true,
      serviceAreaMap: true,
      beforeAfterGallery: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  plumber: {
    id: "plumber",
    label: "Plumber",
    shortLabel: "Plumber",
    category: "home_services",
    description: "Plumbing services and repairs",
    icon: "droplets",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      emergencyServices: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  electrician: {
    id: "electrician",
    label: "Electrician",
    shortLabel: "Electrician",
    category: "home_services",
    description: "Electrical services and repairs",
    icon: "zap",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      emergencyServices: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  hvac: {
    id: "hvac",
    label: "HVAC",
    shortLabel: "HVAC",
    category: "home_services",
    description: "Heating, ventilation, and air conditioning",
    icon: "thermometer",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      emergencyServices: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  landscaping: {
    id: "landscaping",
    label: "Landscaping",
    shortLabel: "Landscaping",
    category: "home_services",
    description: "Lawn care and landscaping",
    icon: "tree-deciduous",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      quoteRequests: true,
      serviceAreaMap: true,
      beforeAfterGallery: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  cleaning: {
    id: "cleaning",
    label: "Cleaning Service",
    shortLabel: "Cleaning",
    category: "home_services",
    description: "Residential and commercial cleaning",
    icon: "spray-can",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  handyman: {
    id: "handyman",
    label: "Handyman",
    shortLabel: "Handyman",
    category: "home_services",
    description: "General repairs and maintenance",
    icon: "wrench",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      insuranceBadges: true,
    },
  },
  painter: {
    id: "painter",
    label: "Painter",
    shortLabel: "Painter",
    category: "home_services",
    description: "Interior and exterior painting",
    icon: "paintbrush",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      serviceAreaMap: true,
      beforeAfterGallery: true,
      insuranceBadges: true,
    },
  },
  roofer: {
    id: "roofer",
    label: "Roofer",
    shortLabel: "Roofer",
    category: "home_services",
    description: "Roofing installation and repair",
    icon: "home",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      emergencyServices: true,
      serviceAreaMap: true,
      beforeAfterGallery: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  pest_control: {
    id: "pest_control",
    label: "Pest Control",
    shortLabel: "Pest Control",
    category: "home_services",
    description: "Pest and wildlife removal",
    icon: "bug",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      emergencyServices: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  pool_service: {
    id: "pool_service",
    label: "Pool Service",
    shortLabel: "Pool Service",
    category: "home_services",
    description: "Pool cleaning and maintenance",
    icon: "waves",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },

  // Professional Services
  consultant: {
    id: "consultant",
    label: "Consultant",
    shortLabel: "Consultant",
    category: "professional_services",
    description: "Business or management consulting",
    icon: "presentation",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      servicePackages: true,
    },
  },
  law_firm: {
    id: "law_firm",
    label: "Law Firm",
    shortLabel: "Law Firm",
    category: "professional_services",
    description: "Legal services",
    icon: "scale",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      licenseBadges: true,
    },
  },
  accounting: {
    id: "accounting",
    label: "Accounting / CPA",
    shortLabel: "Accounting",
    category: "professional_services",
    description: "Tax and accounting services",
    icon: "calculator",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      servicePackages: true,
      licenseBadges: true,
    },
  },
  marketing_agency: {
    id: "marketing_agency",
    label: "Marketing Agency",
    shortLabel: "Marketing",
    category: "professional_services",
    description: "Marketing and advertising",
    icon: "megaphone",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      servicePackages: true,
    },
  },
  it_services: {
    id: "it_services",
    label: "IT Services",
    shortLabel: "IT Services",
    category: "professional_services",
    description: "Technology and IT support",
    icon: "laptop",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      emergencyServices: true,
      servicePackages: true,
      licenseBadges: true,
    },
  },
  real_estate: {
    id: "real_estate",
    label: "Real Estate Agent",
    shortLabel: "Real Estate",
    category: "professional_services",
    description: "Real estate services",
    icon: "building",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      licenseBadges: true,
    },
  },
  insurance: {
    id: "insurance",
    label: "Insurance Agent",
    shortLabel: "Insurance",
    category: "professional_services",
    description: "Insurance services",
    icon: "shield",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      licenseBadges: true,
    },
  },
  financial_advisor: {
    id: "financial_advisor",
    label: "Financial Advisor",
    shortLabel: "Financial",
    category: "professional_services",
    description: "Financial planning and wealth management",
    icon: "trending-up",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      licenseBadges: true,
    },
  },

  // Health & Medical
  medical_practice: {
    id: "medical_practice",
    label: "Medical Practice",
    shortLabel: "Medical",
    category: "health_medical",
    description: "Doctor's office or clinic",
    icon: "stethoscope",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  dental: {
    id: "dental",
    label: "Dental Practice",
    shortLabel: "Dental",
    category: "health_medical",
    description: "Dentist office",
    icon: "smile",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,  // Before/after smiles
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      beforeAfterGallery: true,
      servicePackages: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  therapy: {
    id: "therapy",
    label: "Therapy / Counseling",
    shortLabel: "Therapy",
    category: "health_medical",
    description: "Mental health services",
    icon: "heart",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  fitness: {
    id: "fitness",
    label: "Fitness / Personal Training",
    shortLabel: "Fitness",
    category: "health_medical",
    description: "Gym or personal training",
    icon: "dumbbell",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,  // Transformations
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      beforeAfterGallery: true,
      servicePackages: true,
      licenseBadges: true,
    },
  },
  chiropractic: {
    id: "chiropractic",
    label: "Chiropractic",
    shortLabel: "Chiropractic",
    category: "health_medical",
    description: "Chiropractic services",
    icon: "activity",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  optometry: {
    id: "optometry",
    label: "Optometry",
    shortLabel: "Optometry",
    category: "health_medical",
    description: "Eye care and vision services",
    icon: "eye",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },

  // Automotive
  auto_repair: {
    id: "auto_repair",
    label: "Auto Repair Shop",
    shortLabel: "Auto Repair",
    category: "automotive",
    description: "Vehicle repair and maintenance",
    icon: "car",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      emergencyServices: true,  // Towing partnership
      serviceAreaMap: true,
      pricingDisplay: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  auto_detailing: {
    id: "auto_detailing",
    label: "Auto Detailing",
    shortLabel: "Detailing",
    category: "automotive",
    description: "Car wash and detailing",
    icon: "sparkles",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      beforeAfterGallery: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  towing: {
    id: "towing",
    label: "Towing Service",
    shortLabel: "Towing",
    category: "automotive",
    description: "Towing and roadside assistance",
    icon: "truck",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      emergencyServices: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  tire_shop: {
    id: "tire_shop",
    label: "Tire Shop",
    shortLabel: "Tire Shop",
    category: "automotive",
    description: "Tire sales and service",
    icon: "circle",
    features: {
      ...defaultFeatures,
      testimonials: true,
      faqSection: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      insuranceBadges: true,
    },
  },

  // Pet Services
  pet_grooming: {
    id: "pet_grooming",
    label: "Pet Grooming",
    shortLabel: "Pet Grooming",
    category: "pet_services",
    description: "Dog and pet grooming",
    icon: "dog",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      beforeAfterGallery: true,
      insuranceBadges: true,
    },
  },
  veterinary: {
    id: "veterinary",
    label: "Veterinary Clinic",
    shortLabel: "Vet",
    category: "pet_services",
    description: "Animal hospital or vet clinic",
    icon: "stethoscope",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      emergencyServices: true,
      serviceAreaMap: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  pet_sitting: {
    id: "pet_sitting",
    label: "Pet Sitting / Boarding",
    shortLabel: "Pet Sitting",
    category: "pet_services",
    description: "Pet care and boarding",
    icon: "home",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  dog_training: {
    id: "dog_training",
    label: "Dog Training",
    shortLabel: "Dog Training",
    category: "pet_services",
    description: "Dog obedience and behavior training",
    icon: "graduation-cap",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      beforeAfterGallery: true,
      servicePackages: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },

  // Events & Creative
  photography: {
    id: "photography",
    label: "Photography",
    shortLabel: "Photography",
    category: "events_creative",
    description: "Photography services",
    icon: "camera",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  videography: {
    id: "videography",
    label: "Videography",
    shortLabel: "Video",
    category: "events_creative",
    description: "Video production services",
    icon: "video",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  dj_entertainment: {
    id: "dj_entertainment",
    label: "DJ / Entertainment",
    shortLabel: "DJ",
    category: "events_creative",
    description: "DJ and entertainment services",
    icon: "music",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  event_planning: {
    id: "event_planning",
    label: "Event Planning",
    shortLabel: "Events",
    category: "events_creative",
    description: "Event coordination and planning",
    icon: "calendar",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },
  florist: {
    id: "florist",
    label: "Florist",
    shortLabel: "Florist",
    category: "events_creative",
    description: "Flower arrangements and delivery",
    icon: "flower",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      pricingDisplay: true,
    },
  },
  wedding_services: {
    id: "wedding_services",
    label: "Wedding Services",
    shortLabel: "Wedding",
    category: "events_creative",
    description: "Wedding planning and coordination",
    icon: "heart",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      quoteRequests: true,
      serviceAreaMap: true,
      servicePackages: true,
      insuranceBadges: true,
    },
  },

  // Education
  tutoring: {
    id: "tutoring",
    label: "Tutoring",
    shortLabel: "Tutoring",
    category: "education",
    description: "Academic tutoring services",
    icon: "book-open",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
    },
  },
  music_lessons: {
    id: "music_lessons",
    label: "Music Lessons",
    shortLabel: "Music",
    category: "education",
    description: "Music instruction",
    icon: "music",
    features: {
      ...defaultFeatures,
      portfolioGallery: true,  // Student performances
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      servicePackages: true,
    },
  },
  driving_school: {
    id: "driving_school",
    label: "Driving School",
    shortLabel: "Driving",
    category: "education",
    description: "Driver education",
    icon: "car",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      serviceAreaMap: true,
      pricingDisplay: true,
      servicePackages: true,
      licenseBadges: true,
      insuranceBadges: true,
    },
  },
  language_school: {
    id: "language_school",
    label: "Language School",
    shortLabel: "Language",
    category: "education",
    description: "Language instruction",
    icon: "globe",
    features: {
      ...defaultFeatures,
      testimonials: true,
      teamMembers: true,
      faqSection: true,
      bookingSystem: true,
      pricingDisplay: true,
      servicePackages: true,
    },
  },

  // Custom
  custom: {
    id: "custom",
    label: "Custom / Other",
    shortLabel: "Custom",
    category: "other",
    description: "Configure features manually",
    icon: "settings",
    features: defaultFeatures,  // Start with nothing enabled
  },
};

// ============================================================================
// CONTENT PRESETS
// ============================================================================

export interface ContentPreset {
  heroHeading: string;
  heroHeadingAccent: string;
  heroSubheading: string;
  heroBadgeText: string;
  heroCTAText: string;
  heroSecondaryCTAText: string;
  trustBadges: { text: string; icon: string }[];
  processSteps: { step: number; title: string; description: string; icon: string }[];
  processTitle: string;
  processSubtitle: string;
  processCTAText: string;
  whyChooseUsTitle: string;
  whyChooseUsHeading: string;
  whyChooseUsText: string;
  emergencyBannerText: string;
  emergencyBannerEnabled: boolean;
}

/**
 * Category-based content presets
 * More specific business types inherit from their category
 */
export const categoryContentPresets: Record<BusinessCategory, ContentPreset> = {
  food_beverage: {
    heroHeading: "Delicious Food",
    heroHeadingAccent: "Made Fresh Daily",
    heroSubheading: "Experience exceptional cuisine and unforgettable flavors",
    heroBadgeText: "Locally Owned",
    heroCTAText: "View Our Menu",
    heroSecondaryCTAText: "Make a Reservation",
    trustBadges: [
      { text: "Fresh Ingredients", icon: "leaf" },
      { text: "Made with Love", icon: "heart" },
      { text: "5-Star Rated", icon: "star" },
    ],
    processSteps: [
      { step: 1, title: "Browse Our Menu", description: "Explore our delicious offerings", icon: "menu" },
      { step: 2, title: "Place Your Order", description: "Order online or call us", icon: "phone" },
      { step: 3, title: "Enjoy!", description: "Savor every bite", icon: "utensils" },
    ],
    processTitle: "How It Works",
    processSubtitle: "Simple ordering for delicious food",
    processCTAText: "Order Now",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Quality You Can Taste",
    whyChooseUsText: "We use only the freshest ingredients and time-honored recipes to create dishes that delight.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
  beauty_wellness: {
    heroHeading: "Look & Feel",
    heroHeadingAccent: "Your Best",
    heroSubheading: "Expert care and personalized attention for stunning results",
    heroBadgeText: "Award-Winning Service",
    heroCTAText: "Book Now",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "Licensed Professionals", icon: "award" },
      { text: "Premium Products", icon: "sparkles" },
      { text: "5-Star Reviews", icon: "star" },
    ],
    processSteps: [
      { step: 1, title: "Book Your Appointment", description: "Choose a time that works for you", icon: "calendar" },
      { step: 2, title: "Consultation", description: "We discuss your goals", icon: "message-circle" },
      { step: 3, title: "Transformation", description: "Leave feeling amazing", icon: "sparkles" },
    ],
    processTitle: "Your Experience",
    processSubtitle: "From booking to beautiful",
    processCTAText: "Book Your Appointment",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Excellence in Every Detail",
    whyChooseUsText: "Our skilled professionals use premium products and techniques to ensure you look and feel your absolute best.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
  home_services: {
    heroHeading: "Professional",
    heroHeadingAccent: "Home Services",
    heroSubheading: "Licensed, insured, and committed to quality workmanship",
    heroBadgeText: "Trusted Local Experts",
    heroCTAText: "Get a Free Quote",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "Licensed & Insured", icon: "shield-check" },
      { text: "Satisfaction Guaranteed", icon: "award" },
      { text: "Free Estimates", icon: "check-circle" },
    ],
    processSteps: [
      { step: 1, title: "Request a Quote", description: "Contact us for a free estimate", icon: "clipboard" },
      { step: 2, title: "We Assess & Plan", description: "Our experts evaluate your needs", icon: "search" },
      { step: 3, title: "Quality Work Done", description: "Professional service, guaranteed", icon: "check-circle" },
    ],
    processTitle: "Our Simple Process",
    processSubtitle: "From estimate to completion",
    processCTAText: "Get Your Free Quote",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Quality You Can Trust",
    whyChooseUsText: "With years of experience and a commitment to excellence, we deliver results that exceed expectations. Fully licensed and insured for your peace of mind.",
    emergencyBannerText: "24/7 Emergency Service Available!",
    emergencyBannerEnabled: true,
  },
  professional_services: {
    heroHeading: "Expert",
    heroHeadingAccent: "Professional Services",
    heroSubheading: "Strategic guidance and solutions tailored to your needs",
    heroBadgeText: "Trusted Advisors",
    heroCTAText: "Schedule a Consultation",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "Certified Experts", icon: "award" },
      { text: "Proven Results", icon: "trending-up" },
      { text: "Client-Focused", icon: "users" },
    ],
    processSteps: [
      { step: 1, title: "Schedule a Consultation", description: "Book a free discovery call", icon: "calendar" },
      { step: 2, title: "Strategy Session", description: "We develop a custom plan", icon: "clipboard" },
      { step: 3, title: "Implementation", description: "Execute with expert guidance", icon: "check-circle" },
    ],
    processTitle: "How We Work",
    processSubtitle: "A proven approach to success",
    processCTAText: "Get Started",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Results-Driven Excellence",
    whyChooseUsText: "We combine deep expertise with a client-first approach to deliver measurable results and lasting value.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
  health_medical: {
    heroHeading: "Compassionate",
    heroHeadingAccent: "Healthcare",
    heroSubheading: "Personalized care focused on your health and wellbeing",
    heroBadgeText: "Board Certified",
    heroCTAText: "Book an Appointment",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "Board Certified", icon: "award" },
      { text: "Patient-Centered", icon: "heart" },
      { text: "Accepting New Patients", icon: "user-plus" },
    ],
    processSteps: [
      { step: 1, title: "Schedule Visit", description: "Book your appointment online", icon: "calendar" },
      { step: 2, title: "Consultation", description: "Meet with our care team", icon: "stethoscope" },
      { step: 3, title: "Treatment Plan", description: "Personalized care for you", icon: "clipboard" },
    ],
    processTitle: "Your Care Journey",
    processSubtitle: "Simple steps to better health",
    processCTAText: "Book Now",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Care You Can Count On",
    whyChooseUsText: "Our dedicated team provides compassionate, evidence-based care in a comfortable environment. Your health is our priority.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
  automotive: {
    heroHeading: "Expert",
    heroHeadingAccent: "Auto Care",
    heroSubheading: "Honest service and quality repairs you can trust",
    heroBadgeText: "ASE Certified",
    heroCTAText: "Get a Quote",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "ASE Certified", icon: "award" },
      { text: "Fair Pricing", icon: "dollar-sign" },
      { text: "Warranty Included", icon: "shield-check" },
    ],
    processSteps: [
      { step: 1, title: "Bring It In", description: "Drop off or schedule service", icon: "car" },
      { step: 2, title: "Free Inspection", description: "We diagnose the issue", icon: "search" },
      { step: 3, title: "Quality Repair", description: "Expert work, fair prices", icon: "wrench" },
    ],
    processTitle: "Simple Service Process",
    processSubtitle: "Getting you back on the road",
    processCTAText: "Schedule Service",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Honest Service You Trust",
    whyChooseUsText: "We treat your vehicle like our own. Fair pricing, quality parts, and honest recommendations - every time.",
    emergencyBannerText: "Emergency Towing Available 24/7!",
    emergencyBannerEnabled: true,
  },
  pet_services: {
    heroHeading: "Loving Care",
    heroHeadingAccent: "For Your Pet",
    heroSubheading: "Professional pet care with a personal touch",
    heroBadgeText: "Pet Lovers Serving Pets",
    heroCTAText: "Book Now",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "Certified & Insured", icon: "shield-check" },
      { text: "Pet First Aid Trained", icon: "heart" },
      { text: "5-Star Rated", icon: "star" },
    ],
    processSteps: [
      { step: 1, title: "Book Appointment", description: "Choose your service and time", icon: "calendar" },
      { step: 2, title: "Meet & Greet", description: "We get to know your pet", icon: "heart" },
      { step: 3, title: "Happy Pet!", description: "Quality care, wagging tails", icon: "smile" },
    ],
    processTitle: "How It Works",
    processSubtitle: "Easy booking, happy pets",
    processCTAText: "Book Your Pet's Visit",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Because Pets Are Family",
    whyChooseUsText: "We treat every pet like our own. Professional, gentle care with lots of love included.",
    emergencyBannerText: "Emergency Pet Care Available!",
    emergencyBannerEnabled: false,
  },
  events_creative: {
    heroHeading: "Capture Your",
    heroHeadingAccent: "Special Moments",
    heroSubheading: "Creative professionals bringing your vision to life",
    heroBadgeText: "Award-Winning Work",
    heroCTAText: "Get a Quote",
    heroSecondaryCTAText: "View Portfolio",
    trustBadges: [
      { text: "Award-Winning", icon: "award" },
      { text: "Professional Equipment", icon: "camera" },
      { text: "5-Star Reviews", icon: "star" },
    ],
    processSteps: [
      { step: 1, title: "Share Your Vision", description: "Tell us about your event", icon: "message-circle" },
      { step: 2, title: "Plan Together", description: "We create a custom plan", icon: "clipboard" },
      { step: 3, title: "Create Magic", description: "Beautiful results delivered", icon: "sparkles" },
    ],
    processTitle: "The Creative Process",
    processSubtitle: "From concept to creation",
    processCTAText: "Start Your Project",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Creativity Meets Excellence",
    whyChooseUsText: "We blend artistic vision with technical expertise to create stunning results that exceed expectations.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
  education: {
    heroHeading: "Unlock Your",
    heroHeadingAccent: "Full Potential",
    heroSubheading: "Expert instruction tailored to your learning style",
    heroBadgeText: "Proven Results",
    heroCTAText: "Book a Lesson",
    heroSecondaryCTAText: "Our Programs",
    trustBadges: [
      { text: "Certified Instructors", icon: "award" },
      { text: "Personalized Learning", icon: "user" },
      { text: "Proven Results", icon: "trending-up" },
    ],
    processSteps: [
      { step: 1, title: "Assessment", description: "We evaluate your current level", icon: "clipboard" },
      { step: 2, title: "Custom Plan", description: "Personalized curriculum for you", icon: "book-open" },
      { step: 3, title: "Progress & Success", description: "Achieve your goals", icon: "trophy" },
    ],
    processTitle: "Your Learning Journey",
    processSubtitle: "Step by step to success",
    processCTAText: "Start Learning",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Education That Works",
    whyChooseUsText: "Our proven methods and dedicated instructors help students of all levels achieve their goals.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
  other: {
    heroHeading: "Professional",
    heroHeadingAccent: "Services",
    heroSubheading: "Quality service you can count on",
    heroBadgeText: "Trusted Business",
    heroCTAText: "Contact Us",
    heroSecondaryCTAText: "Our Services",
    trustBadges: [
      { text: "Professional", icon: "award" },
      { text: "Reliable", icon: "check-circle" },
      { text: "Quality Work", icon: "star" },
    ],
    processSteps: [
      { step: 1, title: "Contact Us", description: "Tell us about your needs", icon: "phone" },
      { step: 2, title: "Consultation", description: "We discuss solutions", icon: "message-circle" },
      { step: 3, title: "Delivery", description: "Quality service delivered", icon: "check-circle" },
    ],
    processTitle: "Our Process",
    processSubtitle: "Simple and effective",
    processCTAText: "Get Started",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsHeading: "Quality You Can Trust",
    whyChooseUsText: "We're committed to delivering exceptional service with integrity and professionalism.",
    emergencyBannerText: "",
    emergencyBannerEnabled: false,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get business type info by ID
 * O(1) lookup
 */
export function getBusinessTypeInfo(type: BusinessType): BusinessTypeInfo {
  return businessTypeInfo[type] || businessTypeInfo.custom;
}

/**
 * Get category for a business type
 * O(1) lookup
 */
export function getCategoryForType(type: BusinessType): BusinessCategory {
  return businessTypeInfo[type]?.category || "other";
}

/**
 * Get all types in a category
 * O(1) lookup (pre-computed in categoryInfo)
 */
export function getTypesInCategory(category: BusinessCategory): BusinessType[] {
  const cat = businessCategories.find(c => c.id === category);
  return cat?.types || [];
}

/**
 * Get content preset for a business type
 * Falls back to category preset
 */
export function getContentPreset(type: BusinessType): ContentPreset {
  const category = getCategoryForType(type);
  return categoryContentPresets[category];
}

/**
 * Get feature defaults for a business type
 * O(1) lookup
 */
export function getFeatureDefaults(type: BusinessType): EnabledFeatures {
  return businessTypeInfo[type]?.features || defaultFeatures;
}

/**
 * Check if any features have been modified from defaults
 */
export function hasModifiedFeatures(
  type: BusinessType,
  currentFeatures: EnabledFeatures
): boolean {
  const defaults = getFeatureDefaults(type);
  return Object.keys(defaults).some(
    key => defaults[key as keyof EnabledFeatures] !== currentFeatures[key as keyof EnabledFeatures]
  );
}

/**
 * Get list of modified features (for display)
 */
export function getModifiedFeatures(
  type: BusinessType,
  currentFeatures: EnabledFeatures
): { key: keyof EnabledFeatures; defaultValue: boolean; currentValue: boolean }[] {
  const defaults = getFeatureDefaults(type);
  const modified: { key: keyof EnabledFeatures; defaultValue: boolean; currentValue: boolean }[] = [];

  (Object.keys(defaults) as (keyof EnabledFeatures)[]).forEach(key => {
    if (defaults[key] !== currentFeatures[key]) {
      modified.push({
        key,
        defaultValue: defaults[key],
        currentValue: currentFeatures[key],
      });
    }
  });

  return modified;
}

/**
 * Feature metadata for UI display
 */
export interface FeatureMetadata {
  key: keyof EnabledFeatures;
  label: string;
  description: string;
  icon: string;
  adminNavLabel?: string; // If feature creates admin nav item
  publicNavLabel?: string; // If feature creates public nav item
  proOnly?: boolean;
}

export const featureMetadata: FeatureMetadata[] = [
  // Content Features
  {
    key: "menuSystem",
    label: "Menu System",
    description: "Food, drink, or service menus with categories and pricing",
    icon: "menu",
    adminNavLabel: "Menu",
    publicNavLabel: "Menu",
  },
  {
    key: "portfolioGallery",
    label: "Portfolio Gallery",
    description: "Showcase your work with photos and project details",
    icon: "image",
    adminNavLabel: "Portfolio",
    publicNavLabel: "Portfolio",
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Display customer reviews and ratings",
    icon: "star",
  },
  {
    key: "teamMembers",
    label: "Team Members",
    description: "Show staff profiles with photos and bios",
    icon: "users",
    adminNavLabel: "Team",
  },
  {
    key: "faqSection",
    label: "FAQ Section",
    description: "Frequently asked questions",
    icon: "help-circle",
  },

  // Booking & Contact
  {
    key: "bookingSystem",
    label: "Booking System",
    description: "Online appointment scheduling",
    icon: "calendar",
    publicNavLabel: "Book Now",
  },
  {
    key: "quoteRequests",
    label: "Quote Requests",
    description: "Request a quote or estimate forms",
    icon: "file-text",
  },
  {
    key: "emergencyServices",
    label: "Emergency Services",
    description: "Highlight 24/7 emergency availability",
    icon: "alert-circle",
  },

  // Display Features
  {
    key: "serviceAreaMap",
    label: "Service Area Map",
    description: "Show your service area on Google Maps",
    icon: "map",
  },
  {
    key: "pricingDisplay",
    label: "Price Display",
    description: "Show service prices on your site",
    icon: "dollar-sign",
  },
  {
    key: "beforeAfterGallery",
    label: "Before/After Gallery",
    description: "Showcase transformations with comparison images",
    icon: "columns",
    proOnly: true,
  },
  {
    key: "servicePackages",
    label: "Service Packages",
    description: "Bundle services into packages with special pricing",
    icon: "package",
  },

  // Trust Features
  {
    key: "licenseBadges",
    label: "License Badges",
    description: "Display professional licenses and certifications",
    icon: "award",
  },
  {
    key: "insuranceBadges",
    label: "Insurance Badges",
    description: "Show insurance and bonding information",
    icon: "shield-check",
  },
];

/**
 * Get feature metadata by key
 */
export function getFeatureMetadata(key: keyof EnabledFeatures): FeatureMetadata | undefined {
  return featureMetadata.find(f => f.key === key);
}

/**
 * Group features by purpose for UI organization
 */
export const featureGroups = [
  {
    id: "content",
    label: "Content Features",
    description: "What content to show on your site",
    features: ["menuSystem", "portfolioGallery", "testimonials", "teamMembers", "faqSection"] as (keyof EnabledFeatures)[],
  },
  {
    id: "booking",
    label: "Booking & Contact",
    description: "How customers reach you",
    features: ["bookingSystem", "quoteRequests", "emergencyServices"] as (keyof EnabledFeatures)[],
  },
  {
    id: "display",
    label: "Display Options",
    description: "Additional display features",
    features: ["serviceAreaMap", "pricingDisplay", "beforeAfterGallery", "servicePackages"] as (keyof EnabledFeatures)[],
  },
  {
    id: "trust",
    label: "Trust & Credentials",
    description: "Build customer confidence",
    features: ["licenseBadges", "insuranceBadges"] as (keyof EnabledFeatures)[],
  },
];

// ============================================================================
// BACKWARD COMPATIBILITY
// ============================================================================

/**
 * Legacy business type labels for backward compatibility
 * Maps old 7-type system to new comprehensive system
 */
export const legacyTypeMapping: Record<string, BusinessType> = {
  restaurant: "restaurant",
  catering: "catering",
  contractor: "general_contractor",
  salon: "salon",
  professional: "consultant",
  cleaning: "cleaning",
  custom: "custom",
};

/**
 * Convert legacy business type to new system
 */
export function migrateBusinessType(legacyType: string): BusinessType {
  return legacyTypeMapping[legacyType] || "custom";
}

/**
 * Legacy feature set to new feature set migration
 * Handles the old 7-feature system
 */
export function migrateLegacyFeatures(legacyFeatures: Record<string, boolean>): EnabledFeatures {
  return {
    menuSystem: legacyFeatures.menuSystem ?? false,
    portfolioGallery: legacyFeatures.portfolioGallery ?? false,
    testimonials: legacyFeatures.testimonials ?? false,
    teamMembers: legacyFeatures.teamMembers ?? false,
    faqSection: legacyFeatures.faqSection ?? false,
    bookingSystem: legacyFeatures.bookingSystem ?? false,
    quoteRequests: legacyFeatures.quoteRequests ?? false,
    // New features default to false for legacy migrations
    emergencyServices: false,
    serviceAreaMap: false,
    pricingDisplay: false,
    beforeAfterGallery: false,
    servicePackages: false,
    licenseBadges: false,
    insuranceBadges: false,
  };
}
