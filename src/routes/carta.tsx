import { createFileRoute, redirect } from "@tanstack/react-router";

// Rota antiga: redireciona permanentemente para /menu.
export const Route = createFileRoute("/carta")({
  beforeLoad: () => {
    throw redirect({ to: "/menu", statusCode: 301 });
  },
});
