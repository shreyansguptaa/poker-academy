/** Call amount as a fraction of the pot you win if you are good. */
export function potOdds(potIncludingBet: number, call: number): number {
  if (potIncludingBet + call <= 0) return 0
  return call / (potIncludingBet + call)
}

/** Same number, often taught as "equity you need to break even on a call". */
export function equityNeeded(potIncludingBet: number, call: number): number {
  return potOdds(potIncludingBet, call)
}

/**
 * Build the facing-bet pot from "pot before villain bets" + bet size.
 * Current pot = prior + bet; you call `bet`.
 */
export function potAfterBet(potBefore: number, bet: number): number {
  return potBefore + bet
}

export function equityNeededFromBet(potBefore: number, bet: number): number {
  return equityNeeded(potAfterBet(potBefore, bet), bet)
}

/** EV of calling, then showdown (no future cards / implied odds). Fold EV is 0.
 *  You always put `call` in; you get pot+call back with probability `equity`.
 *  Equivalent: equity × pot − (1 − equity) × call.
 */
export function callEV(equity: number, potIncludingBet: number, call: number): number {
  return equity * (potIncludingBet + call) - call
}

export function foldEV(): number {
  return 0
}

/**
 * Simple raise EV: they fold `foldPct` of the time and you win the current pot;
 * when called you realize `equity` at a final pot of current + raise + call.
 */
export function raiseEV(args: {
  equity: number
  foldPct: number
  potIncludingBet: number
  raiseExtra: number
  villainCall: number
}): number {
  const { equity, foldPct, potIncludingBet, raiseExtra, villainCall } = args
  const foldWin = potIncludingBet
  const calledPot = potIncludingBet + raiseExtra + villainCall
  const calledEV = equity * calledPot - raiseExtra
  return foldPct * foldWin + (1 - foldPct) * calledEV
}

export function spr(effectiveStack: number, pot: number): number {
  if (pot <= 0) return Infinity
  return effectiveStack / pot
}

/** Minimum continue frequency vs a bet. MDF = pot / (pot + bet). */
export function mdf(potBefore: number, bet: number): number {
  if (potBefore + bet <= 0) return 0
  return potBefore / (potBefore + bet)
}

/**
 * River bluff share of a betting range that makes the caller indifferent.
 * alpha = bet / (pot + 2 * bet). Pot-sized bet → 1/3 bluffs.
 */
export function alpha(potBefore: number, bet: number): number {
  const denom = potBefore + 2 * bet
  if (denom <= 0) return 0
  return bet / denom
}

/** How many extra dollars you need to win later to make a call break even. */
export function impliedOddsNeeded(
  equity: number,
  potIncludingBet: number,
  call: number,
): number {
  const ev = callEV(equity, potIncludingBet, call)
  if (ev >= 0) return 0
  if (equity <= 0) return Infinity
  return -ev / equity
}

export function pct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '∞'
  return `${(value * 100).toFixed(digits)}%`
}

export function money(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '∞'
  const sign = value < 0 ? '−' : ''
  return `${sign}$${Math.abs(value).toFixed(digits)}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function near(value: number, target: number, tol = 0.015): boolean {
  return Math.abs(value - target) <= tol
}

export function nearInt(value: number, target: number, tol = 0.51): boolean {
  return Math.abs(value - target) <= tol
}
