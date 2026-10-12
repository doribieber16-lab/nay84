import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Pending } from "@/components/site/PageHero";
import { pageHead, SITE } from "@/lib/site";

type Search = { date?: string; time?: string; people?: string };

export const Route = createFileRoute("/reservar")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    date: typeof s.date === "string" ? s.date : undefined,
    time: typeof s.time === "string" ? s.time : undefined,
    people: typeof s.people === "string" ? s.people : undefined,
  }),
  head: () => pageHead("Reservar Mesa — NAY84", "Reserve a sua mesa no NAY84, restaurante africano na Amadora."),
  component: Reservar,
});

function Reservar() {
  const s = Route.useSearch();
  return (
    <>
      <PageHero eyebrow="Reservas" title="A sua mesa espera por si." />
      <section className="section-light py-24">
        <div className="container-editorial grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            {s.date && (
              <p className="mb-6 text-lg">Pedido: <strong>{s.date}</strong>{s.time && <> às <strong>{s.time}</strong></>} · {s.people ?? 2} pessoas</p>
            )}
            <Pending>O sistema de reservas online com disponibilidade em tempo real será ativado na fase 3. Até lá, reserve por telefone.</Pending>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="eyebrow">Por telefone</p>
            <a href={SITE.phoneHref} className="mt-4 block font-display text-4xl">{SITE.phone}</a>
            <Link to="/contactos" className="link-underline mt-6 inline-block text-sm">Ver horários e localização</Link>
          </div>
        </div>
      </section>
    </>
  );
}
