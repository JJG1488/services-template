"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Briefcase, Image, UtensilsCrossed, MessageSquare, Settings, Calendar, HelpCircle, CircleHelp } from "lucide-react";
import { AdminContext } from "@/lib/admin-context";
import type { EnabledFeatures } from "@/lib/business-types";
import { TourProvider } from "@/components/TourProvider";
import { TourButton } from "@/components/TourButton";

function LoginForm({ onLogin }: { onLogin: (password: string) => Promise<boolean> }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await onLogin(password);
    if (!success) {
      setError("Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              autoFocus
            />
          </div>
          {error && (
            <div className="text-sm mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-gray-900 font-semibold py-3 rounded-lg hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Navigation link definition with feature gating
 */
interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  tourId: string;
  always?: boolean;
  feature?: keyof EnabledFeatures;
}

function AdminNav({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enabledFeatures, setEnabledFeatures] = useState<EnabledFeatures | null>(null);
  const [businessType, setBusinessType] = useState<string>("custom");

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch enabled features on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: "Bearer " + token },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.enabledFeatures) {
            setEnabledFeatures(data.settings.enabledFeatures);
          }
          if (data.settings?.businessType) {
            setBusinessType(data.settings.businessType);
          }
        }
      } catch (err) {
        console.error("Error fetching settings for nav:", err);
      }
    }
    fetchSettings();
  }, []);

  // All possible nav links with feature requirements (Enhanced v9.37, v9.44, v9.46)
  const allLinks: NavLink[] = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, tourId: "nav-dashboard", always: true },
    { href: "/admin/services", label: "Services", icon: <Briefcase className="w-4 h-4" />, tourId: "nav-services", always: true },
    { href: "/admin/portfolio", label: "Portfolio", icon: <Image className="w-4 h-4" />, tourId: "nav-portfolio", feature: "portfolioGallery" },
    { href: "/admin/menu", label: "Menu", icon: <UtensilsCrossed className="w-4 h-4" />, tourId: "nav-menu", feature: "menuSystem" },
    { href: "/admin/booking", label: "Booking", icon: <Calendar className="w-4 h-4" />, tourId: "nav-booking", feature: "bookingSystem" },
    { href: "/admin/inquiries", label: "Inquiries", icon: <MessageSquare className="w-4 h-4" />, tourId: "nav-inquiries", always: true },
    { href: "/admin/faq", label: "FAQ", icon: <HelpCircle className="w-4 h-4" />, tourId: "nav-faq", always: true },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" />, tourId: "nav-settings", always: true },
  ];

  // Filter links based on enabled features - O(n) where n = number of links
  const links = allLinks.filter((link) => {
    if (link.always) return true;
    if (!enabledFeatures) return true; // Show all while loading
    if (link.feature) return enabledFeatures[link.feature];
    return true;
  });

  // Get business type label for display
  const businessTypeLabel = businessType !== "custom" ? businessType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : null;

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-bold text-lg">
              Admin
            </Link>
            {/* Business type badge - shows current template mode */}
            {businessTypeLabel && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand/20 text-brand border border-brand/30">
                {businessTypeLabel}
              </span>
            )}
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-tour={link.tourId}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white font-medium"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="w-px h-6 bg-gray-700 mx-2" />
            <Link
              href="/"
              data-tour="view-site"
              className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              View Site
            </Link>
            <TourButton enabledFeatures={enabledFeatures} />
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white text-sm px-3 py-1.5 border border-gray-700 rounded-lg hover:border-gray-500 hover:bg-gray-800/50 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-4 py-3 space-y-1">
            {/* Business type badge in mobile */}
            {businessTypeLabel && (
              <div className="px-3 py-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand/20 text-brand border border-brand/30">
                  {businessTypeLabel}
                </span>
              </div>
            )}
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-tour={link.tourId}
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg ${
                    isActive
                      ? "bg-gray-800 text-white font-medium"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <hr className="border-gray-700 my-2" />
            <Link
              href="/"
              data-tour="view-site"
              className="block py-3 px-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              View Site
            </Link>
            <TourButton variant="mobile" enabledFeatures={enabledFeatures} />
            <button
              onClick={onLogout}
              className="block w-full text-left py-3 px-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch("/api/admin/verify", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => {
          if (res.ok) setIsAuthenticated(true);
          else localStorage.removeItem("admin_token");
        })
        .catch(() => localStorage.removeItem("admin_token"))
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  async function login(password: string): Promise<boolean> {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("admin_token", token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      <TourProvider autoStart={true} autoStartDelay={1500}>
        <div className="min-h-screen bg-gray-100">
          <AdminNav onLogout={logout} />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </div>
      </TourProvider>
    </AdminContext.Provider>
  );
}
