"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuDisplay } from "@/components/MenuDisplay";
import type { MenuCategory, MenuPdf } from "@/types/menu";

interface MenuData {
  categories: MenuCategory[];
  pdfs: MenuPdf[];
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const data = await res.json();
        setMenu(data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our offerings and find something you&apos;ll love
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading menu...</p>
          </div>
        ) : !menu || (menu.categories.length === 0 && menu.pdfs.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Menu not available yet.</p>
          </div>
        ) : (
          <MenuDisplay categories={menu.categories} pdfs={menu.pdfs} />
        )}
      </main>

      <Footer />
    </div>
  );
}
