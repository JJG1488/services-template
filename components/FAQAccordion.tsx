"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { FAQItem } from "@/lib/settings";

interface FAQAccordionProps {
  items: FAQItem[];
  showSearch?: boolean;
}

/**
 * FAQ Accordion Component
 *
 * Displays FAQ items in an expandable accordion format.
 * Optionally includes search functionality.
 *
 * Performance: O(n) for search filtering where n = number of FAQ items
 */
export function FAQAccordion({ items, showSearch = true }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQs based on search - O(n)
  const filteredItems = searchQuery
    ? items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <div>
      {/* Search */}
      {showSearch && items.length > 3 && (
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenIndex(null); // Close any open accordion when searching
            }}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
      )}

      {/* FAQ Items */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <div
              key={item.id || index}
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
                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4 whitespace-pre-wrap">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No questions found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 text-brand hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : null}
    </div>
  );
}
