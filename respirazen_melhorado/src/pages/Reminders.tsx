import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, Brain, Heart, Zap, Moon, Calendar } from "lucide-react";

interface Reminder { 
  id: string; 
  title: string; 
  at: number; 
  type: 'custom' | 'breathing' | 'meditation' | 'break' | 'hydration';
  recurring?: 'daily' | 'weekly' | 'workdays';
  sound?: boolean;
}

interface SmartReminder {
  id: string;
  name: string;
  description: string;
  icon: any;
  defaultInterval: number; // em minutos
  messages: string[];
  type: 'breathing' | 'meditation' | 'break' | 'hydration';
}

const SMART_REMINDERS: SmartReminder[] = [
  {
    id: 'breathing_break',
    name: 'Pausa Respiratória',
    description: 'Lembretes regulares para exercícios de respiração',
    icon: Heart,
    defaultInterval: 120, // 2 horas
    type: 'breathing',
    messages: [
      'Hora de uma pausa respiratória! 🌬️',
      'Que tal 2 minutos de respiração consciente?',
      'Seu corpo agradece uma pausa para respirar',
      'Momento perfeito para oxigenar a mente'
    ]
  },
  {
    id: 'micro_meditation',
    name: 'Micro Meditação',
    description: 'Pequenas pausas meditativas ao longo do dia',
    icon: Brain,
    defaultInterval: 180, // 3 horas
    type: 'meditation',
    messages: [
      'Que tal uma micro meditação de 3 minutos? 🧘',
      'Hora de centrar a mente e relaxar',
      'Uma pausa meditativa fará bem agora',
      'Conecte-se consigo mesmo por alguns minutos'
    ]
  },
  {
    id: 'energy_boost',
    name: 'Ativação Energética',
    description: 'Lembretes para ativar energia e vitalidade',
    icon: Zap,
    defaultInterval: 240, // 4 horas
    type: 'breathing',
    messages: [
      'Hora de ativar sua energia! ⚡',
      'Que tal uma respiração energizante?',
      'Desperte sua vitalidade natural',
      'Momento de recarregar as energias'
    ]
  },
  {
    id: 'evening_wind_down',
    name: 'Preparação Noturna',
    description: 'Lembretes para relaxar antes de dormir',
    icon: Moon,
    defaultInterval: 1440, // diário às 21h
    type: 'meditation',
    messages: [
      'Hora de preparar a mente para o descanso 🌙',
      'Que tal uma meditação para o sono?',
      'Momento de acalmar a mente',
      'Prepare-se para uma noite tranquila'
    ]
  },
  {
    id: 'hydration',
    name: 'Hidratação Consciente',
    description: 'Lembretes para beber água mindfully',
    icon: Heart,
    defaultInterval: 90, // 1.5 horas
    type: 'hydration',
    messages: [
      'Hora de se hidratar conscientemente! 💧',
      'Beba água e respire profundamente',
      'Hidrate o corpo e a mente',
      'Água + respiração = bem-estar'
    ]
  }
];

const RECURRING_OPTIONS = [
  { value: 'once', label: 'Uma vez' },
  { value: 'daily', label: 'Diariamente' },
  { value: 'workdays', label: 'Dias úteis' },
  { value: 'weekly', label: 'Semanalmente' }
];

