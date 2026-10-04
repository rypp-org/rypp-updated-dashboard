import Image from "next/image";
import {
  Target,
  Rocket,
  Eye,
  Diamond,
  Users,
  ShieldCheck,
  Lightbulb,
  Leaf,
  Building2,
} from "lucide-react";
import { Container } from "@/app/_components/ui";

const valuesList = [
  {
    icon: Users,
    title: "Customer First",
    desc: "Your journey matters.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    desc: "Honest pricing, reliable service.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Solving real problems.",
  },
  {
    icon: Leaf,
    title: "Sustainable Mobility",
    desc: "A cleaner, greener tomorrow.",
  },
  {
    icon: Building2,
    title: "Community Growth",
    desc: "Supporting local partners & economies.",
  },
];

export function AboutStory() {
  return (
    <section id="our-story" className="bg-slate-50/60 py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Story + Founder Quote */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                <span className="h-0.5 w-6 rounded bg-brand" />
                <span>OUR STORY</span>
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                From a Simple Idea<br className="hidden sm:inline" /> to a Bigger Movement.
              </h2>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base lg:text-[15px]">
                <p>
                  RYPP was born from a simple idea — mobility should be easy, flexible, and accessible for everyone. Whether it&apos;s a weekend getaway, a business trip, your daily commute, or an everyday need, we saw a fragmented rental market with inconsistent pricing, limited availability, and lack of trust.
                </p>
                <p>
                  So, we decided to build a platform that brings together trusted vehicle owners and customers on one seamless, transparent, and reliable platform — <strong className="font-semibold text-ink">RYPP</strong>.
                </p>
                <p>
                  Today, we&apos;re building more than just a rental platform — we&apos;re building freedom for a more mobile India.
                </p>
              </div>
            </div>

            {/* Founder Quote Card */}
            <div className="relative mt-8 rounded-2xl border border-red-100 bg-[#fdf2f4] p-6 sm:p-7">
              <span className="absolute left-4 top-2 select-none text-6xl font-serif text-brand/20">
                &ldquo;
              </span>
              <blockquote className="relative z-10 text-sm font-medium italic leading-relaxed text-ink/90 sm:text-base">
                &ldquo;We&apos;re not just building a rental platform, we&apos;re building freedom for a more mobile India.&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-0.5 w-6 rounded bg-brand" />
                <div>
                  <div className="text-sm font-bold text-ink">Kundan Singh</div>
                  <div className="text-xs text-muted">Founder, RYPP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Photo + What Drives Us + Purpose/Mission/Vision + Values */}
          <div className="space-y-8 lg:col-span-6">
            {/* Top Right Story Visual with Handwritten Script */}
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-md">
              <Image
                src="/images/photos/cat-bikes.jpg"
                alt="New Roads New Stories"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-y-0 left-6 flex items-center sm:left-8">
                <span className="font-script text-2xl font-bold text-white drop-shadow sm:text-3xl lg:text-4xl rotate-[-2deg]">
                  New Roads.<br />
                  <span className="text-red-400">New Stories.</span>
                </span>
              </div>
            </div>

            {/* What Drives Us */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-extrabold text-ink sm:text-2xl">
                What Drives Us
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
                At RYPP, we&apos;re driven by a simple belief — mobility creates opportunities. When people can move freely, they can explore more, work better, connect deeper, and live fuller lives.
              </p>

              {/* Purpose, Mission, Vision Row */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line/70 bg-slate-50/50 p-4 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Target className="size-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-ink">Our Purpose</h4>
                  <p className="mt-1.5 text-xs text-muted leading-snug">
                    To make mobility simple, reliable, and accessible for everyone, everywhere.
                  </p>
                </div>

                <div className="rounded-xl border border-line/70 bg-slate-50/50 p-4 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Rocket className="size-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-ink">Our Mission</h4>
                  <p className="mt-1.5 text-xs text-muted leading-snug">
                    To build India&apos;s most trusted mobility platform by connecting people with reliable vehicles through technology, transparency, and great service.
                  </p>
                </div>

                <div className="rounded-xl border border-line/70 bg-slate-50/50 p-4 transition hover:border-brand/30 hover:bg-white hover:shadow-sm">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Eye className="size-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-ink">Our Vision</h4>
                  <p className="mt-1.5 text-xs text-muted leading-snug">
                    To become the leading mobility platform in India and beyond, powering journeys across every city, town, and destination.
                  </p>
                </div>
              </div>

              {/* Our Values Section */}
              <div className="mt-8 border-t border-line/80 pt-6">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Diamond className="size-4 text-brand fill-brand/20" />
                  <span>Our Values</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {valuesList.map((val) => {
                    const IconComp = val.icon;
                    return (
                      <div
                        key={val.title}
                        className="rounded-xl border border-line/60 bg-slate-50/60 p-3 text-center transition hover:border-brand/30 hover:bg-white hover:shadow-sm"
                      >
                        <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                          <IconComp className="size-4" />
                        </div>
                        <div className="mt-2 text-xs font-bold text-ink leading-tight">
                          {val.title}
                        </div>
                        <div className="mt-1 text-[10px] text-muted leading-tight">
                          {val.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
