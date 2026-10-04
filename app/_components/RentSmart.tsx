import Image from "next/image";
import { images } from "../_lib/images";
import { UseBusiness, UseCities, UseCommute, UseWeekend } from "./Icons";
import { Container, RedButton } from "./ui";

const uses = [
  { icon: UseWeekend, label: "Weekend Getaways" },
  { icon: UseBusiness, label: "Business Travel" },
  { icon: UseCommute, label: "Daily Commute" },
  { icon: UseCities, label: "Exploring New Cities" },
];

export function RentSmart() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image src={images.bannerSunset} alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-transparent" />

      <Container className="relative">
        <div className="flex flex-col justify-between gap-8 pb-8 pt-10 md:flex-row md:items-start">
          <div className="max-w-[520px]">
            <h2 className="text-[30px] font-bold tracking-tight sm:text-[34px]">Rent Smart. Ride Happy.</h2>
            <p className="mt-3 text-[13px] leading-6 text-white/85 sm:text-sm">
              Whether it&rsquo;s a quick city ride or a long road trip,{" "}
              <br className="hidden sm:block" />
              RYPP makes vehicle rental simple, affordable and hassle-free.
            </p>
            <RedButton href="#vehicles" className="mt-6">
              Explore Vehicles
            </RedButton>
          </div>
          <p
            className="hidden -rotate-6 pr-6 pt-2 text-right font-script text-[34px] leading-[1.1] text-white/95 md:block"
            aria-hidden
          >
            Good Rides
            <br />
            <span className="mr-[-6px]">Brighter Stories</span>
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-y-5 border-t border-white/15 py-6 lg:grid-cols-4">
          {uses.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-4 lg:justify-start">
              <Icon className="h-11 shrink-0 text-white" />
              <span className="text-[13px] font-semibold">{label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
