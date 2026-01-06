"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ExternalLink, Settings, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { BookingWidget } from "@/components/BookingWidget";

interface BookingSettings {
  bookingUrl: string;
  bookingDisplayMode: string;
  bookingButtonText: string;
  bookingDescription: string;
  showBookingOnHero: boolean;
  showBookingOnServicePages: boolean;
  showBookingPage: boolean;
}

export default function AdminBookingPage() {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch settings");

        const data = await res.json();
        setSettings({
          bookingUrl: data.settings?.bookingUrl || "",
          bookingDisplayMode: data.settings?.bookingDisplayMode || "embed",
          bookingButtonText: data.settings?.bookingButtonText || "Book Now",
          bookingDescription: data.settings?.bookingDescription || "",
          showBookingOnHero: data.settings?.showBookingOnHero || false,
          showBookingOnServicePages: data.settings?.showBookingOnServicePages || false,
          showBookingPage: data.settings?.showBookingPage || true,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Failed to load booking settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const isConfigured = settings?.bookingUrl && settings.bookingUrl.trim() !== "";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Integration</h1>
          <p className="text-gray-600 mt-1">
            Manage your online booking system
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Edit Settings
        </Link>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${isConfigured ? "bg-green-100" : "bg-yellow-100"}`}>
            {isConfigured ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-gray-900">
              {isConfigured ? "Booking System Connected" : "No Booking System Connected"}
            </h2>
            <p className="text-gray-600 mt-1">
              {isConfigured
                ? "Your customers can book appointments through your connected scheduling platform."
                : "Connect a booking platform like Calendly, Cal.com, or Acuity Scheduling to accept online bookings."}
            </p>
            {!isConfigured && (
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-2 text-brand hover:underline mt-3 font-medium"
              >
                Configure in Settings
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {isConfigured && settings && (
        <>
          {/* Current Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Current Configuration</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Booking URL</p>
                <a
                  href={settings.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline flex items-center gap-1 mt-1"
                >
                  {settings.bookingUrl.length > 50
                    ? settings.bookingUrl.substring(0, 50) + "..."
                    : settings.bookingUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Display Mode</p>
                <p className="font-medium text-gray-900 mt-1 capitalize">{settings.bookingDisplayMode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Button Text</p>
                <p className="font-medium text-gray-900 mt-1">{settings.bookingButtonText}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Where It Appears</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {settings.showBookingOnHero && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Hero Section</span>
                  )}
                  {settings.showBookingOnServicePages && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Service Pages</span>
                  )}
                  {settings.showBookingPage && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">/booking Page</span>
                  )}
                  {!settings.showBookingOnHero && !settings.showBookingOnServicePages && !settings.showBookingPage && (
                    <span className="text-xs text-gray-400">Not displayed anywhere</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Preview</h2>
            <p className="text-sm text-gray-600 mb-4">
              This is how your booking widget will appear to customers.
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <BookingWidget
                url={settings.bookingUrl}
                mode={settings.bookingDisplayMode as "embed" | "popup" | "link"}
                buttonText={settings.bookingButtonText}
                description={settings.bookingDescription}
              />
            </div>
          </div>
        </>
      )}

      {/* Supported Platforms */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Supported Booking Platforms</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Calendly", url: "https://calendly.com" },
            { name: "Cal.com", url: "https://cal.com" },
            { name: "Acuity", url: "https://acuityscheduling.com" },
            { name: "Square", url: "https://squareup.com/appointments" },
            { name: "TidyCal", url: "https://tidycal.com" },
            { name: "Setmore", url: "https://setmore.com" },
            { name: "SimplyBook", url: "https://simplybook.me" },
            { name: "HubSpot", url: "https://hubspot.com/meetings" },
          ].map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{platform.name}</span>
              <ExternalLink className="w-3 h-3 text-gray-300 ml-auto" />
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Any booking platform that provides an embeddable URL or scheduling link will work.
        </p>
      </div>
    </div>
  );
}
