import Link from "next/link";
import { ServiceSection } from "@/components/ServiceSection";
import { getActiveServices } from "@/data/services";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Services",
  description: "Browse our full range of professional services",
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <div className="pt-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-brand font-semibold text-sm uppercase tracking-wider mb-3">
            What We Offer
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional solutions tailored to meet your specific needs
          </p>
        </div>
      </div>

      {/* Service Sections */}
      {services.length > 0 ? (
        <div className="pb-16">
          {services.map((service, index) => (
            <ServiceSection key={service.id} service={service} index={index} />
          ))}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-lg">No services available yet.</p>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Contact us today for a free consultation and quote
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand text-gray-900 font-semibold px-8 py-4 rounded-lg hover:bg-brand-dark transition-colors text-lg"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
