import { useEffect, useMemo, useRef, useState } from "react";
import { CustomPatternModal } from "@/components/Breathing/CustomPatternModal";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

 type Phase = 'inspire' | 'segure' | 'expire';

 const PATTERNS = {
  box: { label: 'Box 4-4-4-4', durations: [4, 4, 4] as [number, number, number] },
  quatroSeteOito: { label: '4-7-8', durations: [4, 7, 8] as [number, number, number] },
  coeren: { label: 'Coerência 5-5-5', durations: [5, 5, 5] as [number, number, number] },
 } as const;

 function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString();
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
 }

 function updateStats(elapsedSec: number) {
  const total = Number(localStorage.getItem('rz_total_seconds') || '0') + elapsedSec;
  localStorage.setItem('rz_total_seconds', String(total));
  const lastDay = localStorage.getItem('rz_last_day');
  const today = new Date().toDateString();
  let streak = Number(localStorage.getItem('rz_streak') || '0');
  if (lastDay !== today) {
    // simple streak calc: if yesterday, keep, else reset to 1
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = lastDay === yesterday ? streak + 1 : 1;
    localStorage.setItem('rz_last_day', today);
    localStorage.setItem('rz_streak', String(streak));
  }
 }

 export default function Breathing() {
  const [patternKey, setPatternKey] = useState<keyof typeof PATTERNS>('box');
  const durations = PATTERNS[patternKey].durations; // [inspire, segure, expire]
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPatterns, setCustomPatterns] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rz_custom_patterns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSavePattern = (pattern: any) => {
    const updated = [...customPatterns, pattern];
    setCustomPatterns(updated);
    localStorage.setItem('rz_custom_patterns', JSON.stringify(updated));
    setShowCustomModal(false);
  };
  const [bpm, setBpm] = useState(6); // breaths per minute visual pacing (for ring animation smoothness)
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inspire');
  const [remaining, setRemaining] = useState(durations[0]);
  const [elapsed, setElapsed] = useState(0);
  const [vibrate, setVibrate] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const startTs = useRef<number | null>(null);
  const phaseIndex = useRef(0);

  const phaseLabel = useMemo(() => {
    if (phase === 'inspire') return 'Inspire';
    if (phase === 'segure') return 'Segure';
    return 'Expire';
  }, [phase]);

  useEffect(() => {
    setRemaining(durations[0]);
    setPhase('inspire');
    phaseIndex.current = 0;
  }, [durations]);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setRemaining((prev) => {
        if (prev > 1) return prev - 1;
        // change phase
        const order: Phase[] = ['inspire', 'segure', 'expire'];
        const nextIdx = (phaseIndex.current + 1) % order.length;
        phaseIndex.current = nextIdx;
        const nextPhase = order[nextIdx];
        setPhase(nextPhase);
        const nextDur = durations[nextIdx];
        if (vibrate && navigator.vibrate) navigator.vibrate(30);
        return nextDur;
      });
      setElapsed((e) => e + 1);
    };
    intervalRef.current = window.setInterval(tick, 1000);
    if (!startTs.current) startTs.current = Date.now();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, durations, vibrate]);

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (startTs.current) {
      const elapsedSec = Math.floor((Date.now() - startTs.current) / 1000);
      updateStats(elapsedSec);
      startTs.current = null;
    }
  };

  const radius = 120;
  const baseScale = 0.85;
  const scale = phase === 'inspire' ? 1.0 : phase === 'segure' ? 0.95 : 0.85;

  const breathingMs = Math.round((60 / bpm) * 1000);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <SEO title="RespiraZen — Sessão de Respiração" description="Sessões de respiração guiada com ritmos box, 4-7-8 e coerência. Toque em Começar para respirar melhor." />
      <div className="container mx-auto py-10 grid lg:grid-cols-2 gap-10 items-center">
        <section className="order-2 lg:order-1 space-y-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">Respiração Guiada</h1>
          <p className="text-muted-foreground">Escolha um padrão e aperte Começar. Opção de vibração para indicar mudanças de fase.</p>

          <div className="mb-4">
            <button onClick={() => setShowCustomModal(true)} className="btn btn-primary">Criar padrão personalizado</button>
            {showCustomModal && (
              <CustomPatternModal
                onSave={handleSavePattern}
                onClose={() => setShowCustomModal(false)}
              />
            )}
            {customPatterns.length > 0 && (
              <div className="mt-4">
                <h3>Meus padrões</h3>
                <ul>
                  {customPatterns.map((p, i) => (
                    <li key={i}>{p.name} ({p.inhale}-{p.hold}-{p.exhale}-{p.rest})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Padrão</Label>
              <Select value={patternKey} onValueChange={(v) => setPatternKey(v as keyof typeof PATTERNS)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PATTERNS).map(([key, p]) => (
                    <SelectItem key={key} value={key}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Respirações por minuto: {bpm}</Label>
              <Slider value={[bpm]} min={4} max={10} step={1} onValueChange={(v) => setBpm(v[0])} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!running ? (
              <Button variant="hero" size="xl" onClick={() => setRunning(true)} className="hover-scale">Começar</Button>
            ) : (
              <Button variant="secondary" size="xl" onClick={stop}>Encerrar</Button>
            )}
            <Button variant="soft" onClick={() => setVibrate((v) => !v)} aria-pressed={vibrate}>
              Vibração: {vibrate ? 'Ativa' : 'Desativada'}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">Tempo: {formatTime(elapsed)} • Fase: <span className="font-medium text-foreground">{phaseLabel}</span> • Próx.: {remaining}s</div>
        </section>

        <section className="order-1 lg:order-2 flex items-center justify-center">
          <div
            className="relative h-[320px] w-[320px] md:h-[380px] md:w-[380px] rounded-full border border-primary/20 bg-gradient-primary shadow-[var(--shadow-elegant)] transition-transform"
            style={{
              transform: `scale(${scale})`,
              transition: `transform ${breathingMs}ms ease-in-out`,
            }}
            aria-label={`Círculo respiratório. Fase atual: ${phaseLabel}`}
          >
            <div className="absolute inset-6 rounded-full border-2 border-primary/30" />
            <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ backgroundImage: 'var(--gradient-primary)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-medium">{phaseLabel}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
 }
