// Dados institucionais do NAY84 — a confirmar com o restaurante antes da publicação.
export const SITE = {
  name: "NAY84",
  address: "Rua 1 de Dezembro 4D, Amadora, Portugal",
  phone: "+351 937 142 696",
  phoneHref: "tel:+351937142696",
  instagram: "@restaurante_nay84_pt",
  instagramHref: "https://www.instagram.com/restaurante_nay84_pt/",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Rua+1+de+Dezembro+4D+Amadora",
  mapsEmbed: "https://www.google.com/maps?q=Rua+1+de+Dezembro+4D,+Amadora&output=embed",
  hours: [
    { days: "Segunda-feira", time: "Encerrado" },
    { days: "Terça a sexta", time: "12h00–15h00 · 19h00–22h00" },
    { days: "Sábado e domingo", time: "12h00–22h00" },
  ],
};

export const NAV = [
  { to: "/carta", label: "A Carta" },
  { to: "/historia", label: "A Nossa História" },
  { to: "/experiencia", label: "A Experiência" },
  { to: "/contactos", label: "Contactos" },
] as const;

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
