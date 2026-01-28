"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  Award,
  Clock,
  Shield,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <Section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-primary-100/40 rounded-full blur-[60px] sm:blur-[80px] md:blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-navy-100/40 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] sm:bg-[size:20px_20px] md:bg-[size:24px_24px]" />
      </div>

      <Container className="relative z-10">
        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[3rem] bg-gradient-to-br from-white to-slate-50/50 border border-slate-100 sm:border-2 p-6 sm:p-8 md:p-12 lg:p-16 shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary-100/30 rounded-full blur-2xl sm:blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-navy-100/30 rounded-full blur-2xl sm:blur-3xl" />

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary-50/50 border border-primary/20 text-xs sm:text-sm font-bold text-primary-700 backdrop-blur-md mb-4 sm:mb-6">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 fill-primary-700" />
                  <span>Get Started Today</span>
                </div>

                {/* Headline with Gradient */}
                <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-900 leading-[1.1] tracking-tight mb-4 sm:mb-6">
                  Ready to{" "}
                  <span className="relative inline-block">
                    <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-navy-500 to-brown-500">
                      Transform
                    </span>
                    {/* SVG Underline */}
                    <svg
                      className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                      height="8"
                      viewBox="0 0 300 8"
                      fill="none"
                      preserveAspectRatio="none">
                      <path
                        d="M2 6C50 3 100 1 150 3C200 5 250 3 298 6"
                        stroke="url(#gradient-cta)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="gradient-cta"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%">
                          <stop offset="0%" stopColor="#1DA8AB" />
                          <stop offset="50%" stopColor="#1D295D" />
                          <stop offset="100%" stopColor="#4B2A17" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                  <br />
                  Your Business?
                </h2>

                {/* Subheading */}
                <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                  Join 1000+ businesses that trust AMC Systems for their POS
                  solutions. Get expert consultation and customized quote today.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-slate-700 justify-center xs:justify-start">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm">Free Consultation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 justify-center xs:justify-start">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-amber-600" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm">20+ Years Trusted</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 justify-center xs:justify-start">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm">24/7 Support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 md:mb-12">
                <Button
                  size="lg"
                  className="group relative text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-7 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  asChild>
                  <Link href="/enquiry">
                    Get Free Quote
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-7 rounded-xl sm:rounded-2xl border border-slate-200 sm:border-2 bg-white hover:bg-slate-50 text-navy-900 font-bold shadow-md sm:shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                  asChild>
                  <Link href="/contact">
                    Contact Us
                    <Phone className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-8 sm:mb-10 md:mb-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-3 sm:px-4 bg-white text-slate-500 font-semibold">
                    Or reach us directly
                  </span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                <a
                  href="tel:+971123456789"
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-slate-100 sm:border-2 hover:border-primary-200 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Call Us
                    </div>
                    <div className="font-bold text-navy-900 text-xs sm:text-sm md:text-base">
                      +971 12 345 6789
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:info@amcuae.com"
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-slate-100 sm:border-2 hover:border-primary-200 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Email Us
                    </div>
                    <div className="font-bold text-navy-900 text-xs sm:text-sm md:text-base">
                      info@amcuae.com
                    </div>
                  </div>
                </a>

                <a
                  href="https://wa.me/971123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-slate-100 sm:border-2 hover:border-emerald-200 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 md:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      WhatsApp
                    </div>
                    <div className="font-bold text-navy-900 text-xs sm:text-sm md:text-base">
                      Chat Now
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
