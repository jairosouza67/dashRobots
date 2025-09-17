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
  const [breathingSessions, setBreathingSessions] = useState(0);
  const [meditationSessions, setMeditationSessions] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    const load = () => {
      setStreak(Number(localStorage.getItem('rz_streak') || '0'));
      setTotal(Number(localStorage.getItem('rz_total_seconds') || '0'));
      setBreathingSessions(Number(localStorage.getItem('rz_breathing_sessions') || '0'));
      setMeditationSessions(Number(localStorage.getItem('rz_meditation_sessions') || '0'));
      setTotalSessions(Number(localStorage.getItem('rz_sessions_completed') || '0'));
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Estatísticas</h1>
        <p className="text-gray-600 mb-8">Acompanhe seu progresso e celebre suas conquistas em mindfulness.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Dias seguidos</CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{streak}</div>
              <p className="text-xs text-green-600 font-medium">Mantenha o ritmo diário</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700">Tempo total</CardTitle>
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-900">{formatTotal(total)}</div>
              <p className="text-xs text-cyan-600 font-medium">Somando respirações e meditações</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Sessões totais</CardTitle>
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{totalSessions}</div>
              <p className="text-xs text-purple-600 font-medium">Respirações e meditações completas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Sessões de respiração</CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{breathingSessions}</div>
              <p className="text-xs text-green-600 font-medium">Exercícios respiratórios completos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">Sessões de meditação</CardTitle>
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-900">{meditationSessions}</div>
              <p className="text-xs text-indigo-600 font-medium">Meditações completas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Meta sugerida</CardTitle>
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">5 min/dia</div>
              <p className="text-xs text-amber-600 font-medium">Pequenos passos, grande impacto</p>
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
