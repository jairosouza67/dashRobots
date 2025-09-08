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

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Moon, Focus, Zap } from "lucide-react";

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
    const sessaoAtual = SESSOES.find((x) => x.id === sessao)!;
    const minutos = sessaoAtual.minutos;
    setTempoRestante(minutos * 60);

    // Roteiro híbrido ou tradicional
    if (sessaoAtual.type === 'hybrid' && ROTEIROS_HIBRIDOS[sessao as keyof typeof ROTEIROS_HIBRIDOS]) {
      const roteiro = ROTEIROS_HIBRIDOS[sessao as keyof typeof ROTEIROS_HIBRIDOS];
      
      // Introdução
      speak(roteiro.intro);
      
      // Fases programadas
      roteiro.fases.forEach((fase) => {
        setTimeout(() => {
          if (executando) speak(fase.texto);
        }, fase.tempo * 1000);
      });
      
      // Encerramento programado
      setTimeout(() => {
        if (executando) speak(roteiro.encerramento);
      }, (minutos * 60 - 10) * 1000);
    } else {
      // Roteiro tradicional simples
      speak('Encontre uma postura confortável. Vamos começar sua meditação.');
      setTimeout(() => speak('Inspire pelo nariz... solte devagar pela boca.'), 2000);
      setTimeout(() => speak('Observe o ar entrando e saindo. Se pensamentos surgirem, apenas deixe passar.'), 10000);
    }

    timerRef.current = window.setInterval(() => {
      setTempoRestante((t) => {
        if (t <= 1) {
          stop();
          speak('Encerrando. Leve essa calma e clareza com você.');
          updateStats(minutos);
          // Atualizar estatísticas específicas
          const meditationSessions = Number(localStorage.getItem('rz_meditation_sessions') || '0') + 1;
          localStorage.setItem('rz_meditation_sessions', String(meditationSessions));
          const totalSessions = Number(localStorage.getItem('rz_sessions_completed') || '0') + 1;
          localStorage.setItem('rz_sessions_completed', String(totalSessions));
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
      <SEO title="RespiraZen — Meditações Híbridas" description="Meditações guiadas com técnicas híbridas de neuroplasticidade e mindfulness." />
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Meditações Híbridas</h1>
          <p className="text-muted-foreground">
            Técnicas avançadas que combinam mindfulness, neuroplasticidade e ancoragem neural.
          </p>
        </div>

        <Tabs defaultValue="sessoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessoes">Sessões</TabsTrigger>
            <TabsTrigger value="ambientes">Sons Ambientes</TabsTrigger>
          </TabsList>

          <TabsContent value="sessoes" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SESSOES.map((s) => {
                const Icon = s.icon;
                return (
                  <Card 
                    key={s.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      sessao === s.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSessao(s.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-primary" />
                        <Badge variant={s.type === 'hybrid' ? 'default' : 'secondary'}>
                          {s.type === 'hybrid' ? 'Híbrida' : 'Tradicional'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{s.label}</CardTitle>
                      <CardDescription>{s.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Duração: {s.minutos} minutos
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {s.techniques.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {!executando ? (
                <Button variant="hero" size="lg" onClick={start} className="min-w-[120px]">
                  Iniciar Sessão
                </Button>
              ) : (
                <Button variant="secondary" size="lg" onClick={stop} className="min-w-[120px]">
                  Parar
                </Button>
              )}
              
              {executando && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm text-muted-foreground">
                    Tempo restante: {Math.floor(tempoRestante/60)}:{String(tempoRestante%60).padStart(2,'0')}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ambientes" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {AMBIENTS.map(({ key, label }) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button 
                        variant={ambienteAtivo[key] ? 'default' : 'outline'} 
                        onClick={() => toggleAmbient(key)}
                        className="min-w-[100px]"
                      >
                        {ambienteAtivo[key] ? 'Ativo' : 'Ativar'}
                      </Button>
                      {ambienteAtivo[key] && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Volume: {Math.round((volume[key] ?? 0.25) * 100)}%</Label>
                      <Slider 
                        value={[volume[key] ?? 0.25]} 
                        min={0} 
                        max={1} 
                        step={0.01} 
                        onValueChange={(v) => setAmbientVolume(key, v[0])} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dicas para Sons Ambientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Use fones de ouvido para uma experiência mais imersiva</p>
                  <p>• Ajuste o volume para que seja sutil, não dominante</p>
                  <p>• Experimente diferentes combinações para encontrar sua preferência</p>
                  <p>• Os sons podem ajudar a mascarar ruídos externos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Expandindo as sessões com conteúdo híbrido
const SESSOES = [
  { 
    id: 'foco', 
    label: 'Foco Profundo', 
    minutos: 5, 
    icon: Focus,
    description: 'Desenvolva concentração e clareza mental',
    type: 'hybrid',
    techniques: ['respiração', 'visualização', 'ancoragem']
  },
  { 
    id: 'relax', 
    label: 'Relaxamento Ativo', 
    minutos: 7, 
    icon: Heart,
    description: 'Libere tensões e restaure energia',
    type: 'hybrid',
    techniques: ['body scan', 'respiração', 'sons ambientes']
  },
  { 
    id: 'sono', 
    label: 'Preparação para o Sono', 
    minutos: 10, 
    icon: Moon,
    description: 'Acalme a mente para um sono reparador',
    type: 'traditional',
    techniques: ['respiração lenta', 'relaxamento progressivo']
  },
  {
    id: 'reprogramacao',
    label: 'Reprogramação Mental',
    minutos: 8,
    icon: Brain,
    description: 'Transforme padrões mentais limitantes',
    type: 'hybrid',
    techniques: ['afirmações', 'visualização', 'ancoragem neural']
  },
  {
    id: 'energia',
    label: 'Ativação Energética',
    minutos: 6,
    icon: Zap,
    description: 'Desperte vitalidade e motivação',
    type: 'hybrid',
    techniques: ['respiração energizante', 'movimento sutil', 'intenção']
  }
];

// Roteiros híbridos expandidos
const ROTEIROS_HIBRIDOS = {
  foco: {
    intro: "Vamos desenvolver seu foco com técnicas híbridas de concentração.",
    fases: [
      { tempo: 30, texto: "Feche os olhos e respire naturalmente. Sinta seu corpo se acomodando." },
      { tempo: 60, texto: "Agora, imagine uma luz dourada no centro da sua testa. Essa é sua luz de foco." },
      { tempo: 90, texto: "A cada inspiração, essa luz fica mais brilhante. A cada expiração, ela se expande." },
      { tempo: 120, texto: "Quando pensamentos surgirem, simplesmente os observe e retorne à luz dourada." },
      { tempo: 180, texto: "Sinta como essa luz representa sua capacidade natural de concentração." },
      { tempo: 240, texto: "Agora, ancoremos esse estado. Pressione suavemente o polegar e indicador direitos." },
      { tempo: 270, texto: "Essa é sua âncora de foco. Use-a sempre que precisar de concentração." }
    ],
    encerramento: "Lentamente, abra os olhos mantendo essa sensação de clareza e foco."
  },
  reprogramacao: {
    intro: "Vamos reprogramar padrões mentais com técnicas de neuroplasticidade.",
    fases: [
      { tempo: 45, texto: "Respire profundamente e conecte-se com sua intenção de mudança." },
      { tempo: 90, texto: "Identifique um padrão que você deseja transformar. Apenas observe, sem julgamento." },
      { tempo: 150, texto: "Agora, visualize como você gostaria de ser. Veja-se agindo de forma nova e positiva." },
      { tempo: 210, texto: "Repita mentalmente: 'Eu escolho pensamentos que me fortalecem e me elevam.'" },
      { tempo: 270, texto: "Sinta essa nova versão de você se integrando em cada célula do seu corpo." },
      { tempo: 330, texto: "Crie uma âncora: toque o coração e diga 'Eu sou capaz de mudança positiva.'" },
      { tempo: 390, texto: "Essa transformação já começou. Confie no processo natural da sua mente." }
    ],
    encerramento: "Abra os olhos sabendo que plantou sementes de transformação positiva."
  },
  energia: {
    intro: "Vamos ativar sua energia vital com respiração e movimento consciente.",
    fases: [
      { tempo: 30, texto: "Sente-se ereto, coluna alinhada. Respire profundamente pelo nariz." },
      { tempo: 60, texto: "Inspire contando até 4, segure por 4, expire por 6. Sinta a energia circulando." },
      { tempo: 120, texto: "Mova suavemente os ombros para cima e para baixo, liberando tensões." },
      { tempo: 180, texto: "Imagine energia dourada subindo pela sua coluna a cada inspiração." },
      { tempo: 240, texto: "Essa energia se espalha por todo seu corpo, vitalizando cada célula." },
      { tempo: 300, texto: "Sorria suavemente. Sinta gratidão por essa vitalidade natural." }
    ],
    encerramento: "Abra os olhos sentindo-se energizado e pronto para o dia."
  }
};
