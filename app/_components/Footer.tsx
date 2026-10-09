"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from "./SocialIcons";
import { Container } from "./ui";

const quick = [
  { label: "Home", href: "/" },
  { label: "Vehicles", href: "/#vehicles" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/#contact" },
  { label: "Contact", href: "/#contact" },
];
const support = ["Help Center", "Booking Guide", "Cancellation Policy", "Terms & Conditions", "Privacy Policy"];
const socials = [
  { label: "LinkedIn", Icon: LinkedinIcon },
  { label: "Instagram", Icon: InstagramIcon },
  { label: "X", Icon: XIcon },
  { label: "Facebook", Icon: FacebookIcon },
  { label: "YouTube", Icon: YoutubeIcon },
];

const colTitle = "text-[13px] font-semibold text-white";
const link = "text-[12px] text-white/70 transition hover:text-white";

export function Footer() {
  const [done, setDone] = useState(false);

  function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
    e.currentTarget.reset();
  }

  return (
    <footer id="contact" className="bg-ink text-white">
      <Container>
        {/* phones: 2 cols (brand, contact + newsletter full width; link lists side by side);
            tablets: 3 cols; desktop: the original 5-column row */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 border-b border-white/10 py-9 sm:grid-cols-3 sm:gap-y-8 sm:py-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.2fr_1.4fr] lg:gap-10 lg:py-12">
          <div className="col-span-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 sm:col-span-3 lg:col-span-1 lg:block">
            <div>
              <Logo light />
              <p className="mt-3 text-[12px] text-white/80 lg:mt-4">India&rsquo;s Smart Mobility Platform</p>
              <p className="mt-1 text-[11px] text-white/60">Bike &bull; Car &bull; Rentals</p>
            </div>
            <ul className="flex gap-2.5 lg:mt-5">
              {socials.map(({ label, Icon }) => (
                <li key={label}>
                  <Link
                    href="#contact"
                    aria-label={label}
                    className="grid size-8 place-items-center rounded-full border border-white/25 text-white/85 transition hover:border-brand hover:bg-brand hover:text-white"
                  >
                    <Icon className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h3 className={colTitle}>Quick Links</h3>
            <ul className="mt-3 space-y-2 lg:mt-4 lg:space-y-2.5">
              {quick.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className={colTitle}>Support</h3>
            <ul className="mt-3 space-y-2 lg:mt-4 lg:space-y-2.5">
              {support.map((l) => (
                <li key={l}>
                  <Link href="#contact" className={link}>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 sm:col-span-1">
            <h3 className={colTitle}>Contact Us</h3>
            {/* inline on phones to save height; stacked list from sm */}
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5 text-[12px] text-white/80 sm:flex-col sm:gap-y-3 lg:mt-4 lg:gap-y-3.5">
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="size-4 shrink-0 text-brand" aria-hidden />
                <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="size-4 shrink-0 text-brand" aria-hidden />
                <a href="mailto:hello@rypp.in" className="hover:text-white">hello@rypp.in</a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
                Bengaluru, India
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className={colTitle}>Subscribe to our newsletter</h3>
            <p className="mt-1.5 text-[12px] text-white/70 lg:mt-4">Get latest updates and offers.</p>
            <form onSubmit={subscribe} className="mt-3 flex max-w-md items-center gap-2 lg:max-w-none">
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <input
                id="newsletter"
                type="email"
                required
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/5 px-3.5 py-2.5 text-[12px] text-white placeholder:text-white/50 focus:border-brand focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-brand transition hover:bg-brand-dark"
              >
                <Send className="size-4" aria-hidden />
              </button>
            </form>
            <p role="status" className="mt-1.5 text-[11px] text-white/80 lg:mt-2 lg:min-h-4">
              {done ? "Thanks for subscribing!" : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-1 py-4 text-[11px] text-white/60 sm:flex-row sm:gap-2 sm:py-5">
          <p>&copy; 2026 RYPP. All Rights Reserved.</p>
          <p>Ride Your Way. Explore More.</p>
        </div>
      </Container>
    </footer>
  );
}
