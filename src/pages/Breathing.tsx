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
  
  // Registrar sessão de respiração
  const breathingSessions = Number(localStorage.getItem('rz_breathing_sessions') || '0') + 1;
  localStorage.setItem('rz_breathing_sessions', String(breathingSessions));
  
  // Registrar sessão total
  const totalSessions = Number(localStorage.getItem('rz_sessions_completed') || '0') + 1;
  localStorage.setItem('rz_sessions_completed', String(totalSessions));
  
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
  const scale = phase === 'inspire' ? 1.15 : phase === 'segure' ? 1.0 : 0.85;

  const breathingMs = Math.round((60 / bpm) * 1000);

  const handleCircleClick = () => {
    if (!running) {
      setRunning(true);
    } else {
      stop();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: 'url(/water-background.jpg)'
        }}
      ></div>
      
      {/* Overlay gradiente para melhor legibilidade */}
       <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/50"></div>
      
      <SEO title="RespiraZen — Sessão de Respiração" description="Sessões de respiração guiada com ritmos box, 4-7-8 e coerência. Toque em Começar para respirar melhor." />
      <div className="container mx-auto py-8 px-6 relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Respiração Guiada</h1>
        <p className="text-gray-800 text-lg font-semibold mb-8">Escolha um padrão e aperte Começar. Opção de vibração para indicar mudanças de fase.</p>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">


          <section className="order-2 lg:order-1 space-y-6">

            <div className="space-y-4">
                {showCustomModal && (
                  <CustomPatternModal
                    onSave={handleSavePattern}
                    onClose={() => setShowCustomModal(false)}
                  />
                )}
                {customPatterns.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">Meus padrões</h3>
                    <ul className="mt-2 space-y-1">
                      {customPatterns.map((p, i) => (
                        <li key={i} className="text-sm text-gray-600">{p.name} ({p.inhale}-{p.hold}-{p.exhale}-{p.rest})</li>
                      ))}
                    </ul>
                  </div>
                )}

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Padrão</Label>
                <Select value={patternKey} onValueChange={(v) => setPatternKey(v as keyof typeof PATTERNS)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PATTERNS).map(([key, p]) => (
                      <SelectItem key={key} value={key}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Respirações por minuto: {bpm}</Label>
                <Slider value={[bpm]} min={4} max={10} step={1} onValueChange={(v) => setBpm(v[0])} className="w-full" />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Vibração:</Label>
                <button 
                  onClick={() => setVibrate((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    vibrate ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  aria-pressed={vibrate}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    vibrate ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div>Tempo: {formatTime(elapsed)} • Fase: <span className="font-medium text-gray-700">{phaseLabel}</span> • Próx.: {remaining}s</div>
              </div>


            </div>
          </section>

          <section className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative">
            <div
              className={`w-80 h-80 rounded-full transition-all duration-1000 flex items-center justify-center cursor-pointer shadow-2xl ${
                running
                  ? phase === 'inspire'
                    ? 'scale-110'
                    : phase === 'segure'
                    ? 'scale-110'
                    : phase === 'expire'
                    ? 'scale-90'
                    : 'scale-90'
                  : 'hover:scale-105'
              }`}
              onClick={handleCircleClick}
              style={{
                 background: running 
                   ? phase === 'inspire'
                     ? 'radial-gradient(circle, rgba(59, 130, 246, 0.95) 0%, rgba(147, 197, 253, 0.8) 50%, rgba(219, 234, 254, 0.6) 100%)'
                     : phase === 'segure'
                     ? 'radial-gradient(circle, rgba(168, 85, 247, 0.95) 0%, rgba(196, 181, 253, 0.8) 50%, rgba(233, 213, 255, 0.6) 100%)'
                     : phase === 'expire'
                     ? 'radial-gradient(circle, rgba(34, 197, 94, 0.95) 0%, rgba(134, 239, 172, 0.8) 50%, rgba(220, 252, 231, 0.6) 100%)'
                     : 'radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(147, 197, 253, 0.7) 50%, rgba(219, 234, 254, 0.5) 100%)'
                   : 'radial-gradient(circle, rgba(71, 85, 105, 0.9) 0%, rgba(148, 163, 184, 0.7) 50%, rgba(226, 232, 240, 0.5) 100%)'
               }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2 drop-shadow-2xl">
                  {running ? phaseLabel : 'Inspire'}
                </div>
                <div className="text-sm text-white/90 drop-shadow-lg font-medium">
                  {running ? '' : 'Clique em Iniciar para começar'}
                </div>
              </div>
            </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
