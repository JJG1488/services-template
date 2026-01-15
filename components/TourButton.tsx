/**
 * Tour Button Component for Services Template
 *
 * A button that allows users to restart the guided tour.
 * Typically placed in the admin navigation.
 *
 * @version 9.46 - January 2026
 */

"use client";

import { HelpCircle } from "lucide-react";
import { useTourContext } from "./TourProvider";
import type { EnabledFeatures } from "@/lib/business-types";

interface TourButtonProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show label text */
  showLabel?: boolean;
  /** Variant style */
  variant?: "nav" | "mobile";
  /** Enabled features for filtering tour steps */
  enabledFeatures?: EnabledFeatures | null;
}

/**
 * Button to restart the guided tour
 */
export function TourButton({
  className = "",
  showLabel = false,
  variant = "nav",
  enabledFeatures = null,
}: TourButtonProps) {
  const { startTour, resetTour, isTourActive } = useTourContext();

  function handleClick() {
    // Reset completion status and start tour
    resetTour();
    // Small delay to ensure state updates
    setTimeout(() => {
      startTour(enabledFeatures);
    }, 50);
  }

  if (variant === "mobile") {
    return (
      <button
        onClick={handleClick}
        disabled={isTourActive}
        data-tour="tour-button"
        className={`flex items-center gap-3 w-full text-left py-3 px-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-50 ${className}`}
        title="Take Guided Tour"
      >
        <HelpCircle className="w-5 h-5" />
        <span>Take Tour</span>
      </button>
    );
  }

  // Desktop nav variant
  return (
    <button
      onClick={handleClick}
      disabled={isTourActive}
      data-tour="tour-button"
      className={`flex items-center gap-1.5 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors disabled:opacity-50 ${className}`}
      title="Take Guided Tour"
    >
      <HelpCircle className="w-4 h-4" />
      {showLabel && <span>Tour</span>}
    </button>
  );
}
