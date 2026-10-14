export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const
export const SUITS = ['s', 'h', 'd', 'c'] as const
export const SUIT_NAMES: Record<Suit, string> = {
  s: 'spades',
  h: 'hearts',
  d: 'diamonds',
  c: 'clubs',
}

export type Rank = (typeof RANKS)[number]
export type Suit = (typeof SUITS)[number]

export type Card = {
  rank: Rank
  suit: Suit
}

export const RANK_VALUE: Record<Rank, number> = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5,
  '8': 6,
  '9': 7,
  T: 8,
  J: 9,
  Q: 10,
  K: 11,
  A: 12,
}

export const SUIT_VALUE: Record<Suit, number> = { c: 0, d: 1, h: 2, s: 3 }

export function cardId(card: Card): string {
  return `${card.rank}${card.suit}`
}

export function parseCard(text: string): Card {
  const raw = text.trim()
  if (raw.length < 2) throw new Error(`Bad card: ${text}`)
  const rank = raw[0]!.toUpperCase() as Rank
  const suit = raw[1]!.toLowerCase() as Suit
  if (!RANKS.includes(rank) || !SUITS.includes(suit)) {
    throw new Error(`Bad card: ${text}`)
  }
  return { rank, suit }
}

export function parseCards(text: string): Card[] {
  return text
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(parseCard)
}

export function formatCard(card: Card): string {
  return cardId(card)
}

export function sameCard(a: Card, b: Card): boolean {
  return a.rank === b.rank && a.suit === b.suit
}

export function fullDeck(): Card[] {
  const deck: Card[] = []
  for (const rank of RANKS) {
    for (const suit of SUITS) deck.push({ rank, suit })
  }
  return deck
}

export function removeCards(deck: Card[], dead: Card[]): Card[] {
  return deck.filter((card) => !dead.some((d) => sameCard(card, d)))
}

export function startingHandLabel(a: Card, b: Card): string {
  const i = RANKS.indexOf(a.rank)
  const j = RANKS.indexOf(b.rank)
  if (i === j) return `${a.rank}${b.rank}`
  const hi = i < j ? a.rank : b.rank
  const lo = i < j ? b.rank : a.rank
  return `${hi}${lo}${a.suit === b.suit ? 's' : 'o'}`
}

export function isRed(suit: Suit): boolean {
  return suit === 'h' || suit === 'd'
}

export function suitGlyph(suit: Suit): string {
  if (suit === 's') return '♠'
  if (suit === 'h') return '♥'
  if (suit === 'd') return '♦'
  return '♣'
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleInPlace<T>(items: T[], rand: () => number = Math.random): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = items[i]!
    items[i] = items[j]!
    items[j] = tmp
  }
  return items
}
