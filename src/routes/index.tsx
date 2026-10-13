import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import intro from "@/assets/intro.jpg";
import experience from "@/assets/experience.jpg";
import { Reveal } from "@/components/site/Reveal";
import { Pending } from "@/components/site/PageHero";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "NAY84 — Restaurante Africano na Amadora",
      "África à mesa. Descubra a autenticidade da gastronomia africana no NAY84, na Amadora. Reserve a sua mesa online.",
    ),
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img src={hero} alt="Mesa do NAY84 com pratos africanos à luz das velas" width={1920} height={1088} className="absolute inset-0 h-full w-full scale-105 object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-editorial relative pb-24 md:pb-32">
          <p className="eyebrow animate-rise">Restaurante africano · Amadora</p>
          <h1 className="animate-rise mt-6 max-w-5xl text-6xl leading-[0.95] md:text-8xl lg:text-[9rem]" style={{ animationDelay: "150ms" }}>
            África à mesa.
            <em className="block text-copper">Tradição em cada sabor.</em>
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg" style={{ animationDelay: "300ms" }}>
            Descubra a autenticidade da gastronomia africana, onde cada prato conta uma história e cada visita se transforma numa experiência.
          </p>
          <div className="animate-rise mt-10 flex flex-wrap gap-4" style={{ animationDelay: "450ms" }}>
            <Link to="/reservar" className="btn-primary">Reservar mesa</Link>
            <Link to="/menu" className="btn-ghost">Explorar o menu</Link>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 hidden flex-col items-center gap-3 md:flex" aria-hidden>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground/60 [writing-mode:vertical-rl]">Scroll</span>
          <span className="relative h-10 w-px bg-foreground/20"><span className="animate-scroll-dot absolute left-[-2px] top-0 h-1.5 w-1.5 rounded-full bg-copper" /></span>
        </div>
      </section>

      {/* Intro */}
      <section className="section-light py-28 md:py-40">
        <div className="container-editorial grid items-center gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-6 lg:col-span-5">
            <p className="eyebrow">O NAY84</p>
            <h2 className="mt-6 text-5xl leading-[1.05] md:text-6xl">Uma experiência que vai além da gastronomia.</h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              No NAY84, a cozinha africana é servida com o mesmo cuidado com que se recebe a família em casa. Receitas que atravessam gerações, temperos que despertam memórias e uma mesa onde todos são bem-vindos.
            </p>
            <Link to="/historia" className="link-underline mt-10 inline-block pb-1 text-xs font-semibold uppercase tracking-[0.24em]">Conhecer o NAY84 →</Link>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7" delay={150}>
            <div className="img-zoom relative">
              <img src={intro} alt="Mãos a temperar um prato tradicional" width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover" />
              <span className="absolute -bottom-6 -left-6 hidden bg-crimson px-6 py-4 font-display text-2xl italic text-ivory md:block">Nay · 84</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured dishes */}
      <section className="py-28 md:py-40">
        <div className="container-editorial">
          <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Da nossa cozinha</p>
              <h2 className="mt-6 max-w-2xl text-5xl leading-[1.05] md:text-6xl">Sabores que contam histórias.</h2>
            </div>
            <Link to="/menu" className="btn-ghost self-start md:self-auto">Ver o menu completo</Link>
          </Reveal>
          <div className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n, i) => (
              <Reveal key={n} delay={i * 100} className="bg-background">
                <article className="group flex h-full flex-col p-8">
                  <span className="font-display text-6xl text-copper/40 transition-colors duration-700 group-hover:text-copper">0{n}</span>
                  <h3 className="mt-16 text-3xl">Prato em destaque</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Nome, descrição e fotografia a preencher com o menu oficial do NAY84.</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section-light py-28 md:py-40">
        <div className="container-editorial grid items-center gap-16 md:grid-cols-12">
          <Reveal className="order-2 md:order-1 md:col-span-5">
            <div className="flex aspect-[4/5] items-center justify-center border border-dashed border-earth/40 bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">Fotografia real de Nilsa Muehu<br />(a fornecer pelo restaurante)</p>
            </div>
          </Reveal>
          <Reveal className="order-1 md:order-2 md:col-span-6 md:col-start-7" delay={150}>
            <p className="eyebrow">A fundadora</p>
            <h2 className="mt-6 text-5xl leading-[1.05] md:text-6xl">Uma história de amor, raízes e tradição.</h2>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Nilsa Muehu cresceu entre as tradições culinárias da sua família. Dessa herança nasceu um sonho: o NAY84, um nome que homenageia a sua primogénita, Naywana.
            </p>
            <Link to="/historia" className="btn-ghost mt-10">Conhecer a nossa história</Link>
          </Reveal>
        </div>
      </section>

      {/* Experience */}
      <section className="relative overflow-hidden">
        <div className="img-zoom">
          <img src={experience} alt="Ambiente acolhedor com pessoas à mesa" width={1600} height={1008} loading="lazy" className="h-[80vh] w-full object-cover" />
        </div>
        <div className="hero-overlay absolute inset-0" />
        <div className="container-editorial absolute inset-x-0 bottom-0 pb-20">
          <Reveal>
            <p className="eyebrow">A experiência</p>
            <h2 className="mt-6 max-w-3xl text-5xl leading-[1.05] md:text-7xl">À mesa, somos todos família.</h2>
            <Link to="/experiencia" className="link-underline mt-8 inline-block pb-1 text-xs font-semibold uppercase tracking-[0.24em]">Descobrir o espaço →</Link>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-28 md:py-36">
        <div className="container-editorial grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">Quem nos visita</p>
            <h2 className="mt-6 text-5xl leading-[1.05]">Opiniões dos clientes.</h2>
          </Reveal>
          <Reveal className="md:col-span-7 md:col-start-6" delay={150}>
            <Pending>Apenas serão publicadas avaliações reais e verificáveis (por exemplo, do Google), com indicação da fonte.</Pending>
          </Reveal>
        </div>
      </section>

      <QuickReserve />
    </>
  );
}

function QuickReserve() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("2");
  const field = "w-full border-b border-charcoal/30 bg-transparent py-3 text-lg outline-none focus:border-copper";
  return (
    <section className="section-light py-28 md:py-36">
      <div className="container-editorial">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Reservas</p>
          <h2 className="mt-6 text-5xl leading-[1.05] md:text-7xl">A sua mesa espera por si.</h2>
        </Reveal>
        <Reveal delay={150}>
          <form
            className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-4 md:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/reservar", search: { date, time, people } });
            }}
          >
            <label className="block text-left"><span className="eyebrow">Data</span><input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} /></label>
            <label className="block text-left"><span className="eyebrow">Hora</span><input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={field} /></label>
            <label className="block text-left"><span className="eyebrow">Pessoas</span>
              <select value={people} onChange={(e) => setPeople(e.target.value)} className={field}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button className="btn-primary">Ver disponibilidade</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
