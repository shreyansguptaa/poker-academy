import { mulberry32, parseCards, type Card } from './cards'
import {
  alpha,
  callEV,
  equityNeededFromBet,
  mdf,
  nearInt,
  potAfterBet,
} from './math'
import { remainingCombos } from './ranges'
import { CHARTS, chartAction, type ChartDef } from '../data/charts'

export type QuizKind = 'odds' | 'sizing' | 'preflop' | 'combos'

export type QuizQuestion =
  | {
      kind: 'odds'
      prompt: string
      potBefore: number
      bet: number
      equity: number
      needed: number
      ev: number
      answer: 'call' | 'fold'
      explanation: string
    }
  | {
      kind: 'sizing'
      prompt: string
      potBefore: number
      choices: { label: string; bet: number }[]
      target: 'mdf' | 'alpha'
      correctIndex: number
      explanation: string
    }
  | {
      kind: 'preflop'
      prompt: string
      hand: string
      chartId: string
      answer: 'fold' | 'call' | 'raise'
      explanation: string
    }
  | {
      kind: 'combos'
      prompt: string
      hand: string
      dead: Card[]
      answer: number
      explanation: string
    }

const ODDS_SPOTS = [
  { potBefore: 100, bet: 50, equity: 0.28 },
  { potBefore: 80, bet: 80, equity: 0.3 },
  { potBefore: 120, bet: 40, equity: 0.22 },
  { potBefore: 60, bet: 20, equity: 0.18 },
  { potBefore: 150, bet: 75, equity: 0.33 },
  { potBefore: 90, bet: 30, equity: 0.2 },
  { potBefore: 200, bet: 50, equity: 0.16 },
  { potBefore: 75, bet: 75, equity: 0.38 },
]

const SIZING_POTS = [60, 90, 100, 120, 150]
const SIZE_FRACS = [
  { label: '33%', frac: 1 / 3 },
  { label: '50%', frac: 0.5 },
  { label: '66%', frac: 2 / 3 },
  { label: '100%', frac: 1 },
  { label: '150%', frac: 1.5 },
]

const COMBO_SPOTS: { hand: string; dead: string; note: string }[] = [
  { hand: 'QQ', dead: 'Qh 7c 2s', note: 'one queen is on the board' },
  { hand: 'AA', dead: 'Ah Kd 9c', note: 'one ace is dead' },
  { hand: 'AKs', dead: 'Ah 7s 2c', note: 'the ace of hearts blocks AhKh' },
  { hand: 'AKo', dead: 'Ah Kd 2c', note: 'Ah and Kd remove several offsuit combos' },
  { hand: 'JJ', dead: 'Jh Js 8d', note: 'two jacks are already out' },
  { hand: 'T9s', dead: 'Th 9c 2d', note: 'Th blocks T9s hearts' },
  { hand: 'KK', dead: 'Kc 8h 3d As', note: 'one king is on the board' },
  { hand: 'A5s', dead: 'Ac 5c 2h', note: 'clubs ace and five are dead' },
]

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length)]!
}

export function makeQuiz(kind: QuizKind, seed: number): QuizQuestion {
  const rand = mulberry32(seed)
  if (kind === 'odds') return makeOdds(rand)
  if (kind === 'sizing') return makeSizing(rand)
  if (kind === 'preflop') return makePreflop(rand)
  return makeCombos(rand)
}

function makeOdds(rand: () => number): QuizQuestion {
  const spot = pick(ODDS_SPOTS, rand)
  const needed = equityNeededFromBet(spot.potBefore, spot.bet)
  const potNow = potAfterBet(spot.potBefore, spot.bet)
  const ev = callEV(spot.equity, potNow, spot.bet)
  const answer = ev >= 0 ? 'call' : 'fold'
  return {
    kind: 'odds',
    potBefore: spot.potBefore,
    bet: spot.bet,
    equity: spot.equity,
    needed,
    ev,
    answer,
    prompt: `Pot is $${spot.potBefore} before the bet. Villain bets $${spot.bet}. You have ${(spot.equity * 100).toFixed(0)}% equity. Call or fold?`,
    explanation: `The pot is now $${potNow}. You call $${spot.bet} to win $${potNow + spot.bet}. Equity needed is ${(needed * 100).toFixed(1)}%. Call EV = ${(spot.equity * 100).toFixed(0)}% × $${(potNow + spot.bet).toFixed(0)} − $${spot.bet} = $${ev.toFixed(1)}. ${answer === 'call' ? 'EV is ≥ 0, so calling is correct (ignoring implied odds).' : 'EV is negative, so folding is correct (ignoring implied odds).'}`,
  }
}

