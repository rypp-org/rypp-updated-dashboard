import { stats } from "../_lib/data";
import { StatCities, StatRiders, StatShield, StatStar, StatVehicles } from "./Icons";
import { Container } from "./ui";

const icons = [StatRiders, StatVehicles, StatCities, StatStar, StatShield];

export function Stats() {
  return (
    <section className="py-8 sm:py-10 lg:py-12" aria-label="RYPP in numbers">
      <Container>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-5">
          {stats.map((s, idx) => {
            const Icon = icons[idx];
            return (
              <li key={s.label} className="flex items-center gap-2.5 sm:gap-3 lg:justify-center">
                {/* fixed square box: the traced glyphs have different aspect ratios, so sizing by
                    height alone made wide icons look bigger and pushed the text out of line */}
                <span className="grid size-8 shrink-0 place-items-center sm:size-11">
                  <Icon className="h-full max-w-full text-brand" />
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-lg font-bold text-ink sm:text-2xl">{s.value}</span>
                  <span className="mt-0.5 block text-[10.5px] leading-snug text-muted sm:mt-0 sm:text-[11px]">{s.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
