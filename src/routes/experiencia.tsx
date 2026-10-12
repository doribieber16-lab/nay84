import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Pending } from "@/components/site/PageHero";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/experiencia")({
  head: () => pageHead("A Experiência — NAY84", "O ambiente, a gastronomia e os momentos de convívio que tornam cada visita ao NAY84 especial."),
  component: Experiencia,
});

function Experiencia() {
  return (
    <>
      <PageHero eyebrow="A experiência" title="Um espaço para partilhar, saborear e ficar.">
        Ambiente, gastronomia e momentos de convívio.
      </PageHero>
      <section className="pb-32">
        <div className="container-editorial grid gap-4 md:grid-cols-3">
          {["Ambiente", "Gastronomia", "Detalhes do espaço", "Convívio", "Galeria", "Vídeos"].map((t) => (
            <Pending key={t}><span className="font-display text-2xl text-foreground">{t}</span><br />Fotografias reais do NAY84 a fornecer.</Pending>
          ))}
        </div>
        <div className="container-editorial mt-16"><Link to="/reservar" className="btn-primary">Reservar mesa</Link></div>
      </section>
    </>
  );
}
