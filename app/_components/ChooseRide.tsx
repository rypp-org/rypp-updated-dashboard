import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "../_lib/data";
import { Container, SectionHeading } from "./ui";

export function ChooseRide() {
  return (
    <section className="py-14 lg:py-16" aria-labelledby="choose-ride">
      <Container>
        <div id="choose-ride">
          <SectionHeading
            title="Choose Your Ride"
            underline
            subtitle="From city commutes to weekend getaways — find the perfect vehicle for your journey."
          />
        </div>
        <ul className="mt-7 grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <li key={c.name}>
              <Link
                href="#vehicles"
                className="group relative block h-[260px] overflow-hidden rounded-2xl bg-ink shadow-[0_18px_40px_-24px_rgba(11,17,25,0.6)] lg:h-[296px]"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  style={{ objectPosition: c.focus }}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">{c.name}</h3>
                    <p className="mt-0.5 text-[13px] text-white/85">{c.tagline}</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-lg bg-white text-ink transition group-hover:bg-brand group-hover:text-white">
                    <ArrowRight className="size-[18px]" aria-hidden />
                    <span className="sr-only">Browse {c.name}</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
