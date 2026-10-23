import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../../_components/Header";
import { Footer } from "../../../_components/Footer";
import {
  TIME_SLOTS,
  defaultTripDates,
} from "../../../_lib/vehiclesData";
import { vehiclesApi } from "../../../_lib/api/vehicles";
import { BookingPageContent } from "./_components/BookingPageContent";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function pick(value: string | string[] | undefined, valid: (v: string) => boolean, fallback: string) {
  const v = Array.isArray(value) ? value[0] : value;
  return v && valid(v) ? v : fallback;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { vehicle } = await vehiclesApi.getVehicleById(id);
  if (!vehicle) return { title: "Vehicle Not Found | RYPP" };

  return {
    title: `Book ${vehicle.name} | RYPP`,
    description: `Complete your booking for ${vehicle.name} in Bengaluru at ₹${vehicle.pricePerDay}/day.`,
  };
}

export default async function BookVehiclePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { vehicle } = await vehiclesApi.getVehicleById(id);
  if (!vehicle) notFound();

  const query = await searchParams;
  const defaults = defaultTripDates();
  // dates/times can be handed over from the detail page's booking card; anything malformed falls back
  const isFutureDate = (v: string) => ISO_DATE.test(v) && v >= defaults.today;
  const isSlot = (v: string) => TIME_SLOTS.includes(v);

  return (
    <>
      <Header />
      <main className="flex-1">
        <BookingPageContent
          vehicle={vehicle}
          today={defaults.today}
          initialTrip={{
            pickupDate: pick(query.pickup, isFutureDate, defaults.pickup),
            pickupTime: pick(query.pickupTime, isSlot, "10:00 AM"),
            dropDate: pick(query.drop, isFutureDate, defaults.drop),
            dropTime: pick(query.dropTime, isSlot, "10:00 AM"),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
