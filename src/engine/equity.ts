import {
  RANK_VALUE,
  fullDeck,
  mulberry32,
  removeCards,
  sameCard,
  shuffleInPlace,
  type Card,
} from './cards'
import { expandSpecificCombos } from './ranges'

const CAT_HIGH = 0
const CAT_PAIR = 1
const CAT_TWOPAIR = 2
const CAT_TRIPS = 3
const CAT_STRAIGHT = 4
const CAT_FLUSH = 5
const CAT_BOAT = 6
const CAT_QUADS = 7
const CAT_STFLUSH = 8

function pack(cat: number, a = 0, b = 0, c = 0, d = 0, e = 0): number {
  return ((((cat * 16 + a) * 16 + b) * 16 + c) * 16 + d) * 16 + e
}

function straightHigh(present: boolean[]): number {
  if (present[12] && present[0] && present[1] && present[2] && present[3]) return 3
  for (let high = 12; high >= 4; high--) {
    if (
      present[high] &&
      present[high - 1] &&
      present[high - 2] &&
      present[high - 3] &&
      present[high - 4]
    ) {
      return high
    }
  }
  return -1
}

export function evaluate5(cards: Card[]): number {
  if (cards.length !== 5) throw new Error('evaluate5 expects 5 cards')
  const rankVals = cards.map((c) => RANK_VALUE[c.rank])
  const present = Array.from({ length: 13 }, () => false)
  const counts = Array.from({ length: 13 }, () => 0)
  for (const v of rankVals) {
    present[v] = true
    counts[v] += 1
  }
  const flush = cards.every((c) => c.suit === cards[0]!.suit)
  const sHigh = straightHigh(present)
  const byCount: { rank: number; n: number }[] = []
  for (let r = 12; r >= 0; r--) {
    if (counts[r]) byCount.push({ rank: r, n: counts[r]! })
  }
  byCount.sort((x, y) => y.n - x.n || y.rank - x.rank)

  if (flush && sHigh >= 0) return pack(CAT_STFLUSH, sHigh)
  if (byCount[0]!.n === 4) return pack(CAT_QUADS, byCount[0]!.rank, byCount[1]!.rank)
  if (byCount[0]!.n === 3 && byCount[1]!.n === 2) {
    return pack(CAT_BOAT, byCount[0]!.rank, byCount[1]!.rank)
  }
  if (flush) {
    const kickers = [...rankVals].sort((a, b) => b - a)
    return pack(CAT_FLUSH, kickers[0], kickers[1], kickers[2], kickers[3], kickers[4])
  }
  if (sHigh >= 0) return pack(CAT_STRAIGHT, sHigh)
  if (byCount[0]!.n === 3) {
    return pack(CAT_TRIPS, byCount[0]!.rank, byCount[1]!.rank, byCount[2]!.rank)
  }
  if (byCount[0]!.n === 2 && byCount[1]!.n === 2) {
    const highP = Math.max(byCount[0]!.rank, byCount[1]!.rank)
    const lowP = Math.min(byCount[0]!.rank, byCount[1]!.rank)
    return pack(CAT_TWOPAIR, highP, lowP, byCount[2]!.rank)
  }
  if (byCount[0]!.n === 2) {
    return pack(CAT_PAIR, byCount[0]!.rank, byCount[1]!.rank, byCount[2]!.rank, byCount[3]!.rank)
  }
  return pack(
    CAT_HIGH,
    byCount[0]!.rank,
    byCount[1]!.rank,
    byCount[2]!.rank,
    byCount[3]!.rank,
    byCount[4]!.rank,
  )
}

function combinations(n: number, k: number): number[][] {
  const out: number[][] = []
  const cur: number[] = []
  const rec = (start: number) => {
    if (cur.length === k) {
      out.push(cur.slice())
      return
    }
    for (let i = start; i <= n - (k - cur.length); i++) {
      cur.push(i)
      rec(i + 1)
      cur.pop()
    }
  }
  rec(0)
  return out
}

const COMBOS75 = combinations(7, 5)
const COMBOS65 = combinations(6, 5)

