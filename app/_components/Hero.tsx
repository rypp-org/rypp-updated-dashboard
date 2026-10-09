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
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 via-50% to-transparent md:hidden" />
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
        <div className="flex flex-col justify-between gap-8 pb-40 pt-8 sm:gap-10 sm:pb-56 sm:pt-10 lg:min-h-[560px] lg:pb-8 lg:gap-0 lg:pt-12">
          <div className="max-w-[560px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted sm:text-[13px]">Explore. Ride. Belong.</p>
            <h1 className="mt-3 text-[30px] font-extrabold leading-[1.12] tracking-tight text-ink min-[400px]:text-[34px] sm:mt-4 sm:text-[52px] sm:leading-[1.1] lg:text-[58px]">
              India&rsquo;s Next Gen
              <br />
              <span className="text-brand">
                Vehicle Rental
                <br />
                Platform
              </span>
            </h1>
            <p className="mt-4 text-[14px] leading-6 text-ink/80 sm:mt-5 sm:text-lg sm:leading-7">
              Bikes, Scooters and Cars for every journey.
              <br />
              Affordable. Flexible. Reliable.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-4 sm:mt-7 sm:gap-6">
              <RedButton href="#vehicles">Book Your Ride</RedButton>
              <Link href="#how-it-works" className="group inline-flex items-center gap-2.5 sm:gap-3">
                <span className="grid size-9 place-items-center rounded-full sm:size-10 bg-brand text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.8)] transition group-hover:bg-brand-dark">
                  <Play className="size-4 fill-white" aria-hidden />
                </span>
                <span className="text-left text-xs font-semibold leading-tight text-ink">
                  Watch Video
                  <span className="block font-normal text-muted">2 min</span>
                </span>
              </Link>
            </div>
          </div>

          {/* below md the badges sit over the photo, so give them a frosted card for legibility */}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-2xl bg-white/90 p-4 shadow-[0_12px_32px_-16px_rgba(11,17,25,0.45)] backdrop-blur-sm sm:gap-x-4 sm:gap-y-5 sm:p-5 md:max-w-[700px] md:grid-cols-4 md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
            {trust.map(({ icon: Icon, top, bottom }) => (
              <li key={top} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                {/* fixed square so the differently-proportioned traced glyphs render at one size */}
                <span className="grid size-8 shrink-0 place-items-center sm:size-[38px]">
                  <Icon className="h-full max-w-full text-brand" />
                </span>
                <span className="min-w-0 text-[11.5px] leading-tight text-ink sm:whitespace-nowrap sm:text-[13px]">
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
