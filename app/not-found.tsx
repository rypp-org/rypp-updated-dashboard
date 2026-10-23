import Link from "next/link";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { Container } from "./_components/ui";
import { ArrowLeft, Car, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-ink">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Container className="text-center max-w-lg space-y-6">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-red-50 text-brand">
            <Car className="size-10 text-brand" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand">404 Error</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Vehicle or Page Not Found</h1>
            <p className="text-sm text-muted">
              The vehicle or route you are looking for may have been updated, booked, or is no longer listed in our active fleet.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-brand-dark transition"
            >
              <Search className="size-4" /> Browse Active Fleet
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-ink hover:bg-gray-50 transition"
            >
              <ArrowLeft className="size-4" /> Go to Homepage
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
