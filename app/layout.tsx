import type { Metadata } from "next";
import { Kaushan_Script, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_context/AuthContext";
import { LocationProvider } from "./_context/LocationContext";
import { AuthModal } from "./_components/AuthModal";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const kaushan = Kaushan_Script({
  variable: "--font-kaushan",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "RYPP – India's Next Gen Vehicle Rental Platform",
  description:
    "Rent bikes, scooters and cars for every journey. Affordable, flexible and reliable vehicle rentals across India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${kaushan.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LocationProvider>
            {children}
            <AuthModal />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

