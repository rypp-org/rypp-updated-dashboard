import type { Metadata } from "next";
import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import { AboutHero } from "./_components/AboutHero";
import { AboutStory } from "./_components/AboutStory";
import { AboutWhyRypp } from "./_components/AboutWhyRypp";
import { AboutJourney } from "./_components/AboutJourney";
import { AboutImpact } from "./_components/AboutImpact";
import { AboutCtaBanner } from "./_components/AboutCtaBanner";

export const metadata: Metadata = {
  title: "About Us | RYPP – Ride Your Way",
  description:
    "Learn about RYPP, India's technology-driven mobility platform making bike and car rentals simple, transparent, and reliable. Empowering a more connected India.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AboutHero />
        <AboutStory />
        <AboutWhyRypp />
        <AboutJourney />
        <AboutImpact />
        <AboutCtaBanner />
      </main>
      <Footer />
    </>
  );
}