function makeSizing(rand: () => number): QuizQuestion {
  const potBefore = pick(SIZING_POTS, rand)
  const choices = SIZE_FRACS.map((s) => ({
    label: `${s.label} ($${Math.round(potBefore * s.frac)})`,
    bet: Math.round(potBefore * s.frac),
  }))
  const target = rand() < 0.5 ? 'mdf' : 'alpha'
  const correctIndex = Math.floor(rand() * choices.length)
  const bet = choices[correctIndex]!.bet
  const value = target === 'mdf' ? mdf(potBefore, bet) : alpha(potBefore, bet)
  const label = target === 'mdf' ? 'MDF' : 'bluff share (α)'
  return {
    kind: 'sizing',
    potBefore,
    choices,
    target,
    correctIndex,
    prompt: `Pot is $${potBefore}. Which bet size has ${label} ≈ ${(value * 100).toFixed(0)}%?`,
    explanation: choices
      .map((c) => {
        const m = mdf(potBefore, c.bet)
        const a = alpha(potBefore, c.bet)
        return `${c.label}: MDF ${(m * 100).toFixed(0)}%, α ${(a * 100).toFixed(0)}%`
      })
      .join(' · ') + `. MDF = pot / (pot + bet). α = bet / (pot + 2 × bet).`,
  }
}

function makePreflop(rand: () => number): QuizQuestion {
  const chart = pick(CHARTS, rand)
  const hands = [...chart.actions.keys()]
  const hand = pick(hands, rand)
  const answer = chartAction(chart, hand)
  const verb =
    chart.kind === 'open' ? 'open' : chart.kind === 'threebet' ? '3-bet / call / fold' : '3-bet / defend / fold'
  return {
    kind: 'preflop',
    hand,
    chartId: chart.id,
    answer,
    prompt: `${chart.title}, 100bb 6-max. You have ${hand}. What does the study chart do? (${verb})`,
    explanation: `On the ${chart.title} chart, ${hand} is a ${answer.toUpperCase()}. These are educational 6-max approximations — memorize the shape, not a solver print.`,
  }
}

function makeCombos(rand: () => number): QuizQuestion {
  const spot = pick(COMBO_SPOTS, rand)
  const dead = parseCards(spot.dead)
  const answer = remainingCombos(spot.hand, dead)
  const full = remainingCombos(spot.hand, [])
  return {
    kind: 'combos',
    hand: spot.hand,
    dead,
    answer,
    prompt: `Board / dead cards: ${spot.dead}. How many combos of ${spot.hand} remain?`,
    explanation: `${spot.hand} starts with ${full} combos. ${spot.note[0]!.toUpperCase()}${spot.note.slice(1)}, so ${answer} combo${answer === 1 ? '' : 's'} remain.`,
  }
}

export function gradeQuiz(
  question: QuizQuestion,
  input: string | number,
): { correct: boolean; detail: string } {
  if (question.kind === 'odds') {
    const guess = String(input).toLowerCase()
    return {
      correct: guess === question.answer,
      detail: question.explanation,
    }
  }
  if (question.kind === 'sizing') {
    const idx = typeof input === 'number' ? input : Number(input)
    return {
      correct: idx === question.correctIndex,
      detail: question.explanation,
    }
  }
  if (question.kind === 'preflop') {
    return {
      correct: String(input) === question.answer,
      detail: question.explanation,
    }
  }
  const n = typeof input === 'number' ? input : Number(input)
  return {
    correct: nearInt(n, question.answer),
    detail: question.explanation,
  }
}

export function chartById(id: string): ChartDef | undefined {
  return CHARTS.find((c) => c.id === id)
}
