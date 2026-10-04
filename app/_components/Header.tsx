"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronDown, MapPin, Menu, User, X } from "lucide-react";
import { navLinks } from "../_lib/data";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.06),0_8px_24px_-18px_rgba(15,23,42,0.18)] backdrop-blur">
      <div className="mx-auto flex h-[76px] w-full max-w-[1328px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-[88px]">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => {
            const isActive =
              pathname === l.href ||
              (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.label}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-2 text-[13px] font-medium transition-colors hover:text-brand ${
                  isActive ? "text-brand font-semibold" : "text-ink/80"
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[7px] h-0.5 rounded bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40 hover:bg-line/30 md:inline-flex"
          >
            <MapPin className="size-4 text-brand" aria-hidden />
            Bengaluru
            <ChevronDown className="size-3.5 text-muted" aria-hidden />
          </button>
          <Link
            href="/#contact"
            className="hidden items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40 hover:bg-line/30 md:inline-flex"
          >
            <User className="size-4" aria-hidden />
            Sign In
          </Link>
          <Link
            href="/#vehicles"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark hover:shadow-[0_10px_24px_-10px_rgba(228,32,44,0.8)]"
          >
            Book Now <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-line transition hover:bg-line/30 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-white px-5 pb-4 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((l) => {
              const isActive =
                pathname === l.href ||
                (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-line/60 py-3 text-sm font-medium ${
                      isActive ? "text-brand font-semibold" : "text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
