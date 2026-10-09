import { Lightbulb, Building2, Users, TrendingUp, Globe } from "lucide-react";
import { Container } from "@/app/_components/ui";

const milestones = [
  {
    year: "2024",
    title: "The Idea",
    desc: "RYPP was conceived with a vision to simplify vehicle rentals.",
    icon: Lightbulb,
  },
  {
    year: "2025",
    title: "Building the Platform",
    desc: "Developed core technology, onboarded initial partners, and started pilot operations.",
    icon: Building2,
  },
  {
    year: "2026",
    title: "Expanding Cities",
    desc: "Scaling to multiple destinations across India with a growing fleet.",
    icon: Users,
  },
  {
    year: "2027",
    title: "A Bigger Community",
    desc: "10K+ customers and 500+ vehicles on platform (target).",
    icon: TrendingUp,
  },
  {
    year: "Beyond",
    title: "A More Mobile World",
    desc: "Expanding beyond India and building the future of mobility.",
    icon: Globe,
  },
];

export function AboutJourney() {
  return (
    <section className="bg-slate-50/70 py-16 lg:py-24">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
            <span className="h-0.5 w-6 rounded bg-brand" />
            <span>OUR JOURNEY</span>
          </div>

          <h2 className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Milestones on the road ahead.
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12 lg:mt-16">
          {/* Connecting Red Line (Desktop) */}
          <div className="absolute top-[23px] hidden h-0.5 w-full bg-brand lg:block" />

          {/* Grid of Nodes */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {milestones.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.year + item.title}
                  className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                >
                  {/* Connecting Line (single-column phones only; runs down the icon gutter) */}
                  {i < milestones.length - 1 && (
                    <div className="absolute bottom-[-32px] left-[23px] top-12 w-0.5 bg-brand/30 sm:hidden" />
                  )}

                  {/* Icon Node */}
                  <div
                    className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-brand text-white shadow-[0_4px_16px_rgba(228,32,44,0.4)] transition-transform duration-300 hover:scale-110"
                  >
                    <IconComp className="size-5" />
                  </div>

                  <div className="min-w-0 pt-1 lg:mt-4 lg:pt-0">
                    {/* Year Tag */}
                    <div className="text-xs font-bold uppercase tracking-wider text-brand">
                      {item.year}
                    </div>

                    {/* Milestone Title */}
                    <h3 className="mt-1 text-[15px] font-bold text-ink sm:text-base">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs leading-relaxed text-muted lg:px-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
