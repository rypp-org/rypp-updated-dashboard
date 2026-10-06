"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  Headphones,
  ArrowRight,
  Gauge,
  Fuel,
  Settings,
  Users,
  Weight,
  Sparkles,
  Shield,
  Wrench,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  ALL_VEHICLES,
  FAQ_LIST,
  VehicleDetail,
} from "../../../_lib/vehiclesData";
import { Container } from "../../../_components/ui";
import { BookingModal } from "../../_components/BookingModal";

interface VehicleDetailPageContentProps {
  vehicle: VehicleDetail;
}

export function VehicleDetailPageContent({ vehicle }: VehicleDetailPageContentProps) {
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "features" | "policies" | "reviews">("overview");

  // Booking Form State
  const [pickupDate, setPickupDate] = useState("2026-09-15");
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropDate, setDropDate] = useState("2026-09-16");
  const [dropTime, setDropTime] = useState("10:00 AM");
  const [showBookingModal, setShowBookingModal] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Similar vehicles (filter same category or fallback to curated list)
  const similarVehicles = ALL_VEHICLES.filter(
    (v) => v.category === vehicle.category && v.id !== vehicle.id
  ).slice(0, 6);

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? vehicle.gallery.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === vehicle.gallery.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-white text-ink min-h-screen pb-16">
      {/* --- BREADCRUMBS --- */}
      <div className="border-b border-line bg-gray-50/60 py-3 text-xs">
        <Container>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-muted font-medium">
            <Link href="/" className="hover:text-brand transition">Home</Link>
            <span>&gt;</span>
            <Link href="/vehicles" className="hover:text-brand transition">Vehicles</Link>
            <span>&gt;</span>
            <span className="capitalize">{vehicle.category}s</span>
            <span>&gt;</span>
            <span className="text-ink font-semibold">{vehicle.name}</span>
          </nav>
        </Container>
      </div>

      <Container className="pt-6 lg:pt-8">
        {/* --- TOP SECTION: GALLERY + QUICK SPECS (LEFT) & BOOKING CARD (RIGHT) --- */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          
          {/* LEFT COLUMN: Gallery & Quick Specs */}
          <div className="space-y-6">
            
            {/* Main Image Carousel */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 border border-line shadow-xs group">
              <Image
                src={vehicle.gallery[activeImageIndex] || vehicle.image}
                alt={`${vehicle.name} view ${activeImageIndex + 1}`}
                fill
                priority
                className="object-cover transition-transform duration-300"
              />

              {/* Badge */}
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                <Flame className="size-3.5 fill-white text-white" />
                <span>{vehicle.badge || "Popular Choice"}</span>
              </div>

              {/* Arrow Nav Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-white/90 shadow-md transition hover:bg-white text-ink"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-white/90 shadow-md transition hover:bg-white text-ink"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>

              {/* Counter Badge */}
              <div className="absolute right-4 bottom-4 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                {activeImageIndex + 1} / {vehicle.gallery.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {vehicle.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-video overflow-hidden rounded-lg border-2 transition ${
                    activeImageIndex === idx
                      ? "border-brand ring-2 ring-brand/20 scale-105"
                      : "border-line hover:border-gray-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={imgUrl} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Title & Ratings */}
            <div className="space-y-2 pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">{vehicle.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="size-4 fill-amber-500 text-amber-500" />
                  <span>{vehicle.rating}</span>
                  <span className="text-muted font-normal">({vehicle.reviews} reviews)</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700 font-semibold border border-emerald-200">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Verified Vehicle</span>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed pt-1">
                {vehicle.description}
              </p>
            </div>

            {/* 6 Quick Specs Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-gray-50/60 p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-white border border-line text-brand">
                  <Wrench className="size-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink">{vehicle.engineCapacity}</span>
                  <span className="block text-[11px] text-muted">Engine Capacity</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-gray-50/60 p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-white border border-line text-brand">
                  <Fuel className="size-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink">{vehicle.fuelType}</span>
                  <span className="block text-[11px] text-muted">Fuel Type</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-gray-50/60 p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-white border border-line text-brand">
                  <Settings className="size-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink">{vehicle.transmission}</span>
                  <span className="block text-[11px] text-muted">Transmission</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-gray-50/60 p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-white border border-line text-brand">
                  <Gauge className="size-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink">{vehicle.mileage}</span>
                  <span className="block text-[11px] text-muted">Mileage (Approx)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-gray-50/60 p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-white border border-line text-brand">
                  <Users className="size-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink">{vehicle.seatingCapacity}</span>
                  <span className="block text-[11px] text-muted">Seating Capacity</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line bg-gray-50/60 p-3">
                <div className="grid size-10 place-items-center rounded-lg bg-white border border-line text-brand">
                  <Weight className="size-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink">{vehicle.kerbWeight}</span>
                  <span className="block text-[11px] text-muted">Kerb Weight</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING CARD */}
          <div className="sticky top-28 bg-white rounded-2xl border border-line p-6 shadow-xl space-y-5">
            {/* Price Header & Wishlist */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-extrabold text-ink">
                  ₹ {vehicle.pricePerDay.toLocaleString()}
                </span>
                <span className="text-xs text-muted font-medium"> / day</span>
              </div>

              <button
                onClick={() => setIsWishlisted((v) => !v)}
                className="grid size-10 place-items-center rounded-full border border-line bg-white shadow-2xs hover:bg-gray-50 transition"
                aria-label="Wishlist vehicle"
              >
                <Heart
                  className={`size-5 transition ${
                    isWishlisted ? "fill-brand text-brand" : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Free cancellation alert */}
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 font-medium border border-emerald-200">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>Free Cancellation up to 24 hours</span>
            </div>

            {/* Dates & Times Inputs */}
            <div className="space-y-3.5 text-xs font-medium">
              <div>
                <label className="block text-ink font-semibold mb-1">Pickup Date & Time</label>
                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 size-4 text-brand" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-2 text-ink focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 size-4 text-muted" />
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white py-2 pl-8 pr-2 text-ink focus:border-brand focus:outline-none"
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>02:00 PM</option>
                      <option>06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Drop Date & Time</label>
                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 size-4 text-brand" />
                    <input
                      type="date"
                      value={dropDate}
                      onChange={(e) => setDropDate(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-2 text-ink focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 size-4 text-muted" />
                    <select
                      value={dropTime}
                      onChange={(e) => setDropTime(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white py-2 pl-8 pr-2 text-ink focus:border-brand focus:outline-none"
                    >
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>02:00 PM</option>
                      <option>06:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark"
            >
              Book Now <ArrowRight className="size-4" />
            </button>

            {/* 3 Trust Features */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line text-center text-[11px] font-semibold text-ink/80">
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="size-5 text-brand" />
                <span>Secure Booking</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <CreditCard className="size-5 text-brand" />
                <span>Multiple Payment Options</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Headphones className="size-5 text-brand" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- TABS NAVIGATION BAR --- */}
        <div className="mt-12 border-b border-line">
          <nav aria-label="Vehicle details tabs" className="flex gap-8 overflow-x-auto text-sm font-semibold">
            {(["overview", "specs", "features", "policies", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 capitalize transition relative whitespace-nowrap ${
                  activeTab === tab ? "text-brand font-bold" : "text-muted hover:text-ink"
                }`}
              >
                {tab === "specs" ? "Specifications" : tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* --- TAB CONTENTS --- */}
        <div className="py-8 space-y-12">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-ink">About This {vehicle.category === "bike" ? "Bike" : vehicle.category === "car" ? "Car" : "Scooter"}</h3>
                <p className="mt-3 text-sm text-muted leading-relaxed max-w-3xl">
                  {vehicle.aboutText}
                </p>
              </div>

              {/* 4 Feature Cards + Promo Side Image */}
              <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-stretch">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicle.highlights.map((h, i) => (
                    <div key={i} className="rounded-2xl border border-line bg-red-50/30 p-5 space-y-1.5">
                      <div className="grid size-9 place-items-center rounded-full bg-brand/10 text-brand font-bold text-sm">
                        ✦
                      </div>
                      <h4 className="font-bold text-ink text-sm">{h.title}</h4>
                      <p className="text-xs text-muted">{h.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Promo side image card */}
                <div className="relative overflow-hidden rounded-2xl bg-ink min-h-[200px] flex items-end p-6 border border-line">
                  <Image
                    src="/images/photos/red-mountains.jpg"
                    alt="Scenic ride road"
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="relative z-10">
                    <p className="font-script text-3xl text-white select-none -rotate-3">
                      More Roads <br />
                      <span className="text-brand">More Stories</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPECIFICATIONS */}
          {(activeTab === "overview" || activeTab === "specs") && (
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-bold text-ink">Specifications</h3>

              <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
                {/* Tech Specs Table */}
                <div className="rounded-2xl border border-line overflow-hidden bg-white text-xs">
                  <div className="grid grid-cols-2 divide-x divide-line">
                    <div className="divide-y divide-line">
                      <div className="flex justify-between p-3.5 bg-gray-50/50">
                        <span className="text-muted">Engine Capacity</span>
                        <span className="font-bold text-ink">{vehicle.engineCapacity}</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span className="text-muted">Fuel Type</span>
                        <span className="font-bold text-ink">{vehicle.fuelType}</span>
                      </div>
                      <div className="flex justify-between p-3.5 bg-gray-50/50">
                        <span className="text-muted">Transmission</span>
                        <span className="font-bold text-ink">{vehicle.transmission}</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span className="text-muted">Mileage (Approx)</span>
                        <span className="font-bold text-ink">{vehicle.mileage}</span>
                      </div>
                      <div className="flex justify-between p-3.5 bg-gray-50/50">
                        <span className="text-muted">Seating Capacity</span>
                        <span className="font-bold text-ink">{vehicle.seatingCapacity}</span>
                      </div>
                    </div>

                    <div className="divide-y divide-line">
                      <div className="flex justify-between p-3.5 bg-gray-50/50">
                        <span className="text-muted">Max Power</span>
                        <span className="font-bold text-ink">{vehicle.maxPower}</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span className="text-muted">Max Torque</span>
                        <span className="font-bold text-ink">{vehicle.maxTorque}</span>
                      </div>
                      <div className="flex justify-between p-3.5 bg-gray-50/50">
                        <span className="text-muted">Kerb Weight</span>
                        <span className="font-bold text-ink">{vehicle.kerbWeight}</span>
                      </div>
                      <div className="flex justify-between p-3.5">
                        <span className="text-muted">Fuel Tank Capacity</span>
                        <span className="font-bold text-ink">{vehicle.fuelTankCapacity}</span>
                      </div>
                      <div className="flex justify-between p-3.5 bg-gray-50/50">
                        <span className="text-muted">Braking System</span>
                        <span className="font-bold text-ink">{vehicle.brakingSystem}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Quality Assurance Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-gray-50/60 p-3.5 space-y-1">
                    <Wrench className="size-5 text-brand" />
                    <h4 className="font-bold text-ink text-xs">Well Maintained</h4>
                    <p className="text-[11px] text-muted">Regularly serviced</p>
                  </div>
                  <div className="rounded-xl border border-line bg-gray-50/60 p-3.5 space-y-1">
                    <Sparkles className="size-5 text-brand" />
                    <h4 className="font-bold text-ink text-xs">Clean & Sanitized</h4>
                    <p className="text-[11px] text-muted">Hygienic and safe</p>
                  </div>
                  <div className="rounded-xl border border-line bg-gray-50/60 p-3.5 space-y-1">
                    <Shield className="size-5 text-brand" />
                    <h4 className="font-bold text-ink text-xs">Insurance Covered</h4>
                    <p className="text-[11px] text-muted">Ride with peace of mind</p>
                  </div>
                  <div className="rounded-xl border border-line bg-gray-50/60 p-3.5 space-y-1">
                    <Headphones className="size-5 text-brand" />
                    <h4 className="font-bold text-ink text-xs">Roadside Assistance</h4>
                    <p className="text-[11px] text-muted">We&apos;ve got you covered</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- SIMILAR VEHICLES --- */}
        <section className="pt-8 border-t border-line space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink">Similar Vehicles</h3>
            <Link href="/vehicles" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">
              View All <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarVehicles.map((item) => (
              <div key={item.id} className="rounded-xl border border-line bg-white overflow-hidden shadow-2xs hover:shadow-md transition">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="p-3 space-y-2">
                  <h4 className="font-bold text-ink text-xs line-clamp-1">{item.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating}</span>
                    <span className="text-muted">({item.reviews})</span>
                  </div>
                  <div className="font-extrabold text-ink text-xs">
                    ₹ {item.pricePerDay.toLocaleString()} <span className="font-normal text-muted">/ day</span>
                  </div>
                  <Link
                    href={`/vehicles/${item.id}`}
                    className="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-brand py-2 text-[11px] font-semibold text-white transition hover:bg-brand-dark"
                  >
                    Book Now <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ ACCORDION SECTION --- */}
        <section className="pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink">Frequently Asked Questions</h3>
            <Link href="/#contact" className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">
              View All <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-line bg-gray-50/50 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-4 text-xs font-bold text-ink text-left"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="size-4 text-muted shrink-0" /> : <ChevronDown className="size-4 text-muted shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-line/50 pt-2 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* --- BOTTOM CTA BANNER --- */}
        <div className="mt-14 relative overflow-hidden rounded-2xl bg-ink p-8 shadow-lg border border-line">
          <Image
            src="/images/photos/red-mountains.jpg"
            alt="Scenic highway banner"
            fill
            className="object-cover opacity-30"
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Ready for Your Next Adventure?</h3>
              <p className="mt-1 text-xs text-white/70">Book now and hit the road with RYPP.</p>
            </div>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-brand-dark transition shrink-0"
            >
              Explore More Vehicles <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>

      {/* --- BOOKING MODAL --- */}
      <BookingModal
        vehicle={vehicle}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => setShowBookingModal(false)}
      />
    </div>
  );
}
