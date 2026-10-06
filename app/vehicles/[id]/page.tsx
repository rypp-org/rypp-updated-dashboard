import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "../../_components/Header";
import { Footer } from "../../_components/Footer";
import { ALL_VEHICLES, getVehicleDetails } from "../../_lib/vehiclesData";
import { VehicleDetailPageContent } from "./_components/VehicleDetailPageContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = getVehicleDetails(id);
  if (!vehicle) return { title: "Vehicle Not Found | RYPP" };

  return {
    title: `${vehicle.name} Rental in Bengaluru | RYPP`,
    description: `Rent ${vehicle.name} in Bengaluru starting at ₹${vehicle.pricePerDay}/day. Verified vehicles, zero hidden costs, free cancellation up to 24 hours.`,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const baseVehicle = ALL_VEHICLES.find((v) => v.id === id);

  if (!baseVehicle) {
    // Fallback to default vehicle or notFound if completely unrecognized
    const vehicle = getVehicleDetails("re-himalayan");
    return (
      <>
        <Header />
        <main className="flex-1">
          <VehicleDetailPageContent vehicle={vehicle} />
        </main>
        <Footer />
      </>
    );
  }

  const vehicleDetails = getVehicleDetails(id);

  return (
    <>
      <Header />
      <main className="flex-1">
        <VehicleDetailPageContent vehicle={vehicleDetails} />
      </main>
      <Footer />
    </>
  );
}