export default function Reminders() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [title, setTitle] = useState('Respirar por 1 minuto');
  const [minutes, setMinutes] = useState(60);
  const [reminderType, setReminderType] = useState<Reminder['type']>('custom');
  const [recurring, setRecurring] = useState<'once' | 'daily' | 'weekly' | 'workdays'>('once');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState<Record<string, boolean>>({});
  const [smartIntervals, setSmartIntervals] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, number>>({});
  const smartTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    setPermission(Notification.permission);
    
    // Carregar lembretes salvos
    const saved = localStorage.getItem('rz_reminders');
    if (saved) {
      const list: Reminder[] = JSON.parse(saved);
      setReminders(list);
      list.forEach(scheduleReminder);
    }

    // Carregar configurações de lembretes inteligentes
    const smartConfig = localStorage.getItem('rz_smart_reminders');
    if (smartConfig) {
      const config = JSON.parse(smartConfig);
      setSmartRemindersEnabled(config.enabled || {});
      setSmartIntervals(config.intervals || {});
    }

    // Inicializar intervalos padrão
    const defaultIntervals: Record<string, number> = {};
    SMART_REMINDERS.forEach(sr => {
      defaultIntervals[sr.id] = sr.defaultInterval;
    });
    setSmartIntervals(prev => ({ ...defaultIntervals, ...prev }));

    return () => {
      Object.values(timers.current).forEach((id) => window.clearTimeout(id));
      Object.values(smartTimers.current).forEach((id) => window.clearInterval(id));
    };
  }, []);

  // Salvar configurações de lembretes inteligentes
  useEffect(() => {
    const config = {
      enabled: smartRemindersEnabled,
      intervals: smartIntervals
    };
    localStorage.setItem('rz_smart_reminders', JSON.stringify(config));
  }, [smartRemindersEnabled, smartIntervals]);

  const askPermission = async () => {
    if (!('Notification' in window)) return;
    const p = await Notification.requestPermission();
    setPermission(p);
  };

  const scheduleReminder = (r: Reminder) => {
    const delay = Math.max(0, r.at - Date.now());
    timers.current[r.id] = window.setTimeout(() => {
      if (permission === 'granted') {
        new Notification('RespiraZen', { 
          body: r.title,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
      
      // Se for recorrente, reagendar
      if (r.recurring) {
        const nextTime = calculateNextRecurrence(r.at, r.recurring);
        const newReminder = { ...r, at: nextTime, id: Math.random().toString(36).slice(2) };
        setReminders(list => [...list.filter(x => x.id !== r.id), newReminder]);
        scheduleReminder(newReminder);
      } else {
        // Remover se não for recorrente
        setReminders(list => list.filter(x => x.id !== r.id));
      }
      
      updateReminderStorage();
    }, delay);
  };

  const calculateNextRecurrence = (currentTime: number, type: 'daily' | 'weekly' | 'workdays'): number => {
    const current = new Date(currentTime);
    const next = new Date(current);
    
    switch (type) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'workdays':
        do {
          next.setDate(next.getDate() + 1);
        } while (next.getDay() === 0 || next.getDay() === 6); // Skip weekends
        break;
    }
    
    return next.getTime();
  };

  const updateReminderStorage = () => {
    setTimeout(() => {
      setReminders(current => {
        localStorage.setItem('rz_reminders', JSON.stringify(current));
        return current;
      });
    }, 100);
  };

  const addReminder = () => {
    const at = Date.now() + minutes * 60 * 1000;
    const r: Reminder = { 
      id: Math.random().toString(36).slice(2), 
      title, 
      at,
      type: reminderType,
      recurring: recurring !== 'once' ? recurring : undefined,
      sound: soundEnabled
    };
    const list = [...reminders, r];
    setReminders(list);
    localStorage.setItem('rz_reminders', JSON.stringify(list));
    scheduleReminder(r);
  };

  const removeReminder = (id: string) => {
    setReminders(list => list.filter(x => x.id !== id));
    const rest = reminders.filter(x => x.id !== id);
    localStorage.setItem('rz_reminders', JSON.stringify(rest));
    if (timers.current[id]) window.clearTimeout(timers.current[id]);
  };

  const toggleSmartReminder = (smartId: string, enabled: boolean) => {
    setSmartRemindersEnabled(prev => ({ ...prev, [smartId]: enabled }));
    
    if (enabled) {
      startSmartReminder(smartId);
    } else {
      if (smartTimers.current[smartId]) {
        window.clearInterval(smartTimers.current[smartId]);
        delete smartTimers.current[smartId];
      }
    }
  };

  const startSmartReminder = (smartId: string) => {
    const smartReminder = SMART_REMINDERS.find(sr => sr.id === smartId);
    if (!smartReminder) return;

    const interval = smartIntervals[smartId] || smartReminder.defaultInterval;
    
    smartTimers.current[smartId] = window.setInterval(() => {
      if (permission === 'granted') {
        const randomMessage = smartReminder.messages[Math.floor(Math.random() * smartReminder.messages.length)];
        new Notification('RespiraZen', {
          body: randomMessage,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }, interval * 60 * 1000);
  };

  const updateSmartInterval = (smartId: string, newInterval: number) => {
    setSmartIntervals(prev => ({ ...prev, [smartId]: newInterval }));
    
    // Reiniciar o timer se estiver ativo
    if (smartRemindersEnabled[smartId]) {
      if (smartTimers.current[smartId]) {
        window.clearInterval(smartTimers.current[smartId]);
      }
      startSmartReminder(smartId);
    }
  };

  // Iniciar lembretes inteligentes ativos
  useEffect(() => {
    Object.entries(smartRemindersEnabled).forEach(([smartId, enabled]) => {
      if (enabled && permission === 'granted') {
        startSmartReminder(smartId);
      }
    });

    return () => {
      Object.values(smartTimers.current).forEach(id => window.clearInterval(id));
    };
  }, [permission]);

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'breathing': return <Heart className="h-4 w-4" />;
      case 'meditation': return <Brain className="h-4 w-4" />;
      case 'break': return <Clock className="h-4 w-4" />;
      case 'hydration': return <Heart className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'breathing': return 'bg-blue-100 text-blue-800';
      case 'meditation': return 'bg-purple-100 text-purple-800';
      case 'break': return 'bg-green-100 text-green-800';
      case 'hydration': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SEO 
        title="RespiraZen — Lembretes Inteligentes" 
        description="Sistema avançado de notificações proativas para mindfulness e bem-estar." 
      />
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Lembretes Inteligentes</h1>
          <p className="text-muted-foreground">
            Configure notificações proativas para manter sua prática de mindfulness consistente.
          </p>
        </div>

        {permission !== 'granted' && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Permissão Necessária
              </CardTitle>
              <CardDescription>
                Para receber notificações, precisamos da sua permissão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={askPermission} className="w-full sm:w-auto">
                Permitir Notificações
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="smart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="smart">Lembretes Inteligentes</TabsTrigger>
            <TabsTrigger value="custom">Lembretes Personalizados</TabsTrigger>
          </TabsList>

          <TabsContent value="smart" className="space-y-6">
            <div className="grid gap-4">
              {SMART_REMINDERS.map((smartReminder) => {
                const Icon = smartReminder.icon;
                const isEnabled = smartRemindersEnabled[smartReminder.id] || false;
                const interval = smartIntervals[smartReminder.id] || smartReminder.defaultInterval;
                
                return (
                  <Card key={smartReminder.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{smartReminder.name}</CardTitle>
                            <CardDescription>{smartReminder.description}</CardDescription>
                          </div>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => toggleSmartReminder(smartReminder.id, checked)}
                          disabled={permission !== 'granted'}
                        />
                      </div>
                    </CardHeader>
                    
                    {isEnabled && (
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Intervalo (minutos)</Label>
                            <Input
                              type="number"
                              min={15}
                              max={1440}
                              value={interval}
                              onChange={(e) => updateSmartInterval(smartReminder.id, Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Próximo lembrete</Label>
                            <div className="text-sm text-muted-foreground p-2 bg-secondary rounded">
                              Em {interval} minutos
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Mensagens de exemplo:</Label>
                          <div className="text-sm text-muted-foreground space-y-1">
                            {smartReminder.messages.slice(0, 2).map((msg, idx) => (
                              <div key={idx} className="italic">• {msg}</div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Lembrete Personalizado</CardTitle>
                <CardDescription>
                  Configure lembretes específicos para suas necessidades.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Título do Lembrete</Label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Respirar por 2 minutos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={reminderType} onValueChange={(value: Reminder['type']) => setReminderType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Personalizado</SelectItem>
                        <SelectItem value="breathing">Respiração</SelectItem>
                        <SelectItem value="meditation">Meditação</SelectItem>
                        <SelectItem value="break">Pausa</SelectItem>
                        <SelectItem value="hydration">Hidratação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Tempo (minutos)</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={minutes} 
                      onChange={(e) => setMinutes(Number(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Recorrência</Label>
                    <Select value={recurring} onValueChange={(value: any) => setRecurring(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RECURRING_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={addReminder}
                      disabled={permission !== 'granted'}
                      className="w-full"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                  <Label htmlFor="sound">Som de notificação</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lembretes Agendados</CardTitle>
                <CardDescription>
                  {reminders.length === 0 ? 'Nenhum lembrete agendado.' : `${reminders.length} lembrete(s) ativo(s)`}
                </CardDescription>
              </CardHeader>
              {reminders.length > 0 && (
                <CardContent>
                  <div className="space-y-3">
                    {reminders.map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(r.type)}
                          <div>
                            <div className="font-medium">{r.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(r.at).toLocaleString('pt-BR')}
                              {r.recurring && (
                                <Badge variant="outline" className="ml-2">
                                  {r.recurring === 'daily' ? 'Diário' : 
                                   r.recurring === 'weekly' ? 'Semanal' : 'Dias úteis'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(r.type)}>
                            {r.type === 'custom' ? 'Personalizado' :
                             r.type === 'breathing' ? 'Respiração' :
                             r.type === 'meditation' ? 'Meditação' :
                             r.type === 'break' ? 'Pausa' : 'Hidratação'}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => removeReminder(r.id)}>
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Dicas para Notificações Eficazes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">🔔 Configure horários estratégicos</h4>
                <p className="text-sm text-muted-foreground">
                  Agende lembretes nos momentos de maior estresse ou baixa energia.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">⚡ Use lembretes inteligentes</h4>
                <p className="text-sm text-muted-foreground">
                  Os lembretes automáticos se adaptam ao seu ritmo de trabalho.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">🎯 Seja específico</h4>
                <p className="text-sm text-muted-foreground">
                  Títulos claros ajudam a criar intenção e foco na prática.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">📱 Mantenha o app aberto</h4>
                <p className="text-sm text-muted-foreground">
                  Para melhor funcionamento, mantenha o RespiraZen em segundo plano.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
