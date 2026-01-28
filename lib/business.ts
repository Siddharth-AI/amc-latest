// ============================================================================
// BUSINESS DATA - Centralized business information for SEO
// ============================================================================

import { SITE_URL } from "./site-config";
import { company } from "./data";

export const BUSINESS = {
  name: "AMC Systems - Al Marwah Computers",
  legalName: "Al Marwah Computers LLC",
  tagline: "Premium POS Solutions Provider in UAE",
  shortName: "AMC Systems",

  // Contact Information - Update with actual details
  phone: "+971-4-XXX-XXXX",
  phoneDisplay: "+971 4 XXX XXXX",
  email: "info@amcsystems.ae",
  supportEmail: "support@amcsystems.ae",

  // Address
  address: {
    street: "Dubai, UAE",
    city: "Dubai",
    state: "Dubai",
    stateFullName: "Dubai",
    zip: "",
    country: "UAE",
    full: "Dubai, United Arab Emirates",
  },

  // Geo Coordinates - Update with actual location
  geo: {
    latitude: 25.2048,
    longitude: 55.2708,
  },

  // URLs
  url: SITE_URL,
  bookingUrl: `${SITE_URL}/contact`,
  productsUrl: `${SITE_URL}/products`,

  // Business Hours
  hours: {
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "9:00 AM - 1:00 PM",
    sunday: "Closed",
  },

  // Schema.org formatted hours
  openingHoursSpecification: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],

  // Social Media - Update with actual URLs
  social: {
    facebook: "https://facebook.com/amcsystems",
    linkedin: "https://linkedin.com/company/amcsystems",
    twitter: "https://twitter.com/amcsystems",
    instagram: "https://instagram.com/amcsystems",
  },

  // Company Info from company.json
  story: company.story,
  mission: company.mission,
  vision: company.vision,
  values: company.values,
  certifications: company.certifications,
  partnerships: company.partnerships,

  // Service Areas
  serviceAreas: [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
    "UAE",
  ],

  // Year Established
  foundingYear: 2003,

  // Price Range
  priceRange: "$$$",
} as const;

// ============================================================================
// SEO KEYWORDS - Common keywords used across pages
// ============================================================================

export const LOCATION_KEYWORDS = [
  "dubai",
  "uae",
  "united arab emirates",
  "abu dhabi",
  "sharjah",
  "pos systems uae",
  "retail solutions dubai",
] as const;

export const BRAND_KEYWORDS = [
  "amc systems",
  "al marwah computers",
  "amc systems uae",
  "amc pos systems",
] as const;

