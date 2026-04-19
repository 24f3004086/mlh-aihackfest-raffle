/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Participant {
  id: string;
  name: string;
  email: string;
  enteredAt: string;
}

export type RaffleStatus = 'active' | 'drawing' | 'completed';

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prizeImage: string;
  createdAt: string;
  endsAt: string;
  status: RaffleStatus;
  participants: Participant[];
  winnerId?: string;
  totalTickets: number;
}
