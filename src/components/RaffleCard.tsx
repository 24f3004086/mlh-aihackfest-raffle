/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Clock, ArrowRight } from 'lucide-react';
import { Raffle } from '../types';

interface RaffleCardProps {
  raffle: Raffle;
  onClick: (raffle: Raffle) => void;
}

export const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onClick }) => {
  const participantCount = raffle.participants.length;
  const isCompleted = raffle.status === 'completed';

  return (
    <motion.div
      layoutId={`card-${raffle.id}`}
      onClick={() => onClick(raffle)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 transition-shadow hover:shadow-xl"
      id={`raffle-card-${raffle.id}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-100">
        <img
          src={raffle.prizeImage}
          alt={raffle.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-1 text-white">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">Completed</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors">
          {raffle.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participantCount} entries</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-tight">
            <Clock className="h-4 w-4" />
            <span>{isCompleted ? 'Ended' : 'Active'}</span>
          </div>
        </div>

        {!isCompleted && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-400">
              <span>{Math.round((participantCount / raffle.totalTickets) * 100)}% Filled</span>
              <span>{participantCount} / {raffle.totalTickets}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(participantCount / raffle.totalTickets) * 100}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        )}
      </div>

      <div className="absolute right-4 top-4 rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <ArrowRight className="h-4 w-4 text-zinc-900" />
      </div>
    </motion.div>
  );
}
