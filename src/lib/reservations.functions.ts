import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const getSlots = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ day: dateStr, party: z.number().int().min(1).max(50) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: slots, error }, { data: settings }] = await Promise.all([
      supabaseAdmin.rpc("get_available_slots", { _day: data.day, _party: data.party }),
      supabaseAdmin.from("restaurant_settings").select("max_party").eq("id", 1).single(),
    ]);
    if (error) throw new Error("Não foi possível consultar a disponibilidade.");
    return {
      maxParty: settings?.max_party ?? 10,
      slots: (slots ?? []).map((s) => ({ time: String(s.slot).slice(0, 5), available: !!s.available })),
    };
  });

const ReservationInput = z.object({
  day: dateStr,
  time: z.string().regex(/^\d{2}:\d{2}$/),
  party: z.number().int().min(1).max(50),
  name: z.string().trim().min(2, "Indique o seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().regex(/^[+\d\s()-]{6,30}$/, "Telefone inválido"),
  notes: z.string().trim().max(1000).optional().default(""),
  privacy: z.literal(true),
  website: z.string().max(0).optional(), // honeypot
});

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ReservationInput.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("create_reservation", {
      _day: data.day,
      _slot: data.time,
      _party: data.party,
      _name: data.name,
      _email: data.email,
      _phone: data.phone,
      _notes: data.notes,
      _privacy: data.privacy,
    });
    if (error) {
      const m = error.message;
      if (m.includes("slot_unavailable")) return { ok: false as const, error: "Este horário acabou de ficar indisponível. Escolha outro, por favor." };
      if (m.includes("duplicate")) return { ok: false as const, error: "Já existe uma reserva com este email para este horário." };
      return { ok: false as const, error: "Não foi possível registar a reserva. Tente novamente ou ligue-nos." };
    }
    const row = rows?.[0];
    return { ok: true as const, id: row?.id ?? "", status: row?.status ?? "pendente" };
  });
