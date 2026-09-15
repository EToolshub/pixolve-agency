import type { Metadata } from "next";
import { Compass, Handshake, Rocket, ShieldCheck, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Agencia de Diseño y Tecnología",
  description:
    "Conoce la misión, visión y valores de Pixolve Agency: una agencia de diseño gráfico, UI/UX y desarrollo web comprometida con la transparencia y el crecimiento de tus clientes.",
  alternates: { canonical: "/nosotros" },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Transparencia",
    description:
      "Precios claros, procesos documentados y comunicación honesta en cada etapa del proyecto.",
  },
  {
    icon: Target,
    title: "Orientación a resultados",
    description:
      "Cada pieza de diseño y cada línea de código tiene un objetivo: ayudarte a crecer.",
  },
  {
    icon: Handshake,
    title: "Compromiso",
    description:
      "Tratamos cada proyecto, sin importar su tamaño, con la misma responsabilidad y cuidado.",
  },
  {
    icon: Rocket,
    title: "Mejora continua",
    description:
      "Adoptamos nuevas herramientas y tendencias para que tu marca esté siempre un paso adelante.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="border-b border-default bg-alt py-20">
        <Container>
          <SectionHeading
            eyebrow="Sobre nosotros"
            title="Una agencia construida sobre la confianza"
            description="Pixolve Agency nació para simplificar algo que suele ser confuso: contratar servicios de diseño y tecnología de calidad, con precios claros y procesos transparentes de principio a fin."
          />
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-2xl border border-default p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-heading">
                Nuestra misión
              </h2>
              <p className="mt-3 leading-relaxed text-body">
                Ayudar a negocios de cualquier tamaño —desde pymes hasta
                grandes empresas— a fortalecer su presencia digital mediante
                diseño de calidad, tecnología confiable y un proceso de compra
                y entrega completamente transparente, sin letras pequeñas ni
                sorpresas.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="h-full rounded-2xl border border-default p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Rocket className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-heading">
                Nuestra visión
              </h2>
              <p className="mt-3 leading-relaxed text-body">
                Ser la agencia de referencia para negocios que buscan escalar
                su marca digitalmente, reconocida por la calidad de su
                trabajo, la claridad de sus procesos y la confianza que
                genera en cada cliente, sin importar su idioma, país o forma
                de pago preferida.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-alt py-20">
        <Container>
          <SectionHeading
            eyebrow="Nuestros valores"
            title="Lo que guía cada proyecto que entregamos"
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl bg-card p-7 shadow-sm ring-1 ring-default">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-bold text-heading">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {value.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-heading sm:text-3xl">
            ¿Quieres conocer cómo trabajamos paso a paso?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-body">
            Te mostramos todo el proceso, desde el primer contacto hasta el
            soporte post-entrega.
          </p>
          <div className="mt-6">
            <Button href="/proceso">Ver nuestro proceso</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
