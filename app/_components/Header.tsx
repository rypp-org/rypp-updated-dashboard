"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, ChevronDown, MapPin, Menu, User, X, LogOut, CheckCircle2 } from "lucide-react";
import { navLinks } from "../_lib/data";
import { Logo } from "./Logo";
import { useAuth } from "../_context/AuthContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {isAuthenticated && user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-line bg-line/20 px-3.5 py-2 text-[13px] font-semibold text-ink transition hover:border-brand/40 hover:bg-line/40"
              >
                <div className="flex size-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white uppercase">
                  {user.name ? user.name[0] : "U"}
                </div>
                <span className="max-w-[100px] truncate">{user.name || user.email.split("@")[0]}</span>
                <ChevronDown className="size-3.5 text-muted" aria-hidden />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-line bg-white p-3 shadow-xl z-50">
                  <div className="border-b border-line pb-3 pt-1 px-2">
                    <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                    <p className="text-[11px] text-muted truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                      <CheckCircle2 className="size-3" />
                      RYPP Verified Rider
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="hidden items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40 hover:bg-line/30 md:inline-flex"
            >
              <User className="size-4" aria-hidden />
              Sign In
            </button>
          )}
          <Link
            href="/vehicles"
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-brand px-5 py-2.5 text-[13px] sm:inline-flex font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark hover:shadow-[0_10px_24px_-10px_rgba(228,32,44,0.8)]"
          >
            Book Now <ArrowRight className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-line transition hover:bg-line/30 lg:hidden"
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
          {/* location + sign in are hidden in the bar below md, so surface them here */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40 hover:bg-line/30"
            >
              <MapPin className="size-4 text-brand" aria-hidden />
              Bengaluru
              <ChevronDown className="size-3.5 text-muted" aria-hidden />
            </button>
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="size-4" aria-hidden />
                Sign Out ({user.name ? user.name.split(" ")[0] : "User"})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openAuthModal("login");
                  setOpen(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-3 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40 hover:bg-line/30"
              >
                <User className="size-4" aria-hidden />
                Sign In
              </button>
            )}
          </div>
          {/* Book Now is dropped from the bar on phones, so it lives in the menu there */}
          <Link
            href="/vehicles"
            onClick={() => setOpen(false)}
            className="mt-2.5 flex items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-[13px] font-semibold text-white sm:hidden"
          >
            Book Now <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      )}
    </header>
  );
}
