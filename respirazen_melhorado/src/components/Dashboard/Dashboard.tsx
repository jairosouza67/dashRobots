
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Clock, Target, TrendingUp, Share2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  breathingSessions: number;
  meditationSessions: number;
  weeklyData: Array<{ day: string; sessions: number; minutes: number }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    breathingSessions: 0,
    meditationSessions: 0,
    weeklyData: []
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadStats();
  }, []);

  const loadStats = () => {
    // Load data from localStorage
    const totalSessions = Number(localStorage.getItem('rz_sessions_completed') || '0');
    const totalSeconds = Number(localStorage.getItem('rz_total_seconds') || '0');
    const currentStreak = Number(localStorage.getItem('rz_streak') || '0');
    const breathingSessions = Number(localStorage.getItem('rz_breathing_sessions') || '0');
    const meditationSessions = Number(localStorage.getItem('rz_meditation_sessions') || '0');

    // Generate weekly data (mock for last 7 days)
    const today = new Date();
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      
      // Mock data based on current stats
      const sessions = Math.floor(Math.random() * Math.max(1, totalSessions / 7)) + (i === 0 ? 1 : 0);
      const minutes = Math.floor(sessions * (2 + Math.random() * 8));
      
      weeklyData.push({
        day: dayName,
        sessions,
        minutes
      });
    }

    setStats({
      totalSessions,
      totalMinutes: Math.floor(totalSeconds / 60),
      currentStreak,
      breathingSessions,
      meditationSessions,
      weeklyData
    });
  };

  const shareProgress = async () => {
    const shareData = {
      title: 'RespiraZen - Meu Progresso',
      text: `Completei ${stats.totalSessions} sessões de meditação e tenho ${stats.currentStreak} dias consecutivos de prática! 🧘‍♀️✨`,
      url: window.location.origin
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${shareData.text} ${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Progresso copiado para a área de transferência!');
      });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Respiração', value: stats.breathingSessions, color: '#10B981' },
    { name: 'Meditação', value: stats.meditationSessions, color: '#8B5CF6' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard de Progresso
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Acompanhe sua jornada de mindfulness e bem-estar
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Sessões</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Minutos Praticados</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalMinutes}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sequência Atual</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nível</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(stats.totalSessions / 10) + 1}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Progresso dos Últimos 7 Dias
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <Bar 
                    dataKey="sessions" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Sessões"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Session Type Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Distribuição de Sessões
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Share Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Compartilhe seu Progresso!</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Inspire outros a começar sua jornada de mindfulness compartilhando suas conquistas.
          </p>
          <Button
            onClick={shareProgress}
            variant="secondary"
            size="lg"
            className="px-8 py-3 rounded-full font-semibold transition-all bg-background text-primary hover:bg-accent hover:text-accent-foreground border border-primary/20"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartilhar Progresso
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
