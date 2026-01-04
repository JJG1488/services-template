"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { PortfolioFilterBar } from "@/components/PortfolioFilterBar";
import type { PortfolioItem } from "@/types/portfolio";

interface Service {
  id: string;
  name: string;
  slug: string;
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchPortfolio();
    fetchServices();
  }, []);

  async function fetchPortfolio() {
    try {
      const params = new URLSearchParams();
      if (selectedService) params.set("service", selectedService);
      if (selectedCategory) params.set("category", selectedCategory);

      const res = await fetch(`/api/portfolio?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchServices() {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  // Refetch when filters change
  useEffect(() => {
    fetchPortfolio();
  }, [selectedService, selectedCategory]);

  const featuredItems = items.filter((item) => item.is_featured);
  const regularItems = items.filter((item) => !item.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our completed projects and see the quality of work we deliver
          </p>
        </div>

        {/* Filters */}
        {(services.length > 0 || items.some((i) => i.category)) && (
          <div className="mb-8">
            <PortfolioFilterBar
              services={services}
              selectedService={selectedService}
              selectedCategory={selectedCategory}
              onServiceChange={setSelectedService}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading portfolio...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No portfolio items found.</p>
          </div>
        ) : (
          <>
            {/* Featured section */}
            {featuredItems.length > 0 && !selectedService && !selectedCategory && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
                <PortfolioGrid items={featuredItems} />
              </section>
            )}

            {/* All projects */}
            <section>
              {featuredItems.length > 0 && !selectedService && !selectedCategory ? (
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Projects</h2>
              ) : null}
              <PortfolioGrid
                items={
                  selectedService || selectedCategory
                    ? items
                    : regularItems.length > 0
                    ? regularItems
                    : items
                }
              />
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
