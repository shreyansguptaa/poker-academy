import raw from './hands.json'

export type Street = 'preflop' | 'flop' | 'turn' | 'river'

export type HistAction = {
  street: Street
  player: string
  type: 'post' | 'fold' | 'check' | 'call' | 'bet' | 'raise'
  amount?: number
}

export type ReplayPlayer = {
  seat: number
  name: string
  stack: number
  hole: string[]
}

export type ReplayHand = {
  id: string
  source: string
  event: string
  stakes: { sb: number; bb: number }
  buttonSeat: number
  players: ReplayPlayer[]
  board: string[]
  actions: HistAction[]
  hero: string
}

export const HANDS = raw as ReplayHand[]

export function positionName(seat: number, buttonSeat: number, seats: number): string {
  const diff = (seat - buttonSeat + seats) % seats
  if (seats === 2) return diff === 0 ? 'BTN' : 'BB'
  if (seats === 3) return ['BTN', 'SB', 'BB'][diff] ?? 'UTG'
  const six = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO']
  return six[diff] ?? 'UTG'
}
