import { RANKS, type Card, type Rank } from './cards'

export type HandAction = 'fold' | 'call' | 'raise'
export type HandKind = 'pair' | 'suited' | 'offsuit'

export function gridHand(row: number, col: number): string {
  if (row === col) return `${RANKS[row]}${RANKS[col]}`
  const hi = Math.min(row, col)
  const lo = Math.max(row, col)
  return `${RANKS[hi]}${RANKS[lo]}${col > row ? 's' : 'o'}`
}

export function allStartingHands(): string[] {
  const hands: string[] = []
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) hands.push(gridHand(r, c))
  }
  return hands
}

export function normalizeHand(hand: string): string {
  const t = hand.trim()
  if (t.length === 2) return t.toUpperCase()
  return `${t.slice(0, 2).toUpperCase()}${t.slice(2).toLowerCase()}`
}

export function handKind(hand: string): HandKind {
  if (hand.length === 2) return 'pair'
  return hand.endsWith('s') ? 'suited' : 'offsuit'
}

export function comboWeight(hand: string): number {
  const kind = handKind(hand)
  if (kind === 'pair') return 6
  if (kind === 'suited') return 4
  return 12
}

export function parseHandLabel(hand: string): { a: Rank; b: Rank; kind: HandKind } {
  const a = hand[0] as Rank
  const b = hand[1] as Rank
  return { a, b, kind: handKind(hand) }
}

function rankIndex(rank: string): number {
  const i = RANKS.indexOf(rank as Rank)
  if (i < 0) throw new Error(`Bad rank: ${rank}`)
  return i
}

function expandToken(raw: string): string[] {
  const token = raw.trim()
  if (!token) return []
  const plus = token.endsWith('+')
  const core = plus ? token.slice(0, -1) : token

  if (/^[2-9TJQKA]{2}$/i.test(core) && core[0]!.toUpperCase() === core[1]!.toUpperCase()) {
    const rank = core[0]!.toUpperCase()
    const from = rankIndex(rank)
    if (!plus) return [`${rank}${rank}`]
    return RANKS.slice(0, from + 1).map((r) => `${r}${r}`)
  }

  const m = core.match(/^([2-9TJQKA])([2-9TJQKA])([so])$/i)
  if (!m) throw new Error(`Bad range token: ${raw}`)
  const a = m[1]!.toUpperCase()
  const b = m[2]!.toUpperCase()
  const so = m[3]!.toLowerCase()
  const i = rankIndex(a)
  const j = rankIndex(b)
  if (i >= j) throw new Error(`Bad range token: ${raw}`)
  if (!plus) return [`${a}${b}${so}`]

  const gap = j - i
  // Broadway (A–J): keep the high card, improve the kicker. A9s+, KTo+.
  // Connected / 1-gap mid hands: shift the pair toward broadway. 98s+, T8s+.
  // Wider leftovers (T6s+, 85s+): keep the high card, improve the kicker.
  if (i <= 3 || gap >= 3) {
    const hands: string[] = []
    for (let k = j; k > i; k--) hands.push(`${a}${RANKS[k]}${so}`)
    return hands
  }
  const hands: string[] = []
  for (let hi = i; hi >= 0; hi--) {
    const lo = hi + gap
    if (lo > 12) continue
    hands.push(`${RANKS[hi]}${RANKS[lo]}${so}`)
  }
  return hands
}

export function expandRange(spec: string): Set<string> {
  const hands = new Set<string>()
  if (!spec.trim()) return hands
  for (const part of spec.split(',')) {
    for (const hand of expandToken(part)) hands.add(hand)
  }
  return hands
}

export function rangeComboCount(hands: Iterable<string>): number {
  let n = 0
  for (const hand of hands) n += comboWeight(hand)
  return n
}

export function rangePercent(hands: Iterable<string>): number {
  return rangeComboCount(hands) / 1326
}

export function actionMap(raiseSpec: string, callSpec = ''): Map<string, HandAction> {
  const map = new Map<string, HandAction>()
  for (const hand of allStartingHands()) map.set(hand, 'fold')
  for (const hand of expandRange(callSpec)) map.set(hand, 'call')
  for (const hand of expandRange(raiseSpec)) map.set(hand, 'raise')
  return map
}

export function expandSpecificCombos(hand: string): [Card, Card][] {
  const { a, b, kind } = parseHandLabel(hand)
  const combos: [Card, Card][] = []
  if (kind === 'pair') {
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        combos.push([
          { rank: a, suit: ['s', 'h', 'd', 'c'][i] as Card['suit'] },
          { rank: b, suit: ['s', 'h', 'd', 'c'][j] as Card['suit'] },
        ])
      }
    }
    return combos
  }
  const suits = ['s', 'h', 'd', 'c'] as const
  if (kind === 'suited') {
    for (const suit of suits) {
      combos.push([
        { rank: a, suit },
        { rank: b, suit },
      ])
    }
    return combos
  }
  for (const s1 of suits) {
    for (const s2 of suits) {
      if (s1 === s2) continue
      combos.push([
        { rank: a, suit: s1 },
        { rank: b, suit: s2 },
      ])
    }
  }
  return combos
}

/** Remaining combos of a starting hand given dead cards (board + hole). */
export function remainingCombos(hand: string, dead: Card[] = []): number {
  const { a, b, kind } = parseHandLabel(hand)
  if (kind === 'pair') {
    const used = dead.filter((c) => c.rank === a).length
    const left = 4 - used
    return left >= 2 ? (left * (left - 1)) / 2 : 0
  }
  const suits = ['s', 'h', 'd', 'c'] as const
  const deadSet = new Set(dead.map((c) => `${c.rank}${c.suit}`))
  let n = 0
  if (kind === 'suited') {
    for (const suit of suits) {
      if (!deadSet.has(`${a}${suit}`) && !deadSet.has(`${b}${suit}`)) n += 1
    }
    return n
  }
  for (const s1 of suits) {
    for (const s2 of suits) {
      if (s1 === s2) continue
      if (!deadSet.has(`${a}${s1}`) && !deadSet.has(`${b}${s2}`)) n += 1
    }
  }
  return n
}

export function overlapScore(
  painted: Map<string, HandAction>,
  truth: Map<string, HandAction>,
): { correct: number; total: number; percent: number } {
  let correct = 0
  const total = 169
  for (const hand of allStartingHands()) {
    if ((painted.get(hand) ?? 'fold') === (truth.get(hand) ?? 'fold')) correct += 1
  }
  return { correct, total, percent: correct / total }
}
