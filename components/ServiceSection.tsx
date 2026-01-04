import Link from "next/link";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { DynamicIcon } from "./DynamicIcon";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/data/services";

interface ServiceSectionProps {
  service: Service;
  index: number;
}

export function ServiceSection({ service, index }: ServiceSectionProps) {
  const isEven = index % 2 === 0;

  return (
    <section className={`py-16 ${index > 0 ? "border-t border-gray-100" : ""}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div
          className={`flex flex-col ${
            isEven ? "lg:flex-row" : "lg:flex-row-reverse"
          } gap-8 lg:gap-12 items-center`}
        >
          {/* Image/Icon Side */}
          <div className="w-full lg:w-1/2">
            {service.images && service.images.length > 0 ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={service.images[0].url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                {service.is_featured && (
                  <div className="absolute top-4 left-4 bg-brand text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-brand/20 to-brand/5 rounded-2xl flex items-center justify-center">
                <DynamicIcon
                  name={service.icon}
                  className="w-24 h-24 text-brand"
                />
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            {/* Category Badge */}
            {service.category && (
              <span className="inline-block text-brand font-semibold text-sm uppercase tracking-wider mb-3">
                {service.category}
              </span>
            )}

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {service.name}
            </h2>

            {/* Price & Duration */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {service.price !== null && (
                <span className="text-2xl font-bold text-brand">
                  {formatPrice(service.price, service.price_type)}
                </span>
              )}
              {service.duration && (
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {service.description || service.short_description}
            </p>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  What&apos;s Included
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
