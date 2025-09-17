
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BreathingCircleProps {
  phase: 'inspire' | 'segure' | 'expire';
  remaining: number;
  isRunning: boolean;
  onClick: () => void;
}

export default function ImprovedBreathingCircle({ 
  phase, 
  remaining, 
  isRunning, 
  onClick 
}: BreathingCircleProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    switch (phase) {
      case 'inspire':
        setDisplayText('Inspire...');
        break;
      case 'segure':
        setDisplayText('Segure...');
        break;
      case 'expire':
        setDisplayText('Expire...');
        break;
      default:
        setDisplayText('Inspire...');
    }
  }, [phase]);

  const getPhaseColors = () => {
    switch (phase) {
      case 'inspire':
        return {
          gradient: 'from-green-400 via-emerald-500 to-teal-500',
          shadow: 'shadow-green-500/50',
          ring: 'ring-green-400/30'
        };
      case 'segure':
        return {
          gradient: 'from-yellow-400 via-amber-500 to-orange-500',
          shadow: 'shadow-yellow-500/50',
          ring: 'ring-yellow-400/30'
        };
      case 'expire':
        return {
          gradient: 'from-blue-400 via-indigo-500 to-purple-500',
          shadow: 'shadow-blue-500/50',
          ring: 'ring-blue-400/30'
        };
      default:
        return {
          gradient: 'from-gray-400 via-gray-500 to-gray-600',
          shadow: 'shadow-gray-500/50',
          ring: 'ring-gray-400/30'
        };
    }
  };

  const colors = getPhaseColors();
  
  const scaleValue = isRunning ? (
    phase === 'inspire' ? 1.2 : 
    phase === 'segure' ? 1.1 : 
    0.9
  ) : 1;

  return (
    <div className="flex items-center justify-center relative">
      {/* Outer Ring Animation */}
      <motion.div
        className={`absolute w-96 h-96 rounded-full border-4 ${colors.ring} opacity-60`}
        animate={{
          scale: isRunning ? [0.8, 1.2, 0.8] : 1,
          opacity: isRunning ? [0.3, 0.6, 0.3] : 0.4
        }}
        transition={{
          duration: isRunning ? 12 : 0,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* Middle Ring */}
      <motion.div
        className={`absolute w-80 h-80 rounded-full border-2 ${colors.ring} opacity-40`}
        animate={{
          scale: isRunning ? [0.9, 1.1, 0.9] : 1,
          opacity: isRunning ? [0.2, 0.4, 0.2] : 0.3
        }}
        transition={{
          duration: isRunning ? 8 : 0,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Main Breathing Circle */}
      <motion.div
        className={`
          w-72 h-72 rounded-full cursor-pointer
          bg-gradient-to-br ${colors.gradient}
          ${colors.shadow} shadow-2xl
          flex items-center justify-center
          hover:shadow-3xl transition-shadow duration-300
          relative overflow-hidden
        `}
        animate={{
          scale: scaleValue,
        }}
        transition={{
          duration: isRunning ? (
            phase === 'inspire' ? 4 : 
            phase === 'segure' ? 4 : 
            4
          ) : 0.3,
          ease: "easeInOut"
        }}
        onClick={onClick}
        whileHover={{ scale: isRunning ? scaleValue * 1.02 : 1.05 }}
        whileTap={{ scale: isRunning ? scaleValue * 0.98 : 0.95 }}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        
        {/* Content */}
        <div className="text-center z-10">
          <motion.div
            key={displayText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg"
          >
            {displayText}
          </motion.div>
          
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-white/90 font-medium drop-shadow"
            >
              {remaining}s
            </motion.div>
          )}
          
          {!isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/80 font-medium drop-shadow mt-2"
            >
              Clique para começar
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Breathing Particles */}
      {isRunning && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient} opacity-60`}
              animate={{
                x: [0, Math.cos((i * 60) * Math.PI / 180) * 200, 0],
                y: [0, Math.sin((i * 60) * Math.PI / 180) * 200, 0],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
