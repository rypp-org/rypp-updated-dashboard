"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { Container } from "./_components/ui";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RYPP Global Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container className="text-center max-w-lg space-y-6">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-amber-50 text-amber-600">
            <AlertTriangle className="size-10 text-amber-600" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Something went wrong</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Unable to load this vehicle</h1>
            <p className="text-sm text-muted">
              We encountered an issue connecting to the fleet database. Please try reloading or select another vehicle from our available fleet.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-dark transition"
            >
              <RefreshCw className="size-4" /> Try Again
            </button>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-ink hover:bg-gray-50 transition"
            >
              <ArrowLeft className="size-4" /> View Fleet
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
