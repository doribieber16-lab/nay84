import { Link } from "@tanstack/react-router";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t pb-24 pt-20 sm:pb-10">
      <div className="pattern-line mb-20 opacity-60" aria-hidden />
      <div className="container-editorial grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link to="/" className="font-display text-5xl">NAY<span className="text-copper">84</span></Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Gastronomia africana com alma, na Amadora.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Visite-nos</p>
          <address className="space-y-2 text-sm not-italic text-foreground/85">
            <a href={SITE.mapsHref} target="_blank" rel="noreferrer" className="link-underline block">{SITE.address}</a>
            <a href={SITE.phoneHref} className="link-underline block">{SITE.phone}</a>
            <a href={SITE.instagramHref} target="_blank" rel="noreferrer" className="link-underline block">{SITE.instagram}</a>
          </address>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Horário</p>
          <ul className="space-y-2 text-sm text-foreground/85">
            {SITE.hours.map((h) => (
              <li key={h.days}><span className="block text-muted-foreground">{h.days}</span>{h.time}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-5">Páginas</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="link-underline">{n.label}</Link></li>)}
            <li><Link to="/reservar" className="link-underline">Reservar</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-editorial mt-16 flex flex-col gap-3 border-t pt-8 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Restaurante NAY84. Todos os direitos reservados.</p>
        <Link to="/privacidade" className="link-underline">Política de privacidade</Link>
      </div>
    </footer>
  );
}
