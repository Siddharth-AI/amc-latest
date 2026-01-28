"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Award, Users, Shield, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CompanyIntroSection() {
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  return (
    <Section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Modern Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px] sm:bg-[size:20px_20px] md:bg-[size:24px_24px]" />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary-200/20 rounded-full blur-2xl sm:blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-navy-200/20 rounded-full blur-2xl sm:blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f008_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f008_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]" />

        {/* Diagonal Gradient Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 via-transparent to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* ========== CONTENT COLUMN ========== */}
          <div className="space-y-6 sm:space-y-8 lg:order-2">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-strong border border-primary/20 text-xs sm:text-sm font-bold text-primary shadow-lg hover:shadow-glow transition-all duration-300 group">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform" />
              <span>About AMC Systems</span>
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse" />
            </div>

            {/* Headline with Gradient & Underline */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-500 leading-tight">
                Leading{" "}
                <span className="relative inline-block">
                  <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-navy-500 to-brown-500">
                    POS Innovation
                  </span>
                  {/* SVG Underline */}
                  <svg
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
                    height="6"
                    viewBox="0 0 300 6"
                    fill="none">
                    <path
                      d="M2 4C50 2 100 1 150 2C200 3 250 2 298 4"
                      stroke="url(#gradient-intro)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient-intro"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%" stopColor="#1DA8AB" />
                        <stop offset="100%" stopColor="#1D295D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                in the <span className="text-primary-600">UAE</span>
              </h2>
            </div>

            {/* Enhanced Description */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-muted leading-relaxed">
                For over{" "}
                <span className="text-navy-600 font-bold">two decades</span>, Al
                Marwah Computers has been at the forefront of retail technology
                in the UAE. We&apos;ve helped{" "}
                <span className="text-primary-600 font-semibold">
                  thousands of businesses
                </span>{" "}
                transform their operations with cutting-edge POS solutions.
              </p>

              <p className="text-sm sm:text-base md:text-lg text-text-muted leading-relaxed">
                Our commitment to{" "}
                <span className="font-semibold text-navy-600">
                  excellence and innovation
                </span>{" "}
                has made us the trusted choice for businesses of all sizes, from
                local retailers to enterprise chains across the region.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Link href="/about">
                <Button
                  size="lg"
                  className="w-full xs:w-auto rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group text-sm sm:text-base">
                  <span>Learn More About Us</span>
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full xs:w-auto rounded-xl sm:rounded-2xl border-2 border-navy-600 text-navy-600 hover:bg-navy-600 hover:text-white font-bold transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 pt-3 sm:pt-4 opacity-70">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-600" />
                <span className="text-xs sm:text-sm font-semibold text-navy-600">
                  ISO Certified
                </span>
              </div>
              <div className="w-px h-3 sm:h-4 md:h-6 bg-border" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-600" />
                <span className="text-xs sm:text-sm font-semibold text-navy-600">
                  Award Winning
                </span>
              </div>
              <div className="w-px h-3 sm:h-4 md:h-6 bg-border" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-600" />
                <span className="text-xs sm:text-sm font-semibold text-navy-600">
                  Trusted Partner
                </span>
              </div>
            </div>
          </div>

          {/* ========== IMAGE COLUMN ========== */}
          <div className="relative lg:order-1">
            <div className="relative">
              {/* Glow Effect Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400/20 via-navy-400/20 to-brown-400/20 rounded-3xl blur-2xl opacity-50 animate-pulse" />

              {/* Main Image Container */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:shadow-glow transition-all duration-500"
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}>
                <div className="aspect-[4/3] relative">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=90"
                    alt="AMC Systems Team"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/20 to-transparent" />

                  {/* Shimmer Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${
                      isVideoHovered ? "translate-x-full" : "-translate-x-full"
                    }`}
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="group relative">
                      {/* Pulsing Rings */}
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />

                      {/* Button */}
                      <div className="relative w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-500 group-hover:shadow-glow">
                        <Play
                          className="h-8 w-8 text-navy-600 ml-1 transition-colors group-hover:text-white"
                          fill="currentColor"
                        />
                      </div>
                    </button>
                  </div>

                  {/* Bottom Label */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-strong rounded-2xl px-5 py-3 border border-white/30">
                      <div className="text-primary-500 font-bold text-lg">
                        Watch Our Story
                      </div>
                      <div className="text-primary-400 text-sm">
                        How we transform businesses
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-8 -right-8 hidden lg:block">
                <div className="glass-strong rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl font-black gradient-text bg-clip-text text-transparent bg-gradient-to-br from-primary-500 to-navy-600">
                      20+
                    </div>
                    <div>
                      <div className="font-black text-xl text-navy-600">
                        Years
                      </div>
                      <div className="text-sm font-semibold text-text-muted">
                        Of Excellence
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Floating Badge */}
              <div className="absolute -top-6 -left-6 hidden md:block">
                <div className="glass-strong rounded-2xl px-5 py-3 shadow-xl border border-white/30 flex items-center gap-3 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-bold text-navy-600 text-sm">
                      ISO Certified
                    </div>
                    <div className="text-xs text-text-muted">
                      Quality Assured
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-400 to-navy-500 opacity-20 blur-3xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-3xl bg-gradient-to-br from-brown-400 to-primary-500 opacity-20 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
