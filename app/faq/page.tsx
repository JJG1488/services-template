import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { getStoreSettingsFromDB, type FAQItem } from "@/lib/settings";
import { FAQAccordion } from "@/components/FAQAccordion";

export const dynamic = "force-dynamic";

/**
 * FAQ Page - Server Component
 *
 * Displays FAQs from store_settings JSONB.
 * FAQs are managed via /admin/faq page.
 *
 * Falls back to default FAQs if none are configured.
 */

export default async function FAQPage() {
  const settings = await getStoreSettingsFromDB();

  // Use FAQs from settings, fall back to empty if none
  const faqs = settings.faqs || [];
  const title = settings.faqTitle || "Frequently Asked Questions";
  const subtitle = settings.faqSubtitle || "Find answers to common questions about our services.";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* FAQ List */}
        {faqs.length > 0 ? (
          <FAQAccordion items={faqs} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No FAQs available at this time.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later.</p>
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-gray-900 font-semibold rounded-lg hover:bg-brand-hover active:bg-brand-active transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
