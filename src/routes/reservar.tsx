import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { pageHead, SITE } from "@/lib/site";
import { createReservation, getSlots } from "@/lib/reservations.functions";

type Search = { date?: string | undefined; time?: string | undefined; people?: string | undefined };

export const Route = createFileRoute("/reservar")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    date: typeof s["date"] === "string" ? s["date"] : undefined,
    time: typeof s["time"] === "string" ? s["time"] : undefined,
    people: s["people"] != null ? String(s["people"]) : undefined,
  }),
  head: () => pageHead("Reservar Mesa — NAY84", "Reserve a sua mesa no NAY84, restaurante africano na Amadora. Consulte a disponibilidade em tempo real."),
  component: Reservar,
});

function todayLisbon() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(new Date());
}
function fmtDate(d: string) {
  return new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long" }).format(new Date(d + "T12:00:00"));
}

const field = "w-full border-b border-charcoal/30 bg-transparent py-3 text-lg outline-none transition-colors focus:border-copper";

function Reservar() {
  const q = Route.useSearch();
  const [day, setDay] = useState(q.date ?? "");
  const [party, setParty] = useState(Number(q.people ?? 2) || 2);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ time: string; available: boolean }[] | null>(null);
  const [maxParty, setMaxParty] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", privacy: false, website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ status: string } | null>(null);
  const min = useMemo(todayLisbon, []);

  useEffect(() => {
    if (!day) return;
    let cancel = false;
    setLoading(true);
    setLoadErr(null);
    setTime(null);
    getSlots({ data: { day, party } })
      .then((r) => {
        if (cancel) return;
        setSlots(r.slots);
        setMaxParty(r.maxParty);
        if (q.time && r.slots.some((s) => s.time === q.time && s.available)) setTime(q.time);
      })
      .catch(() => !cancel && setLoadErr("Não foi possível consultar a disponibilidade."))
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, party]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) return;
    setSubmitting(true);
    setSubmitErr(null);
    try {
      const r = await createReservation({ data: { day, time, party, ...form, privacy: form.privacy as true } });
      if (r.ok) setDone({ status: r.status });
      else {
        setSubmitErr(r.error);
        const s = await getSlots({ data: { day, party } });
        setSlots(s.slots);
        setTime(null);
      }
    } catch {
      setSubmitErr("Verifique os dados introduzidos e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <>
        <PageHero eyebrow="Reserva recebida" title={done.status === "confirmada" ? "A sua mesa está reservada." : "Pedido de reserva recebido."}>
          {fmtDate(day)} às {time} · {party} {party === 1 ? "pessoa" : "pessoas"}.{" "}
          {done.status === "confirmada" ? "Esperamos por si." : "O restaurante vai confirmar o seu pedido em breve, através do contacto indicado."}
        </PageHero>
        <section className="pb-32"><div className="container-editorial flex flex-wrap gap-4">
          <Link to="/" className="btn-primary">Voltar ao início</Link>
          <Link to="/carta" className="btn-ghost">Ver a carta</Link>
        </div></section>
      </>
    );
  }

  const open = slots?.filter((s) => s.available) ?? [];

  return (
    <>
      <PageHero eyebrow="Reservas" title="A sua mesa espera por si.">Escolha o dia, o número de pessoas e um dos horários disponíveis.</PageHero>
      <section className="section-light py-24">
        <form onSubmit={submit} className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="space-y-14 md:col-span-7">
            <Step n="01" title="Data e pessoas">
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block"><span className="eyebrow">Data</span>
                  <input required type="date" min={min} value={day} onChange={(e) => setDay(e.target.value)} className={field} />
                </label>
                <label className="block"><span className="eyebrow">Pessoas</span>
                  <select value={party} onChange={(e) => setParty(Number(e.target.value))} className={field}>
                    {Array.from({ length: maxParty }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Grupos com mais de {maxParty} pessoas: ligue-nos para {SITE.phone}.</p>
            </Step>

            <Step n="02" title="Horário">
              {!day && <p className="text-muted-foreground">Escolha primeiro uma data.</p>}
              {day && loading && <p className="text-muted-foreground" aria-live="polite">A consultar disponibilidade…</p>}
              {loadErr && <p className="text-crimson">{loadErr}</p>}
              {day && !loading && slots && open.length === 0 && (
                <p className="text-muted-foreground">Sem horários disponíveis em {fmtDate(day)}. Experimente outro dia.</p>
              )}
              {day && !loading && open.length > 0 && (
                <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Horários disponíveis">
                  {slots!.map((s) => (
                    <button type="button" key={s.time} disabled={!s.available} role="radio" aria-checked={time === s.time} onClick={() => setTime(s.time)}
                      className={`min-w-20 border px-4 py-3 text-sm tracking-wider transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${time === s.time ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/25 hover:border-copper"}`}>
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </Step>

            <Step n="03" title="Os seus dados">
              <fieldset disabled={!time} className="grid gap-8 disabled:opacity-40 sm:grid-cols-2">
                <label className="block sm:col-span-2"><span className="eyebrow">Nome</span>
                  <input required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} /></label>
                <label className="block"><span className="eyebrow">Email</span>
                  <input required type="email" maxLength={255} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} /></label>
                <label className="block"><span className="eyebrow">Telefone</span>
                  <input required type="tel" pattern="[+\d\s()\-]{6,30}" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} /></label>
                <label className="block sm:col-span-2"><span className="eyebrow">Observações (opcional)</span>
                  <textarea rows={3} maxLength={1000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={field} placeholder="Alergias, ocasião especial, cadeira de bebé…" /></label>
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                <label className="flex items-start gap-3 text-sm sm:col-span-2">
                  <input required type="checkbox" checked={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.checked })} className="mt-1 accent-copper" />
                  <span>Aceito o tratamento dos meus dados para gestão desta reserva, nos termos da <Link to="/privacidade" className="underline">política de privacidade</Link>.</span>
                </label>
              </fieldset>
            </Step>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="sticky top-28 border border-charcoal/15 bg-card p-8">
              <p className="eyebrow">Resumo</p>
              <dl className="mt-6 space-y-4 text-sm">
                <Row k="Data" v={day ? fmtDate(day) : "—"} />
                <Row k="Hora" v={time ?? "—"} />
                <Row k="Pessoas" v={String(party)} />
              </dl>
              {submitErr && <p className="mt-6 text-sm text-crimson" role="alert">{submitErr}</p>}
              <button disabled={!time || submitting} className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40">
                {submitting ? "A enviar…" : "Confirmar reserva"}
              </button>
              <p className="mt-6 text-xs text-muted-foreground">Prefere falar connosco? <a href={SITE.phoneHref} className="underline">{SITE.phone}</a></p>
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t pt-8">
      <div className="mb-8 flex items-baseline gap-4"><span className="font-display text-3xl text-copper">{n}</span><h2 className="text-3xl">{title}</h2></div>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4 border-b border-charcoal/10 pb-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right capitalize">{v}</dd></div>;
}
