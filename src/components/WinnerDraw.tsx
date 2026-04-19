/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { Raffle, Participant } from '../types';

interface WinnerDrawProps {
  raffle: Raffle;
  onComplete: (winnerId: string) => void;
}

export function WinnerDraw({ raffle, onComplete }: WinnerDrawProps) {
  const [stage, setStage] = useState<'counting' | 'picking' | 'reveal'>('counting');
  const [counter, setCounter] = useState(3);
  const [currentCandidate, setCurrentCandidate] = useState<Participant | null>(null);

  useEffect(() => {
    if (stage === 'counting') {
      const timer = setInterval(() => {
        setCounter((prev) => {
          if (prev === 1) {
            setStage('picking');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }

    if (stage === 'picking') {
      let iterations = 0;
      const totalIterations = 20;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * raffle.participants.length);
        setCurrentCandidate(raffle.participants[randomIndex]);
        iterations++;

        if (iterations >= totalIterations) {
          clearInterval(interval);
          setStage('reveal');
        }
      }, 100);
      return () => clearInterval(interval);
    }

    if (stage === 'reveal') {
        const timer = setTimeout(() => {
            if (currentCandidate) {
                onComplete(currentCandidate.id);
            }
        }, 4000);
        return () => clearTimeout(timer);
    }
  }, [stage, raffle.participants, currentCandidate, onComplete]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900 overflow-hidden" id="winner-draw-overlay">
      <div className="absolute inset-0 opacity-20">
        <div className="atmosphere" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'counting' && (
          <motion.div
            key="counter"
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <h2 className="text-zinc-500 font-bold uppercase tracking-widest text-xl">Drawing Winner In</h2>
            <div className="text-[200px] font-black text-white leading-none">
                {counter}
            </div>
          </motion.div>
        )}

        {stage === 'picking' && (
          <motion.div
            key="picking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            <h2 className="text-primary font-bold uppercase tracking-widest text-2xl animate-pulse">Shuffling entries...</h2>
            <div className="h-32 flex items-center justify-center">
                <motion.div
                    key={currentCandidate?.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl font-bold text-white"
                >
                    {currentCandidate?.name}
                </motion.div>
            </div>
          </motion.div>
        )}

        {stage === 'reveal' && currentCandidate && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center space-y-6"
          >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto h-32 w-32 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.5)]"
            >
                <Trophy className="h-16 w-16 text-yellow-900" />
            </motion.div>

            <div className="space-y-2">
                <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-zinc-400 font-bold uppercase tracking-widest"
                >
                    Winner Selected
                </motion.h2>
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    className="text-7xl font-black text-white px-8"
                >
                    {currentCandidate.name}
                </motion.h1>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-center gap-4 py-8"
            >
                <Star className="text-primary h-6 w-6 animate-bounce" />
                <Sparkles className="text-primary h-8 w-8 animate-pulse" />
                <Star className="text-primary h-6 w-6 animate-bounce" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Particles Simulation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: window.innerHeight + 10,
                    opacity: 0 
                }}
                animate={{ 
                    y: -20,
                    opacity: [0, 1, 0]
                }}
                transition={{
                    duration: 3 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 10
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
            />
        ))}
      </div>
    </div>
  );
}
