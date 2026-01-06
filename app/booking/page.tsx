import { Metadata } from "next";
import { BookingWidget } from "@/components/BookingWidget";
import { createFreshAdminClient, getStoreId } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Schedule your appointment online",
};

interface BookingSettings {
  bookingUrl: string;
  bookingDisplayMode: string;
  bookingButtonText: string;
  bookingDescription: string;
  showBookingPage: boolean;
  businessName?: string;
}

async function getBookingSettings(): Promise<BookingSettings | null> {
  const supabase = createFreshAdminClient();
  const storeId = getStoreId();

  if (!supabase || !storeId) {
    return null;
  }

  const { data, error } = await supabase
    .from("store_settings")
    .select("settings")
    .eq("store_id", storeId)
    .single();

  if (error || !data?.settings) {
    return null;
  }

  return {
    bookingUrl: data.settings.bookingUrl || "",
    bookingDisplayMode: data.settings.bookingDisplayMode || "embed",
    bookingButtonText: data.settings.bookingButtonText || "Book Now",
    bookingDescription: data.settings.bookingDescription || "",
    showBookingPage: data.settings.showBookingPage !== false,
    businessName: data.settings.businessName || "",
  };
}

export default async function BookingPage() {
  const settings = await getBookingSettings();

  // If booking page is disabled or no URL configured, show message
  if (!settings || !settings.showBookingPage || !settings.bookingUrl) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Online Booking Not Available
          </h1>
          <p className="text-gray-600 mb-8">
            Online booking is not currently available. Please contact us directly to schedule an appointment.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-brand font-semibold text-sm uppercase tracking-wider mb-3">
            Schedule Online
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book an Appointment
          </h1>
          {settings.bookingDescription && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {settings.bookingDescription}
            </p>
          )}
        </div>

        {/* Booking Widget */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <BookingWidget
            url={settings.bookingUrl}
            mode={settings.bookingDisplayMode as "embed" | "popup" | "link"}
            buttonText={settings.bookingButtonText}
          />
        </div>

        {/* Contact Alternative */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Having trouble booking online? We&apos;re here to help.
          </p>
          <a
            href="/contact"
            className="text-brand hover:underline font-medium"
          >
            Contact us directly →
          </a>
        </div>
      </div>
    </div>
  );
}
