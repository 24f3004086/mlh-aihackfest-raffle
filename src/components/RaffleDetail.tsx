/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Calendar, Ticket, Trophy, CheckCircle2 } from 'lucide-react';
import { Raffle, Participant } from '../types';

interface RaffleDetailProps {
  raffle: Raffle;
  onBack: () => void;
  onEnter: (id: string, name: string, email: string) => void;
  onDraw: (id: string) => void;
}

export function RaffleDetail({ raffle, onBack, onEnter, onDraw }: RaffleDetailProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hasEntered, setHasEntered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnter(raffle.id, name, email);
    setHasEntered(true);
    setName('');
    setEmail('');
  };

  const isCompleted = raffle.status === 'completed';
  const winner = isCompleted ? raffle.participants.find(p => p.id === raffle.winnerId) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="raffle-detail">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Raffles
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <motion.div
            layoutId={`card-${raffle.id}`}
            className="aspect-square overflow-hidden rounded-[40px] shadow-2xl ring-1 ring-zinc-200"
          >
            <img
              src={raffle.prizeImage}
              alt={raffle.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {isCompleted && winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-yellow-50 border border-yellow-200 text-center space-y-2"
            >
              <Trophy className="h-10 w-10 text-yellow-500 mx-auto" />
              <h3 className="text-xl font-bold text-yellow-900">We have a winner!</h3>
              <p className="text-yellow-800 font-medium">Congratulations to {winner.name}</p>
              <p className="text-xs text-yellow-600 font-mono">{winner.email}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              {raffle.title}
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed">
              {raffle.description}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl ring-1 ring-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Entries</span>
              </div>
              <p className="text-2xl font-bold">{raffle.participants.length} / {raffle.totalTickets}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl ring-1 ring-zinc-200 shadow-sm">
              <div className="flex items-center gap-2 text-zinc-400 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ends on</span>
              </div>
              <p className="text-lg font-bold">{new Date(raffle.endsAt).toLocaleDateString()}</p>
            </div>
          </div>

          {!isCompleted && (
            <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl">
              {hasEntered ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                  <div>
                    <h3 className="text-2xl font-bold">You're in!</h3>
                    <p className="text-zinc-400 text-sm mt-1">Check your email for ticket details.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Enter Raffle</h2>
                    <p className="text-zinc-400 text-sm mt-1">Fill in details to secure your ticket.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-zinc-800 rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-zinc-800 rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-primary py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Ticket className="h-5 w-5" />
                      Get Ticket
                    </motion.button>
                  </form>
                </div>
              )}
            </div>
          )}

          {raffle.participants.length > 0 && !isCompleted && (
            <div className="pt-6 border-t border-zinc-200">
               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDraw(raffle.id)}
                  className="w-full py-4 rounded-2xl border-2 border-zinc-900 font-bold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="h-5 w-5" />
                  Draw Winner Now
                </motion.button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Recent Participants</h3>
            <div className="space-y-3">
              {raffle.participants.slice(-5).reverse().map((p, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white ring-1 ring-zinc-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">{p.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{new Date(p.enteredAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <Ticket className="h-4 w-4 text-zinc-200" />
                </motion.div>
              ))}
              {raffle.participants.length === 0 && (
                <p className="text-sm italic text-zinc-400 text-center py-4">No entries yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
