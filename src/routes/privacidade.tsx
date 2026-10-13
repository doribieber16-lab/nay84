import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { pageHead, SITE } from "@/lib/site";

export const Route = createFileRoute("/privacidade")({
  head: () => pageHead("Política de Privacidade — NAY84", "Como o NAY84 trata os dados pessoais recolhidos nas reservas, nos termos do RGPD."),
  component: Privacidade,
});

const SECTIONS = [
  ["Responsável pelo tratamento", `Restaurante NAY84, ${SITE.address}. Contacto: ${SITE.phone}.`],
  ["Dados recolhidos", "Nome, email, telefone, data e hora da reserva, número de pessoas e as observações que decidir partilhar (por exemplo, alergias)."],
  ["Finalidade", "Os dados são usados exclusivamente para gerir a sua reserva e contactá-lo sobre a mesma. Não são usados para marketing sem o seu consentimento expresso."],
  ["Fundamento", "Execução de diligências pré-contratuais a seu pedido (art. 6.º, n.º 1, al. b) do RGPD) e o seu consentimento."],
  ["Conservação", "Os dados são conservados apenas durante o tempo necessário à gestão da reserva e ao cumprimento de obrigações legais."],
  ["Os seus direitos", "Pode pedir acesso, retificação, apagamento, limitação ou portabilidade dos seus dados, bem como opor-se ao tratamento, contactando o restaurante. Pode ainda apresentar reclamação à CNPD (www.cnpd.pt)."],
  ["Cookies", "Este website não utiliza cookies de publicidade nem de análise. Apenas são usados mecanismos técnicos essenciais ao funcionamento do site."],
];

function Privacidade() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Política de privacidade." />
      <section className="pb-32">
        <div className="container-editorial max-w-3xl space-y-10">
          {SECTIONS.map(([t, p]) => (
            <div key={t} className="border-t pt-6">
              <h2 className="text-3xl">{t}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{p}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Texto base a validar pelo restaurante antes da publicação.</p>
        </div>
      </section>
    </>
  );
}
