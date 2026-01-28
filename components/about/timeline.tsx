"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TimelineEvent } from "@/lib/types";
import { CheckCircle2, Sparkles, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll(".timeline-item");

    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: index % 2 === 0 ? -60 : 60,
          scale: 0.85,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate the dot
      const dot = item.querySelector(".timeline-dot");
      if (dot) {
        gsap.fromTo(
          dot,
          { scale: 0, rotate: -180 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
            },
          }
        );
      }
    });
  }, [events]);

  return (
    <div ref={timelineRef} className="relative max-w-6xl mx-auto px-4 sm:px-6">
      {/* Central Line - Hidden on mobile, visible on desktop */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200 md:block" />

      {/* Timeline Items */}
      <div className="space-y-8 md:space-y-16">
        {events.map((event, index) => (
          <div
            key={index}
            className={`timeline-item relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Content Card */}
            <div className="flex-1 md:w-[calc(50%-2rem)] ml-16 md:ml-0">
              <div
                className={`group relative p-6 sm:p-8 rounded-2xl md:rounded-3xl bg-white border-2 border-slate-100 hover:border-primary-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                  index % 2 === 0 ? "md:text-right" : "md:text-left"
                }`}
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary-500/5 via-navy-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Year Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl md:rounded-full bg-gradient-to-r from-primary-500 to-navy-600 text-white text-sm sm:text-base font-bold mb-4 shadow-lg group-hover:shadow-xl transition-shadow ${
                      index % 2 === 0
                        ? "md:float-right md:ml-4"
                        : "md:float-left md:mr-4"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    {event.year}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-navy-900 mb-3 clear-both group-hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Achievement Badge */}
                  <div
                    className={`inline-flex items-center gap-2 text-primary-600 font-semibold text-xs sm:text-sm ${
                      index % 2 === 0 ? "md:justify-end md:ml-auto md:flex" : ""
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Milestone Achieved</span>
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div
                  className={`absolute w-20 h-20 sm:w-28 sm:h-28 bg-primary-100/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    index % 2 === 0
                      ? "top-4 right-4"
                      : "top-4 left-4"
                  }`}
                />
              </div>
            </div>

            {/* Center Dot */}
            <div className="timeline-dot absolute left-8 md:left-1/2 md:-translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-navy-600 border-4 border-white shadow-xl z-10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>

            {/* Spacer for alternating layout on desktop */}
            <div className="hidden md:block flex-1 md:w-[calc(50%-2rem)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
