import { stats } from "../_lib/data";
import { StatCities, StatRiders, StatShield, StatStar, StatVehicles } from "./Icons";
import { Container } from "./ui";

const icons = [StatRiders, StatVehicles, StatCities, StatStar, StatShield];

export function Stats() {
  return (
    <section className="py-10 lg:py-12" aria-label="RYPP in numbers">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s, idx) => {
            const Icon = icons[idx];
            return (
              <li key={s.label} className="flex items-center gap-3 lg:justify-center">
                <Icon className="h-11 shrink-0 text-brand" />
                <span className="leading-tight">
                  <span className="block text-2xl font-bold text-ink">{s.value}</span>
                  <span className="block text-[11px] text-muted">{s.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
