"use client";

import { useState } from "react";
import { FileText, ChevronRight } from "lucide-react";
import { DietaryBadge } from "./DietaryBadge";
import type { MenuCategory, MenuItem, MenuPdf, DietaryTag } from "@/types/menu";

interface MenuDisplayProps {
  categories: MenuCategory[];
  pdfs: MenuPdf[];
}

function formatPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "Market Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const [showVariations, setShowVariations] = useState(false);
  const hasVariations = item.variations && item.variations.length > 0;

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        {item.image_url && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
              {hasVariations ? (
                <button
                  onClick={() => setShowVariations(!showVariations)}
                  className="text-sm font-medium text-brand hover:underline flex items-center gap-1"
                >
                  View options
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      showVariations ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <div>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.price_note && (
                    <span className="text-xs text-gray-500 block">{item.price_note}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dietary tags & details */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {item.dietary_tags?.map((tag) => (
              <DietaryBadge key={tag} tag={tag as DietaryTag} size="sm" />
            ))}
            {item.spice_level && item.spice_level > 0 && (
              <span className="text-xs text-red-600">
                {"🌶️".repeat(Math.min(item.spice_level, 5))}
              </span>
            )}
            {item.calories && (
              <span className="text-xs text-gray-400">{item.calories} cal</span>
            )}
          </div>

          {/* Variations */}
          {showVariations && hasVariations && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              {item.variations!.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {v.name}
                    {v.description && (
                      <span className="text-gray-400 ml-1">({v.description})</span>
                    )}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(v.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MenuDisplay({ categories, pdfs }: MenuDisplayProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || ""
  );

  const activeItems =
    categories.find((c) => c.id === activeCategory)?.items || [];

  return (
    <div>
      {/* PDF Downloads */}
      {pdfs.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {pdfs.map((pdf) => (
            <a
              key={pdf.id}
              href={pdf.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-brand hover:text-brand transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{pdf.name}</span>
            </a>
          ))}
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeCategory === category.id
                  ? "bg-brand text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Category Content */}
      {categories.map((category) => {
        if (categories.length > 1 && category.id !== activeCategory) return null;

        return (
          <div key={category.id} className="mb-8">
            {categories.length === 1 && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {category.name}
              </h2>
            )}
            {category.description && (
              <p className="text-gray-600 mb-6">{category.description}</p>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(category.items || []).map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>

            {(!category.items || category.items.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                No items in this category
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
