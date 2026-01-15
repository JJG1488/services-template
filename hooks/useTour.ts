/**
 * Admin Guided Tour Hook for Services Template
 *
 * Manages the guided tour state, including:
 * - Starting/stopping the tour
 * - Tracking completion status in localStorage
 * - Handling first-time user detection
 * - Filtering steps based on enabled features
 *
 * @version 9.46 - January 2026
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { driver, type Driver } from "driver.js";
import type { EnabledFeatures } from "@/lib/business-types";
import {
  servicesTourSteps,
  tourDriverConfig,
  TOUR_STORAGE_KEY,
  TOUR_VERSION,
  type TourStep,
} from "@/lib/tour-config";

interface UseTourReturn {
  /** Start the guided tour */
  startTour: (enabledFeatures?: EnabledFeatures | null) => void;
  /** End the tour and mark as completed */
  endTour: () => void;
  /** Reset tour completion status (allows re-tour) */
  resetTour: () => void;
  /** Whether the tour has been completed */
  hasCompletedTour: boolean;
  /** Whether the tour is currently active */
  isTourActive: boolean;
  /** Whether the tour system is ready */
  isReady: boolean;
}

/**
 * Get the stored tour completion data
 */
function getTourData(): { completed: boolean; version: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Set tour completion data
 */
function setTourData(completed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      TOUR_STORAGE_KEY,
      JSON.stringify({ completed, version: TOUR_VERSION })
    );
  } catch {
    // localStorage not available
  }
}

/**
 * Clear tour completion data
 */
function clearTourData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

/**
 * Filter tour steps based on enabled features
 * O(n) where n = number of tour steps
 */
function filterStepsByFeatures(
  steps: TourStep[],
  enabledFeatures: EnabledFeatures | null
): TourStep[] {
  if (!enabledFeatures) return steps;

  return steps.filter((step) => {
    // Always show steps without feature requirements
    if (!step.featureRequired) return true;

    // Check if the required feature is enabled
    const featureKey = step.featureRequired as keyof EnabledFeatures;
    return enabledFeatures[featureKey] === true;
  });
}

/**
 * Custom hook for managing the admin guided tour
 */
export function useTour(): UseTourReturn {
  const [hasCompletedTour, setHasCompletedTour] = useState(true); // Default to true to prevent flash
  const [isTourActive, setIsTourActive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const driverRef = useRef<Driver | null>(null);

  // Initialize tour state from localStorage
  useEffect(() => {
    const tourData = getTourData();

    // Check if tour was completed with current version
    if (tourData?.completed && tourData.version === TOUR_VERSION) {
      setHasCompletedTour(true);
    } else {
      setHasCompletedTour(false);
    }

    setIsReady(true);
  }, []);

  // Cleanup driver on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, []);

  /**
   * Start the guided tour
   * @param enabledFeatures - Optional features to filter steps
   */
  const startTour = useCallback((enabledFeatures?: EnabledFeatures | null) => {
    // Destroy existing driver if any
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    // Filter steps based on enabled features
    const filteredSteps = filterStepsByFeatures(
      servicesTourSteps,
      enabledFeatures ?? null
    );

    // Create new driver instance
    const driverInstance = driver({
      ...tourDriverConfig,
      steps: filteredSteps,
      onDestroyStarted: () => {
        setIsTourActive(false);
      },
      onDestroyed: () => {
        setIsTourActive(false);
        driverRef.current = null;
      },
    });

    driverRef.current = driverInstance;
    setIsTourActive(true);
    driverInstance.drive();
  }, []);

  /**
   * End the tour and mark as completed
   */
  const endTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setIsTourActive(false);
    setTourData(true);
    setHasCompletedTour(true);
  }, []);

  /**
   * Reset tour completion status (allows re-tour)
   */
  const resetTour = useCallback(() => {
    clearTourData();
    setHasCompletedTour(false);
  }, []);

  return {
    startTour,
    endTour,
    resetTour,
    hasCompletedTour,
    isTourActive,
    isReady,
  };
}
