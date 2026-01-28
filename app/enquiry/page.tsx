"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Send,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom-select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  submitEnquiry,
  resetEnquiryState,
} from "@/store/slices/publicEnquirySlice";
import { fetchPublicCategories } from "@/store/slices/publicCategorySlice";
import { fetchPublicProducts } from "@/store/slices/publicProductSlice";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  categoryId: string;
  productId: string;
  quantity: string;
  requirements: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  requirements?: string;
}

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "Dubai, UAE",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+971 12 345 6789",
    href: "tel:+971123456789",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@amcuae.com",
    href: "mailto:info@amcuae.com",
  },
];

export default function EnquiryPage() {
  const dispatch = useAppDispatch();
  const {
    loading: submitting,
    success,
    error: submitError,
  } = useAppSelector((state) => state.publicEnquiry);
  const { categories } = useAppSelector((state) => state.publicCategory);
  const { products } = useAppSelector((state) => state.publicProduct);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    categoryId: "",
    productId: "",
    quantity: "",
    requirements: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicCategories({ page: 1, limit: 100 }));
    dispatch(fetchPublicProducts({ page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(resetEnquiryState()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (success) {
      setIsSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        categoryId: "",
        productId: "",
        quantity: "",
        requirements: "",
      });
    }
  }, [success]);

  const filteredProducts = useMemo(() => {
    if (!formData.categoryId) return [];
    return products.filter((p) => p.category_id === formData.categoryId);
  }, [formData.categoryId, products]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return (
      /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, "").length >= 8
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
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
    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required";
    } else if (formData.requirements.trim().length < 20) {
      newErrors.requirements =
        "Please provide more details (min 20 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await dispatch(
      submitEnquiry({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName || undefined,
        message: formData.requirements,
        category_id: formData.categoryId || undefined,
        product_id: formData.productId || undefined,
      })
    );
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
              We&apos;ve received your enquiry and will contact you within 24 hours.
            </p>
            <Button
              size="lg"
              className="bg-navy-900 hover:bg-navy-800 text-white px-8 py-6 rounded-xl font-bold"
              asChild>
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
            <div className="inline-flex items-center mt-10 gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-white mb-6">
              <FileText className="w-4 h-4" />
              Request a Quote
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Get Your Free Quote
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-0 max-w-2xl mx-auto leading-relaxed">
              Tell us about your requirements and we&apos;ll provide a customized
              solution
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Info Cards */}
      <Section className="py-12 sm:py-16 md:py-20 bg-slate-50">
        <Container>
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-500 mb-2">
                      {info.label}
                    </h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-base font-bold text-navy-900 hover:text-primary-600 transition-colors">
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

      {/* Form Section */}
      <Section className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="max-w-4xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 mb-4">
                Enquiry Form
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                Fill out the form below and our team will get back to you within
                24 hours
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4 pb-2 border-b-2 border-slate-200">
                  Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-bold text-navy-900 mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={`px-4 py-6 text-base rounded-xl border-2 ${
                        errors.fullName ? "border-red-500" : "border-slate-200"
                      } focus:border-primary-500 transition-colors`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-bold text-navy-900 mb-2 block">
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
                      <p className="text-red-500 text-sm mt-2">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-bold text-navy-900 mb-2 block">
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
                      <p className="text-red-500 text-sm mt-2">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-bold text-navy-900 mb-2 block">
                      Company Name (Optional)
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Your Company"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className="px-4 py-6 text-base rounded-xl border-2 border-slate-200 focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Product Interest */}
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4 pb-2 border-b-2 border-slate-200">
                  Product Interest
                </h3>
                <div className="grid sm:grid-cols-3 gap-6 mt-6">
                  <div>
                    <Label
                      htmlFor="category"
                      className="text-sm font-bold text-navy-900 mb-2 block">
                      Category (Optional)
                    </Label>
                    <CustomSelect
                      id="category"
                      value={formData.categoryId}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          categoryId: value,
                          productId: "",
                        })
                      }
                      placeholder="Select category"
                      options={[
                        { value: "", label: "Select category" },
                        ...categories.map((cat) => ({
                          value: cat.id,
                          label: cat.name,
                        })),
                      ]}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="product"
                      className="text-sm font-bold text-navy-900 mb-2 block">
                      Product (Optional)
                    </Label>
                    <CustomSelect
                      id="product"
                      value={formData.productId}
                      onChange={(value) =>
                        setFormData({ ...formData, productId: value })
                      }
                      disabled={!formData.categoryId}
                      placeholder="Select product"
                      options={[
                        { value: "", label: "Select product" },
                        ...filteredProducts.map((product) => ({
                          value: product.id,
                          label: product.name,
                        })),
                      ]}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="quantity"
                      className="text-sm font-bold text-navy-900 mb-2 block">
                      Quantity (Optional)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="1"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border-2 border-slate-200 focus:border-primary-500 transition-colors min-h-[50px]"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-4 pb-2 border-b-2 border-slate-200">
                  Requirements
                </h3>
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="requirements"
                      className="text-sm font-bold text-navy-900 mb-2 block">
                      Your Requirements *
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="Please describe your requirements in detail..."
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                      rows={6}
                      className={`px-4 py-4 text-base rounded-xl border-2 ${
                        errors.requirements
                          ? "border-red-500"
                          : "border-slate-200"
                      } focus:border-primary-500 transition-colors resize-none`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      {errors.requirements ? (
                        <p className="text-red-500 text-sm">
                          {errors.requirements}
                        </p>
                      ) : (
                        <p className="text-slate-500 text-sm">
                          {formData.requirements.length}/20 characters minimum
                        </p>
                      )}
                    </div>
                  </div>

                  <div></div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white px-8 py-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    Submit Enquiry
                  </>
                )}
              </Button>
            </form>
          </div>
        </Container>
      </Section>
    </div>
  );
}
