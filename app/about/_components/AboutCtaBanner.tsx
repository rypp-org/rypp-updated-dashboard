import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/app/_components/ui";

export function AboutCtaBanner() {
  return (
    <section className="relative overflow-hidden bg-ink py-12 text-white sm:py-20 lg:py-28">
      {/* Background Image */}
      <Image
        src="/images/photos/cta.jpg"
        alt="RYPP Motorcycle rider on highway at sunset"
        fill
        priority
        className="object-cover object-center opacity-40"
        sizes="100vw"
      />

      {/* Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-transparent" />

      <Container className="relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Left Column Text Content */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand sm:text-xs">
              <span className="h-0.5 w-5 rounded bg-brand sm:w-6" />
              <span>READY TO RIDE?</span>
            </div>

            <h2 className="mt-2.5 text-[22px] font-extrabold leading-tight tracking-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
              Be a part of our journey.
            </h2>

            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/80 sm:mt-4 sm:text-base">
              Whether you want to rent, partner, or join our team — let&apos;s build a more mobile India together.
            </p>

            {/* CTAs: equal-width pair on phones (wrapping to full width on the narrowest), natural width from sm */}
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <Link
                href="/#vehicles"
                className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-[13px] sm:flex-none sm:px-6 sm:py-3.5 sm:text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark hover:shadow-[0_10px_24px_-8px_rgba(228,32,44,0.85)]"
              >
                Ride Your Way <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/#contact"
                className="inline-flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-[13px] sm:flex-none sm:px-6 sm:py-3.5 sm:text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20"
              >
                Join Our Team
              </Link>
            </div>
          </div>

          {/* Right Calligraphic Brush Graphic */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="rotate-[-6deg] text-right">
              <span className="font-script text-3xl font-bold tracking-wide text-white/95 drop-shadow-lg xl:text-4xl">
                Different Journeys,<br />
                <span className="text-brand">A Brighter Tomorrow.</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
