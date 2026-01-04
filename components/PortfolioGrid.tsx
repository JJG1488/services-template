"use client";

import { useState } from "react";
import { ExternalLink, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function openModal(item: PortfolioItem) {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  }

  function closeModal() {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  }

  function nextImage() {
    if (selectedItem?.images) {
      setCurrentImageIndex((i) => (i + 1) % selectedItem.images.length);
    }
  }

  function prevImage() {
    if (selectedItem?.images) {
      setCurrentImageIndex(
        (i) => (i - 1 + selectedItem.images.length) % selectedItem.images.length
      );
    }
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <article
            key={item.id}
            onClick={() => openModal(item)}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
          >
            {/* Image */}
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              {item.images?.[0]?.url ? (
                <img
                  src={item.images[0].url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : item.before_image_url ? (
                <img
                  src={item.after_image_url || item.before_image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Featured badge */}
              {item.is_featured && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}

              {/* Before/After indicator */}
              {item.before_image_url && item.after_image_url && (
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                  Before & After
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
              {item.client_name && (
                <p className="text-sm text-gray-500 mb-2">Client: {item.client_name}</p>
              )}
              {item.service_name && (
                <span className="inline-block text-xs bg-brand/10 text-brand px-2 py-1 rounded">
                  {item.service_name}
                </span>
              )}
              {item.description && (
                <p className="text-gray-600 text-sm mt-3 line-clamp-2">{item.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Gallery or Before/After */}
            <div className="relative bg-gray-900">
              {selectedItem.before_image_url && selectedItem.after_image_url ? (
                <div className="aspect-video">
                  <BeforeAfterSlider
                    beforeImage={selectedItem.before_image_url}
                    afterImage={selectedItem.after_image_url}
                    className="h-full"
                  />
                </div>
              ) : selectedItem.images && selectedItem.images.length > 0 ? (
                <div className="relative aspect-video">
                  <img
                    src={selectedItem.images[currentImageIndex]?.url}
                    alt={selectedItem.images[currentImageIndex]?.alt || selectedItem.title}
                    className="w-full h-full object-contain"
                  />

                  {/* Image navigation */}
                  {selectedItem.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                        {currentImageIndex + 1} / {selectedItem.images.length}
                      </div>
                    </>
                  )}

                  {/* Caption */}
                  {selectedItem.images[currentImageIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-3">
                      {selectedItem.images[currentImageIndex].caption}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No images</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                  {selectedItem.client_name && (
                    <p className="text-gray-500">Client: {selectedItem.client_name}</p>
                  )}
                </div>

                {selectedItem.external_url && (
                  <a
                    href={selectedItem.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-brand text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Live
                  </a>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedItem.service_name && (
                  <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded">
                    {selectedItem.service_name}
                  </span>
                )}
                {selectedItem.category && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                    {selectedItem.category}
                  </span>
                )}
                {selectedItem.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              {selectedItem.description && (
                <p className="text-gray-600 mb-6">{selectedItem.description}</p>
              )}

              {/* Results */}
              {selectedItem.results && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-green-800 mb-1">Results</h4>
                  <p className="text-green-700">{selectedItem.results}</p>
                </div>
              )}

              {/* Testimonial */}
              {selectedItem.testimonial && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-brand">
                  <p className="text-gray-700 italic mb-3">
                    &ldquo;{selectedItem.testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedItem.testimonial.rating && (
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < selectedItem.testimonial!.rating!
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="text-gray-900 font-medium">
                      {selectedItem.testimonial.author}
                    </span>
                    {selectedItem.testimonial.role && (
                      <span className="text-gray-500">
                        &middot; {selectedItem.testimonial.role}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Image thumbnails */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedItem.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          i === currentImageIndex ? "border-brand" : "border-transparent"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `Image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
