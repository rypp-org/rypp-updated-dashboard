import { ChooseRide } from "./_components/ChooseRide";
import { CtaBanner } from "./_components/CtaBanner";
import { Destinations } from "./_components/Destinations";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { PopularVehicles } from "./_components/PopularVehicles";
import { RentSmart } from "./_components/RentSmart";
import { Stats } from "./_components/Stats";
import { Testimonials } from "./_components/Testimonials";
import { Vision } from "./_components/Vision";
import { WhyRypp } from "./_components/WhyRypp";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ChooseRide />
        <RentSmart />
        <div className="pt-14 lg:pt-16">
          <PopularVehicles />
        </div>
        <WhyRypp />
        <Destinations />
        <HowItWorks />
        <section className="grid md:grid-cols-2" aria-label="Testimonials and vision">
          <Testimonials />
          <Vision />
        </section>
        <Stats />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
