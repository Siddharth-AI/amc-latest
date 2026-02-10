import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Users,
  Target,
  TrendingUp,
  Shield,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Star,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/about/timeline";
import { TeamCard } from "@/components/about/team-card";

export const metadata: Metadata = {
  title: "About Us - AMC Systems | Leading POS Solutions Provider in UAE",
  description:
    "Learn about AMC Systems' 20+ year journey in providing cutting-edge POS solutions across the UAE. Founded in 2003, we've helped 1000+ businesses transform with enterprise-grade retail technology.",
  keywords: [
    "AMC Systems about",
    "Al Marwah Computers history",
    "POS solutions provider UAE",
    "retail technology company",
    "UAE business solutions",
    "enterprise POS systems",
  ],
  openGraph: {
    title: "About Us - AMC Systems | Leading POS Solutions Provider",
    description:
      "Over two decades of excellence, helping 1000+ businesses transform with cutting-edge point-of-sale technology in UAE.",
    url: "/about",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMC Systems - About Us",
      },
    ],
    siteName: "AMC Systems",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - AMC Systems",
    description: "20+ years of excellence in POS solutions across UAE.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

const values = [
  {
    icon: Target,
    title: "Customer First",
    description:
      "Every decision we make is centered around delivering exceptional value to our customers.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Quality & Reliability",
    description:
      "We maintain the highest standards in every product and service we deliver.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "Staying ahead with cutting-edge technology and forward-thinking solutions.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "Building trust through transparency, honesty, and ethical business practices.",
    color: "from-rose-500 to-pink-600",
  },
];

const timeline = [
  {
    year: "2003",
    title: "The Beginning",
    description:
      "Founded with a vision to revolutionize retail technology in the UAE. Started with a small team and big dreams.",
  },
  {
    year: "2008",
    title: "Regional Expansion",
    description:
      "Expanded operations across all seven emirates, establishing ourselves as a trusted POS solutions provider.",
  },
  {
    year: "2013",
    title: "1000+ Clients Milestone",
    description:
      "Reached a major milestone of serving over 1000 businesses across various industries.",
  },
  {
    year: "2018",
    title: "ISO Certification",
    description:
      "Achieved ISO 9001:2015 certification, reinforcing our commitment to quality and excellence.",
  },
  {
    year: "2023",
    title: "20 Years Strong",
    description:
      "Celebrated two decades of innovation, growth, and customer success. Looking forward to the next chapter.",
  },
  {
    year: "2024",
    title: "AI Integration",
    description:
      "Launched AI-powered analytics and inventory management solutions for next-gen retail operations.",
  },
];

const team = [
  {
    id: "1",
    name: "Ahmed Al Mansoori",
    role: "Founder & CEO",
    bio: "Visionary leader with 20+ years in retail technology",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    linkedin: "#",
    email: "ahmed@amcsystems.ae",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Chief Technology Officer",
    bio: "Expert in enterprise software architecture",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    linkedin: "#",
    email: "sarah@amcsystems.ae",
  },
  {
    id: "3",
    name: "Mohammed Hassan",
    role: "Head of Operations",
    bio: "Specialist in logistics and customer success",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    linkedin: "#",
    email: "mohammed@amcsystems.ae",
  },
  {
    id: "4",
    name: "Fatima Ali",
    role: "Sales Director",
    bio: "Building lasting relationships",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    linkedin: "#",
    email: "fatima@amcsystems.ae",
  },
];

const achievements = [
  { icon: Users, label: "Happy Clients", value: "1000+", color: "blue" },
  { icon: Building2, label: "Projects", value: "15K+", color: "emerald" },
  { icon: Globe, label: "Emirates", value: "7", color: "violet" },
  { icon: Star, label: "Satisfaction", value: "98%", color: "amber" },
];

