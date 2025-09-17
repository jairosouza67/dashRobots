
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: 'breathing' | 'meditation' | 'milestone' | 'tip';
}

const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: {
      name: 'Maria Silva',
      avatar: '👩‍💼',
      level: 5
    },
    content: 'Completei minha primeira semana consecutiva de meditação! A técnica 4-7-8 tem me ajudado muito com a ansiedade antes das reuniões. Gratidão! 🙏',
    timestamp: '2024-01-15T10:30:00Z',
    likes: 24,
    comments: 8,
    category: 'milestone'
  },
  {
    id: '2',
    author: {
      name: 'João Santos',
      avatar: '🧑‍💻',
      level: 12
    },
    content: 'Dica para quem está começando: comece com apenas 2 minutos por dia. Depois de uma semana, você vai querer naturalmente aumentar o tempo. A consistência é mais importante que a duração! ✨',
    timestamp: '2024-01-15T08:15:00Z',
    likes: 45,
    comments: 12,
    category: 'tip'
  },
  {
    id: '3',
    author: {
      name: 'Ana Costa',
      avatar: '👩‍🎨',
      level: 8
    },
    content: 'A sessão de respiração box breathing de hoje foi transformadora. Consegui manter o foco por 10 minutos inteiros! Quem mais pratica essa técnica?',
    timestamp: '2024-01-14T19:45:00Z',
    likes: 31,
    comments: 15,
    category: 'breathing'
  },
  {
    id: '4',
    author: {
      name: 'Carlos Oliveira',
      avatar: '👨‍🏫',
      level: 20
    },
    content: 'Marco histórico: 100 dias consecutivos! 🎉 O RespiraZen mudou minha vida. Durmo melhor, me concentro mais e estou muito mais calmo. Obrigado a toda essa comunidade incrível!',
    timestamp: '2024-01-14T16:20:00Z',
    likes: 89,
    comments: 23,
    category: 'milestone'
  },
  {
    id: '5',
    author: {
      name: 'Fernanda Lima',
      avatar: '👩‍⚕️',
      level: 15
    },
    content: 'Para quem trabalha na área da saúde: a respiração diafragmática tem me ajudado muito entre os plantões. 5 minutos e já sinto a diferença. Recomendo! 💙',
    timestamp: '2024-01-14T14:10:00Z',
    likes: 52,
    comments: 18,
    category: 'tip'
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'milestone': return '🏆';
    case 'tip': return '💡';
    case 'breathing': return '🌬️';
    case 'meditation': return '🧘‍♀️';
    default: return '💬';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'milestone': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'tip': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'breathing': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'meditation': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Agora há pouco';
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
};

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPosts(MOCK_POSTS);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const sharePost = async (post: CommunityPost) => {
    const shareData = {
      title: `Veja o que ${post.author.name} compartilhou no RespiraZen`,
      text: post.content.substring(0, 100) + '...',
      url: `${window.location.origin}/comunidade#post-${post.id}`
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `"${post.content}" - ${post.author.name} no RespiraZen\n${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Post copiado para a área de transferência!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comunidade RespiraZen
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conecte-se com outros praticantes, compartilhe conquistas e inspire-se mutuamente na jornada do bem-estar.
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Membros Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">15,632</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessões Compartilhadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Satisfação</div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{post.author.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {post.author.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>Nível {post.author.level}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {getCategoryIcon(post.category)} {post.category}
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>

                <button
                  onClick={() => sharePost(post)}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Compartilhar</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Junte-se à Conversa!</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Compartilhe suas experiências, conquistas e dicas com nossa comunidade acolhedora.
          </p>
          <Button 
            variant="secondary"
            size="lg"
            className="px-8 py-3 rounded-full font-semibold transition-all bg-background text-primary hover:bg-accent hover:text-accent-foreground border border-primary/20"
          >
            <User className="w-5 h-5 mr-2" />
            Criar Conta Gratuita
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
