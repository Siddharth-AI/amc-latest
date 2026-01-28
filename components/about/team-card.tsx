"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/lib/types";
import { Linkedin, Mail, Twitter, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.85,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          end: "top 65%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <Card className="relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-slate-100 bg-white p-6 md:p-8 transition-all duration-500 hover:border-primary-200 hover:shadow-2xl">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-navy-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Floating Orbs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-200/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-navy-200/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150" />

        <div className="relative z-10">
          {/* Avatar Container */}
          <div className="relative mb-6">
            <div
              ref={imageRef}
              className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto rounded-2xl overflow-hidden ring-4 ring-slate-100 group-hover:ring-primary-300 transition-all duration-500 group-hover:scale-105"
            >
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 via-primary-200 to-navy-100 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-700">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Verification Badge */}
              <div className="absolute bottom-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 border-2 border-white shadow-lg flex items-center justify-center">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Animated Ring */}
            <div className="absolute inset-0 m-auto w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl border-2 border-primary-300 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          </div>

          {/* Name & Role */}
          <div className="text-center mb-4">
            <h3 className="text-xl sm:text-2xl font-black text-navy-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
              {member.name}
            </h3>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <p className="text-xs sm:text-sm font-bold text-primary-700">
                {member.role}
              </p>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <p className="text-xs sm:text-sm text-slate-600 text-center leading-relaxed mb-6 px-2">
              {member.bio}
            </p>
          )}

          {/* Divider */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mb-6" />

          {/* Social Links */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group/social w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group/social w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="group/social w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />
        </div>
      </Card>
    </div>
  );
}
