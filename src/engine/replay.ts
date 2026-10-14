import { parseCard, startingHandLabel, type Card } from './cards'
import {
  HANDS,
  positionName,
  type HistAction,
  type ReplayHand,
  type Street,
} from '../data/hands'

export type TableState = {
  pot: number
  street: Street
  boardShown: number
  toCall: number
  invested: Record<string, number>
  stacks: Record<string, number>
  folded: string[]
  lastBet: number
}

export function heroCards(hand: ReplayHand): Card[] {
  const hero = hand.players.find((p) => p.name === hand.hero)
  return (hero?.hole ?? []).map((c) => parseCard(c))
}

export function heroHandLabel(hand: ReplayHand): string {
  const cards = heroCards(hand)
  if (cards.length < 2) return '??'
  return startingHandLabel(cards[0]!, cards[1]!)
}

export function heroPosition(hand: ReplayHand): string {
  const hero = hand.players.find((p) => p.name === hand.hero)
  if (!hero) return '?'
  return positionName(hero.seat, hand.buttonSeat, hand.players.length)
}

export function emptyState(hand: ReplayHand): TableState {
  const stacks: Record<string, number> = {}
  const invested: Record<string, number> = {}
  for (const p of hand.players) {
    stacks[p.name] = p.stack
    invested[p.name] = 0
  }
  return {
    pot: 0,
    street: 'preflop',
    boardShown: 0,
    toCall: 0,
    invested,
    stacks,
    folded: [],
    lastBet: 0,
  }
}

function resetStreet(state: TableState, street: Street): TableState {
  const invested: Record<string, number> = {}
  for (const name of Object.keys(state.invested)) invested[name] = 0
  const boardShown = street === 'preflop' ? 0 : street === 'flop' ? 3 : street === 'turn' ? 4 : 5
  return { ...state, street, invested, lastBet: 0, toCall: 0, boardShown }
}

export function applyAction(state: TableState, action: HistAction): TableState {
  let next = state.street === action.street ? { ...state, invested: { ...state.invested }, stacks: { ...state.stacks }, folded: [...state.folded] } : resetStreet(state, action.street)
  next = { ...next, invested: { ...next.invested }, stacks: { ...next.stacks }, folded: [...next.folded] }
  const name = action.player
  const already = next.invested[name] ?? 0
  const put = (chips: number) => {
    const pay = Math.min(chips, next.stacks[name] ?? 0)
    next.stacks[name] = (next.stacks[name] ?? 0) - pay
    next.invested[name] = already + pay
    next.pot += pay
  }
  if (action.type === 'fold') {
    if (!next.folded.includes(name)) next.folded.push(name)
    return next
  }
  if (action.type === 'check') return next
  if (action.type === 'post' || action.type === 'bet') {
    put(action.amount ?? 0)
    next.lastBet = Math.max(next.lastBet, next.invested[name] ?? 0)
    return next
  }
  if (action.type === 'call') {
    const need = action.amount ?? Math.max(0, next.lastBet - already)
    put(need)
    return next
  }
  if (action.type === 'raise') {
    const target = action.amount ?? next.lastBet * 2
    put(Math.max(0, target - already))
    next.lastBet = Math.max(next.lastBet, next.invested[name] ?? 0)
    return next
  }
  return next
}

export function replayTo(hand: ReplayHand, actionIndex: number): TableState {
  let state = emptyState(hand)
  for (let i = 0; i < actionIndex; i++) {
    const action = hand.actions[i]
    if (action) state = applyAction(state, action)
  }
  const upcoming = hand.actions[actionIndex]
  if (upcoming && upcoming.street !== state.street) state = resetStreet(state, upcoming.street)
  const actor = upcoming?.player
  if (actor) state = { ...state, toCall: Math.max(0, state.lastBet - (state.invested[actor] ?? 0)) }
  return state
}

export function nextHeroDecision(hand: ReplayHand, from: number): number {
  for (let i = from; i < hand.actions.length; i++) {
    const a = hand.actions[i]!
    if (a.player === hand.hero && a.type !== 'post') return i
  }
  return -1
}

export function actionLabel(action: HistAction): string {
  if (action.type === 'fold') return 'fold'
  if (action.type === 'check') return 'check'
  if (action.type === 'call') return `call ${action.amount ?? ''}`.trim()
  if (action.type === 'bet') return `bet ${action.amount ?? ''}`
  if (action.type === 'raise') return `raise to ${action.amount ?? ''}`
  return `post ${action.amount ?? ''}`
}

export function sameFamily(user: string, hist: HistAction): boolean {
  if (user === hist.type) return true
  if (user === 'bet' && hist.type === 'raise') return true
  if (user === 'raise' && hist.type === 'bet') return true
  if (user === 'check' && hist.type === 'call' && !hist.amount) return true
  return false
}

export { HANDS }
