import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Target, TrendingUp, Brain, Heart, Zap, Award, BarChart3, Activity } from "lucide-react";

interface Stats {
  totalSeconds: number;
  streak: number;
  sessionsCompleted: number;
  breathingSessions: number;
  meditationSessions: number;
  lastActivity: string;
  weeklyMinutes: number[];
  monthlyGoal: number;
  personalBest: number;
  mindfulnessMoments: number;
  stressReduction: number;
  focusImprovement: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

interface WeeklyInsight {
  type: 'positive' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  icon: string;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats>({
    totalSeconds: 0,
    streak: 0,
    sessionsCompleted: 0,
    breathingSessions: 0,
    meditationSessions: 0,
    lastActivity: 'Nunca',
    weeklyMinutes: [0, 0, 0, 0, 0, 0, 0],
    monthlyGoal: 300, // 5 horas por mês
    personalBest: 0,
    mindfulnessMoments: 0,
    stressReduction: 0,
    focusImprovement: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);

  useEffect(() => {
    loadStats();
    loadAchievements();
    generateWeeklyInsights();
  }, []);

  const loadStats = () => {
    const totalSeconds = Number(localStorage.getItem('rz_total_seconds') || '0');
    const streak = Number(localStorage.getItem('rz_streak') || '0');
    const sessionsCompleted = Number(localStorage.getItem('rz_sessions_completed') || '0');
    const breathingSessions = Number(localStorage.getItem('rz_breathing_sessions') || '0');
    const meditationSessions = Number(localStorage.getItem('rz_meditation_sessions') || '0');
    const lastDay = localStorage.getItem('rz_last_day');
    const weeklyMinutes = JSON.parse(localStorage.getItem('rz_weekly_minutes') || '[0,0,0,0,0,0,0]');
    const personalBest = Number(localStorage.getItem('rz_personal_best') || '0');
    const mindfulnessMoments = Number(localStorage.getItem('rz_mindfulness_moments') || '0');
    
    // Calcular métricas de bem-estar baseadas no uso
    const stressReduction = Math.min(Math.floor(totalSeconds / 3600 * 15), 100);
    const focusImprovement = Math.min(Math.floor(streak * 8), 100);
    
    setStats({
      totalSeconds,
      streak,
      sessionsCompleted,
      breathingSessions,
      meditationSessions,
      lastActivity: lastDay ? new Date(lastDay).toLocaleDateString('pt-BR') : 'Nunca',
      weeklyMinutes,
      monthlyGoal: 300,
      personalBest,
      mindfulnessMoments,
      stressReduction,
      focusImprovement
    });
  };

  const loadAchievements = () => {
    const unlockedAchievements = JSON.parse(localStorage.getItem('rz_achievements') || '[]');
    
    const allAchievements: Achievement[] = [
      {
        id: 'first_session',
        title: 'Primeiro Passo',
        description: 'Complete sua primeira sessão',
        icon: '🌱',
        unlocked: unlockedAchievements.includes('first_session'),
        progress: Math.min(stats.sessionsCompleted, 1),
        target: 1
      },
      {
        id: 'week_warrior',
        title: 'Guerreiro da Semana',
        description: 'Pratique por 7 dias consecutivos',
        icon: '🔥',
        unlocked: unlockedAchievements.includes('week_warrior'),
        progress: Math.min(stats.streak, 7),
        target: 7
      },
      {
        id: 'meditation_master',
        title: 'Mestre da Meditação',
        description: 'Complete 50 sessões de meditação',
        icon: '🧘',
        unlocked: unlockedAchievements.includes('meditation_master'),
        progress: Math.min(stats.meditationSessions, 50),
        target: 50
      },
      {
        id: 'breath_expert',
        title: 'Especialista em Respiração',
        description: 'Complete 100 exercícios de respiração',
        icon: '💨',
        unlocked: unlockedAchievements.includes('breath_expert'),
        progress: Math.min(stats.breathingSessions, 100),
        target: 100
      },
      {
        id: 'time_master',
        title: 'Mestre do Tempo',
        description: 'Acumule 10 horas de prática',
        icon: '⏰',
        unlocked: unlockedAchievements.includes('time_master'),
        progress: Math.min(stats.totalSeconds / 3600, 10),
        target: 10
      },
      {
        id: 'consistency_king',
        title: 'Rei da Consistência',
        description: 'Mantenha uma sequência de 30 dias',
        icon: '👑',
        unlocked: unlockedAchievements.includes('consistency_king'),
        progress: Math.min(stats.streak, 30),
        target: 30
      }
    ];
    
    setAchievements(allAchievements);
  };

  const generateWeeklyInsights = () => {
    const insights: WeeklyInsight[] = [];
    
    if (stats.streak >= 7) {
      insights.push({
        type: 'milestone',
        title: 'Sequência Incrível!',
        description: `Você manteve uma sequência de ${stats.streak} dias. Isso mostra verdadeira dedicação!`,
        icon: '🎯'
      });
    }
    
    if (stats.totalSeconds > 0) {
      const avgSessionTime = stats.totalSeconds / stats.sessionsCompleted;
      if (avgSessionTime > 600) { // Mais de 10 minutos
        insights.push({
          type: 'positive',
          title: 'Sessões Profundas',
          description: 'Suas sessões têm duração acima da média. Isso indica foco e dedicação.',
          icon: '🧠'
        });
      }
    }
    
    if (stats.breathingSessions > stats.meditationSessions * 2) {
      insights.push({
        type: 'suggestion',
        title: 'Explore a Meditação',
        description: 'Você tem preferido exercícios de respiração. Que tal experimentar algumas meditações guiadas?',
        icon: '🌸'
      });
    }
    
    if (stats.stressReduction >= 50) {
      insights.push({
        type: 'positive',
        title: 'Redução de Estresse',
        description: 'Sua prática regular está contribuindo significativamente para reduzir o estresse.',
        icon: '😌'
      });
    }
    
    setWeeklyInsights(insights);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Comece sua jornada hoje!";
    if (streak === 1) return "Primeiro dia! Continue assim!";
    if (streak < 7) return "Ótimo começo!";
    if (streak < 30) return "Você está criando um hábito!";
    return "Incrível dedicação!";
  };

  const weeklyGoal = 7;
  const weeklyProgress = Math.min((stats.streak / weeklyGoal) * 100, 100);
  const monthlyProgress = Math.min((stats.totalSeconds / 60 / stats.monthlyGoal) * 100, 100);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <SEO 
        title="RespiraZen — Seu Progresso" 
        description="Acompanhe seu progresso na jornada de mindfulness e respiração consciente." 
      />
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Seu Progresso</h1>
          <p className="text-muted-foreground">
            Acompanhe sua jornada de mindfulness e celebre suas conquistas.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="wellness">Bem-estar</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatTime(stats.totalSeconds)}</div>
                  <p className="text-xs text-muted-foreground">
                    de prática mindful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sequência</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.streak}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    sessões completadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recorde Pessoal</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatTime(stats.personalBest)}</div>
                  <p className="text-xs text-muted-foreground">
                    sessão mais longa
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Meta Mensal</CardTitle>
                  <CardDescription>
                    {Math.round(monthlyProgress)}% da meta de {stats.monthlyGoal} minutos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={monthlyProgress} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.round(stats.totalSeconds / 60)} min praticados</span>
                    <Badge variant={monthlyProgress >= 100 ? "default" : "secondary"}>
                      {monthlyProgress >= 100 ? "Meta atingida!" : "Continue assim!"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Semanal</CardTitle>
                  <CardDescription>
                    Seus últimos 7 dias de prática
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${Math.min((stats.weeklyMinutes[index] / 30) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {stats.weeklyMinutes[index]}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Redução de Estresse</CardTitle>
                  <Heart className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.stressReduction}%</div>
                  <Progress value={stats.stressReduction} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Baseado na sua prática regular
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Melhoria do Foco</CardTitle>
                  <Brain className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.focusImprovement}%</div>
                  <Progress value={stats.focusImprovement} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Baseado na sua consistência
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Momentos Mindful</CardTitle>
                  <Zap className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.mindfulnessMoments}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Momentos de presença cultivados
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Benefícios da Sua Prática</CardTitle>
                <CardDescription>
                  Como o mindfulness está impactando seu bem-estar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Saúde Mental
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Redução da ansiedade e estresse</li>
                      <li>• Melhoria do humor e bem-estar</li>
                      <li>• Maior autoconhecimento emocional</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      Capacidade Cognitiva
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Aumento da concentração</li>
                      <li>• Melhoria da memória de trabalho</li>
                      <li>• Maior clareza mental</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Saúde Física
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Redução da pressão arterial</li>
                      <li>• Melhoria da qualidade do sono</li>
                      <li>• Fortalecimento do sistema imunológico</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      Relacionamentos
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Maior empatia e compaixão</li>
                      <li>• Comunicação mais consciente</li>
                      <li>• Redução da reatividade emocional</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.unlocked ? 'border-primary' : 'opacity-75'}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{achievement.icon}</div>
                      {achievement.unlocked && (
                        <Badge variant="default">Desbloqueado!</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.target) * 100} 
                        className="h-2" 
                      />
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress} / {achievement.target}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {weeklyInsights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${
                  insight.type === 'positive' ? 'border-l-green-500' :
                  insight.type === 'milestone' ? 'border-l-blue-500' :
                  'border-l-yellow-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dicas Personalizadas</CardTitle>
                <CardDescription>
                  Baseadas no seu padrão de uso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {stats.streak < 3 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">🎯 Construa o Hábito</h4>
                      <p className="text-sm text-muted-foreground">
                        Tente praticar no mesmo horário todos os dias para criar uma rotina.
                      </p>
                    </div>
                  )}
                  
                  {stats.totalSeconds < 1800 && ( // Menos de 30 minutos total
                    <div className="space-y-2">
                      <h4 className="font-medium">⏰ Comece Pequeno</h4>
                      <p className="text-sm text-muted-foreground">
                        Sessões de 3-5 minutos são perfeitas para começar. A consistência é mais importante que a duração.
                      </p>
                    </div>
                  )}
                  
                  {stats.breathingSessions === 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">💨 Explore a Respiração</h4>
                      <p className="text-sm text-muted-foreground">
                        Os exercícios de respiração são uma ótima forma de começar a prática mindful.
                      </p>
                    </div>
                  )}
                  
                  {stats.meditationSessions === 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">🧘 Experimente Meditar</h4>
                      <p className="text-sm text-muted-foreground">
                        As meditações guiadas podem ajudar a aprofundar sua prática.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}