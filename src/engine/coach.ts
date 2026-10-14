import { callEV, equityNeeded, pct } from './math'
import { heroPosition } from './replay'
import { CHARTS, chartAction } from '../data/charts'
import type { HistAction, ReplayHand, Street } from '../data/hands'
import { startingHandLabel, parseCard } from './cards'

export type UserChoice = {
  type: 'fold' | 'check' | 'call' | 'bet' | 'raise'
  amount?: number
}

export type CoachNote = {
  grade: 'good' | 'ok' | 'leak'
  headline: string
  detail: string
  math?: string
  leak?: string
}

function openChartId(position: string): string | null {
  if (position === 'UTG') return 'open-utg'
  if (position === 'HJ') return 'open-hj'
  if (position === 'CO') return 'open-co'
  if (position === 'BTN') return 'open-btn'
  if (position === 'SB') return 'open-sb'
  return null
}

function labelFor(hand: ReplayHand): string {
  const hero = hand.players.find((p) => p.name === hand.hero)
  if (!hero || hero.hole.length < 2) return '??'
  return startingHandLabel(parseCard(hero.hole[0]!), parseCard(hero.hole[1]!))
}

export function coachDecision(args: {
  hand: ReplayHand
  street: Street
  pot: number
  toCall: number
  user: UserChoice
  hist: HistAction
}): CoachNote {
  const { hand, street, pot, toCall, user, hist } = args
  const matched = user.type === hist.type
  const pos = heroPosition(hand)
  const label = labelFor(hand)
  const lines: string[] = []

  if (matched) {
    lines.push(`In the real hand, ${hand.hero} also ${hist.type === 'raise' ? 'raised' : hist.type === 'bet' ? 'bet' : hist.type}. You took the same kind of action.`)
  } else {
    lines.push(
      `You chose to ${user.type}. In the real hand, ${hand.hero} chose to ${hist.type}${hist.amount ? ` (${hist.amount})` : ''}. Different is not always wrong — but you should know why they differ.`,
    )
  }

  let leak: string | undefined
  let grade: CoachNote['grade'] = matched ? 'good' : 'ok'

  if (toCall > 0) {
    const need = equityNeeded(pot, toCall)
    const evIfHalf = callEV(0.35, pot, toCall)
    lines.push(
      `The pot is ${pot}. Calling costs ${toCall}. That is a ${pct(need)} price — you need to win more than ${pct(need)} of the time (ignoring later streets) for a call to pay.`,
    )
    if (user.type === 'fold' && (hist.type === 'call' || hist.type === 'raise')) {
      grade = 'leak'
      leak = 'folding-too-much'
      lines.push(
        `Folding here means you never get to realize that price. The real player kept going. Ask: do I have any chance of improving, or of making them fold later?`,
      )
    }
    if (user.type === 'call' && hist.type === 'fold') {
      grade = 'ok'
      leak = 'calling-too-wide'
      lines.push(
        `Calling is only good if your hand wins often enough, or if you can win a bigger pot later. The real player gave up — they decided this hand was not worth the ${toCall}.`,
      )
    }
    void evIfHalf
  }

  if (street === 'preflop' && toCall === 0) {
    const chartId = openChartId(pos)
    const chart = chartId ? CHARTS.find((c) => c.id === chartId) : undefined
    if (chart) {
      const rec = chartAction(chart, label)
      const youRaise = user.type === 'raise' || user.type === 'bet'
      if (rec === 'raise' && !youRaise && user.type === 'fold') {
        grade = 'leak'
        leak = 'folding-opens'
        lines.push(`From ${pos}, our study chart opens ${label}. Folding it is a common beginner leak — you are throwing away a hand that should fight.`)
      } else if (rec === 'fold' && youRaise) {
        grade = 'leak'
        leak = 'opening-junk'
        lines.push(`From ${pos}, our study chart folds ${label}. Raising it is playing too many hands from a bad seat.`)
      } else if (chartId) {
        lines.push(`Study-chart note from ${pos}: ${label} is a ${rec.toUpperCase()} in the classroom charts (teaching shape, not a solver print).`)
      }
    }
  }

  const headline =
    grade === 'good'
      ? 'Same idea as the real hand.'
      : grade === 'leak'
        ? 'This is a leak to fix.'
        : 'Different from the real hand — sit with why.'

  return {
    grade,
    headline,
    detail: lines.join(' '),
    math: toCall > 0 ? `Need ${pct(equityNeeded(pot, toCall))} equity to call ${toCall} into ${pot}.` : undefined,
    leak,
  }
}
