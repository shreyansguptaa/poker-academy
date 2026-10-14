import { useState } from 'react'
import {
  alpha,
  callEV,
  equityNeededFromBet,
  impliedOddsNeeded,
  mdf,
  money,
  pct,
  potAfterBet,
  raiseEV,
  spr,
} from '../engine/math'
import { parseCards } from '../engine/cards'
import { comboWeight, normalizeHand, remainingCombos } from '../engine/ranges'
import { equityVsRange, monteCarloEquity } from '../engine/equity'
import { NumberField } from './NumberField'
import { Formula } from './Formula'
import { RangeGrid, RangeLegend } from './RangeGrid'
import { CHARTS, chartStats } from '../data/charts'

export function PotOddsWidget({ compact = false }: { compact?: boolean }) {
  const [pot, setPot] = useState(100)
  const [bet, setBet] = useState(50)
  const potNow = potAfterBet(pot, bet)
  const need = equityNeededFromBet(pot, bet)
  return (
    <div className="stack">
      <div className="toolbar">
        <NumberField label="Pot before bet" value={pot} min={1} onChange={setPot} />
        <NumberField label="Bet you face" value={bet} min={0} onChange={setBet} />
      </div>
      <Formula
        eq={`Need ${pct(need)} = ${bet} / (${potNow} + ${bet})`}
        note={`Pot is now ${money(potNow)}. You risk ${money(bet)} to win ${money(potNow + bet)}.`}
      />
      {compact ? null : (
        <p className="muted">
          Half-pot needs 25%. Pot needs 33%. If your equity is higher than {pct(need)}, calling beats
          folding on this street.
        </p>
      )}
    </div>
  )
}

export function EvWidget() {
  const [pot, setPot] = useState(100)
  const [bet, setBet] = useState(50)
  const [eq, setEq] = useState(32)
  const [fold, setFold] = useState(30)
  const [raiseTo, setRaiseTo] = useState(150)
  const potNow = potAfterBet(pot, bet)
  const evCall = callEV(eq / 100, potNow, bet)
  const extra = Math.max(0, raiseTo - bet)
  const evRaise = raiseEV({
    equity: eq / 100,
    foldPct: fold / 100,
    potIncludingBet: potNow,
    raiseExtra: extra,
    villainCall: extra,
  })
  return (
    <div className="stack">
      <div className="toolbar">
        <NumberField label="Pot before bet" value={pot} min={1} onChange={setPot} />
        <NumberField label="Bet you face" value={bet} min={0} onChange={setBet} />
        <NumberField label="Your equity" value={eq} min={0} max={100} onChange={setEq} suffix="%" />
        <NumberField label="They fold" value={fold} min={0} max={100} onChange={setFold} suffix="%" />
        <NumberField label="You raise to" value={raiseTo} min={0} onChange={setRaiseTo} />
      </div>
      <Formula
        eq={`Call EV = ${pct(eq / 100, 0)} × ${money(potNow + bet)} − ${money(bet)} = ${money(evCall)}`}
        note={`Fold EV = $0. Raise EV (toy model) = ${money(evRaise)}. Pick the largest number.`}
      />
    </div>
  )
}

export function SprWidget() {
  const [stack, setStack] = useState(100)
  const [pot, setPot] = useState(6.5)
  const value = spr(stack, pot)
  const band = value <= 4 ? 'Low — commitment territory' : value <= 8 ? 'Mid — one more street of value' : 'High — implied-odds land'
  return (
    <div className="stack">
      <div className="toolbar">
        <NumberField label="Effective stack" value={stack} min={0} step={0.5} onChange={setStack} />
        <NumberField label="Pot" value={pot} min={0.5} step={0.5} onChange={setPot} />
      </div>
      <Formula eq={`SPR = ${stack} ÷ ${pot} = ${value.toFixed(1)}`} note={band} />
    </div>
  )
}

