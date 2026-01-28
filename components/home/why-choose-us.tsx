"use client";

import {
  Award,
  ShieldCheck,
  Headphones,
  Zap,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const features = [
  {
    title: "20+ Years Experience",
    description:
      "Two decades of expertise delivering cutting-edge POS solutions across the UAE.",
    icon: Award,
  },
  {
    title: "ISO Certified",
    description:
      "Industry-standard certifications ensuring quality and reliability.",
    icon: ShieldCheck,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock technical assistance whenever you need it.",
    icon: Headphones,
  },
  {
    title: "Fast Deployment",
    description:
      "Quick setup and integration with minimal business disruption.",
    icon: Zap,
  },
  {
    title: "Scalable Solutions",
    description:
      "Grow your business with solutions that scale with your needs.",
    icon: TrendingUp,
  },
  {
    title: "Expert Team",
    description: "Dedicated professionals committed to your success.",
    icon: Users,
  },
];

export function WhyChooseUs() {
  return (
    <Section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-200/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-brown-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f010_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f010_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Gradient Overlay */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 via-transparent to-transparent" />
      </div>
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy-100/30 rounded-full blur-[120px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: Content */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong border border-primary/20 text-sm font-bold text-primary-700 shadow-sm hover:shadow-glow transition-all duration-300">
                <Sparkles className="h-4 w-4" />
                Why Choose AMC
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy-900 leading-[1.1] tracking-tight">
                Built for{" "}
                <span className="relative inline-block">
                  <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-navy-500 to-brown-500">
                    Excellence
                  </span>
                  {/* Underline SVG */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 300 12"
                    fill="none">
                    <path
                      d="M2 10C50 5 100 2 150 5C200 8 250 5 298 10"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
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
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-light">
                We don't just provide technology—we partner with you for
                sustainable growth and long-term success.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 sm:space-y-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-3 sm:gap-5 group p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-white/80 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Visual/Stats */}
          <div className="relative lg:pl-8">
            {/* Main Container with better gradient */}
            <div className="relative h-[600px] rounded-[3rem] bg-gradient-to-br from-primary-50 via-white to-navy-50 p-8 overflow-hidden shadow-2xl">
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px]" />

              {/* Floating Stats Cards */}

              {/* Card 1 - Top Left - Animated Float */}
              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 max-w-[220px] border border-white/50 animate-float hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="text-4xl font-black text-primary-600">
                    98%
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-700">
                  Client Retention Rate
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Industry Leading
                </div>
              </div>

              {/* Card 2 - Bottom Right - Delayed Animation */}
              <div
                className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 max-w-[220px] border border-white/50 animate-float hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-navy-600" />
                  </div>
                  <div className="text-4xl font-black text-navy-600">1000+</div>
                </div>
                <div className="text-sm font-bold text-slate-700">
                  Businesses Powered
                </div>
                <div className="text-xs text-slate-500 mt-1">Across UAE</div>
              </div>

              {/* Card 3 - Center - Main Focus */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 max-w-[280px] border-2 border-primary-100 animate-float hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Award className="w-9 h-9 text-white" />
                  </div>
                  <div className="text-5xl font-black gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-navy-600">
                    20+
                  </div>
                </div>
                <div className="text-base font-bold text-navy-900 mb-2">
                  Years of Excellence
                </div>
                <div className="text-sm text-slate-600">
                  Industry Leadership in POS Solutions
                </div>

                {/* Trust Badge */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-slate-700">
                    ISO Certified Partner
                  </span>
                </div>
              </div>

              {/* Decorative Glow Elements */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-primary-300/30 rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-navy-300/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
