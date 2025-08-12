import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatTotal(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function Stats() {
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = () => {
      setStreak(Number(localStorage.getItem('rz_streak') || '0'));
      setTotal(Number(localStorage.getItem('rz_total_seconds') || '0'));
    };
    load();
    const i = setInterval(load, 1000);
    return () => clearInterval(i);
  }, []);

  const badges = [
    { id: 'first', label: 'Primeira sessão', unlocked: total > 0 },
    { id: '7days', label: '7 dias seguidos', unlocked: streak >= 7 },
    { id: '30min', label: '30 min totais', unlocked: total >= 30 * 60 },
    { id: '2h', label: '2 horas totais', unlocked: total >= 2 * 3600 },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SEO title="RespiraZen — Estatísticas" description="Acompanhe seu progresso: streaks, tempo total e conquistas." />
      <div className="container mx-auto py-10 space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Estatísticas</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Dias seguidos</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{streak}</div>
              <p className="text-sm text-muted-foreground">Mantenha o ritmo diário</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tempo total</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{formatTotal(total)}</div>
              <p className="text-sm text-muted-foreground">Somando respirações e meditações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Meta sugerida</CardTitle></CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">5 min/dia</div>
              <p className="text-sm text-muted-foreground">Pequenos passos, grande impacto</p>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-3">Conquistas</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.id} variant={b.unlocked ? 'default' : 'secondary'}>{b.label}</Badge>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
