import Link from "next/link";
import { ExternalLink, Images } from "lucide-react";
import type { Service } from "@/data/services";
import { formatPrice } from "@/data/services";
import { DynamicIcon } from "./DynamicIcon";

interface ServiceCardProps {
  service: Service;
  showPortfolioBadge?: boolean;
}

export function ServiceCard({ service, showPortfolioBadge }: ServiceCardProps) {
  // Get first image URL - handle both string[] and PortfolioImage[] formats
  let imageUrl: string | null = null;
  if (service.images && service.images.length > 0) {
    const firstImage = service.images[0];
    imageUrl = typeof firstImage === "string" ? firstImage : firstImage.url;
  }

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {service.is_featured && (
          <span className="bg-brand text-gray-900 text-xs font-medium px-2 py-1 rounded">
            Featured
          </span>
        )}
        {showPortfolioBadge && (
          <span className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
            <Images className="w-3 h-3" />
            Work Examples
          </span>
        )}
      </div>

      {/* Image or Icon */}
      {imageUrl ? (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center">
            <DynamicIcon
              name={service.icon}
              className="w-10 h-10 text-brand"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors">
          {service.name}
        </h3>
        {service.short_description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.short_description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-brand">
            {formatPrice(service.price, service.price_type)}
          </p>
          {service.external_url && (
            <span className="text-gray-400 flex items-center gap-1 text-xs">
              <ExternalLink className="w-3 h-3" />
              Live Demo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
