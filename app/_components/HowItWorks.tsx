import { ArrowRight } from "lucide-react";
import { steps } from "../_lib/data";
import { Container } from "./ui";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="pb-14 lg:pb-16" aria-labelledby="how-heading">
      <Container className="relative">
        <h2 id="how-heading" className="text-[22px] font-bold tracking-tight text-ink sm:text-[28px] lg:text-[34px]">
          How It Works
        </h2>
        <p className="mt-1.5 text-[13px] text-muted sm:text-sm">Get on the road in just a few simple steps.</p>

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
          <ol className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,0.8fr)]">
            {steps.map((s, i) => (
              // phones: number beside the text, linked by a vertical line; sm+: centred column
              <li key={s.n} className="relative flex items-center gap-4 sm:block sm:text-center">
                {i < steps.length - 1 && (
                  <span aria-hidden className="absolute -bottom-6 left-[25px] top-[52px] w-px bg-line sm:hidden" />
                )}
                <span className="relative z-10 grid size-[52px] shrink-0 place-items-center rounded-full bg-blush text-lg font-medium text-brand sm:mx-auto sm:size-[64px] sm:text-[22px]">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-bold text-ink sm:mt-4">{s.title}</h3>
                  <p className="mt-1 text-[11px] leading-snug text-muted sm:mx-auto sm:max-w-[190px]">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
