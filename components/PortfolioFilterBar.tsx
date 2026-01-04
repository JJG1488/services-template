"use client";

import { Filter } from "lucide-react";
import { portfolioCategories } from "@/types/portfolio";

interface Service {
  id: string;
  name: string;
  slug: string;
}

interface PortfolioFilterBarProps {
  services: Service[];
  selectedService: string;
  selectedCategory: string;
  onServiceChange: (serviceId: string) => void;
  onCategoryChange: (category: string) => void;
}

export function PortfolioFilterBar({
  services,
  selectedService,
  selectedCategory,
  onServiceChange,
  onCategoryChange,
}: PortfolioFilterBarProps) {
  const hasFilters = selectedService || selectedCategory;

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 text-gray-500">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filter by:</span>
      </div>

      {/* Service filter */}
      <select
        value={selectedService}
        onChange={(e) => onServiceChange(e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      >
        <option value="">All Services</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      {/* Category filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      >
        <option value="">All Categories</option>
        {portfolioCategories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={() => {
            onServiceChange("");
            onCategoryChange("");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
