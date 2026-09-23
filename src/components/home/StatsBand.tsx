import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { services } from "@/data/services";

// Cifras verificables a partir del propio catálogo y de las políticas del sitio.
const packageCount = services.reduce((sum, service) => sum + service.packages.length, 0);

const stats = [
  { value: services.length, label: "Servicios especializados" },
  { value: packageCount, label: "Paquetes con precio fijo" },
  { value: 24, suffix: "h", label: "Validación de tu pago (hábiles)" },
  { value: 100, suffix: "%", label: "Atención remota en LATAM y EE. UU." },
];

export function StatsBand() {
  return (
    <section className="py-6">
      <Container>
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-default bg-card lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`relative p-7 sm:p-9 ${index % 2 === 0 ? "border-r border-default" : ""} ${index < 2 ? "border-b border-default lg:border-b-0" : ""} ${index === 1 ? "lg:border-r" : ""}`}
            >
              <p className="font-display text-4xl font-extrabold text-heading sm:text-5xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-body">{stat.label}</p>
              <span className="absolute left-7 top-0 h-0.5 w-10 bg-brand-500 sm:left-9" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
