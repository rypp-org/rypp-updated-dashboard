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
  const { id } = await params;
  const { vehicle } = await vehiclesApi.getVehicleById(id);
  if (!vehicle) return { title: "Vehicle Not Found | RYPP" };

  return {
    title: `${vehicle.name} Rental in Bengaluru | RYPP`,
    description: `Rent ${vehicle.name} in Bengaluru starting at ₹${vehicle.pricePerDay}/day. Verified vehicles, zero hidden costs, free cancellation up to 24 hours.`,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [{ vehicle }, { vehicles: allDbVehicles }] = await Promise.all([
    vehiclesApi.getVehicleById(id),
    vehiclesApi.getVehicles(),
  ]);

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
