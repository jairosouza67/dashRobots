import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Ambient {
  key: 'chuva' | 'vento';
  label: string;
}

const AMBIENTS: Ambient[] = [
  { key: 'chuva', label: 'Chuva suave' },
  { key: 'vento', label: 'Vento calmo' },
];

const SESSOES = [
  { id: 'foco', label: 'Foco (3 min)', minutos: 3 },
  { id: 'relax', label: 'Relaxamento (5 min)', minutos: 5 },
  { id: 'sono', label: 'Sono (4 min)', minutos: 4 },
];

function speak(text: string, lang = 'pt-BR', rate = 1) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  window.speechSynthesis.speak(u);
}

function updateStats(minutos: number) {
  const total = Number(localStorage.getItem('rz_total_seconds') || '0') + minutos * 60;
  localStorage.setItem('rz_total_seconds', String(total));
  const lastDay = localStorage.getItem('rz_last_day');
  const today = new Date().toDateString();
  let streak = Number(localStorage.getItem('rz_streak') || '0');
  if (lastDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    streak = lastDay === yesterday ? streak + 1 : 1;
    localStorage.setItem('rz_last_day', today);
    localStorage.setItem('rz_streak', String(streak));
  }
}

export default function Meditations() {
  const [sessao, setSessao] = useState(SESSOES[0].id);
  const [executando, setExecutando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(SESSOES[0].minutos * 60);
  const [ambienteAtivo, setAmbienteAtivo] = useState<Record<string, boolean>>({});
  const [volume, setVolume] = useState<Record<string, number>>({ chuva: 0.3, vento: 0.25 });
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { source: AudioBufferSourceNode; gain: GainNode; filter?: BiquadFilterNode }>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const s = SESSOES.find((x) => x.id === sessao)!;
    setTempoRestante(s.minutos * 60);
  }, [sessao]);

  useEffect(() => {
    return () => stop();
  }, []);

  const createNoiseBuffer = (duration = 2) => {
    const ctx = ctxRef.current!;
    const buffer = ctx.createBuffer(1, duration * ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1; // white noise
    }
    return buffer;
  };

  const toggleAmbient = (key: string) => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = ctxRef.current;
    const existing = nodesRef.current[key];
    if (existing) {
      existing.source.stop();
      existing.source.disconnect();
      existing.gain.disconnect();
      existing.filter?.disconnect();
      delete nodesRef.current[key];
      setAmbienteAtivo((a) => ({ ...a, [key]: false }));
      return;
    }

    // create looped noise with optional filter profile
    const source = ctx.createBufferSource();
    source.buffer = createNoiseBuffer(3);
    source.loop = true;

    let node: AudioNode = source;
    let filter: BiquadFilterNode | undefined;
    if (key === 'chuva') {
      filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 0.8;
      node.connect(filter);
      node = filter;
    }
    if (key === 'vento') {
      filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 0.5;
      node.connect(filter);
      node = filter;
    }

    const gain = ctx.createGain();
    gain.gain.value = volume[key] ?? 0.25;
    node.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    nodesRef.current[key] = { source, gain, filter };
    setAmbienteAtivo((a) => ({ ...a, [key]: true }));
  };

  const setAmbientVolume = (key: string, value: number) => {
    setVolume((v) => ({ ...v, [key]: value }));
    const n = nodesRef.current[key];
    if (n) n.gain.gain.value = value;
  };

  const start = () => {
    setExecutando(true);
    const minutos = SESSOES.find((x) => x.id === sessao)!.minutos;
    setTempoRestante(minutos * 60);

    // roteiro simples
    speak('Encontre uma postura confortável. Vamos começar sua meditação.');
    setTimeout(() => speak('Inspire pelo nariz... solte devagar pela boca.'), 2000);
    setTimeout(() => speak('Observe o ar entrando e saindo. Se pensamentos surgirem, apenas deixe passar.'), 10000);

    timerRef.current = window.setInterval(() => {
      setTempoRestante((t) => {
        if (t <= 1) {
          stop();
          speak('Encerrando. Leve essa calma com você.');
          updateStats(minutos);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const stop = () => {
    setExecutando(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (ctxRef.current) {
      Object.values(nodesRef.current).forEach((n) => {
        try { n.source.stop(); } catch {}
        n.source.disconnect();
        n.gain.disconnect();
        n.filter?.disconnect();
      });
      nodesRef.current = {};
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SEO title="RespiraZen — Meditações Curtas" description="Meditações guiadas por voz de 1 a 5 minutos com sons ambientes gerados no app." />
      <div className="container mx-auto py-10 grid lg:grid-cols-2 gap-10 items-start">
        <section className="space-y-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">Meditações Curtas</h1>
          <p className="text-muted-foreground">Escolha uma sessão, ative sons ambientes e aperte Iniciar.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sessão</Label>
              <Select value={sessao} onValueChange={setSessao}>
                <SelectTrigger><SelectValue placeholder="Escolha" /></SelectTrigger>
                <SelectContent>
                  {SESSOES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!executando ? (
              <Button variant="hero" size="lg" onClick={start}>Iniciar</Button>
            ) : (
              <Button variant="secondary" size="lg" onClick={stop}>Parar</Button>
            )}
            <div className="text-sm text-muted-foreground">Tempo restante: {Math.floor(tempoRestante/60)}:{String(tempoRestante%60).padStart(2,'0')}</div>
          </div>
        </section>

        <aside className="space-y-6">
          <h2 className="text-xl font-semibold">Sons ambientes</h2>
          <div className="space-y-4">
            {AMBIENTS.map(({ key, label }) => (
              <div key={key} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{label}</div>
                  <Button variant={ambienteAtivo[key] ? 'secondary' : 'soft'} onClick={() => toggleAmbient(key)}>
                    {ambienteAtivo[key] ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
                <div className="mt-3 space-y-2">
                  <Label>Volume</Label>
                  <Slider value={[volume[key] ?? 0.25]} min={0} max={1} step={0.01} onValueChange={(v) => setAmbientVolume(key, v[0])} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border p-4 bg-secondary/50">
            <p className="text-sm text-muted-foreground">Dica: ative o modo Não Perturbe no celular para uma experiência mais calma.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
