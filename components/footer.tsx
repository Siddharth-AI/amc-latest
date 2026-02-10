"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
} from "lucide-react";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Softwares", href: "/products" },
  { name: "News & Events", href: "/news" },
  { name: "Contact Us", href: "/contact" },
  { name: "Request Quote", href: "/enquiry" },
];

const productLinks = [
  { name: "POS Systems", href: "/products/pos-systems" },
  { name: "Retail Solutions", href: "/products/retail-solutions" },
  { name: "Software", href: "/products/software" },
  { name: "Hardware", href: "/products/hardware" },
  { name: "Support Services", href: "/products/support" },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-700" },
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
    color: "hover:text-pink-600",
  },
];

export function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(29, 168, 171, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(29, 41, 93, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(75, 42, 23, 0.05) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Main Footer */}
        <div className="py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="footer-column lg:col-span-1">
              <div className="mb-6">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 via-navy-500 to-brown-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl group-hover:shadow-primary-500/30 transition-all duration-300 group-hover:scale-105">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black bg-gradient-to-r from-navy-800 to-primary-600 bg-clip-text text-transparent">
                      AMC
                    </span>
                    <span className="text-sm block text-navy-600 -mt-1">
                      Systems
                    </span>
                  </div>
                </Link>
              </div>

              <p className="text-navy-600 mb-6 leading-relaxed">
                Leading POS solutions provider in UAE since 2003. Transforming
                businesses with cutting-edge technology and exceptional service.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 flex items-center justify-center text-navy-600 ${social.color} hover:scale-110 hover:shadow-lg transition-all duration-300`}
                      aria-label={social.name}>
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h3 className="text-lg font-bold text-navy-800 mb-6 relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="footer-link text-navy-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group">
                      <ArrowRight className="arrow-icon h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary-500" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="footer-column">
              <h3 className="text-lg font-bold text-navy-800 mb-6 relative">
                Softwares
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="footer-link text-navy-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2 group">
                      <ArrowRight className="arrow-icon h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary-500" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h3 className="text-lg font-bold text-navy-800 mb-6 relative">
                Contact Us
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-navy-800 font-medium">Address</div>
                    <div className="text-navy-600 text-sm">
                      Dubai, United Arab Emirates
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-navy-800 font-medium">Phone</div>
                    <a
                      href="tel:+971123456789"
                      className="text-navy-600 text-sm hover:text-primary-600 transition-colors">
                      +971 12 345 6789
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-navy-800 font-medium">Email</div>
                    <a
                      href="mailto:info@amcuae.com"
                      className="text-navy-600 text-sm hover:text-primary-600 transition-colors">
                      info@amcuae.com
                    </a>
                  </div>
                </li>
              </ul>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/971123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full mt-6 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 sm:py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-navy-600 text-center md:text-left">
              © {new Date().getFullYear()} Al Marwah Computers. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-xs sm:text-sm transition-colors"
                style={{ color: "var(--color-navy)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-navy)")
                }>
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs sm:text-sm transition-colors"
                style={{ color: "var(--color-navy)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-navy)")
                }>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
