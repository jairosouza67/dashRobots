
'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { CustomPatternModal } from "@/components/Breathing/CustomPatternModal";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import ImprovedBreathingCircle from "@/components/Breathing/ImprovedBreathingCircle";

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

async function updateStats(elapsedSec: number, patternUsed: string, user: any, updateUserProgress: any) {
  const total = Number(localStorage.getItem('rz_total_seconds') || '0') + elapsedSec;
  localStorage.setItem('rz_total_seconds', String(total));
  
  const breathingSessions = Number(localStorage.getItem('rz_breathing_sessions') || '0') + 1;
  localStorage.setItem('rz_breathing_sessions', String(breathingSessions));
  
  const totalSessions = Number(localStorage.getItem('rz_sessions_completed') || '0') + 1;
  localStorage.setItem('rz_sessions_completed', String(totalSessions));
  
  // Update streak
  const lastDay = localStorage.getItem('rz_last_day');
  const today = new Date().toDateString();
  let streak = Number(localStorage.getItem('rz_streak') || '0');
  if (lastDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = lastDay === yesterday ? streak + 1 : 1;
    localStorage.setItem('rz_last_day', today);
    localStorage.setItem('rz_streak', String(streak));
  }

  // Save to Firebase if user is logged in
  if (user && updateUserProgress) {
    try {
      await updateUserProgress({
        type: 'breathing',
        duration: elapsedSec,
        sessionId: patternUsed
      });
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }
}

export default function ImprovedBreathing() {
  const { user, updateUserProgress } = useAuth();
  const [patternKey, setPatternKey] = useState<keyof typeof PATTERNS>('box');
  const [customInhale, setCustomInhale] = useState(4);
  const [customHold, setCustomHold] = useState(4);
  const [customExhale, setCustomExhale] = useState(4);
  const [useCustomTiming, setUseCustomTiming] = useState(false);
  const [durations, setDurations] = useState<[number, number, number]>(PATTERNS[patternKey].durations);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPatterns, setCustomPatterns] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('rz_custom_patterns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bpm, setBpm] = useState(6);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inspire');
  const [remaining, setRemaining] = useState(durations[0]);
  const [elapsed, setElapsed] = useState(0);
  const [vibrate, setVibrate] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const startTs = useRef<number | null>(null);
  const phaseIndex = useRef(0);

  // Update durations when pattern or custom timing changes
  useEffect(() => {
    if (useCustomTiming) {
      setDurations([customInhale, customHold, customExhale]);
    } else {
      setDurations(PATTERNS[patternKey].durations);
    }
  }, [useCustomTiming, customInhale, customHold, customExhale, patternKey]);

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
        // Change phase
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

  const handleSavePattern = (pattern: any) => {
    const updated = [...customPatterns, pattern];
    setCustomPatterns(updated);
    localStorage.setItem('rz_custom_patterns', JSON.stringify(updated));
    setShowCustomModal(false);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (startTs.current) {
      const elapsedSec = Math.floor((Date.now() - startTs.current) / 1000);
      const currentPattern = useCustomTiming ? 'custom' : patternKey;
      updateStats(elapsedSec, currentPattern, user, updateUserProgress);
      startTs.current = null;
    }
  };

  const handleCircleClick = () => {
    if (!running) {
      setRunning(true);
    } else {
      stop();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: 'url(/water-background.jpg)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/50 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/70" />
      
      <SEO 
        title="RespiraZen — Sessão de Respiração" 
        description="Sessões de respiração guiada com ritmos box, 4-7-8 e coerência. Toque em Começar para respirar melhor." 
      />
      
      <div className="container mx-auto py-8 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Respiração Guiada
          </h1>
          <p className="text-gray-800 dark:text-gray-300 text-lg font-semibold mb-8">
            Escolha um padrão e aperte Começar. Opção de vibração para indicar mudanças de fase.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Controls Section */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 lg:order-1 space-y-6"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              {/* Custom Pattern Modal */}
              {showCustomModal && (
                <CustomPatternModal
                  onSave={handleSavePattern}
                  onClose={() => setShowCustomModal(false)}
                />
              )}

              {/* Breathing Configuration */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                  Configurações de Respiração
                </h3>
                
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Modo personalizado:
                  </Label>
                  <button 
                    onClick={() => setUseCustomTiming(!useCustomTiming)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useCustomTiming ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useCustomTiming ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {!useCustomTiming ? (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Padrão pré-definido
                    </Label>
                    <Select value={patternKey} onValueChange={(v) => setPatternKey(v as keyof typeof PATTERNS)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escolha um padrão" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PATTERNS).map(([key, p]) => (
                          <SelectItem key={key} value={key}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <Label className="text-sm font-medium text-green-800 dark:text-green-400 mb-2 block">
                        ⬆️ Inspirar: {customInhale}s
                      </Label>
                      <Slider 
                        value={[customInhale]} 
                        min={2} 
                        max={12} 
                        step={1} 
                        onValueChange={(v) => setCustomInhale(v[0])} 
                        className="w-full" 
                      />
                      <div className="flex justify-between text-xs text-green-600 dark:text-green-400 mt-1">
                        <span>2s</span>
                        <span>12s</span>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <Label className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2 block">
                        ⏸️ Segure: {customHold}s
                      </Label>
                      <Slider 
                        value={[customHold]} 
                        min={0} 
                        max={12} 
                        step={1} 
                        onValueChange={(v) => setCustomHold(v[0])} 
                        className="w-full" 
                      />
                      <div className="flex justify-between text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                        <span>0s</span>
                        <span>12s</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <Label className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2 block">
                        ⬇️ Expirar: {customExhale}s
                      </Label>
                      <Slider 
                        value={[customExhale]} 
                        min={2} 
                        max={12} 
                        step={1} 
                        onValueChange={(v) => setCustomExhale(v[0])} 
                        className="w-full" 
                      />
                      <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400 mt-1">
                        <span>2s</span>
                        <span>12s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* General Settings */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Respirações por minuto: {bpm}
                  </Label>
                  <Slider 
                    value={[bpm]} 
                    min={4} 
                    max={10} 
                    step={1} 
                    onValueChange={(v) => setBpm(v[0])} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>4 rpm</span>
                    <span>10 rpm</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Vibração
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Vibra ao mudar de fase
                    </p>
                  </div>
                  <button 
                    onClick={() => setVibrate((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      vibrate ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      vibrate ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Session Status */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-900 dark:text-purple-300 mb-2">
                  📊 Status da Sessão
                </h3>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  <div className="flex justify-between items-center">
                    <span>Tempo:</span>
                    <span className="font-mono font-medium">{formatTime(elapsed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fase atual:</span>
                    <span className="font-medium text-purple-800 dark:text-purple-200">{phaseLabel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Próxima mudança:</span>
                    <span className="font-mono font-medium">{remaining}s</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Breathing Circle Section */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <ImprovedBreathingCircle
              phase={phase}
              remaining={remaining}
              isRunning={running}
              onClick={handleCircleClick}
            />
          </motion.section>
        </div>
      </div>
    </div>
  );
}
