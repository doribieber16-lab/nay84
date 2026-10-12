import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Pending } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/historia")({
  head: () => pageHead("A Nossa História — NAY84", "A história de Nilsa Muehu e do NAY84: raízes, família e a paixão pela gastronomia africana."),
  component: Historia,
});

const CHAPTERS = [
  { t: "As origens", p: "Nilsa Muehu nasceu a 10 de março de 1984." },
  { t: "A paixão pela gastronomia", p: "A sua paixão pela cozinha africana nasceu das tradições familiares, à volta da mesa e dos sabores de casa." },
  { t: "O nascimento do NAY84", p: "O NAY84 é a concretização de um sonho pessoal: partilhar essa herança com quem nos visita." },
  { t: "O significado da família", p: "O nome NAY84 presta homenagem à sua primogénita, Naywana." },
  { t: "A visão para o futuro", p: null },
];

function Historia() {
  return (
    <>
      <PageHero eyebrow="A nossa história" title="Mais do que um restaurante, uma história de vida." />
      <section className="section-light py-28">
        <div className="container-editorial space-y-24">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.t} className="grid gap-8 border-t pt-12 md:grid-cols-12">
              <span className="font-display text-7xl text-copper md:col-span-2">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="text-4xl md:col-span-4 md:text-5xl">{c.t}</h2>
              <div className="text-lg leading-relaxed text-muted-foreground md:col-span-5 md:col-start-8">
                {c.p ?? <Pending>Texto a fornecer pela fundadora.</Pending>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="py-28">
        <div className="container-editorial grid gap-8 md:grid-cols-2">
          <Pending>Fotografia de Nilsa Muehu (mediante autorização).</Pending>
          <Pending>Fotografia de Nilsa com Naywana (mediante autorização).</Pending>
        </div>
        <div className="container-editorial mt-16"><Link to="/reservar" className="btn-primary">Reservar mesa</Link></div>
      </section>
    </>
  );
}
