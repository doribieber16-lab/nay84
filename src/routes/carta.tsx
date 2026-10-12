import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Pending } from "@/components/site/PageHero";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/carta")({
  head: () => pageHead("A Nossa Carta — NAY84", "Consulte a carta do NAY84: entradas, pratos principais, especialidades africanas, sobremesas e bebidas."),
  component: Carta,
});

const CATS = ["Entradas", "Pratos principais", "Especialidades", "Acompanhamentos", "Sobremesas", "Bebidas"];

function Carta() {
  const [active, setActive] = useState(CATS[0]);
  return (
    <>
      <PageHero eyebrow="A carta" title="Sabores de casa, servidos com alma.">
        Pratos preparados com tempo, temperos com memória e receitas de família.
      </PageHero>
      <section className="pb-32">
        <div className="container-editorial">
          <div className="sticky top-[73px] z-20 -mx-6 flex gap-2 overflow-x-auto border-y bg-background/95 px-6 py-4 backdrop-blur md:mx-0">
            {CATS.map((c) => (
              <button key={c} onClick={() => setActive(c)} className={`shrink-0 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${active === c ? "bg-copper text-charcoal" : "text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <h2 className="mt-16 text-5xl">{active}</h2>
          <div className="mt-10">
            <Pending>A carta oficial (pratos, descrições, preços e alergénios) será carregada a partir do painel administrativo. Não são apresentados pratos ou preços fictícios.</Pending>
          </div>
          <Link to="/reservar" className="btn-primary mt-16">Reservar mesa</Link>
        </div>
      </section>
    </>
  );
}
