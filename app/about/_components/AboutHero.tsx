"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Play, X, Car, Users, MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/app/_components/ui";

export function AboutHero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-8 lg:pb-20 lg:pt-12">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Content Column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
              <span className="h-0.5 w-6 rounded bg-brand" />
              <span>ABOUT RYPP</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl xl:text-[54px] lg:leading-[1.12]">
              More Roads.<br />
              More People.<br />
              <span className="text-brand">A More Connected India.</span>
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base lg:text-[15px]">
              RYPP is a technology-driven mobility platform making bike and car rentals simple, transparent, and reliable. We believe everyone should have the freedom to explore, travel, work, and live on their own terms — anytime, anywhere.
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_22px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark hover:shadow-[0_10px_26px_-8px_rgba(228,32,44,0.85)]"
              >
                Our Story <ArrowRight className="size-4" />
              </a>

              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-3 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-brand/40 hover:bg-line/30"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Play className="size-3.5 fill-brand ml-0.5" />
                </span>
                <span>Watch Video</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-normal text-muted">
                  2 min
                </span>
              </button>
            </div>

            {/* Stats highlight row */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-3.5">
              <div className="flex items-center gap-3 rounded-xl border border-line/80 bg-slate-50/70 p-3.5 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Car className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink">500+</div>
                  <div className="text-[11px] font-medium leading-tight text-muted">
                    Vehicles on Platform
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line/80 bg-slate-50/70 p-3.5 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Users className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink">10K+</div>
                  <div className="text-[11px] font-medium leading-tight text-muted">
                    Happy Customers
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line/80 bg-slate-50/70 p-3.5 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink">50+</div>
                  <div className="text-[11px] font-medium leading-tight text-muted">
                    Cities (Upcoming)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line/80 bg-slate-50/70 p-3.5 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink">100%</div>
                  <div className="text-[11px] font-medium leading-tight text-muted">
                    Verified Partners
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card with Calligraphic Overlays */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl lg:max-w-none lg:aspect-[1.15/1]">
              <Image
                src="/images/photos/red-mountains.jpg"
                alt="RYPP vehicles traveling across majestic Indian mountains"
                fill
                priority
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Calligraphic Handwriting Badge Top Center/Right */}
              <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                <div className="relative inline-block rotate-[-4deg]">
                  <span className="font-script text-3xl font-bold tracking-wide text-white drop-shadow-md sm:text-4xl md:text-5xl">
                    Ride <span className="text-brand drop-shadow">Your Way.</span>
                  </span>
                  <div className="mt-0.5 h-1 w-full rounded-full bg-gradient-to-r from-brand to-red-400" />
                </div>
              </div>

              {/* Bottom Right Calligraphic Script Badge */}
              <div className="absolute bottom-6 right-6 text-right sm:bottom-8 sm:right-8">
                <span className="font-script text-xl font-medium text-white/90 drop-shadow sm:text-2xl lg:text-3xl">
                  Good Rides, Brighter Stories
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="text-base font-semibold text-white">
                About RYPP — Ride Your Way
              </h3>
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="RYPP Brand Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
