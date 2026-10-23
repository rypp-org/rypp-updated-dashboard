import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../_components/Header";
import { Footer } from "../../_components/Footer";
import { defaultTripDates } from "../../_lib/vehiclesData";
import { vehiclesApi } from "../../_lib/api/vehicles";
import { VehicleDetailPageContent } from "./_components/VehicleDetailPageContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { vehicle } = await vehiclesApi.getVehicleById(id);
    if (!vehicle) return { title: "Vehicle Rental in Bengaluru | RYPP" };

    return {
      title: `${vehicle.name} Rental in Bengaluru | RYPP`,
      description: `Rent ${vehicle.name} in Bengaluru starting at ₹${vehicle.pricePerDay}/day. Verified vehicles, zero hidden costs, free cancellation up to 24 hours.`,
    };
  } catch {
    return { title: "Vehicle Rental in Bengaluru | RYPP" };
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  let id = "1";
  try {
    const p = await params;
    if (p?.id) id = p.id;
  } catch {
    // fallback
  }

  let vehicle: any = null;
  let allDbVehicles: any[] = [];

  try {
    const [detailRes, listRes] = await Promise.all([
      vehiclesApi.getVehicleById(id),
      vehiclesApi.getVehicles(),
    ]);
    vehicle = detailRes?.vehicle || null;
    allDbVehicles = listRes?.vehicles || [];
  } catch (err) {
    console.error(`[VehicleDetailPage] Error fetching vehicle ${id}:`, err);
  }

  if (!vehicle) {
    notFound();
  }

  const similarVehicles = allDbVehicles.filter(
    (v) => v.id !== vehicle.id && (v.category === vehicle.category || true)
  ).slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1">
        <VehicleDetailPageContent
          vehicle={vehicle}
          dates={defaultTripDates()}
          similarVehicles={similarVehicles}
        />
      </main>
      <Footer />
    </>
  );
}
