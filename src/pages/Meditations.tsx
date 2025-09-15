import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Moon, Focus, Zap, Music, Upload, Settings } from "lucide-react";

interface Ambient {
  key: 'chuva' | 'vento';
  label: string;
}

interface CustomAudio {
  type: 'youtube' | 'mp3' | 'none';
  url: string;
  volume: number;
}

const AMBIENTS: Ambient[] = [
  { key: 'chuva', label: 'Chuva suave' },
  { key: 'vento', label: 'Vento calmo' },
];

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
  },
  relax: {
    intro: "Vamos liberar tensões com técnicas de relaxamento ativo.",
    fases: [
      { tempo: 30, texto: "Respire profundamente e sinta seu corpo se acomodando." },
      { tempo: 60, texto: "Comece pelos pés. Tensione por 3 segundos, depois relaxe completamente." },
      { tempo: 120, texto: "Agora as pernas. Tensione... e relaxe. Sinta a diferença." },
      { tempo: 180, texto: "Continue pelo abdômen, peito, braços. Tensione e relaxe cada parte." },
      { tempo: 240, texto: "Finalmente, o rosto e pescoço. Tensione... e relaxe profundamente." },
      { tempo: 300, texto: "Sinta todo seu corpo relaxado, como se estivesse flutuando." },
      { tempo: 360, texto: "Respire naturalmente, aproveitando essa sensação de paz total." }
    ],
    encerramento: "Abra os olhos lentamente, mantendo essa sensação de relaxamento."
  }
};

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
  const [isPaused, setIsPaused] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(SESSOES[0].minutos * 60);
  const [duracaoAudio, setDuracaoAudio] = useState<number | null>(null); // Duração do áudio em segundos
  const [ambienteAtivo, setAmbienteAtivo] = useState<Record<string, boolean>>({});
  const [volume, setVolume] = useState<Record<string, number>>({ chuva: 0.3, vento: 0.25 });
  const [customAudio, setCustomAudio] = useState<Record<string, CustomAudio>>({});
  const [audioConfigOpen, setAudioConfigOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');
  const customAudioRef = useRef<HTMLAudioElement | HTMLIFrameElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { source: AudioBufferSourceNode; gain: GainNode; filter?: BiquadFilterNode }>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const s = SESSOES.find((x) => x.id === sessao)!;
    setTempoRestante(s.minutos * 60);
    setDuracaoAudio(null); // Reset da duração quando trocar de sessão
  }, [sessao]);

  // Efeito para atualizar o tempo quando a duração do áudio for detectada
  useEffect(() => {
    if (duracaoAudio && executando && !isPaused) {
      console.log(`Ajustando cronômetro para duração do áudio: ${duracaoAudio} segundos`);
      setTempoRestante(duracaoAudio);
    }
  }, [duracaoAudio, executando, isPaused]);

  useEffect(() => {
    // Carregar configurações de áudio personalizadas salvas
    const loadedCustomAudio: Record<string, CustomAudio> = {};
    SESSOES.forEach(sessao => {
      const saved = localStorage.getItem(`rz_custom_audio_${sessao.id}`);
      if (saved) {
        try {
          loadedCustomAudio[sessao.id] = JSON.parse(saved);
        } catch (e) {
          console.error('Erro ao carregar áudio personalizado:', e);
        }
      }
    });
    setCustomAudio(loadedCustomAudio);

    // Listener para mensagens do YouTube
    const handleYouTubeMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'video-progress') {
          console.log('YouTube player update:', data);
        }
      } catch (e) {
        // Ignorar mensagens que não são JSON
      }
    };

    window.addEventListener('message', handleYouTubeMessage);

    return () => {
      stop();
      window.removeEventListener('message', handleYouTubeMessage);
    };
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

  const saveCustomAudio = (sessionId: string, audioConfig: CustomAudio) => {
    setCustomAudio(prev => ({ ...prev, [sessionId]: audioConfig }));
    localStorage.setItem(`rz_custom_audio_${sessionId}`, JSON.stringify(audioConfig));
  };

  const loadCustomAudio = (sessionId: string): CustomAudio => {
    const saved = localStorage.getItem(`rz_custom_audio_${sessionId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return { type: 'none', url: '', volume: 0.5 };
  };

  const playCustomAudio = (sessionId: string) => {
    const audioConfig = customAudio[sessionId] || loadCustomAudio(sessionId);
    if (audioConfig.type === 'none' || !audioConfig.url) return;

    // Parar a sessão principal se estiver executando
    if (executando) {
      setExecutando(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Removido: Parar áudio padrão (speechSynthesis) - não usado mais
    // window.speechSynthesis.cancel();

    // Parar todos os áudios ambientes quando áudio personalizado for reproduzido
    Object.values(nodesRef.current).forEach((node) => {
      try {
        node.source.stop();
        node.source.disconnect();
        node.gain.disconnect();
        if (node.filter) node.filter.disconnect();
      } catch (e) {
        // Ignorar erros se o nó já foi parado
      }
    });
    nodesRef.current = {};
    setAmbienteAtivo({});

    // Parar áudio anterior se estiver tocando
    if (customAudioRef.current) {
      if (customAudioRef.current instanceof HTMLAudioElement) {
        customAudioRef.current.pause();
      } else if (customAudioRef.current instanceof HTMLIFrameElement) {
        // Remover iframe do YouTube
        try {
          document.body.removeChild(customAudioRef.current);
        } catch (e) {
          console.warn('Erro ao remover iframe anterior:', e);
        }
      }
      customAudioRef.current = null;
    }

    if (audioConfig.type === 'youtube') {
      // Para YouTube, extrair apenas o áudio usando iframe invisível otimizado
      const videoId = extractYouTubeId(audioConfig.url);
      if (videoId) {
        try {
          // Criar iframe invisível com configurações específicas para áudio
          const iframe = document.createElement('iframe');
          iframe.style.position = 'absolute';
          iframe.style.left = '-9999px';
          iframe.style.top = '-9999px';
          iframe.style.width = '1px';
          iframe.style.height = '1px';
          iframe.style.opacity = '0';
          iframe.style.visibility = 'hidden';
          iframe.style.pointerEvents = 'none';
          iframe.allow = 'autoplay; encrypted-media';
          iframe.setAttribute('allowfullscreen', 'false');
          
          // URL otimizada para reprodução de áudio apenas
          const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&disablekb=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&start=0`;
          
          iframe.src = youtubeUrl;
          
          // Adicionar listener para detectar duração do YouTube
          const handleYouTubeMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://www.youtube.com') return;
            try {
              const data = JSON.parse(event.data);
              if (data.event === 'video-progress' && data.info && data.info.duration) {
                const duration = Math.round(data.info.duration);
                console.log('Duração do YouTube detectada:', duration, 'segundos');
                setDuracaoAudio(duration);
              }
            } catch (e) {
              // Ignorar mensagens que não são JSON válido
            }
          };
          
          window.addEventListener('message', handleYouTubeMessage);
          
          // Limpar listener após 10 segundos (fallback)
          setTimeout(() => {
            window.removeEventListener('message', handleYouTubeMessage);
            // Se não conseguiu detectar a duração, usar tempo padrão da sessão
            if (!duracaoAudio) {
              console.log('Não foi possível detectar duração do YouTube, usando tempo padrão');
            }
          }, 10000);
          
          // Adicionar ao DOM como elemento invisível
          document.body.appendChild(iframe);
          
          // Salvar referência
          customAudioRef.current = iframe;
          
          console.log('YouTube áudio invisível configurado');
          
        } catch (error) {
          console.error('Erro ao configurar áudio do YouTube:', error);
          alert('Erro ao configurar o áudio do YouTube. Considerações: 1) Alguns vídeos têm restrições de reprodução. 2) Use um arquivo MP3 direto para controle total.');
        }
      } else {
        alert('URL do YouTube inválida. Formatos aceitos: youtube.com/watch?v=ID ou youtu.be/ID');
      }
    } else if (audioConfig.type === 'mp3') {
      // Para MP3, criar elemento audio
      try {
        const audio = new Audio(audioConfig.url);
        audio.volume = audioConfig.volume;
        audio.loop = true;
        audio.crossOrigin = 'anonymous';
        
        audio.addEventListener('loadedmetadata', () => {
          console.log('Áudio MP3 carregado com sucesso');
          if (audio.duration && isFinite(audio.duration)) {
            const duration = Math.round(audio.duration);
            console.log('Duração do MP3 detectada:', duration, 'segundos');
            setDuracaoAudio(duration);
          } else {
            console.log('Duração do MP3 não disponível ou infinita (stream)');
          }
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Erro ao carregar áudio personalizado:', e);
          alert('Erro ao carregar o áudio. Verifique se a URL está correta e acessível.');
        });
        
        customAudioRef.current = audio;
        
        // Tentar reproduzir com interação do usuário
        const playAudio = () => {
          audio.play().catch(error => {
            console.error('Erro ao reproduzir áudio:', error);
            alert('Erro ao reproduzir o áudio. Clique na página e tente novamente.');
          });
        };
        
        // Se não conseguir reproduzir automaticamente, pedir interação do usuário
        audio.play().catch(() => {
          alert('Para reproduzir o áudio, clique em "OK" e depois clique na página.');
          document.addEventListener('click', playAudio, { once: true });
        });
        
      } catch (error) {
        console.error('Erro ao criar elemento de áudio:', error);
        alert('Erro ao configurar o áudio personalizado.');
      }
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    // Padrões mais robustos para diferentes formatos de URL do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/ // ID direto
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    console.error('URL do YouTube não reconhecida:', url);
    return null;
  };

  const start = () => {
    setExecutando(true);
    const sessaoAtual = SESSOES.find((x) => x.id === sessao)!;
    const minutos = sessaoAtual.minutos;
    
    // Reset da duração do áudio para detectar novamente
    setDuracaoAudio(null);
    
    // Reproduzir áudio personalizado se configurado
    playCustomAudio(sessao);
    
    // Aguardar um pouco para detectar a duração do áudio
    setTimeout(() => {
      const tempoFinal = duracaoAudio || (minutos * 60); // Usar duração do áudio ou tempo padrão
      setTempoRestante(tempoFinal);
      
      console.log(`Sessão iniciada com duração: ${tempoFinal} segundos ${duracaoAudio ? '(baseada no áudio)' : '(tempo padrão)'}`);
    }, 3000); // 3 segundos para detectar duração
    
    // Usar tempo padrão inicialmente
    setTempoRestante(minutos * 60);

    // Remover toda a síntese de voz - apenas áudio personalizado
    // (Removido: roteiros híbridos e tradicionais com speak())

    timerRef.current = window.setInterval(() => {
      setTempoRestante((t) => {
        if (t <= 1) {
          stop();
          setIsPaused(false);
          // Remover fala de encerramento - silencioso
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

  const pauseCustomAudio = () => {
    if (customAudioRef.current) {
      if (customAudioRef.current instanceof HTMLAudioElement) {
        customAudioRef.current.pause();
      } else if (customAudioRef.current instanceof HTMLIFrameElement) {
        // Para YouTube iframe, enviar comando de pause via postMessage
        try {
          const iframe = customAudioRef.current;
          iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          console.log('Comando de pause enviado para YouTube iframe');
        } catch (e) {
          console.warn('Não foi possível pausar o vídeo do YouTube:', e);
        }
      }
    }
  };

  const resumeCustomAudio = () => {
    if (customAudioRef.current) {
      if (customAudioRef.current instanceof HTMLAudioElement) {
        customAudioRef.current.play().catch(error => {
          console.error('Erro ao retomar áudio:', error);
        });
      } else if (customAudioRef.current instanceof HTMLIFrameElement) {
        // Para YouTube iframe, enviar comando de play via postMessage
        try {
          const iframe = customAudioRef.current;
          iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          console.log('Comando de play enviado para YouTube iframe');
        } catch (e) {
          console.warn('Não foi possível retomar o vídeo do YouTube:', e);
        }
      }
    }
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      // Manter executando como true quando retomar
      setExecutando(true);
      resumeCustomAudio();
      // Removido: window.speechSynthesis.resume();
      
      // Retomar o timer
      if (!timerRef.current) {
        timerRef.current = window.setInterval(() => {
          setTempoRestante((t) => {
            if (t <= 1) {
              stop();
              setIsPaused(false);
              // Removido: speak('Encerrando. Leve essa calma e clareza com você.');
              const sessaoAtual = SESSOES.find((x) => x.id === sessao)!;
              updateStats(sessaoAtual.minutos);
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
      }
    } else {
      setIsPaused(true);
      // Pausar o timer
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      pauseCustomAudio();
      // Removido: window.speechSynthesis.pause();
    }
  };

  const stop = () => {
    setExecutando(false);
    setIsPaused(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    
    // Removido: Parar áudio padrão (speechSynthesis) - não usado mais
    // window.speechSynthesis.cancel();
    
    if (ctxRef.current) {
      Object.values(nodesRef.current).forEach((n) => {
        try { n.source.stop(); } catch {}
        n.source.disconnect();
        n.gain.disconnect();
        n.filter?.disconnect();
      });
      nodesRef.current = {};
    }

    // Parar áudio personalizado
    if (customAudioRef.current) {
      if (customAudioRef.current instanceof HTMLAudioElement) {
        customAudioRef.current.pause();
      } else if (customAudioRef.current instanceof HTMLIFrameElement) {
        // Remover iframe do YouTube
        try {
          document.body.removeChild(customAudioRef.current);
        } catch (e) {
          console.warn('Erro ao remover iframe:', e);
        }
      }
      customAudioRef.current = null;
    }
  };

  const AudioConfigDialog = ({ sessionId }: { sessionId: string }) => {
    const [audioType, setAudioType] = useState<'youtube' | 'mp3' | 'none'>('none');
    const [audioUrl, setAudioUrl] = useState('');
    const [audioVolume, setAudioVolume] = useState(0.5);

    useEffect(() => {
      const config = loadCustomAudio(sessionId);
      setAudioType(config.type);
      setAudioUrl(config.url);
      setAudioVolume(config.volume);
    }, [sessionId]);

    const handleSave = () => {
      saveCustomAudio(sessionId, {
        type: audioType,
        url: audioUrl,
        volume: audioVolume
      });
      setAudioConfigOpen(false);
    };

    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Áudio Personalizado</DialogTitle>
          <DialogDescription>
            Configure um áudio personalizado para esta sessão de meditação.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="audio-type">Tipo de Áudio</Label>
            <Select value={audioType} onValueChange={(value: 'youtube' | 'mp3' | 'none') => setAudioType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum (padrão)</SelectItem>
                <SelectItem value="youtube">Link do YouTube</SelectItem>
                <SelectItem value="mp3">Arquivo MP3 (URL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {audioType !== 'none' && (
            <>
              <div>
                 <Label htmlFor="audio-url">
                   {audioType === 'youtube' ? 'URL do YouTube' : 'URL do MP3'}
                 </Label>
                 <Input
                   id="audio-url"
                   value={audioUrl}
                   onChange={(e) => setAudioUrl(e.target.value)}
                   placeholder={audioType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://exemplo.com/audio.mp3'}
                 />
                 {audioType === 'youtube' && (
                   <div className="text-xs text-muted-foreground mt-1 space-y-1">
                     <p>🎵 <strong>Áudio apenas:</strong> O vídeo será reproduzido de forma invisível</p>
                     <p>⚠️ <strong>Limitação:</strong> Alguns vídeos podem ter restrições de reprodução</p>
                     <p>💡 <strong>Dica:</strong> Para controle total de volume, use um arquivo MP3 direto</p>
                     <p>� <strong>Formatos aceitos:</strong> youtube.com/watch?v=ID ou youtu.be/ID</p>
                   </div>
                 )}
               </div>
              
              <div>
                <Label>Volume: {Math.round(audioVolume * 100)}%</Label>
                <Slider
                  value={[audioVolume]}
                  onValueChange={([value]) => setAudioVolume(value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setAudioConfigOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    );
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
                        <div className="flex items-center gap-2">
                          <Badge variant={s.type === 'hybrid' ? 'default' : 'secondary'}>
                            {s.type === 'hybrid' ? 'Híbrida' : 'Tradicional'}
                          </Badge>
                          <Dialog open={audioConfigOpen && selectedSession === s.id} onOpenChange={(open) => {
                            setAudioConfigOpen(open);
                            if (open) setSelectedSession(s.id);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant={customAudio[s.id]?.type !== 'none' && customAudio[s.id]?.url ? "default" : "ghost"} 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                title="Configurar áudio personalizado"
                              >
                                <Music className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <AudioConfigDialog sessionId={s.id} />
                          </Dialog>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{s.label}</CardTitle>
                      <CardDescription>{s.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
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
                        {/* Timer regressivo dentro do card */}
                        {(executando || isPaused) && sessao === s.id && (
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="text-center">
                              <div className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                {Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')}
                              </div>
                              <div className="text-xs text-blue-700 dark:text-blue-300">
                                {isPaused ? 'Pausado' : 'Tempo restante'}
                                {duracaoAudio && (
                                  <span className="ml-1 text-green-600 dark:text-green-400">
                                    📱 Auto
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Botões de controle */}
                        {(executando || isPaused) && sessao === s.id ? (
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant={isPaused ? "default" : "secondary"}
                              size="sm" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePause();
                              }}
                            >
                              {isPaused ? 'Retomar' : 'Pausar'}
                            </Button>
                            <Button 
                              variant="destructive"
                              size="sm" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                stop();
                                setIsPaused(false);
                              }}
                            >
                              Encerrar
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="default"
                            size="sm" 
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessao(s.id);
                              start();
                            }}
                          >
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>


          </TabsContent>

          <TabsContent value="ambientes" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {AMBIENTS.map(({ key, label }) => (
                <Card key={key} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">{label}</Label>
                      <Button
                        variant={ambienteAtivo[key] ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleAmbient(key)}
                      >
                        {ambienteAtivo[key] ? 'Parar' : 'Reproduzir'}
                      </Button>
                    </div>
                    
                    {ambienteAtivo[key] && (
                      <div className="space-y-2">
                        <Label className="text-sm">Volume: {Math.round((volume[key] ?? 0.25) * 100)}%</Label>
                        <Slider
                          value={[volume[key] ?? 0.25]}
                          onValueChange={([value]) => setAmbientVolume(key, value)}
                          max={1}
                          min={0}
                          step={0.05}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