export function ImpliedWidget() {
  const [pot, setPot] = useState(80)
  const [bet, setBet] = useState(40)
  const [eq, setEq] = useState(18)
  const potNow = potAfterBet(pot, bet)
  const ev = callEV(eq / 100, potNow, bet)
  const need = impliedOddsNeeded(eq / 100, potNow, bet)
  return (
    <div className="stack">
      <div className="toolbar">
        <NumberField label="Pot before bet" value={pot} min={1} onChange={setPot} />
        <NumberField label="Call" value={bet} min={0} onChange={setBet} />
        <NumberField label="Equity now" value={eq} min={1} max={100} onChange={setEq} suffix="%" />
      </div>
      <Formula
        eq={`Call EV = ${money(ev)}. Extra needed ≈ ${money(need)}`}
        note={
          ev >= 0
            ? 'Already +EV. You do not need implied odds to call.'
            : `If you hit ~${pct(eq / 100, 0)} of the time, you need about ${money(need)} more from later streets when you get there.`
        }
      />
    </div>
  )
}

export function MdfWidget() {
  const [pot, setPot] = useState(100)
  const [bet, setBet] = useState(50)
  return (
    <div className="stack">
      <div className="toolbar">
        <NumberField label="Pot before bet" value={pot} min={1} onChange={setPot} />
        <NumberField label="Bet size" value={bet} min={0} onChange={setBet} />
      </div>
      <Formula
        eq={`MDF = ${pot} / (${pot} + ${bet}) = ${pct(mdf(pot, bet))}`}
        note={`α (river bluff share) = ${bet} / (${pot} + 2×${bet}) = ${pct(alpha(pot, bet))}. Fold more than ${pct(1 - mdf(pot, bet))} and pure bluffs print.`}
      />
    </div>
  )
}

