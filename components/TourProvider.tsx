/**
 * Tour Provider Component for Services Template
 *
 * Provides tour context to child components and handles:
 * - Auto-starting tour for first-time users
 * - Exposing tour controls via context
 * - Handling feature-gated tour steps
 *
 * @version 9.46 - January 2026
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTour } from "@/hooks/useTour";
import type { EnabledFeatures } from "@/lib/business-types";

// Import driver.js CSS
import "driver.js/dist/driver.css";

interface TourContextType {
  startTour: (enabledFeatures?: EnabledFeatures | null) => void;
  endTour: () => void;
  resetTour: () => void;
  hasCompletedTour: boolean;
  isTourActive: boolean;
  isReady: boolean;
}

const TourContext = createContext<TourContextType | null>(null);

interface TourProviderProps {
  children: ReactNode;
  /** Auto-start tour for first-time users (default: true) */
  autoStart?: boolean;
  /** Delay before auto-starting tour in ms (default: 1000) */
  autoStartDelay?: number;
  /** Enabled features for filtering tour steps */
  enabledFeatures?: EnabledFeatures | null;
}

/**
 * Provider component that wraps the admin layout
 * Handles auto-starting the tour for first-time users
 */
export function TourProvider({
  children,
  autoStart = true,
  autoStartDelay = 1500,
  enabledFeatures = null,
}: TourProviderProps) {
  const tour = useTour();
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  // Auto-start tour for first-time users
  useEffect(() => {
    if (!autoStart || !tour.isReady || hasAutoStarted) return;
    if (tour.hasCompletedTour) return;

    // Delay to allow page to fully render
    const timer = setTimeout(() => {
      tour.startTour(enabledFeatures);
      setHasAutoStarted(true);
    }, autoStartDelay);

    return () => clearTimeout(timer);
  }, [autoStart, autoStartDelay, tour.isReady, tour.hasCompletedTour, hasAutoStarted, enabledFeatures, tour]);

  // Wrap startTour to pass enabledFeatures
  const startTourWithFeatures = (features?: EnabledFeatures | null) => {
    tour.startTour(features ?? enabledFeatures);
  };

  return (
    <TourContext.Provider
      value={{
        ...tour,
        startTour: startTourWithFeatures,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

/**
 * Hook to access tour context
 * Must be used within a TourProvider
 */
export function useTourContext(): TourContextType {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTourContext must be used within a TourProvider");
  }
  return context;
}
