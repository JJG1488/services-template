"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, HelpCircle, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "How do I schedule an appointment or service?",
    answer: "You can schedule a service by contacting us through our Contact page, calling us during business hours, or using our online booking system if available. We'll work with you to find a convenient time that fits your schedule.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "We ask that you provide at least 24 hours notice if you need to cancel or reschedule your appointment. Late cancellations or no-shows may be subject to a cancellation fee. We understand emergencies happen and will work with you on a case-by-case basis.",
  },
  {
    question: "Do you offer free estimates?",
    answer: "Yes, we provide free estimates for most services. Contact us with details about your project, and we'll give you a clear quote before any work begins. For complex projects, we may need to schedule an on-site assessment.",
  },
  {
    question: "What areas do you serve?",
    answer: "We serve the local area and surrounding communities. Check our service areas section or contact us to confirm we can service your location. We may be able to accommodate requests outside our standard service area for an additional travel fee.",
  },
  {
    question: "How do I get a quote for my project?",
    answer: "Getting a quote is easy! You can request a quote through our Contact page, describe your project and requirements, and we'll respond with a detailed estimate. For accurate pricing, please provide as much detail as possible about your needs.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and other payment methods shown at checkout. Payment is typically due upon completion of services unless other arrangements are made for larger projects.",
  },
  {
    question: "Are you licensed and insured?",
    answer: "Yes, we maintain all required licenses and carry appropriate insurance for the services we provide. We're happy to provide proof of insurance or licensing upon request. Your peace of mind is important to us.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "Your satisfaction is our priority. If you're not happy with our work, please contact us within 48 hours of service completion. We'll work with you to address any concerns and, if necessary, will re-perform the service at no additional cost.",
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900 pr-4">{item.question}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search
  const filteredFaqs = searchQuery
    ? defaultFAQs.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : defaultFAQs;

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">
            Find answers to common questions about our services, scheduling, and policies.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {/* FAQ List */}
        {filteredFaqs.length > 0 ? (
          <FAQAccordion items={filteredFaqs} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-brand hover:underline"
            >
              Clear search
            </button>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
