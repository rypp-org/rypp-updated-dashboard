import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1328px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function RedButton({
  href,
  children,
  arrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      {children}
      {arrow && <ArrowRight className="size-4" aria-hidden />}
    </Link>
  );
}

export function SectionHeading({
  title,
  subtitle,
  underline = false,
}: {
  title: string;
  subtitle?: string;
  underline?: boolean;
}) {
  return (
    <div>
      <h2 className="text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">{title}</h2>
      {underline && <span className="mt-2 block h-0.5 w-9 bg-brand" />}
      {subtitle && <p className={`text-sm text-muted ${underline ? "mt-2" : "mt-1.5"}`}>{subtitle}</p>}
    </div>
  );
}

export function ViewAll({ href }: { href: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
      View All <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}
