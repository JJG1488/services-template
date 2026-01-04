"use client";

import { useState, useEffect } from "react";
import { Calendar, ExternalLink, X, Loader2 } from "lucide-react";

type BookingDisplayMode = "embed" | "popup" | "link";

interface BookingWidgetProps {
  url: string;
  mode?: BookingDisplayMode;
  buttonText?: string;
  description?: string;
  className?: string;
  serviceName?: string;
}

export function BookingWidget({
  url,
  mode = "link",
  buttonText = "Book Now",
  description,
  className = "",
  serviceName,
}: BookingWidgetProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Detect booking platform from URL
  const platform = detectPlatform(url);

  // Reset loading state when popup opens
  useEffect(() => {
    if (showPopup) {
      setIsLoading(true);
    }
  }, [showPopup]);

  if (!url) {
    return null;
  }

  // Mode: Link - Just a button that opens URL in new tab
  if (mode === "link") {
    return (
      <div className={className}>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Calendar className="w-5 h-5" />
          {buttonText}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  // Mode: Popup - Button that opens modal with iframe
  if (mode === "popup") {
    return (
      <div className={className}>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        <button
          onClick={() => setShowPopup(true)}
          className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Calendar className="w-5 h-5" />
          {buttonText}
        </button>

        {/* Popup Modal */}
        {showPopup && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPopup(false)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand" />
                  <span className="font-semibold">
                    {serviceName ? `Book ${serviceName}` : "Schedule an Appointment"}
                  </span>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Iframe Content */}
              <div className="relative h-[600px]">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <Loader2 className="w-8 h-8 text-brand animate-spin" />
                  </div>
                )}
                <iframe
                  src={url}
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  title="Book an appointment"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode: Embed - Inline iframe
  if (mode === "embed") {
    return (
      <div className={className}>
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
                <span className="text-sm text-gray-500">Loading booking calendar...</span>
              </div>
            </div>
          )}
          <iframe
            src={url}
            className="w-full border-0"
            style={{ minHeight: "630px" }}
            onLoad={() => setIsLoading(false)}
            title="Book an appointment"
          />
        </div>
        {platform && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Powered by {platform}
          </p>
        )}
      </div>
    );
  }

  return null;
}

/**
 * Detect booking platform from URL for attribution
 */
function detectPlatform(url: string): string | null {
  if (!url) return null;

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("calendly.com")) return "Calendly";
  if (lowerUrl.includes("cal.com")) return "Cal.com";
  if (lowerUrl.includes("acuity")) return "Acuity Scheduling";
  if (lowerUrl.includes("squareup.com") || lowerUrl.includes("square.site")) return "Square";
  if (lowerUrl.includes("tidycal")) return "TidyCal";
  if (lowerUrl.includes("hubspot")) return "HubSpot";
  if (lowerUrl.includes("setmore")) return "Setmore";
  if (lowerUrl.includes("simplybook")) return "SimplyBook";

  return null;
}

/**
 * Utility component for phone booking fallback
 */
export function PhoneBooking({
  phoneNumber,
  buttonText = "Call to Book",
  description,
  className = "",
}: {
  phoneNumber: string;
  buttonText?: string;
  description?: string;
  className?: string;
}) {
  if (!phoneNumber) return null;

  // Format phone number for display
  const formattedPhone = formatPhoneNumber(phoneNumber);

  return (
    <div className={className}>
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}
      <a
        href={`tel:${phoneNumber.replace(/\D/g, "")}`}
        className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        {buttonText}
      </a>
      <p className="text-lg font-semibold text-gray-900 mt-2">{formattedPhone}</p>
    </div>
  );
}

/**
 * Format phone number for display
 */
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}
