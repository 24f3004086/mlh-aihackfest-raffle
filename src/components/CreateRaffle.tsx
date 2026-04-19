/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Raffle } from '../types';

interface CreateRaffleProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (raffle: Partial<Raffle>) => void;
}

export function CreateRaffle({ isOpen, onClose, onSubmit }: CreateRaffleProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prizeImage: '',
    totalTickets: 100,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      participants: [],
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200" id="create-raffle-modal">
              <div className="bg-primary/5 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900">Create Raffle</h2>
                    <p className="text-sm text-zinc-500">Launch a new prize draw in seconds.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full bg-white p-2 text-zinc-400 shadow-sm ring-1 ring-zinc-200 transition-colors hover:text-zinc-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prize Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Vintage Camera Kit"
                      className="mt-1 w-full rounded-xl bg-zinc-50 px-4 py-3 text-zinc-900 ring-1 ring-zinc-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</label>
                    <textarea
                      required
                      placeholder="Tell participants about the prize..."
                      className="mt-1 min-h-[100px] w-full rounded-xl bg-zinc-50 px-4 py-3 text-zinc-900 ring-1 ring-zinc-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prize Image URL</label>
                    <div className="mt-1 flex gap-2">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
                           {formData.prizeImage ? (
                                <img src={formData.prizeImage} className="h-full w-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                           ) : (
                                <ImageIcon className="h-5 w-5" />
                           )}
                        </div>
                        <input
                            required
                            type="url"
                            placeholder="https://..."
                            className="w-full rounded-xl bg-zinc-50 px-4 py-3 text-zinc-900 ring-1 ring-zinc-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.prizeImage}
                            onChange={(e) => setFormData({ ...formData, prizeImage: e.target.value })}
                        />
                    </div>
                    <p className="mt-1 text-[10px] text-zinc-400 uppercase tracking-tight">Pro tip: Use unsplash or picsum for demo images</p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Tickets</label>
                    <input
                      required
                      type="number"
                      min="1"
                      className="mt-1 w-full rounded-xl bg-zinc-50 px-4 py-3 text-zinc-900 ring-1 ring-zinc-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.totalTickets}
                      onChange={(e) => setFormData({ ...formData, totalTickets: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 font-bold text-white shadow-lg transition-transform hover:bg-zinc-800"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  Launch Raffle
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
