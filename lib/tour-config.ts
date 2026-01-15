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
 * Steps are ordered to guide users through the most important features first
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
    id: "dashboard-stats",
    element: "[data-tour='dashboard-stats']",
    popover: {
      title: "Dashboard Overview",
      description: "View your key metrics at a glance - total services, recent inquiries, and more. Click any card to see more details.",
      side: "bottom" as const,
      align: "center" as const,
    },
  },
  {
    id: "services",
    element: "[data-tour='nav-services']",
    popover: {
      title: "Services Management",
      description: "Add, edit, and manage your service offerings. Set prices, descriptions, and durations. This is where you showcase what you offer.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "portfolio",
    element: "[data-tour='nav-portfolio']",
    featureRequired: "portfolioGallery",
    popover: {
      title: "Portfolio Gallery",
      description: "Showcase your work with photos and before/after images. Upload project photos to build trust with potential customers.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "menu",
    element: "[data-tour='nav-menu']",
    featureRequired: "menuSystem",
    popover: {
      title: "Menu Builder",
      description: "Create and manage your menu with categories and items. Perfect for restaurants, cafes, and food service businesses.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "booking",
    element: "[data-tour='nav-booking']",
    featureRequired: "bookingSystem",
    popover: {
      title: "Booking System",
      description: "Connect your Calendly or Cal.com account to enable online booking. Customers can schedule appointments directly from your site.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "inquiries",
    element: "[data-tour='nav-inquiries']",
    popover: {
      title: "Customer Inquiries",
      description: "View and respond to contact form submissions. Keep track of leads and customer questions.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "faq",
    element: "[data-tour='nav-faq']",
    popover: {
      title: "FAQ Management",
      description: "Create and manage frequently asked questions. Help customers find answers without needing to contact you.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "settings",
    element: "[data-tour='nav-settings']",
    popover: {
      title: "Business Settings",
      description: "Customize your business type, appearance, contact info, and more. Configure which features are enabled for your specific business.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    id: "view-site",
    element: "[data-tour='view-site']",
    popover: {
      title: "Preview Your Site",
      description: "Click here anytime to see your live website. Check how your services appear to customers.",
      side: "bottom" as const,
      align: "end" as const,
    },
  },
  {
    id: "tour-button",
    element: "[data-tour='tour-button']",
    popover: {
      title: "Need Help? Take the Tour Again!",
      description: "Click this button anytime to restart the guided tour.",
      side: "bottom" as const,
      align: "end" as const,
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
