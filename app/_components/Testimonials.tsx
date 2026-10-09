"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../_lib/data";
import { images } from "../_lib/images";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const go = (d: number) => setI((v) => (v + d + testimonials.length) % testimonials.length);

  return (
    <div className="relative overflow-hidden bg-brand text-white">
      <Image src={images.redMountains} alt="" fill sizes="50vw" className="object-cover opacity-70 mix-blend-multiply grayscale" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-[664px] flex-col px-5 py-10 sm:px-8 md:ml-auto md:mr-0 md:pl-8 lg:pl-[max(2rem,calc((100vw-1328px)/2+2rem))] lg:pr-10">
        <h2 className="text-[22px] font-bold sm:text-[26px] tracking-tight">What Our Riders Say</h2>
        <p className="mt-1 text-[13px] text-white/90">Real people. Real journeys. Real freedom.</p>

        <div className="relative mt-6" aria-live="polite">
          <figure className="rounded-xl bg-white px-11 py-5 text-ink sm:px-12 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.5)]">
            <blockquote className="min-h-[60px] text-[13px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Image src={t.avatar} alt="" width={40} height={40} unoptimized className="size-10 rounded-full object-cover" />
              <span className="text-[12px] leading-tight">
                <span className="block font-bold">{t.name}</span>
                <span className="text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="absolute left-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow transition hover:bg-blush"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow transition hover:bg-blush"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Choose testimonial">
          {testimonials.map((x, idx) => (
            <button
              key={x.name}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
              aria-current={idx === i}
              className={`size-1.5 rounded-full transition ${idx === i ? "bg-white" : "bg-white/45 hover:bg-white/75"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
