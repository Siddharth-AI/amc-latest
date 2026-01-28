"use client";

import { Award, Users, Package, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const stats = [
  { label: "Years Experience", value: 20, suffix: "+", icon: Award, color: "from-violet-500 to-purple-600" },
  { label: "Happy Clients", value: 1000, suffix: "+", icon: Users, color: "from-cyan-500 to-blue-600" },
  { label: "Products Sold", value: 5000, suffix: "+", icon: Package, color: "from-emerald-500 to-teal-600" },
  { label: "Support", value: 24, suffix: "/7", icon: Clock, color: "from-amber-500 to-orange-600" },
];

export function StatsCounter() {
  return (
    <Section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-secondary"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <Container className="relative z-10">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="stat-item text-center"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Number */}
                <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3">
                  <span>{stat.value.toLocaleString()}</span>
                  <span className="text-white/80">{stat.suffix}</span>
                </div>

                {/* Label */}
                <div className="text-white/80 font-medium text-lg">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
