import type { Metadata } from "next";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { VehiclesPageContent } from "./_components/VehiclesPageContent";

export const metadata: Metadata = {
  title: "Vehicles – Rent Bikes, Scooters & Cars | RYPP",
  description:
    "Explore wide range of bikes, scooters and cars available for rent in Bengaluru. Flexible pricing, verified vehicles, instant booking.",
};

export default function VehiclesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <VehiclesPageContent />
      </main>
      <Footer />
    </>
  );
}
