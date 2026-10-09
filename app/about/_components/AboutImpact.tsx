"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Users,
  Car,
  MapPin,
  ShieldCheck,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/app/_components/ui";

const impactStats = [
  { icon: Users, value: "10K+", label: "Happy Customers (Goal)" },
  { icon: Car, value: "500+", label: "Vehicles on Platform" },
  { icon: MapPin, value: "50+", label: "Cities (Upcoming)" },
  { icon: ShieldCheck, value: "100%", label: "Verified Partners" },
];

const testimonialsList = [
  {
    name: "Amit Sharma",
    role: "Traveler, Delhi",
    avatar: "/images/avatar-amit.svg",
    rating: 5,
    quote:
      "RYPP made my Ladakh trip so easy! The bike was in great condition and the whole booking process was super smooth.",
  },
  {
    name: "Priya Mehta",
    role: "Business Professional, Bengaluru",
    avatar: "/images/avatar-priya.svg",
    rating: 5,
    quote:
      "Transparent pricing and excellent service. I rented a car for my business trip and had a hassle-free experience.",
  },
  {
    name: "Rahul Verma",
    role: "Student, Pune",
    avatar: "/images/avatar-rohan.svg",
    rating: 5,
    quote:
      "Affordable, reliable, and convenient. RYPP gives me the freedom to explore new places on my own terms.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Product Manager, Mumbai",
    avatar: "/images/avatar-sneha.svg",
    rating: 5,
    quote:
      "Verified partners, transparent pricing and a smooth handover. Exactly how rentals should work.",
  },
];

export function AboutImpact() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((curr) =>
      curr === 0 ? testimonialsList.length - 1 : curr - 1
    );
  };

  const next = () => {
    setActiveIndex((curr) =>
      curr === testimonialsList.length - 1 ? 0 : curr + 1
    );
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
            <span className="h-0.5 w-6 rounded bg-brand" />
            <span>OUR IMPACT</span>
          </div>

          <h2 className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Creating opportunities.<br className="hidden sm:inline" /> Moving lives forward.
          </h2>
        </div>

        {/* Impact Stats Row */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-line/80 bg-slate-50/50 p-5 sm:gap-y-4 sm:p-8 lg:grid-cols-4">
          {impactStats.map((stat) => {
            const IconComp = stat.icon;
            return (
              // phones: icon above the text so labels get the full cell width; side by side from sm
              <div key={stat.label} className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand sm:size-11">
                  <IconComp className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-extrabold leading-tight text-ink sm:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs font-medium leading-snug text-muted">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials Slider Area */}
        <div className="relative mt-12">
          {/* Controls header / arrows */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              RIDER TESTIMONIALS
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex size-9 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex size-9 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              testimonialsList[activeIndex],
              testimonialsList[(activeIndex + 1) % testimonialsList.length],
              testimonialsList[(activeIndex + 2) % testimonialsList.length],
            ].map((t, idx) => (
              <div
                key={t.name + idx}
                className={`${
                  // one card on phones (arrows/dots page through), three from md up
                  idx > 0 ? "hidden md:flex" : "flex"
                } flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-brand/30 hover:shadow-md sm:p-6`}
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="mt-4 text-xs leading-relaxed text-ink/90 sm:text-sm">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="mt-6 flex items-center gap-3 border-t border-line/60 pt-4">
                  <div className="relative size-10 overflow-hidden rounded-full border border-brand/20 bg-slate-100">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink sm:text-sm">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonialsList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "w-6 bg-brand" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
