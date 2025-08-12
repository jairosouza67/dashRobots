import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-breath.jpg";

const Index = () => {
  return (
    <main>
      <SEO
        title="RespiraZen — Respiração Guiada e Meditações Curtas"
        description="Respiração guiada com animações e meditações de 1 a 5 minutos. Acalme-se em instantes com sons ambientes e lembretes."
        canonical="https://dee8e0b5-6fae-437f-832b-1a7bfb719b7b.lovableproject.com/"
      />

      <section className="container mx-auto py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <article className="space-y-6 animate-enter">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Respiração Guiada e Meditação, em 1 minuto</h1>
          <p className="text-lg text-muted-foreground">Reduza ansiedade, foque melhor e durma com mais facilidade. Sessões simples, vibração opcional e sons ambientes relaxantes.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/respirar"><Button variant="hero" size="xl" className="hover-scale">Começar a Respirar</Button></Link>
            <Link to="/meditacoes"><Button variant="secondary" size="lg">Meditações</Button></Link>
          </div>
          <ul className="grid sm:grid-cols-3 gap-3 pt-2">
            <li className="rounded-lg border p-4 bg-secondary/40"><span className="block text-sm font-medium">Sessões curtas</span><span className="text-xs text-muted-foreground">1–5 min</span></li>
            <li className="rounded-lg border p-4 bg-secondary/40"><span className="block text-sm font-medium">Sons ambientes</span><span className="text-xs text-muted-foreground">chuva, vento</span></li>
            <li className="rounded-lg border p-4 bg-secondary/40"><span className="block text-sm font-medium">Estatísticas</span><span className="text-xs text-muted-foreground">streak e tempo</span></li>
          </ul>
        </article>
        <aside className="relative">
          <img
            src={hero}
            alt="Gradiente sereno com ondas que evocam respiração calma"
            className="w-full h-auto rounded-xl border shadow-[var(--shadow-elegant)]"
            loading="lazy"
          />
        </aside>
      </section>
    </main>
  );
};

export default Index;
