import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { pageHead } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Item = Database["public"]["Tables"]["menu_items"]["Row"];

const menuQuery = queryOptions({
  queryKey: ["menu"],
  queryFn: async () => {
    const [c, i] = await Promise.all([
      supabase.from("menu_categories").select("*").order("position"),
      supabase.from("menu_items").select("*").order("position"),
    ]);
    return { categories: c.data ?? [], items: i.data ?? [] };
  },
});

export const Route = createFileRoute("/menu")({
  head: () =>
    pageHead(
      "O Nosso Menu — NAY84 Restaurante Africano",
      "Uma viagem pelos sabores, aromas e tradições da gastronomia africana. Descubra o menu do NAY84, na Amadora.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQuery),
  component: Menu,
});

const euro = (c: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(c / 100);

function Menu() {
  const { data } = useSuspenseQuery(menuQuery);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<Item | null>(null);
  const isDemo = data.items.some((i) => i.is_demo);
  const specials = data.items.filter((i) => i.is_special).slice(0, 3);
  const visible = useMemo(() => data.items.filter((i) => !active || i.category_id === active), [data.items, active]);
  const catName = (id: string) => data.categories.find((c) => c.id === id)?.name ?? "";

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-32">
        <img src="/images/menu/hero.jpg" alt="Mesa com pratos de gastronomia africana" width={1920} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-editorial relative pb-16 md:pb-20">
          <p className="eyebrow animate-rise">NAY84 · O Nosso Menu</p>
          <h1 className="animate-rise mt-5 max-w-4xl text-5xl leading-[1] md:text-7xl lg:text-8xl" style={{ animationDelay: "120ms" }}>
            Sabores de África, <em className="text-copper">memórias à mesa.</em>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg" style={{ animationDelay: "240ms" }}>
            Uma viagem pelos sabores, aromas e tradições da gastronomia africana. Descubra pratos que celebram as nossas raízes e a arte de partilhar.
          </p>
        </div>
      </section>

      {/* Specialties */}
      {specials.length === 3 && (
        <section className="section-light py-24 md:py-36">
          <div className="container-editorial">
            <Reveal className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="eyebrow">As nossas especialidades</p>
                <h2 className="mt-6 text-5xl leading-[1.05] md:text-6xl">Tradição que se sente em cada sabor.</h2>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">
                Receitas que atravessam gerações e celebram a riqueza da cozinha africana.
              </p>
            </Reveal>
            <div className="mt-16 grid gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">
              <Feature item={specials[0]!} onOpen={setOpen} className="md:col-span-7 md:row-span-2" aspect="aspect-[4/5]" />
              <Feature item={specials[1]!} onOpen={setOpen} className="md:col-span-5" aspect="aspect-[7/5]" />
              <Feature item={specials[2]!} onOpen={setOpen} className="md:col-span-4 md:col-start-9" aspect="aspect-square" />
            </div>
          </div>
        </section>
      )}

      {/* Menu grid */}
      <section className="py-24 md:py-32" id="pratos">
        <div className="container-editorial">
          <Reveal>
            <p className="eyebrow">O menu</p>
            <h2 className="mt-6 text-5xl md:text-6xl">Escolha o seu caminho.</h2>
          </Reveal>

          {data.items.length === 0 ? (
            <p className="mt-12 text-muted-foreground">O menu está a ser preparado. Volte em breve.</p>
          ) : (
            <>
              <div className="sticky top-[73px] z-20 -mx-6 mt-12 border-y bg-background/95 backdrop-blur md:mx-0">
                <div className="flex gap-1 overflow-x-auto px-6 py-3 md:px-0" role="tablist" aria-label="Categorias">
                  <Tab on={!active} onClick={() => setActive(null)}>Tudo</Tab>
                  {data.categories.map((c) => (
                    <Tab key={c.id} on={active === c.id} onClick={() => setActive(c.id)}>{c.name}</Tab>
                  ))}
                </div>
              </div>

              <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((i, idx) => (
                  <li key={i.id} className="animate-rise" style={{ animationDelay: `${Math.min(idx, 6) * 60}ms` }}>
                    <button onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Ver detalhes de ${i.name}`}>
                      <div className="img-zoom relative overflow-hidden rounded-md">
                        {i.image_url ? (
                          <img src={i.image_url} alt={i.name} loading="lazy" width={1024} height={768} className={`aspect-[4/3] w-full object-cover ${i.is_available ? "" : "grayscale"}`} />
                        ) : (
                          <div className="aspect-[4/3] w-full bg-muted" />
                        )}
                        <div className="absolute inset-0 bg-charcoal/0 transition-colors duration-700 group-hover:bg-charcoal/20" />
                        {i.is_special && <span className="eyebrow absolute left-4 top-4 bg-charcoal/80 px-3 py-1.5 backdrop-blur">Especialidade</span>}
                      </div>
                      <div className="mt-6 flex items-baseline justify-between gap-4">
                        <h3 className="text-3xl transition-colors duration-500 group-hover:text-copper">{i.name}</h3>
                        {i.price_cents != null && <span className="font-display text-xl text-copper">{euro(i.price_cents)}</span>}
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{catName(i.category_id)}</p>
                      {i.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.description}</p>}
                      <Tags item={i} />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {isDemo && (
            <p className="mt-20 border-t pt-6 text-xs text-muted-foreground">
              Versão de demonstração: as fotografias e os pratos apresentados são ilustrativos e serão substituídos pelo menu oficial do NAY84. Preços, ingredientes e alergénios serão indicados após confirmação.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-32 md:py-44">
        <img src="/images/menu/peixe.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <Reveal className="container-editorial relative text-center">
          <p className="eyebrow">Reservas</p>
          <h2 className="mx-auto mt-6 max-w-3xl text-5xl leading-[1.05] md:text-7xl">Já sabe o que lhe apetece?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Os melhores sabores merecem ser partilhados. Reserve a sua mesa e venha viver a experiência NAY84.
          </p>
          <Link to="/reservar" className="btn-primary mt-10">Reservar mesa</Link>
        </Reveal>
      </section>

      <DishModal item={open} category={open ? catName(open.category_id) : ""} onClose={() => setOpen(null)} />
    </>
  );
}

function Feature({ item, onOpen, className, aspect }: { item: Item; onOpen: (i: Item) => void; className: string; aspect: string }) {
  return (
    <Reveal className={className}>
      <button onClick={() => onOpen(item)} className="group relative block h-full w-full overflow-hidden rounded-md text-left">
        <div className="img-zoom h-full">
          <img src={item.feature_image_url ?? item.image_url ?? ""} alt={item.name} loading="lazy" className={`h-full w-full object-cover ${aspect} md:aspect-auto`} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-8">
          <h3 className="text-3xl md:text-4xl">{item.name}</h3>
          {item.description && <p className="mt-2 max-w-md text-sm text-ivory/75">{item.description}</p>}
          <span className="eyebrow mt-4 inline-block">Descobrir →</span>
        </div>
      </button>
    </Reveal>
  );
}

function Tags({ item }: { item: Item }) {
  const tags = [
    item.is_spicy && "Picante",
    item.is_vegetarian && "Vegetariano",
    !item.is_available && "Indisponível",
  ].filter(Boolean) as string[];
  if (!tags.length && !item.allergens.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tags.map((t) => <span key={t} className="border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">{t}</span>)}
      {item.allergens.length > 0 && <span className="px-1 py-1 text-xs text-muted-foreground">Alergénios: {item.allergens.join(", ")}</span>}
    </div>
  );
}

function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button role="tab" aria-selected={on} onClick={onClick}
      className={`relative shrink-0 px-5 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-500 ${on ? "text-copper" : "text-muted-foreground hover:text-foreground"}`}>
      {children}
      <span className={`absolute inset-x-5 bottom-1 h-px bg-copper transition-transform duration-500 ${on ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  );
}

function DishModal({ item, category, onClose }: { item: Item | null; category: string; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/80 backdrop-blur-sm animate-in fade-in md:items-center md:p-8" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dish-title">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-background animate-in slide-in-from-bottom-8 duration-500 md:grid md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-charcoal/70 text-xl text-ivory backdrop-blur">×</button>
        {item.image_url && <img src={item.feature_image_url ?? item.image_url} alt={item.name} className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full" />}
        <div className="flex flex-col p-8 md:p-12">
          <p className="eyebrow">{category}</p>
          <h2 id="dish-title" className="mt-4 text-5xl leading-[1.05]">{item.name}</h2>
          {item.price_cents != null && <p className="mt-4 font-display text-2xl text-copper">{euro(item.price_cents)}</p>}
          {item.description && <p className="mt-6 leading-relaxed text-muted-foreground">{item.description}</p>}
          <div className="mt-8 space-y-3 border-t pt-6 text-sm">
            <p><span className="text-muted-foreground">Ingredientes e alergénios: </span>{item.allergens.length ? item.allergens.join(", ") : "informação a confirmar com o restaurante."}</p>
            {item.is_demo && <p className="text-xs text-muted-foreground">Prato e fotografia ilustrativos (versão de demonstração).</p>}
          </div>
          <Link to="/reservar" className="btn-primary mt-10 self-start">Reservar mesa</Link>
        </div>
      </div>
    </div>
  );
}
