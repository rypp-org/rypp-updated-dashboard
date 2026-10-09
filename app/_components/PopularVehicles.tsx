"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import { vehicles, type VehicleCategory } from "../_lib/data";
import { Container, ViewAll } from "./ui";

type Tab = "bike" | "scooter" | "car";

const tabs: { id: Tab; label: string }[] = [
  { id: "bike", label: "Bikes" },
  { id: "scooter", label: "Scooters" },
  { id: "car", label: "Cars" },
];

const categoryBadge: Record<VehicleCategory, string> = {
  bike: "Bike",
  scooter: "Scooter",
  car: "Car",
};

const inr = new Intl.NumberFormat("en-IN");

export function PopularVehicles() {
  // null = the mixed "featured" lineup shown on first load
  const [tab, setTab] = useState<VehicleCategory | null>(null);
  const shown = tab ? vehicles.filter((v) => v.category === tab) : vehicles.filter((v) => v.featured);
  const activeTab = tab ?? "bike";

  return (
    <section id="vehicles" className="pb-14 pt-2 lg:pb-16" aria-labelledby="popular-vehicles">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-x-7 gap-y-3">
            <h2 id="popular-vehicles" className="text-[22px] font-bold leading-none tracking-tight text-ink sm:text-[28px] lg:text-[34px]">
              Popular Vehicles
            </h2>
            <div role="group" aria-label="Vehicle type" className="flex items-center gap-1 pb-0.5 text-[13px] font-semibold">
              {tabs.map((t, i) => (
                <span key={t.id} className="flex items-center gap-1">
                  {i > 0 && <span className="px-1 text-xs text-muted/60" aria-hidden>+</span>}
                  <button
                    type="button"
                    aria-pressed={activeTab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative px-1 py-1 transition-colors ${
                      activeTab === t.id ? "text-brand" : "text-ink/75 hover:text-brand"
                    }`}
                  >
                    {t.label}
                    {activeTab === t.id && <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded bg-brand" />}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <ViewAll href="/vehicles" />
        </div>

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {shown.map((v) => (
            <li
              key={v.id}
              className="group flex min-w-0 flex-col rounded-2xl border border-line bg-white p-3 sm:p-3.5 shadow-[0_10px_30px_-22px_rgba(11,17,25,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-20px_rgba(11,17,25,0.5)]"
            >
              <Link href={`/vehicles/${v.id}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-line/40 block">
                <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink shadow-sm backdrop-blur">
                  {categoryBadge[v.category]}
                </span>
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  sizes="(min-width: 1280px) 200px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-110"
                />
              </Link>
              <h3 className="mt-3 line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-tight text-ink hover:text-brand transition">
                <Link href={`/vehicles/${v.id}`}>{v.name}</Link>
              </h3>
              {/* single line at every width so neighbouring cards stay aligned; "reviews" drops on phones */}
              <p className="mt-1.5 flex max-w-full items-center gap-1 self-start whitespace-nowrap rounded-full bg-line/50 px-2 py-0.5 text-[11px] text-muted">
                <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                <span className="font-semibold text-ink/80">{v.rating.toFixed(1)}</span>
                <span className="truncate">
                  ({v.reviews}
                  <span className="sr-only sm:not-sr-only"> reviews</span>)
                </span>
              </p>
              {/* mt-auto pins price + button to the card bottom so rows line up */}
              <p className="mt-auto pt-2 text-[16px] font-bold text-ink sm:text-[17px]">
                ₹ {inr.format(v.pricePerDay)}
                <span className="text-xs font-semibold text-muted"> / day</span>
              </p>
              <Link
                href={`/vehicles/${v.id}`}
                // phones: soft tint so a 2-col grid of CTAs doesn't overpower the photos; solid red from sm up
                className="mt-2.5 inline-flex items-center justify-center gap-1.5 rounded-md bg-blush py-2 text-center text-xs font-semibold text-brand sm:mt-3 sm:transition sm:bg-brand sm:py-2.5 sm:text-white sm:hover:bg-brand-dark"
              >
                Book Now
                <ArrowRight className="size-3.5" aria-hidden />
                <span className="sr-only"> {v.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
