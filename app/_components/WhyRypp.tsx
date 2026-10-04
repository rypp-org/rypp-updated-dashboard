import Image from "next/image";
import Link from "next/link";
import { Apple } from "lucide-react";
import { WhyPin, WhyRupee, WhySupport, WhyVerified } from "./Icons";
import { PlayStoreIcon } from "./SocialIcons";
import { Container } from "./ui";

const reasons = [
  { icon: WhyRupee, title: "Affordable Prices", text: "Great vehicles, budget-friendly." },
  { icon: WhyVerified, title: "Verified Partners", text: "Trusted & rated local vendors." },
  { icon: WhyPin, title: "Pan India Availability", text: "50+ cities and counting." },
  { icon: WhySupport, title: "24/7 Support", text: "We're always here for you." },
];

function Phone() {
  return (
    <div
      className="relative mx-auto h-[300px] w-[152px] shrink-0 rounded-[34px] border-[6px] border-ink bg-white shadow-[0_24px_40px_-18px_rgba(11,17,25,0.55)] sm:h-[330px] sm:w-[166px]"
      aria-hidden
    >
      <div className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 rounded-b-2xl bg-ink" />
      <div className="flex h-full flex-col items-center justify-center rounded-[26px] bg-white p-4">
        <Image src="/images/logo.png" alt="RYPP" width={1009} height={761} className="h-auto w-24" />
      </div>
    </div>
  );
}

export function WhyRypp() {
  return (
    <section className="pb-14 lg:pb-16" aria-labelledby="why-rypp">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.9fr_1fr]">
          <div>
            <h2 id="why-rypp" className="text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">
              Why RYPP?
            </h2>
            <p className="mt-1.5 text-sm text-muted">More than just rentals — a better way to move.</p>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {reasons.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl border border-line bg-white px-3 py-6 text-center">
                  <span className="mx-auto grid size-[54px] place-items-center rounded-full bg-white shadow-[0_0_0_7px_#fdeaea]">
                    <Icon className="h-6 text-brand" />
                  </span>
                  <h3 className="mt-5 text-[13px] font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-blush p-6 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-7 sm:text-left">
            <div className="min-w-0">
              <h3 className="text-xl font-bold leading-tight text-ink">
                Download the
                <br />
                RYPP App
              </h3>
              <div className="mt-2 flex justify-center gap-2 sm:justify-start" aria-hidden>
                <span className="h-0.5 w-9 rounded-full bg-brand" />
                <span className="h-0.5 w-9 rounded-full bg-brand" />
              </div>
              <p className="mt-2 text-[12px] leading-snug text-muted">
                Book, manage and extend
                <br />
                your rides on the go.
              </p>
              <div className="mt-4 flex flex-col items-center gap-2 sm:items-start">
                <Link
                  href="#contact"
                  className="inline-flex w-[132px] items-center gap-2 rounded-md bg-ink px-3 py-1.5 text-white transition hover:bg-black"
                >
                  <PlayStoreIcon className="size-5" />
                  <span className="text-[7px] uppercase leading-tight tracking-wide text-white/80">
                    Get it on
                    <span className="block text-[12px] font-semibold normal-case tracking-normal text-white">Google Play</span>
                  </span>
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex w-[132px] items-center gap-2 rounded-md bg-ink px-3 py-1.5 text-white transition hover:bg-black"
                >
                  <Apple className="size-5 fill-white" aria-hidden />
                  <span className="text-[7px] leading-tight text-white/80">
                    Download on the
                    <span className="block text-[12px] font-semibold text-white">App Store</span>
                  </span>
                </Link>
              </div>
            </div>
            <Phone />
          </div>
        </div>
      </Container>
    </section>
  );
}
