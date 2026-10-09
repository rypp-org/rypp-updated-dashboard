import Image from "next/image";
import { images } from "../_lib/images";

export function Vision() {
  return (
    <div id="about" className="relative overflow-hidden bg-ink text-white">
      <Image src={images.vision} alt="" fill sizes="50vw" className="object-cover object-bottom" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
      <div className="relative flex h-full max-w-[720px] flex-col justify-center px-5 py-10 sm:px-8 md:pr-10 lg:pr-[max(2rem,calc((100vw-1328px)/2+2rem))]">
        <div className="max-w-[360px]">
          <h2 className="text-[22px] font-bold sm:text-[26px] tracking-tight">Our Vision</h2>
          <p className="mt-3 text-[13px] leading-6 text-white/90">
            To make mobility simple, reliable, and accessible for everyone — powering journeys across every city, town,
            and destination in India.
          </p>
        </div>
        <p
          className="pointer-events-none absolute bottom-8 right-6 hidden -rotate-6 text-right font-script text-[30px] leading-[1.1] text-white lg:block"
          aria-hidden
        >
          A Greener
          <br />
          Brighter
          <br />
          India
        </p>
      </div>
    </div>
  );
}
