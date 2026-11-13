import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const transparent = path === "/" && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        transparent ? "bg-transparent py-6" : "border-b bg-background py-4"
      }`}
    >
      <div className="container-editorial grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:flex lg:justify-between">
        <Link to="/" className="min-w-0 font-display text-3xl tracking-wide text-foreground" aria-label="NAY84 — Início">
          NAY<span className="text-copper">84</span>
        </Link>
        <nav className="hidden items-center gap-10 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-underline pb-1 text-xs font-medium uppercase tracking-[0.22em] text-foreground/80 hover:text-foreground"
              activeProps={{ className: "text-copper" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-4">
          <Link to="/reservar" className="btn-primary hidden !px-6 !py-3 sm:inline-flex">
            Reservar
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 flex-col gap-1.5 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <span className={`h-px w-7 bg-foreground transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-7 bg-foreground transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </Button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        inert={!open}
        className={`fixed inset-x-0 bottom-0 top-[76px] overflow-y-auto overscroll-contain bg-background transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container-editorial flex min-h-full flex-col justify-between gap-10 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]" aria-label="Menu móvel">
          <ul className="space-y-5">
            {[{ to: "/", label: "Início" }, ...NAV].map((n, i) => (
              <li key={n.to} style={{ transitionDelay: `${i * 60}ms` }} className={`transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <Link to={n.to} onClick={() => setOpen(false)} className="block font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <Link to="/reservar" className="btn-primary w-full">Reservar mesa</Link>
            <a href={SITE.phoneHref} className="block text-center text-sm text-muted-foreground">{SITE.phone}</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function MobileReserveBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur sm:hidden">
      <Link to="/reservar" className="btn-primary w-full">Reservar mesa</Link>
    </div>
  );
}
