import Image from "next/image";
import Link from "next/link";
import { destinations } from "../_lib/data";
import { Container, ViewAll } from "./ui";

export function Destinations() {
  return (
    <section className="pb-14 lg:pb-16" aria-labelledby="destinations">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="destinations" className="text-[22px] font-bold tracking-tight text-ink sm:text-[28px] lg:text-[34px]">
              Popular Destinations
            </h2>
            <p className="mt-1.5 text-[13px] text-muted sm:text-sm">Top places our riders love to explore.</p>
          </div>
          <ViewAll href="#destinations" />
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {destinations.map((d) => (
            <li key={d.name}>
              <Link href="#vehicles" className="group relative block h-[190px] overflow-hidden rounded-xl bg-ink lg:h-[210px]">
                <Image
                  src={d.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 200px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-3.5 text-white">
                  <h3 className="text-[15px] font-bold leading-tight">{d.name}</h3>
                  <p className="text-[11px] text-white/85">{d.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