export function SizingWidget() {
  const [pot, setPot] = useState(100)
  const sizes = [1 / 3, 0.5, 2 / 3, 1, 1.5]
  return (
    <div className="stack">
      <NumberField label="Pot" value={pot} min={1} onChange={setPot} />
      <div className="grid-3">
        {sizes.map((frac) => {
          const bet = Math.round(pot * frac)
          return (
            <div className="card" key={frac}>
              <div className="stat">
                <span>{Math.round(frac * 100)}% pot · {money(bet, 0)}</span>
                <b>{pct(mdf(pot, bet), 0)} MDF</b>
                <span>α {pct(alpha(pot, bet), 0)}</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="muted">Smaller bets demand more continues. Larger bets want a more polar range.</p>
    </div>
  )
}

export function ComboWidget() {
  const [hand, setHand] = useState('QQ')
  const [dead, setDead] = useState('Qh 7c 2s')
  let cards = [] as ReturnType<typeof parseCards>
  let error = ''
  try {
    cards = dead.trim() ? parseCards(dead) : []
  } catch (e) {
    error = e instanceof Error ? e.message : 'Bad cards'
  }
  let remain = 0
  let full = 0
  if (!error) {
    try {
      remain = remainingCombos(normalizeHand(hand), cards)
      full = comboWeight(normalizeHand(hand))
    } catch (e) {
      error = e instanceof Error ? e.message : 'Bad hand'
    }
  }
  return (
    <div className="stack">
      <div className="toolbar">
        <label className="field">
          <span>Starting hand</span>
          <input value={hand} onChange={(e) => setHand(e.target.value)} placeholder="AKs" />
        </label>
        <label className="field">
          <span>Dead cards</span>
          <input value={dead} onChange={(e) => setDead(e.target.value)} placeholder="Ah Kd 9c" />
        </label>
      </div>
      <Formula
        eq={`${normalizeHand(hand) || '—'} has ${remain} / ${full} combos left`}
        note={error || 'Pairs start at 6, suited at 4, offsuit at 12. Dead cards of those ranks remove combos.'}
      />
    </div>
  )
}

export function PositionsWidget() {
  const seats = [
    ['UTG', 'Tightest open. Five players behind.'],
    ['HJ', 'Still early. Slightly wider than UTG.'],
    ['CO', 'Steal seat. Add suited gappers.'],
    ['BTN', 'Widest open. Best seat in the game.'],
    ['SB', 'Out of position. Wider than UTG, tighter than BTN.'],
    ['BB', 'Closes the action. Defends by price.'],
  ]
  return (
    <div className="stack">
      {seats.map(([pos, note]) => (
        <div className="card" key={pos}>
          <strong>{pos}</strong>
          <p>{note}</p>
        </div>
      ))}
    </div>
  )
}

export function GridExplainerWidget() {
  const chart = CHARTS[0]!
  return (
    <div className="stack">
      <RangeLegend />
      <RangeGrid actions={chart.actions} />
      <p className="muted">UTG open on the grid. Suited hands sit above the diagonal; offsuit below; pairs on it.</p>
    </div>
  )
}

export function PolarWidget() {
  const linear = CHARTS.find((c) => c.id === 'open-utg')!
  const polar = CHARTS.find((c) => c.id === '3bet-vs-utg')!
  return (
    <div className="stack">
      <p className="muted">Left: linear UTG open. Right: more polar 3-bet vs UTG (value + Axs, medium pairs often flat).</p>
      <div className="grid-2">
        <div>
          <RangeLegend />
          <RangeGrid actions={linear.actions} />
        </div>
        <div>
          <RangeGrid actions={polar.actions} />
        </div>
      </div>
    </div>
  )
}

export function PreflopWidget() {
  const opens = CHARTS.filter((c) => c.kind === 'open')
  return (
    <div className="stack">
      <div className="grid-3">
        {opens.map((chart) => {
          const stats = chartStats(chart)
          return (
            <div className="card" key={chart.id}>
              <div className="stat">
                <span>{chart.position}</span>
                <b>{pct(stats.raisePct, 0)}</b>
                <span>open · {stats.raise} combos</span>
              </div>
            </div>
          )
        })}
      </div>
      <p className="muted">Study-chart shape only. Drill the actual grids in Range Trainer.</p>
    </div>
  )
}

export function ThreeBetWidget() {
  const chart = CHARTS.find((c) => c.id === 'bb-vs-btn')!
  const stats = chartStats(chart)
  return (
    <div className="stack">
      <RangeLegend />
      <RangeGrid actions={chart.actions} />
      <Formula
        eq={`BB vs BTN continues ${pct(stats.continuePct, 0)} (3-bet ${pct(stats.raisePct, 0)})`}
        note="You are getting a price against a wide open. Fold the worst offsuit junk; fight with suited hands."
      />
    </div>
  )
}

export function TextureWidget() {
  return (
    <div className="grid-2">
      <div className="card">
        <h3>A♥ 7♣ 2♠</h3>
        <p>Dry, high, rainbow. PFR has more aces. High-frequency small c-bet.</p>
      </div>
      <div className="card">
        <h3>9♣ 8♣ 7♥</h3>
        <p>Connected and two-tone. Caller’s suited connectors smash this. Check more.</p>
      </div>
      <div className="card">
        <h3>K♠ 7♠ 7♦</h3>
        <p>Paired. Lots of air. Small bets still fold out junk; watch trips.</p>
      </div>
      <div className="card">
        <h3>Q♣ J♣ 2♦</h3>
        <p>High and wet. Nut-flush and straight advantage decide whether you size up.</p>
      </div>
    </div>
  )
}

export function StreetsWidget() {
  const [flop, setFlop] = useState(33)
  const startPot = 6.5
  const flopBet = (startPot * flop) / 100
  const potFlop = startPot + 2 * flopBet
  const turnBet = potFlop * 0.66
  const potTurn = potFlop + 2 * turnBet
  const riverBet = potTurn * 0.66
  const potRiver = potTurn + 2 * riverBet
  return (
    <div className="stack">
      <NumberField label="Flop c-bet % of pot" value={flop} min={20} max={150} onChange={setFlop} />
      <Formula
        eq={`SRP ${startPot}bb → flop pot ${potFlop.toFixed(1)} → turn ${potTurn.toFixed(1)} → river ${potRiver.toFixed(1)}`}
        note={`If you then fire ~2/3 on turn (${turnBet.toFixed(1)}) and river (${riverBet.toFixed(1)}), you are building toward a 100bb stack-off — or leaving a lot behind if the flop size was tiny.`}
      />
    </div>
  )
}

export function EquityWidget() {
  const [hero, setHero] = useState('Ah Kd')
  const [villain, setVillain] = useState('Qs Qc')
  const [board, setBoard] = useState('')
  const [range, setRange] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string>('Run a sim to see equity.')

  const run = () => {
    setRunning(true)
    window.setTimeout(() => {
      try {
        const h = parseCards(hero)
        const b = board.trim() ? parseCards(board) : []
        if (range.trim()) {
          const hands = range
            .split(/[,\s]+/)
            .map((s) => s.trim())
            .filter(Boolean)
          const r = equityVsRange({ hero: h, villainHands: hands, board: b, trials: 3500, seed: 7 })
          setResult(`${hero} vs [${range}] has ${(r.equity * 100).toFixed(1)}% equity (${r.trials} trials).`)
        } else {
          const v = parseCards(villain)
          const r = monteCarloEquity({ hero: h, villain: v, board: b, trials: 4000, seed: 7 })
          setResult(`${hero} vs ${villain} has ${(r.equity * 100).toFixed(1)}% equity (${r.win} wins / ${r.tie} ties / ${r.lose} losses).`)
        }
      } catch (e) {
        setResult(e instanceof Error ? e.message : 'Could not run equity')
      }
      setRunning(false)
    }, 20)
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <label className="field">
          <span>Hero</span>
          <input value={hero} onChange={(e) => setHero(e.target.value)} />
        </label>
        <label className="field">
          <span>Villain hand</span>
          <input value={villain} onChange={(e) => setVillain(e.target.value)} />
        </label>
        <label className="field">
          <span>Board</span>
          <input value={board} onChange={(e) => setBoard(e.target.value)} placeholder="optional" />
        </label>
        <label className="field">
          <span>Or villain range</span>
          <input value={range} onChange={(e) => setRange(e.target.value)} placeholder="QQ, AKs, AKo" />
        </label>
      </div>
      <button className="btn" type="button" onClick={run} disabled={running}>
        {running ? 'Running…' : 'Run Monte Carlo'}
      </button>
      <Formula eq={result} note="Training-grade simulation, not a research solver. AK vs QQ should land near 43%." />
    </div>
  )
}

export function GameExplainerWidget() {
  return (
    <div className="stack">
      <div className="card">
        <h3>The game in one box</h3>
        <p>
          You and up to five others each get two secret cards. Five public cards come out later. Best
          five-card hand — or last person who didn’t fold — wins the chips in the middle.
        </p>
      </div>
      <div className="grid-2">
        <div className="card">
          <strong>No-limit</strong>
          <p>You may bet any amount, including all your chips. That is why decisions get scary — and interesting.</p>
        </div>
        <div className="card">
          <strong>Six seats</strong>
          <p>This app uses a 6-player table. That is the most common online cash setup.</p>
        </div>
      </div>
    </div>
  )
}

const STREETS = [
  { name: '1. Preflop', detail: 'You have only your two secret cards. People fold, call, or raise.' },
  { name: '2. Flop', detail: 'Three shared cards appear. Another round of betting.' },
  { name: '3. Turn', detail: 'A fourth shared card. Another round of betting.' },
  { name: '4. River', detail: 'The fifth and last shared card. Last bets. Then showdown if needed.' },
]

export function StreetWalkWidget() {
  const [step, setStep] = useState(0)
  const street = STREETS[step]!
  return (
    <div className="stack">
      <div className="card">
        <div className="stat">
          <span>Walk through one hand</span>
          <b>{street.name}</b>
          <span>{street.detail}</span>
        </div>
      </div>
      <div className="row">
        <button className="btn ghost" type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </button>
        <button
          className="btn"
          type="button"
          disabled={step === STREETS.length - 1}
          onClick={() => setStep((s) => s + 1)}
        >
          Next street
        </button>
      </div>
      <p className="muted">
        If everyone except one person folds at any point, that person wins the pot immediately. No
        showdown.
      </p>
    </div>
  )
}

const RANKS_DEMO = [
  { name: '1. Royal flush', ex: 'A♠ K♠ Q♠ J♠ T♠', note: 'The unbeatable hand. Almost never happens.' },
  { name: '2. Straight flush', ex: '9♥ 8♥ 7♥ 6♥ 5♥', note: 'Five in a row, same suit.' },
  { name: '3. Four of a kind', ex: 'Q♠ Q♥ Q♦ Q♣ 2♠', note: 'Four cards of one rank.' },
  { name: '4. Full house', ex: 'J♠ J♥ J♦ 4♣ 4♠', note: 'Three of one rank plus a pair.' },
  { name: '5. Flush', ex: 'A♣ J♣ 8♣ 5♣ 2♣', note: 'Five cards, same suit, not in a row.' },
  { name: '6. Straight', ex: '9♠ 8♥ 7♦ 6♣ 5♠', note: 'Five in a row, mixed suits.' },
  { name: '7. Three of a kind', ex: '8♠ 8♥ 8♦ K♣ 3♠', note: 'Also called trips or a set (set = you started with a pair).' },
  { name: '8. Two pair', ex: 'A♠ A♥ 5♦ 5♣ 9♠', note: 'Two different pairs.' },
  { name: '9. One pair', ex: 'K♠ K♥ 9♦ 6♣ 2♠', note: 'Most showdowns look like this.' },
  { name: '10. High card', ex: 'A♠ J♥ 8♦ 5♣ 3♠', note: 'Nothing connected. Highest card decides.' },
]

export function RankingsWidget() {
  const [i, setI] = useState(8)
  const row = RANKS_DEMO[i]!
  return (
    <div className="stack">
      <div className="card">
        <div className="stat">
          <span>Click a rank — stronger is higher on the list</span>
          <b>{row.name}</b>
          <span>{row.ex}</span>
        </div>
        <p style={{ marginTop: 8 }}>{row.note}</p>
      </div>
      <div className="rank-list">
        {RANKS_DEMO.map((item, idx) => (
          <button
            key={item.name}
            type="button"
            className={idx === i ? 'on' : ''}
            onClick={() => setI(idx)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  )
}

const ACTIONS = [
  { name: 'Fold', mean: 'I quit this hand. I put in no more chips. I cannot win this pot.' },
  { name: 'Check', mean: 'I stay in, but I bet nothing — only allowed if nobody has bet yet this street.' },
  { name: 'Call', mean: 'I match what you just bet so I can stay in.' },
  { name: 'Bet', mean: 'Nobody has bet yet. I put chips in and make you pay to continue.' },
  { name: 'Raise', mean: 'You already bet. I make it bigger.' },
]

export function BettingWidget() {
  const [i, setI] = useState(0)
  return (
    <div className="stack">
      <div className="row">
        {ACTIONS.map((action, idx) => (
          <button
            key={action.name}
            type="button"
            className={`btn${i === idx ? '' : ' ghost'}`}
            onClick={() => setI(idx)}
          >
            {action.name}
          </button>
        ))}
      </div>
      <div className="card">
        <h3>{ACTIONS[i]!.name}</h3>
        <p>{ACTIONS[i]!.mean}</p>
      </div>
    </div>
  )
}

export function BlindsWidget() {
  const [bb, setBb] = useState(2)
  return (
    <div className="stack">
      <NumberField label="Big blind at this table" value={bb} min={1} step={1} onChange={setBb} />
      <Formula
        eq={`Small blind $${(bb / 2).toFixed(0)} · Big blind $${bb} · A “100bb” stack is $${bb * 100}`}
        note="We talk in big blinds so a cheap table and an expensive table use the same strategy numbers."
      />
    </div>
  )
}

export function RangePlainWidget() {
  return (
    <div className="stack">
      <p className="muted">
        You cannot see their two cards. A range is your guess at every hand they would still play this
        way. Green on the grid = “I would raise with this.” Dark = “I fold this.”
      </p>
      <RangeLegend />
      <RangeGrid actions={CHARTS[0]!.actions} />
      <p className="muted">
        This is an Under-the-Gun opening range — the tightest seat. Do not memorize it tonight. Just
        notice: the strong stuff lives in the top-left.
      </p>
    </div>
  )
}
