import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHero, Pending } from "@/components/site/PageHero";
import { pageHead } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

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

export const Route = createFileRoute("/carta")({
  head: () => pageHead("A Nossa Carta — NAY84", "Consulte a carta do NAY84: pratos africanos autênticos, especialidades, sobremesas e bebidas."),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQuery),
  component: Carta,
});

const euro = (c: number) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(c / 100);

function Carta() {
  const { data } = useSuspenseQuery(menuQuery);
  const [active, setActive] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [onlySpecial, setOnlySpecial] = useState(false);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.items.filter(
      (i) =>
        (!active || i.category_id === active) &&
        (!onlySpecial || i.is_special) &&
        (!term || i.name.toLowerCase().includes(term) || (i.description ?? "").toLowerCase().includes(term)),
    );
  }, [data.items, active, q, onlySpecial]);

  return (
    <>
      <PageHero eyebrow="A carta" title="Sabores de casa, servidos com alma.">
        Pratos preparados com tempo, temperos com memória e receitas de família.
      </PageHero>
      <section className="pb-32">
        <div className="container-editorial">
          {data.items.length === 0 ? (
            <Pending>A carta oficial (pratos, descrições, preços e alergénios) ainda não foi carregada. Assim que o restaurante a fornecer, aparecerá aqui automaticamente.</Pending>
          ) : (
            <>
              <div className="sticky top-[73px] z-20 -mx-6 flex flex-col gap-4 border-y bg-background/95 px-6 py-4 backdrop-blur md:mx-0 md:flex-row md:items-center">
                <div className="flex gap-2 overflow-x-auto">
                  <Chip on={!active} onClick={() => setActive(null)}>Tudo</Chip>
                  {data.categories.map((c) => <Chip key={c.id} on={active === c.id} onClick={() => setActive(c.id)}>{c.name}</Chip>)}
                </div>
                <div className="flex items-center gap-4 md:ml-auto">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <input type="checkbox" checked={onlySpecial} onChange={(e) => setOnlySpecial(e.target.checked)} className="accent-copper" />Especialidades
                  </label>
                  <input type="search" placeholder="Pesquisar prato…" aria-label="Pesquisar prato" value={q} onChange={(e) => setQ(e.target.value)} className="w-48 border-b bg-transparent py-2 text-sm outline-none focus:border-copper" />
                </div>
              </div>
              {data.categories.filter((c) => !active || c.id === active).map((c) => {
                const items = visible.filter((i) => i.category_id === c.id);
                if (!items.length) return null;
                return (
                  <div key={c.id} className="mt-20">
                    <h2 className="text-5xl">{c.name}</h2>
                    <ul className="mt-10 grid gap-x-16 md:grid-cols-2">
                      {items.map((i) => (
                        <li key={i.id} className={`flex gap-6 border-b py-8 ${i.is_available ? "" : "opacity-50"}`}>
                          {i.image_url && <img src={i.image_url} alt={i.name} loading="lazy" className="h-24 w-24 shrink-0 object-cover" />}
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between gap-4">
                              <h3 className="text-2xl">{i.name}{i.is_special && <span className="eyebrow ml-3 align-middle">Especialidade</span>}</h3>
                              {i.price_cents != null && <span className="font-display text-xl text-copper">{euro(i.price_cents)}</span>}
                            </div>
                            {i.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.description}</p>}
                            {i.allergens.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Alergénios: {i.allergens.join(", ")}</p>}
                            {!i.is_available && <p className="mt-2 text-xs uppercase tracking-widest text-crimson">Indisponível de momento</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              {visible.length === 0 && <p className="mt-16 text-muted-foreground">Nenhum prato corresponde à pesquisa.</p>}
            </>
          )}
          <Link to="/reservar" className="btn-primary mt-16">Reservar mesa</Link>
        </div>
      </section>
    </>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${on ? "bg-copper text-charcoal" : "text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}
