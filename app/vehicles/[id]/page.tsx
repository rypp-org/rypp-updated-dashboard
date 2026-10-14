import type { Metadata } from "next";
import { Header } from "../../_components/Header";
import { Footer } from "../../_components/Footer";
import { defaultTripDates, getVehicleDetails } from "../../_lib/vehiclesData";
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
  const { vehicle } = await vehiclesApi.getVehicleById(id);

  // Fallback to Himalayan if vehicle is not found
  const finalVehicle = vehicle || getVehicleDetails("re-himalayan");

  return (
    <>
      <Header />
      <main className="flex-1">
        <VehicleDetailPageContent vehicle={finalVehicle} dates={defaultTripDates()} />
      </main>
      <Footer />
    </>
  );
}
