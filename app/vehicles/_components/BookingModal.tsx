"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Calendar, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { Vehicle } from "../../_lib/vehiclesData";

interface BookingModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const BENGALURU_LOCATIONS = [
  "Koramangala Hub",
  "Indiranagar Station",
  "HSR Layout Sector 1",
  "Whitefield Main Road",
  "BLR Airport Terminal 1",
  "MG Road Metro Station",
];

export function BookingModal({ vehicle, onClose, onSuccess }: BookingModalProps) {
  const [pickupDate, setPickupDate] = useState<string>("2026-10-10");
  const [returnDate, setReturnDate] = useState<string>("2026-10-12");
  const [location, setLocation] = useState<string>(BENGALURU_LOCATIONS[0]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  if (!vehicle) return null;

  // Calculate days
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const subtotal = vehicle.pricePerDay * days;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = "RYPP-" + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(randomRef);
    setIsSubmitted(true);
    onSuccess(`Successfully booked ${vehicle.name}! Ref: ${randomRef}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-gray-50/80">
          <h3 className="text-lg font-bold text-ink">
            {isSubmitted ? "Booking Confirmed!" : `Reserve ${vehicle.name}`}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-gray-200 hover:text-ink transition"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-ink">Your Ride is Ready!</h4>
              <p className="mt-1 text-sm text-muted">
                We have confirmed your booking for <span className="font-semibold text-ink">{vehicle.name}</span>.
              </p>
            </div>
            
            <div className="rounded-xl bg-gray-50 p-4 text-left border border-line space-y-2 text-xs text-ink/80">
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-muted">Booking Reference:</span>
                <span className="font-mono font-bold text-brand">{bookingRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Pickup Location:</span>
                <span className="font-medium text-ink">{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Duration:</span>
                <span className="font-medium text-ink">{days} day(s)</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-ink pt-2 border-t border-line/60">
                <span>Total Amount:</span>
                <span className="text-brand">₹ {total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-muted">
              Confirmation SMS & Email sent. Please present your Driving License at pickup.
            </p>

            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Vehicle preview card */}
            <div className="flex gap-4 rounded-xl border border-line bg-gray-50/50 p-3">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-white border border-line/50">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span>{vehicle.rating}</span>
                  <span className="text-muted">({vehicle.reviews} reviews)</span>
                </div>
                <h4 className="font-bold text-ink text-sm sm:text-base">{vehicle.name}</h4>
                <div className="mt-1 flex gap-2 text-[11px] text-muted font-medium">
                  <span className="bg-white px-2 py-0.5 rounded border border-line">✓ {vehicle.transmission}</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-line">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-muted mb-1.5 font-semibold">Pickup Hub Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 size-4 text-brand pointer-events-none" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-ink focus:border-brand focus:outline-none"
                  >
                    {BENGALURU_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc} (Bengaluru)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted mb-1.5 font-semibold">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 size-4 text-muted pointer-events-none" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-ink focus:border-brand focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-muted mb-1.5 font-semibold">Return Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 size-4 text-muted pointer-events-none" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-ink focus:border-brand focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-xl border border-line bg-gray-50/70 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Rental ({days} {days === 1 ? "day" : "days"} @ ₹{vehicle.pricePerDay}/day)</span>
                <span>₹ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>GST & Platform Insurance (12%)</span>
                <span>₹ {taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-ink pt-2 border-t border-line">
                <span>Total Price</span>
                <span className="text-brand text-base">₹ {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>Zero hidden fees. Free cancellation up to 6 hours before pickup.</span>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark"
            >
              Confirm Booking <ArrowRight className="size-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
