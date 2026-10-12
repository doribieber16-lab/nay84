import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Pending } from "@/components/site/PageHero";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/privacidade")({
  head: () => pageHead("Política de Privacidade — NAY84", "Como o NAY84 trata os dados pessoais recolhidos nas reservas."),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Política de privacidade." />
      <section className="pb-32"><div className="container-editorial max-w-3xl">
        <Pending>Texto RGPD (responsável pelo tratamento, finalidade, prazo de conservação e direitos dos titulares) a validar pelo restaurante.</Pending>
      </div></section>
    </>
  ),
});
