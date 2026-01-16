import { MapPin, Clock, Award, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getStoreSettingsFromDB } from "@/lib/settings";
import { getStoreConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
  description: "Learn more about our business and our commitment to quality service",
};

export default async function AboutPage() {
  const store = getStoreConfig();
  const settings = await getStoreSettingsFromDB();

  // Split about text into paragraphs for better formatting
  const aboutParagraphs = settings.aboutText
    ? settings.aboutText.split(/\n\n+/).filter(p => p.trim())
    : [];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-brand font-semibold text-sm uppercase tracking-wider mb-3">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About {store.name}
          </h1>
          {settings.tagline && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {settings.tagline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Text Section */}
            {aboutParagraphs.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {aboutParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Welcome to {store.name}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We are committed to providing exceptional service and quality results for all our customers.
                  Contact us today to learn more about how we can help you.
                </p>
              </div>
            )}

            {/* Why Choose Us - if we have badges/stats */}
            {settings.badges && settings.badges.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Why Choose Us
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {settings.badges.slice(0, 4).map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${badge.color || "#FFD700"}20` }}
                      >
                        <CheckCircle
                          className="w-5 h-5"
                          style={{ color: badge.color || "#FFD700" }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Facts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Quick Facts
              </h2>

              <div className="space-y-6">
                {settings.businessHours && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Business Hours</p>
                      <p className="font-semibold text-gray-900">
                        {settings.businessHours}
                      </p>
                    </div>
                  </div>
                )}

                {settings.serviceAreas && settings.serviceAreas.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Service Areas</p>
                      <p className="font-semibold text-gray-900">
                        {settings.serviceAreas.slice(0, 3).join(", ")}
                        {settings.serviceAreas.length > 3 && ` +${settings.serviceAreas.length - 3} more`}
                      </p>
                    </div>
                  </div>
                )}

                {settings.reviewCount && settings.reviewCount > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Customer Reviews</p>
                      <p className="font-semibold text-gray-900">
                        {settings.overallRating?.toFixed(1) || "5.0"} stars ({settings.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            {settings.stats && settings.stats.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <h2 className="text-lg font-semibold mb-6">
                  By The Numbers
                </h2>
                <div className="space-y-4">
                  {settings.stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                      <span className="text-gray-300">{stat.label}</span>
                      <span className="text-2xl font-bold text-brand">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-brand/10 rounded-2xl p-6 text-center">
              <Users className="w-12 h-12 text-brand mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact us today for a free consultation and quote.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full bg-brand text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
