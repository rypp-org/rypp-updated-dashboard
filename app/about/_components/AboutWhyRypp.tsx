import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  IndianRupee,
  ShieldCheck,
  MapPin,
  Clock,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/app/_components/ui";

const features = [
  {
    icon: Zap,
    title: "Easy Booking",
    desc: "Book your bike or car in minutes. Simple, fast, and hassle-free.",
    image: "/images/photos/v-classic.jpg",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "No hidden charges. What you see is what you pay.",
    image: "/images/photos/cat-bikes.jpg",
  },
  {
    icon: ShieldCheck,
    title: "Verified Partners",
    desc: "Trusted local vendors and well-maintained vehicles.",
    image: "/images/photos/cat-cars.jpg",
  },
  {
    icon: MapPin,
    title: "Wide Availability",
    desc: "Bikes and cars in multiple locations across India.",
    image: "/images/photos/dest-manali.jpg",
  },
  {
    icon: Clock,
    title: "Flexible Rentals",
    desc: "Hourly, daily or long-term rentals — for every need.",
    image: "/images/photos/v-activa.jpg",
  },
  {
    icon: Leaf,
    title: "Sustainable Travel",
    desc: "Supporting shared mobility for a greener future.",
    image: "/images/photos/dest-bengaluru.jpg",
  },
];

export function AboutWhyRypp() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
              <span className="h-0.5 w-6 rounded bg-brand" />
              <span>WHY RYPP?</span>
            </div>

            <h2 className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
              More than just rentals —<br className="hidden sm:inline" /> a better way to move.
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-md text-xs text-muted sm:text-sm md:text-right">
              We&apos;re solving real problems in the mobility ecosystem by bringing together technology, trusted partners, and a customer-first approach.
            </p>

            <Link
              href="/#vehicles"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_18px_-6px_rgba(228,32,44,0.6)] transition hover:bg-brand-dark sm:text-sm"
            >
              Book Your Ride <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
              >
                {/* Image Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={feat.image}
                    alt={feat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <IconComponent className="size-5" />
                  </div>

                  <h3 className="mt-4 text-[15px] font-bold text-ink sm:text-base">
                    {feat.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
