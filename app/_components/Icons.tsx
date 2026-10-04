// Icons traced directly from the design mock-up (see scripts/trace-icons.mjs),
// so they are the same glyphs as in the reference. Colour comes from `currentColor`.
import { tracedIcons } from "../_lib/traced-icons";

type P = { className?: string };

function make(name: string) {
  const icon = tracedIcons[name];
  const Icon = ({ className }: P) => (
    <svg viewBox={icon.viewBox} fill="currentColor" fillRule="evenodd" className={`w-auto ${className ?? ""}`} aria-hidden>
      <path d={icon.d} />
    </svg>
  );
  Icon.displayName = `Icon(${name})`;
  return Icon;
}

// hero trust row
export const TrustPeople = make("people");
export const TrustVehicles = make("helmet");
export const TrustShield = make("shield");
export const TrustSupport = make("support");

// "Rent Smart" use cases (white)
export const UseWeekend = make("weekend");
export const UseBusiness = make("business");
export const UseCommute = make("commute");
export const UseCities = make("cities2");

// "Why RYPP?"
export const WhyRupee = make("rupee");
export const WhyVerified = make("verified");
export const WhyPin = make("pin");
export const WhySupport = make("headset");

// stats row
export const StatRiders = make("riders");
export const StatVehicles = make("vehicles");
export const StatCities = make("cities");
export const StatStar = make("star");
export const StatShield = make("shield100");
