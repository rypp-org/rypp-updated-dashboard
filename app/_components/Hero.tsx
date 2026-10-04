import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { images } from "../_lib/images";
import { TrustPeople, TrustShield, TrustSupport, TrustVehicles } from "./Icons";
import { Container, RedButton } from "./ui";

const trust = [
  { icon: TrustPeople, top: "Trusted by", bottom: "10K+ Riders" },
  { icon: TrustVehicles, top: "Wide Range", bottom: "of Vehicles" },
  { icon: TrustShield, top: "Safe & Secure", bottom: "Rentals" },
  { icon: TrustSupport, top: "24/7", bottom: "Support" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* public/images/photos/hero1.png: full-bleed hero background at every size */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image src={images.hero} alt="" fill preload sizes="100vw" className="object-cover object-[62%_55%]" />
        {/* small screens: fade from the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 via-45% to-transparent md:hidden" />
        {/* wider screens: solid white hugging the text column (max-w-[560px]), then a quick fade into the photo */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff calc(max(0px, (100% - 1328px) / 2) + 32px + 560px), rgba(255,255,255,0) calc(max(0px, (100% - 1328px) / 2) + 32px + 780px))",
          }}
        />
      </div>

      <Container className="relative">
        <div className="flex flex-col justify-between gap-10 pb-56 pt-10 lg:min-h-[560px] lg:pb-8 lg:gap-0 lg:pt-12">
          <div className="max-w-[560px]">
            <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-muted">Explore. Ride. Belong.</p>
            <h1 className="mt-4 text-[38px] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[52px] lg:text-[58px]">
              India&rsquo;s Next Gen
              <br />
              <span className="text-brand">
                Vehicle Rental
                <br />
                Platform
              </span>
            </h1>
            <p className="mt-5 text-base leading-7 text-ink/80 sm:text-lg">
              Bikes, Scooters and Cars for every journey.
              <br />
              Affordable. Flexible. Reliable.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <RedButton href="#vehicles">Book Your Ride</RedButton>
              <Link href="#how-it-works" className="group inline-flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.8)] transition group-hover:bg-brand-dark">
                  <Play className="size-4 fill-white" aria-hidden />
                </span>
                <span className="text-left text-xs font-semibold leading-tight text-ink">
                  Watch Video
                  <span className="block font-normal text-muted">2 min</span>
                </span>
              </Link>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 md:max-w-[700px]">
            {trust.map(({ icon: Icon, top, bottom }) => (
              <li key={top} className="flex items-center gap-3">
                <Icon className="h-[38px] shrink-0 text-brand" />
                <span className="whitespace-nowrap text-[13px] leading-tight text-ink">
                  <span className="block font-medium">{top}</span>
                  <span className="block font-medium">{bottom}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* decorative type over the artwork -- xl+ only: needs the extra width so it clears the heading */}
        <div className="pointer-events-none absolute right-8 top-10 hidden xl:block" aria-hidden>
          <p className="absolute -left-[470px] top-[-2px] w-[430px] -rotate-6 whitespace-nowrap font-script text-[62px] leading-[0.95] text-ink">
            Ride
            <br />
            <span className="ml-14 text-brand">Your Way.</span>
            <span className="absolute -bottom-2 left-[130px] h-[3px] w-[220px] -rotate-3 rounded bg-brand" />
          </p>
          <div className="w-[140px] border-l border-ink/25 pl-4 text-[11px] font-bold uppercase leading-[1.5] tracking-[0.14em] text-ink">
            <p>Bike</p>
            <p>Car</p>
            <p>Rentals</p>
            <p>Anywhere</p>
            <span className="my-2 block h-0.5 w-8 bg-brand" />
            <p className="font-medium text-ink/70">Explore</p>
            <p className="font-medium text-ink/70">Travel</p>
            <p className="font-medium text-ink/70">Work</p>
            <p className="font-medium text-ink/70">Live More</p>
          </div>
        </div>
      </Container>

    </section>
  );
}
