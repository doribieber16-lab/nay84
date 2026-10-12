import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { pageHead, SITE } from "@/lib/site";

export const Route = createFileRoute("/contactos")({
  head: () => pageHead("Contactos e Localização — NAY84", "Morada, telefone, horário e direções para o NAY84, na Rua 1 de Dezembro, Amadora."),
  component: Contactos,
});

function Contactos() {
  return (
    <>
      <PageHero eyebrow="Contactos" title="Encontre-nos na Amadora." />
      <section className="pb-32">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="space-y-10 md:col-span-5">
            <div><p className="eyebrow">Morada</p><p className="mt-3 font-display text-3xl">{SITE.address}</p></div>
            <div><p className="eyebrow">Telefone</p><a href={SITE.phoneHref} className="link-underline mt-3 inline-block font-display text-3xl">{SITE.phone}</a></div>
            <div><p className="eyebrow">Instagram</p><a href={SITE.instagramHref} target="_blank" rel="noreferrer" className="link-underline mt-3 inline-block font-display text-3xl">{SITE.instagram}</a></div>
            <div>
              <p className="eyebrow">Horário</p>
              <ul className="mt-3 space-y-2">{SITE.hours.map((h) => <li key={h.days} className="flex justify-between border-b py-2"><span className="text-muted-foreground">{h.days}</span><span>{h.time}</span></li>)}</ul>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href={SITE.mapsHref} target="_blank" rel="noreferrer" className="btn-ghost">Obter direções</a>
              <Link to="/reservar" className="btn-primary">Reservar</Link>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <iframe title="Mapa do NAY84" src={SITE.mapsEmbed} loading="lazy" className="h-[520px] w-full grayscale invert-[0.9] contrast-[0.9]" />
          </div>
        </div>
      </section>
    </>
  );
}
