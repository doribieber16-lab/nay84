import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="pb-20 pt-40 md:pb-28 md:pt-52">
      <div className="container-editorial">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="animate-rise mt-6 max-w-4xl text-5xl leading-[1.02] md:text-7xl lg:text-8xl" style={{ animationDelay: "120ms" }}>
          {title}
        </h1>
        {children && (
          <div className="animate-rise mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "240ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function Pending({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-copper/50 p-8 text-sm text-muted-foreground">
      <p className="eyebrow mb-3">Conteúdo a confirmar</p>
      {children}
    </div>
  );
}
