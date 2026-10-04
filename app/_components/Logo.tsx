import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className = "h-5 w-8" }: { className?: string }) {
  return <Image src="/images/logo-mark.png" alt="" width={865} height={512} className={`w-auto object-contain ${className}`} aria-hidden />;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="RYPP home" className="inline-flex flex-col leading-none">
      <LogoMark className="ml-0.5 h-[26px]" />
      <span
        className={`-mt-1 text-[26px] font-extrabold italic tracking-tight ${light ? "text-white" : "text-ink"}`}
      >
        RYPP
      </span>
      <span className={`text-[8px] font-medium italic tracking-wide ${light ? "text-white/70" : "text-muted"}`}>
        Ride Your Way
      </span>
    </Link>
  );
}