export function evaluateBest(cards: Card[]): number {
  if (cards.length === 5) return evaluate5(cards)
  const table = cards.length === 7 ? COMBOS75 : cards.length === 6 ? COMBOS65 : null
  if (!table) throw new Error('evaluateBest expects 5–7 cards')
  let best = -1
  for (const idx of table) {
    const score = evaluate5(idx.map((i) => cards[i]!))
    if (score > best) best = score
  }
  return best
}

export type EquityResult = {
  win: number
  tie: number
  lose: number
  equity: number
  trials: number
}

function compareShowdown(hero: Card[], villain: Card[], board: Card[]): number {
  const hs = evaluateBest([...hero, ...board])
  const vs = evaluateBest([...villain, ...board])
  if (hs > vs) return 1
  if (hs < vs) return -1
  return 0
}

function liveVillainCombos(hero: Card[], villainHands: string[], board: Card[]): [Card, Card][] {
  const combos: [Card, Card][] = []
  for (const label of villainHands) {
    for (const combo of expandSpecificCombos(label)) {
      const clash =
        combo.some((c) => hero.some((h) => sameCard(c, h))) ||
        combo.some((c) => board.some((b) => sameCard(c, b)))
      if (!clash) combos.push(combo)
    }
  }
  return combos
}

export function monteCarloEquity(args: {
  hero: Card[]
  villain: Card[]
  board?: Card[]
  trials?: number
  seed?: number
}): EquityResult {
  const board = args.board ?? []
  const trials = args.trials ?? 4000
  const remaining = removeCards(fullDeck(), [...args.hero, ...args.villain, ...board])
  const need = 5 - board.length
  const rand = args.seed !== undefined ? mulberry32(args.seed) : Math.random

  if (need === 0) {
    const cmp = compareShowdown(args.hero, args.villain, board)
    return {
      win: cmp > 0 ? 1 : 0,
      tie: cmp === 0 ? 1 : 0,
      lose: cmp < 0 ? 1 : 0,
      equity: cmp > 0 ? 1 : cmp === 0 ? 0.5 : 0,
      trials: 1,
    }
  }

  let win = 0
  let tie = 0
  let lose = 0
  for (let t = 0; t < trials; t++) {
    const pool = remaining.slice()
    shuffleInPlace(pool, rand)
    const cmp = compareShowdown(args.hero, args.villain, board.concat(pool.slice(0, need)))
    if (cmp > 0) win += 1
    else if (cmp < 0) lose += 1
    else tie += 1
  }
  return { win, tie, lose, equity: (win + tie / 2) / trials, trials }
}

export function equityVsRange(args: {
  hero: Card[]
  villainHands: string[]
  board?: Card[]
  trials?: number
  seed?: number
}): EquityResult {
  const board = args.board ?? []
  const trials = args.trials ?? 4000
  const rand = args.seed !== undefined ? mulberry32(args.seed) : Math.random
  const combos = liveVillainCombos(args.hero, args.villainHands, board)
  if (combos.length === 0) {
    return { win: 0, tie: 0, lose: 0, equity: 0, trials: 0 }
  }

  let win = 0
  let tie = 0
  let lose = 0
  const need = 5 - board.length
  for (let t = 0; t < trials; t++) {
    const villain = combos[Math.floor(rand() * combos.length)]!
    const remaining = removeCards(fullDeck(), [...args.hero, ...villain, ...board])
    shuffleInPlace(remaining, rand)
    const runout = board.concat(remaining.slice(0, need))
    const cmp = compareShowdown(args.hero, villain, runout)
    if (cmp > 0) win += 1
    else if (cmp < 0) lose += 1
    else tie += 1
  }
  return { win, tie, lose, equity: (win + tie / 2) / trials, trials }
}

export function categoryName(score: number): string {
  const cat = Math.floor(score / 16 ** 5)
  switch (cat) {
    case CAT_STFLUSH:
      return 'Straight flush'
    case CAT_QUADS:
      return 'Four of a kind'
    case CAT_BOAT:
      return 'Full house'
    case CAT_FLUSH:
      return 'Flush'
    case CAT_STRAIGHT:
      return 'Straight'
    case CAT_TRIPS:
      return 'Three of a kind'
    case CAT_TWOPAIR:
      return 'Two pair'
    case CAT_PAIR:
      return 'Pair'
    default:
      return 'High card'
  }
}
