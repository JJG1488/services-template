import Link from "next/link";
import { ArrowRight, ExternalLink, Images } from "lucide-react";
import type { Service } from "@/data/services";
import { DynamicIcon } from "./DynamicIcon";

interface ServiceGridProps {
  services: Service[];
  showAll?: boolean;
  portfolioServiceIds?: string[]; // Service IDs that have portfolio items
}

function formatPrice(price: number | null, priceType: string): string {
  if (price === null) return "Contact for pricing";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price / 100);

  switch (priceType) {
    case "starting_at":
      return "From " + formatted;
    case "hourly":
      return formatted + "/hr";
    case "custom":
      return "Custom pricing";
    default:
      return formatted;
  }
}

export function ServiceGrid({ services, showAll = false, portfolioServiceIds = [] }: ServiceGridProps) {
  const displayServices = showAll ? services : services.slice(0, 6);

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No services available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((service, index) => {
          // Get first image URL if available
          let imageUrl: string | null = null;
          if (service.images && service.images.length > 0) {
            const firstImage = service.images[0];
            imageUrl = typeof firstImage === "string" ? firstImage : firstImage.url;
          }

          const hasPortfolio = portfolioServiceIds.includes(service.id);

          return (
            <Link
              key={service.id}
              href={"/services/" + service.slug}
              className={"group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 card-hover stagger-" + ((index % 5) + 1)}
            >
              {/* Image or Icon Header */}
              {imageUrl ? (
                <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badges overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {service.is_featured && (
                      <span className="bg-brand text-gray-900 text-xs font-medium px-2 py-1 rounded shadow-sm">
                        Featured
                      </span>
                    )}
                    {hasPortfolio && (
                      <span className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        Gallery
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-brand/5 to-brand/10 flex items-center justify-center relative">
                  <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
                    <DynamicIcon name={service.icon} className="w-8 h-8 text-brand" />
                  </div>
                  {/* Badges overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {service.is_featured && (
                      <span className="bg-brand text-gray-900 text-xs font-medium px-2 py-1 rounded shadow-sm">
                        Featured
                      </span>
                    )}
                    {hasPortfolio && (
                      <span className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        Gallery
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors">
                  {service.name}
                </h3>

                {service.short_description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.short_description}
                  </p>
                )}

                {/* Price */}
                {service.price !== null && (
                  <p className="text-brand font-semibold mb-4">
                    {formatPrice(service.price, service.price_type)}
                  </p>
                )}

                {/* Features Preview */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand font-medium group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  {service.external_url && (
                    <span className="text-gray-400 flex items-center gap-1 text-xs">
                      <ExternalLink className="w-3 h-3" />
                      Demo
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Button */}
      {!showAll && services.length > 6 && (
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-brand-dark transition-all btn-glow"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
