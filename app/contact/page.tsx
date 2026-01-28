"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitContact, resetContactState } from "@/store/slices/publicContactSlice";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Dubai, United Arab Emirates",
    color: "primary",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+971 12 345 6789",
    href: "tel:+97112345 6789",
    color: "emerald",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@amcuae.com",
    href: "mailto:info@amcuae.com",
    color: "violet",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon-Sat: 9AM - 6PM",
    color: "amber",
  },
];

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { loading: submitting, success, error: submitError } = useAppSelector((state) => state.publicContact);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => dispatch(resetContactState()), 3000);
    }
  }, [success, dispatch]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, "").length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await dispatch(submitContact({
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    }));
    setIsSubmitting(false);
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4">
              Thank You!
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-8">
              We've received your message and will get back to you shortly.
            </p>
            <Button
              size="lg"
              className="bg-navy-900 hover:bg-navy-800 text-white px-8 py-6 rounded-xl font-bold"
              asChild
            >
              <Link href="/">
                Return to Home
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 bg-gradient-to-b from-slate-900 to-navy-900 overflow-hidden">
        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mt-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white mb-6">
              <MessageCircle className="w-4 h-4" />
              We're Here to Help
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Get in Touch
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-0 max-w-2xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Info Cards */}
      <Section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 mb-4 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 mb-2">
                      {info.label}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-base font-bold text-navy-900 hover:text-primary-600 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-base font-bold text-navy-900">
                        {info.value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="max-w-4xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4">
                Send us a Message
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                Fill out the form below and our team will get back to you within 24 hours
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-bold text-navy-900 mb-2 block">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`px-4 py-6 text-base rounded-xl border-2 ${
                      errors.name ? "border-red-500" : "border-slate-200"
                    } focus:border-primary-500 transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-bold text-navy-900 mb-2 block">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`px-4 py-6 text-base rounded-xl border-2 ${
                      errors.email ? "border-red-500" : "border-slate-200"
                    } focus:border-primary-500 transition-colors`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone & Subject Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-bold text-navy-900 mb-2 block">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+971 12 345 6789"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`px-4 py-6 text-base rounded-xl border-2 ${
                      errors.phone ? "border-red-500" : "border-slate-200"
                    } focus:border-primary-500 transition-colors`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-bold text-navy-900 mb-2 block">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={`px-4 py-6 text-base rounded-xl border-2 ${
                      errors.subject ? "border-red-500" : "border-slate-200"
                    } focus:border-primary-500 transition-colors`}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-2">{errors.subject}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-bold text-navy-900 mb-2 block">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your requirements..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={6}
                  className={`px-4 py-4 text-base rounded-xl border-2 ${
                    errors.message ? "border-red-500" : "border-slate-200"
                  } focus:border-primary-500 transition-colors resize-none`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white px-8 py-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </Container>
      </Section>

      {/* Map Section (Optional) */}
      <Section className="py-0">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-slate-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.68290528265!2d54.89782924999999!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="AMC Systems Location"
          />
        </div>
      </Section>
    </div>
  );
}
