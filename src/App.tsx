/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Ticket, Trophy, Zap, Info, ExternalLink, Users } from 'lucide-react';
import { Raffle, Participant } from './types';
import { RaffleCard } from './components/RaffleCard';
import { CreateRaffle } from './components/CreateRaffle';
import { RaffleDetail } from './components/RaffleDetail';
import { WinnerDraw } from './components/WinnerDraw';

const INITIAL_RAFFLES: Raffle[] = [
  {
    id: '1',
    title: 'Nikon Z8 Creator Kit',
    description: 'The ultimate tool for creators. Includes Nikon Z8 body, 24-70mm f/2.8 lens, and a premium camera bag.',
    prizeImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    participants: [
      { id: 'p1', name: 'Alex Rivera', email: 'alex@example.com', enteredAt: new Date().toISOString() },
      { id: 'p2', name: 'Sarah Chen', email: 'sarah@example.com', enteredAt: new Date().toISOString() },
    ],
    totalTickets: 50,
  },
  {
    id: '2',
    title: 'Herman Miller Embody',
    description: 'Upgrade your workspace with the most ergonomic chair ever designed. Galaxy edition.',
    prizeImage: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    participants: [
      { id: 'p3', name: 'Marcus Miller', email: 'marcus@example.com', enteredAt: new Date().toISOString() },
    ],
    totalTickets: 100,
  },
  {
    id: '3',
    title: 'MacBook Pro M3 Max',
    description: '16-inch, Space Black, 64GB Unified Memory. The powerhouse for professionals.',
    prizeImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    endsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    participants: [
      { id: 'p4', name: 'Elena Gilbert', email: 'elena@example.com', enteredAt: new Date().toISOString() },
      { id: 'p5', name: 'Stefan Salvatore', email: 'stefan@example.com', enteredAt: new Date().toISOString() },
    ],
    winnerId: 'p4',
    totalTickets: 25,
  }
];

export default function App() {
  const [raffles, setRaffles] = useState<Raffle[]>(() => {
    const saved = localStorage.getItem('lucky_raffles');
    return saved ? JSON.parse(saved) : INITIAL_RAFFLES;
  });
  
  const [selectedRaffleId, setSelectedRaffleId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    localStorage.setItem('lucky_raffles', JSON.stringify(raffles));
  }, [raffles]);

  const selectedRaffle = raffles.find((r) => r.id === selectedRaffleId);

  const handleCreateRaffle = (newRaffle: Partial<Raffle>) => {
    setRaffles([newRaffle as Raffle, ...raffles]);
  };

  const handleEnterRaffle = (raffleId: string, name: string, email: string) => {
    setRaffles((prev) =>
      prev.map((r) => {
        if (r.id === raffleId) {
          const newParticipant: Participant = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            enteredAt: new Date().toISOString(),
          };
          return { ...r, participants: [...r.participants, newParticipant] };
        }
        return r;
      })
    );
  };

  const handleStartDraw = (raffleId: string) => {
    setIsDrawing(true);
  };

  const handleCompleteDraw = (winnerId: string) => {
    setRaffles((prev) =>
      prev.map((r) => {
        if (r.id === selectedRaffleId) {
          return { ...r, status: 'completed' as const, winnerId };
        }
        return r;
      })
    );
    setIsDrawing(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24">
      {/* Navigation Rail / Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg ring-1 ring-zinc-200"
          >
            <div className="h-8 w-8 bg-zinc-900 rounded-full flex items-center justify-center text-primary">
                <Ticket className="h-5 w-5" />
            </div>
            <span className="font-black text-xl tracking-tight text-zinc-900">LuckyDraw</span>
          </motion.div>

          <motion.div 
             initial={{ x: 20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:flex items-center gap-1 bg-white px-4 py-2.5 rounded-full shadow-sm ring-1 ring-zinc-200 text-sm font-medium text-zinc-500">
                <Users className="h-4 w-4" />
                <span>{raffles.reduce((acc, r) => acc + r.participants.length, 0)} Active Users</span>
            </div>
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white pl-5 pr-6 py-3 rounded-full font-bold shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
            >
                <Plus className="h-5 w-5" />
                <span>New Raffle</span>
            </button>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!selectedRaffle ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <Zap className="h-3 w-3 fill-current" />
                    <span>Featured Giveaways</span>
                </div>
                <h2 className="text-5xl font-black text-zinc-900 tracking-tight leading-none">
                    High Stakes,<br />Low Entry.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {raffles.map((raffle) => (
                  <RaffleCard
                    key={raffle.id}
                    raffle={raffle}
                    onClick={(r) => setSelectedRaffleId(r.id)}
                  />
                ))}
              </div>

              <div className="p-12 rounded-[40px] bg-zinc-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-lg">
                    <div className="inline-flex items-center gap-2 bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        <Info className="h-3 w-3" />
                        Beta Platform
                    </div>
                    <h3 className="text-3xl font-bold">Launch your own community raffle.</h3>
                    <p className="text-zinc-400">Our platform provides the most transparent and exciting drawing mechanism for your audience.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group flex items-center gap-4 bg-white text-zinc-900 pl-8 pr-3 py-3 rounded-full font-bold transition-all hover:bg-zinc-100"
                >
                    Get Started Free
                    <div className="bg-zinc-900 p-3 rounded-full text-white transition-transform group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RaffleDetail
                raffle={selectedRaffle}
                onBack={() => setSelectedRaffleId(null)}
                onEnter={handleEnterRaffle}
                onDraw={handleStartDraw}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <CreateRaffle
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRaffle}
      />

      {isDrawing && selectedRaffle && (
        <WinnerDraw
            raffle={selectedRaffle}
            onComplete={handleCompleteDraw}
        />
      )}

      <footer className="mt-24 py-12 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span className="font-bold text-zinc-900">LuckyDraw</span>
                <span>© 2026</span>
            </div>
            <div className="flex items-center gap-8 font-medium">
                <a href="#" className="hover:text-zinc-900 transition-colors">How it works</a>
                <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
                    Support <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
        </svg>
    )
}