export default async function AboutPage() {
  const { SITE_URL } = await import("@/lib/site-config");
  const { generateWebPageSchema } = await import("@/lib/seo-schema");

  // Structured Data
  const aboutUrl = `${SITE_URL}/about`;
  const breadcrumbs = [{ name: "About Us", url: aboutUrl }];

  const structuredData = generateWebPageSchema({
    title: "About Us - AMC Systems",
    description:
      "Learn about AMC Systems' 20+ year journey in providing cutting-edge POS solutions across the UAE.",
    url: aboutUrl,
    breadcrumbs,
  });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section - MINIMAL & CLEAN */}
        <Section className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-20 lg:pb-28 bg-gradient-to-b from-slate-900 to-navy-900 overflow-hidden">
          <Container>
            <div className="max-w-4xl mx-auto sm:text-center px-4">
              {/* Small Tag - Mobile Responsive */}
              <p className="text-primary-400 font-semibold mt-10 text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">
                Trusted Since 2003
              </p>

              {/* Main Title - Fully Responsive */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
                Leading POS Solutions in{" "}
                <span className="text-primary-400 block sm:inline">UAE</span>
              </h1>

              {/* Subtitle - Mobile Optimized */}
              <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
                Over two decades of excellence, helping 1000+ businesses
                transform with cutting-edge point-of-sale technology
              </p>

              {/* Action Buttons - Mobile First */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 md:mb-16 px-2">
                <Button
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
                  asChild>
                  <Link href="/enquiry">Get Started →</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
                  asChild>
                  <Link href="/products">View Software</Link>
                </Button>
              </div>

              {/* Trust Indicators - Mobile Responsive */}
              <div className="flex flex-col xs:flex-row flex-wrap md:justify-center gap-4 sm:gap-6 md:gap-8 sm:text-center px-2">
                <div className="flex items-center md:justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                    ISO Certified
                  </span>
                </div>
                <div className="flex items-center md:justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                    24/7 Support
                  </span>
                </div>
                <div className="flex items-center md:justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                    1000+ Happy Clients
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Story Section */}
        <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Left: Image */}
              <div className="relative order-2 lg:order-1">
                <div className="relative rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                    alt="AMC Team"
                    width={600}
                    height={400}
                    className="w-full"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border-2 border-primary-100">
                  <div className="text-2xl sm:text-3xl font-black text-primary-600 mb-1">
                    15K+
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-600">
                    Installations
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-50 text-xs sm:text-sm font-bold text-primary-700 mb-4 sm:mb-6">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  Our Story
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4 sm:mb-6">
                  Two Decades of Excellence
                </h2>

                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
                  <p>
                    Founded in 2003,{" "}
                    <span className="font-bold text-navy-900">
                      Al Marwah Computers (AMC Systems)
                    </span>{" "}
                    has been at the forefront of retail technology in the UAE.
                    What started as a small venture has grown into the region's
                    most trusted POS solutions provider.
                  </p>
                  <p>
                    Our commitment to innovation, quality, and customer
                    satisfaction has helped over 1000 businesses transform their
                    operations and achieve remarkable growth.
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 mb-1 text-sm sm:text-base">
                        ISO Certified
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600">
                        Quality Assured
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 mb-1 text-sm sm:text-base">
                        24/7 Support
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600">
                        Always Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Values Section */}
        <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16 px-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-50 text-xs sm:text-sm font-bold text-primary-700 mb-4 sm:mb-6">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                Our Values
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4 sm:mb-6">
                What Drives Us Forward
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600">
                The core principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-white border-2 border-slate-100 hover:border-primary-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold text-navy-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Hover Gradient */}
                    <div
                      className={`absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        {/* Timeline Section */}
        <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 px-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-50 text-xs sm:text-sm font-bold text-primary-700 mb-4 sm:mb-6">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                Our Journey
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4 sm:mb-6">
                20 Years of Growth
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600">
                Key milestones in our journey to becoming UAE's leading POS
                solutions provider
              </p>
            </div>

            <Timeline events={timeline} />
          </Container>
        </Section>

        {/* Team Section */}
        <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16 px-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-50 text-xs sm:text-sm font-bold text-primary-700 mb-4 sm:mb-6">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Our Team
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4 sm:mb-6">
                Meet the Experts
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600">
                The dedicated professionals behind AMC Systems' success
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {team.map((member, index) => (
                <TeamCard key={index} member={member} />
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <Container>
            <div className="max-w-5xl mx-auto px-4">
              <div className="relative rounded-3xl md:rounded-[3rem] bg-gradient-to-br from-primary-500 via-navy-600 to-brown-600 p-8 sm:p-12 md:p-16 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
                    Join 1000+ businesses that trust AMC Systems for their POS
                    solutions
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-navy-900 hover:bg-slate-100 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
                      asChild>
                      <Link href="/enquiry">
                        Get Started
                        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl font-bold"
                      asChild>
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </>
  );
}
