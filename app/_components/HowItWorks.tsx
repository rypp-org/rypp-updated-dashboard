import { ArrowRight } from "lucide-react";
import { steps } from "../_lib/data";
import { Container } from "./ui";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pb-14 lg:pb-16" aria-labelledby="how-heading">
      <Container className="relative">
        <h2 id="how-heading" className="text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">
          How It Works
        </h2>
        <p className="mt-1.5 text-sm text-muted">Get on the road in just a few simple steps.</p>

        <div
          className="pointer-events-none absolute -right-4 bottom-2 hidden size-[150px] place-items-center rounded-full border-[14px] border-blush/70 xl:grid"
          aria-hidden
        >
          <ArrowRight className="size-14 text-blush" strokeWidth={3} />
        </div>

        <div className="relative mt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-8 right-[22%] top-8 hidden h-px bg-line lg:block"
          />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,0.8fr)]">
            {steps.map((s) => (
              <li key={s.n} className="text-center">
                <span className="relative z-10 mx-auto grid size-[64px] place-items-center rounded-full bg-blush text-[22px] font-medium text-brand">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[13px] font-bold text-ink">{s.title}</h3>
                <p className="mx-auto mt-1 max-w-[190px] text-[11px] leading-snug text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
