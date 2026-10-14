import { actionMap, rangeComboCount, rangePercent, type HandAction } from '../engine/ranges'

export type ChartKind = 'open' | 'threebet' | 'defend'

export type ChartDef = {
  id: string
  title: string
  kind: ChartKind
  position: string
  vs: string | null
  blurb: string
  raiseSpec: string
  callSpec: string
  actions: Map<string, HandAction>
}

function chart(
  id: string,
  title: string,
  kind: ChartKind,
  position: string,
  vs: string | null,
  blurb: string,
  raiseSpec: string,
  callSpec = '',
): ChartDef {
  return {
    id,
    title,
    kind,
    position,
    vs,
    blurb,
    raiseSpec,
    callSpec,
    actions: actionMap(raiseSpec, callSpec),
  }
}

/**
 * Original educational 6-max 100bb cash approximations.
 * These are study charts for learning shape (tight early, wide on the button),
 * not a commercial solver print.
 */
export const CHARTS: ChartDef[] = [
  chart(
    'open-utg',
    'UTG open',
    'open',
    'UTG',
    null,
    'First in, five players behind. Value-heavy: pairs, strong broadway, a few suited connectors.',
    '22+, A9s+, A5s, AJo+, KTs+, KQo, QTs+, JTs, T9s, 98s, 87s',
  ),
  chart(
    'open-hj',
    'HJ open',
    'open',
    'HJ',
    null,
    'One seat later — add more suited aces, suited connectors, and offsuit broadway.',
    '22+, A4s+, ATo+, K9s+, KJo+, Q9s+, QJo, J9s+, T8s+, 97s+, 87s, 76s, 65s',
  ),
  chart(
    'open-co',
    'CO open',
    'open',
    'CO',
    null,
    'Cutoff opens a real stealing range: more offsuit aces and suited gappers.',
    '22+, A2s+, A9o+, K7s+, KTo+, Q8s+, QTo+, J8s+, JTo, T8s+, T9o, 97s+, 86s+, 76s, 65s, 54s',
  ),
  chart(
    'open-btn',
    'BTN open',
    'open',
    'BTN',
    null,
    'The button is the widest open. Almost any suited hand and a lot of offsuit Broadway + connectors.',
    '22+, A2s+, A2o+, K4s+, K9o+, Q6s+, Q9o+, J6s+, J8o+, T6s+, T8o+, 96s+, 98o, 85s+, 87o, 75s+, 76o, 64s+, 54s, 43s',
  ),
  chart(
    'open-sb',
    'SB open',
    'open',
    'SB',
    null,
    'You will be out of position postflop, so the SB open is wider than UTG but tighter than the button.',
    '22+, A2s+, A8o+, K6s+, KTo+, Q8s+, QTo+, J8s+, JTo, T7s+, T9o, 97s+, 86s+, 76s, 65s, 54s',
  ),
  chart(
    '3bet-vs-utg',
    '3-bet vs UTG',
    'threebet',
    'any',
    'UTG',
    'Versus a tight open: 3-bet a value-heavy core plus a few suited-ace bluffs. Flat some pairs and suited Broadway in position.',
    'TT+, AQs+, AKo, A5s, A4s',
    '99, 88, 77, 66, AJs, ATs, AQo, KQs, KJs, QJs, JTs',
  ),
  chart(
    '3bet-vs-co',
    '3-bet vs CO',
    'threebet',
    'BTN/blinds',
    'CO',
    'The cutoff open is wider, so both value and bluff 3-bets expand. Still flat playable suited hands.',
    '88+, AJs+, AQo+, KQs, A5s, A4s, A3s, 76s, 65s',
    '77, 66, 55, 44, ATs, KJs, KQo, QJs, JTs, T9s, 98s',
  ),
  chart(
    '3bet-vs-btn',
    '3-bet vs BTN',
    'threebet',
    'blinds',
    'BTN',
    'Button opens very wide. 3-bet more suited aces and connectors; call a wide defended range from the big blind.',
    '77+, ATs+, AJo+, KQs, KJs, A5s, A4s, A3s, A2s, 76s, 65s, 54s',
    '66, 55, 44, 33, 22, A9s, A8s, A7s, A6s, KTs, QTs, QJs, JTs, T9s, 98s, 87s, KQo, ATo',
  ),
  chart(
    'bb-vs-utg',
    'BB defend vs UTG',
    'defend',
    'BB',
    'UTG',
    'Closing the action vs a tight range: defend the top of your range and suited hands that play well multi-street.',
    'TT+, AQs+, AKo',
    '99, 88, 77, 66, 55, 44, 33, AJs, ATs, A9s, A8s, A7s, A6s, A5s, A4s, A3s, A2s, AQo, AJo, ATo, KQs, KJs, KTs, K9s, KQo, QJs, QTs, Q9s, JTs, J9s, T9s, T8s, 98s, 97s, 87s, 76s, 65s, 54s',
  ),
  chart(
    'bb-vs-co',
    'BB defend vs CO',
    'defend',
    'BB',
    'CO',
    'Versus a cutoff open you can defend much wider — pot odds plus position disadvantage, but their range is steal-heavy.',
    '88+, AJs+, AQo+, KQs, A5s, A4s',
    '77, 66, 55, 44, 33, 22, ATs, A9s, A8s, A7s, A6s, A3s, A2s, ATo, A9o, A8o, KJs, KTs, K9s, K8s, KQo, KJo, KTo, QJs, QTs, Q9s, Q8s, QJo, JTs, J9s, J8s, JTo, T9s, T8s, T7s, 98s, 97s, 87s, 86s, 76s, 75s, 65s, 64s, 54s, 43s',
  ),
  chart(
    'bb-vs-btn',
    'BB defend vs BTN',
    'defend',
    'BB',
    'BTN',
    'Widest defend. You are getting a price against a ~40% open; fold the worst offsuit junk and fight with suited hands.',
    '77+, ATs+, AJo+, KQs, KJs, A5s, A4s, A3s, A2s',
    '66, 55, 44, 33, 22, A9s, A8s, A7s, A6s, ATo, A9o, A8o, A7o, A5o, A4o, KTs, K9s, K8s, K7s, KQo, KJo, KTo, K9o, QJs, QTs, Q9s, Q8s, Q7s, QJo, QTo, JTs, J9s, J8s, J7s, JTo, J9o, T9s, T8s, T7s, T6s, T9o, T8o, 98s, 97s, 96s, 98o, 87s, 86s, 85s, 87o, 76s, 75s, 74s, 76o, 65s, 64s, 54s, 53s, 43s, 32s',
  ),
]

export function chartAction(chart: ChartDef, hand: string): HandAction {
  return chart.actions.get(hand) ?? 'fold'
}

export function chartStats(chart: ChartDef): { raise: number; call: number; fold: number; raisePct: number; continuePct: number } {
  const raiseHands: string[] = []
  const callHands: string[] = []
  for (const [hand, action] of chart.actions) {
    if (action === 'raise') raiseHands.push(hand)
    if (action === 'call') callHands.push(hand)
  }
  const raise = rangeComboCount(raiseHands)
  const call = rangeComboCount(callHands)
  return {
    raise,
    call,
    fold: 1326 - raise - call,
    raisePct: rangePercent(raiseHands),
    continuePct: (raise + call) / 1326,
  }
}

export function chartsByKind(kind: ChartKind): ChartDef[] {
  return CHARTS.filter((c) => c.kind === kind)
}
