/**
 * Admin Guided Tour Configuration for Services Template
 *
 * This file defines the tour steps for the services admin dashboard.
 * Each step targets a DOM element using data-tour attributes.
 * Some steps are conditionally shown based on enabled features.
 *
 * @version 9.46 - January 2026
 */

import type { DriveStep } from "driver.js";

export const TOUR_STORAGE_KEY = "admin_tour_completed";
export const TOUR_VERSION = "1.0.0"; // Increment to force re-tour on major updates

export interface TourStep extends DriveStep {
  id: string;
  /** If set, only show this step when this feature is enabled */
  featureRequired?: string;
}

/**
 * Tour steps for the services admin dashboard
 * All steps use centered positioning for a consistent, fixed-location experience
 */
export const servicesTourSteps: TourStep[] = [
  {
    id: "welcome",
    popover: {
      title: "Welcome to Your Services Admin!",
      description: "Let's take a quick tour of your admin dashboard. This will help you understand how to manage your services business effectively.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "dashboard",
    popover: {
      title: "Dashboard Overview",
      description: "Your dashboard shows key metrics at a glance - total services, recent inquiries, and more. Click any card to see more details.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "services",
    popover: {
      title: "Services Management",
      description: "In the 'Services' section, you can add, edit, and manage your service offerings. Set prices, descriptions, and durations to showcase what you offer.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "portfolio",
    featureRequired: "portfolioGallery",
    popover: {
      title: "Portfolio Gallery",
      description: "The 'Portfolio' section lets you showcase your work with photos and before/after images. Upload project photos to build trust with potential customers.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "menu",
    featureRequired: "menuSystem",
    popover: {
      title: "Menu Builder",
      description: "The 'Menu' section lets you create and manage your menu with categories and items. Perfect for restaurants, cafes, and food service businesses.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "booking",
    featureRequired: "bookingSystem",
    popover: {
      title: "Booking System",
      description: "In 'Booking', you can connect your Calendly or Cal.com account to enable online booking. Customers can schedule appointments directly from your site.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "inquiries",
    popover: {
      title: "Customer Inquiries",
      description: "The 'Inquiries' section shows contact form submissions. View and respond to leads and customer questions here.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "faq",
    popover: {
      title: "FAQ Management",
      description: "In the 'FAQ' section, create and manage frequently asked questions. Help customers find answers without needing to contact you.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "settings",
    popover: {
      title: "Business Settings",
      description: "The 'Settings' section lets you customize your business type, appearance, contact info, and more. Configure which features are enabled for your specific business.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "view-site",
    popover: {
      title: "Preview Your Site",
      description: "Click 'View Site' in the navigation bar anytime to see your live website and check how your services appear to customers.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "tour-button",
    popover: {
      title: "Need Help? Take the Tour Again!",
      description: "Click the help button in the navigation bar anytime to restart this guided tour.",
      side: "over" as const,
      align: "center" as const,
    },
  },
  {
    id: "complete",
    popover: {
      title: "You're All Set!",
      description: "That's the end of the tour! Start by adding your services or customizing your business settings. Good luck!",
      side: "over" as const,
      align: "center" as const,
    },
  },
];

/**
 * Driver.js configuration options for consistent styling
 */
export const tourDriverConfig = {
  showProgress: true,
  progressText: "{{current}} of {{total}}",
  nextBtnText: "Next",
  prevBtnText: "Back",
  doneBtnText: "Finish",
  allowClose: true,
  overlayColor: "rgba(0, 0, 0, 0.75)",
  stagePadding: 8,
  stageRadius: 8,
  animate: true,
  smoothScroll: true,
  allowKeyboardControl: true,
  popoverClass: "admin-tour-popover",
};
