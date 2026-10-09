import Image from "next/image";
import { images } from "../_lib/images";
import { Container, RedButton } from "./ui";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <Image src={images.cta} alt="" fill sizes="100vw" className="object-cover object-[50%_18%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
      <Container className="relative">
        <div className="flex min-h-[200px] items-center justify-between gap-8 py-10">
          <div>
            <h2 className="text-[22px] font-bold leading-tight tracking-tight sm:text-[30px]">Ready for Your Next Journey?</h2>
            <p className="mt-2 text-[13px] text-white/90 sm:text-sm">Choose your ride and experience freedom like never before.</p>
            <RedButton href="#vehicles" className="mt-5">
              Book Your Ride
            </RedButton>
          </div>
          <p className="hidden -rotate-6 text-right font-script text-[32px] leading-[1.1] text-white md:block" aria-hidden>
            Different
            <br />
            Journeys
            <br />
            A Brighter
            <br />
            Tomorrow.
          </p>
        </div>
      </Container>
    </section>
  );
}
