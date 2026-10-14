import { useMemo, useState } from 'react'
import { HANDS } from '../../data/hands'
import type { HistAction } from '../../data/hands'
import {
  actionLabel,
  heroHandLabel,
  heroPosition,
  nextHeroDecision,
  replayTo,
} from '../../engine/replay'
import { coachDecision, type CoachNote, type UserChoice } from '../../engine/coach'
import { PlayingCard } from '../../components/PlayingCard'
import { recordPlay, loadProgress, playStats } from '../../lib/progress'
import { positionName } from '../../data/hands'

function fmt(n: number, bb: number): string {
  if (bb >= 500) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return `${(n / bb).toFixed(n % bb === 0 ? 0 : 1)}bb`
}

export function PlayPage() {
  const [index, setIndex] = useState(1)
  const hand = HANDS[index] ?? HANDS[0]!
  const [cursor, setCursor] = useState(() => Math.max(0, nextHeroDecision(hand, 0)))
  const [note, setNote] = useState<CoachNote | null>(null)
  const [done, setDone] = useState(false)
  const stats = playStats(loadProgress())

  const state = useMemo(() => replayTo(hand, cursor === -1 ? hand.actions.length : cursor), [hand, cursor])
  const hist = cursor >= 0 ? hand.actions[cursor] : undefined
  const deciding = Boolean(hist && hist.player === hand.hero && !note && !done)

  const loadHand = (i: number) => {
    const next = HANDS[i] ?? HANDS[0]!
    setIndex(i)
    const start = nextHeroDecision(next, 0)
    setCursor(start === -1 ? next.actions.length : start)
    setNote(null)
    setDone(start === -1)
  }

  const choose = (user: UserChoice) => {
    if (!hist) return
    const taught = coachDecision({
      hand,
      street: state.street,
      pot: state.pot,
      toCall: state.toCall,
      user,
      hist,
    })
    setNote(taught)
    recordPlay(hand.id, taught.grade, taught.leak)
  }

  const continueHand = () => {
    const after = cursor + 1
    const nxt = nextHeroDecision(hand, after)
    setNote(null)
    if (nxt === -1) {
      setCursor(hand.actions.length)
      setDone(true)
    } else {
      setCursor(nxt)
    }
  }

  const board = hand.board.slice(0, state.boardShown)

  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">Play a real table</p>
        <h1>Sit down. The other seats already happened.</h1>
        <p>
          These are real published hands: mostly{' '}
          <strong>Pluribus vs humans in 2019</strong> (the Science paper), plus one famous televised
          pot. You sit in one seat. Everyone else plays their real line. After you act, a coach
          compares you to what that person actually did — and to the classroom math.
        </p>
      </header>

      <div className="row">
        <button className="btn ghost" type="button" onClick={() => loadHand((index + HANDS.length - 1) % HANDS.length)}>
          Previous hand
        </button>
        <button className="btn" type="button" onClick={() => loadHand((index + 1) % HANDS.length)}>
          Next hand
        </button>
        <span className="muted">
          Hand {index + 1}/{HANDS.length} · {stats.goods} matched · {stats.leaks} leaks spotted
        </span>
      </div>

      <p className="muted">
        {hand.event}. You are <strong>{hand.hero}</strong> ({heroPosition(hand)}) with {heroHandLabel(hand)}.
      </p>

      <div className="felt">
        <div className="felt-center">
          <div className="row">
            {board.length ? board.map((c) => <PlayingCard key={c} code={c} />) : <span className="muted">No board yet (preflop)</span>}
          </div>
          <div className="pot-chip">Pot {fmt(state.pot, hand.stakes.bb)}</div>
          <div className="muted" style={{ fontSize: 13 }}>
            {state.street}
          </div>
        </div>
        {hand.players.map((p, i) => {
          const n = hand.players.length
          const heroI = hand.players.findIndex((x) => x.name === hand.hero)
          const angle = ((i - heroI) / n) * 2 * Math.PI + Math.PI / 2
          const left = 50 + Math.cos(angle) * 38
          const top = 50 + Math.sin(angle) * 34
          const folded = state.folded.includes(p.name)
          const toAct = deciding && hist?.player === p.name
          return (
            <div
              key={p.name}
              className={`seat${p.name === hand.hero ? ' you' : ''}${folded ? ' folded' : ''}${toAct ? ' acting' : ''}`}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <strong>{p.name === hand.hero ? 'You' : p.name}</strong>
              <span>
                {positionName(p.seat, hand.buttonSeat, n)} · {fmt(state.stacks[p.name] ?? p.stack, hand.stakes.bb)}
              </span>
              <div className="row" style={{ justifyContent: 'center', marginTop: 4 }}>
                {p.name === hand.hero && p.hole.length === 2
                  ? p.hole.map((c) => <PlayingCard key={c} code={c} />)
                  : folded
                    ? null
                    : ['back-a', 'back-b'].map((k) => (
                        <span key={k} className="playing-card back">
                          <span className="r">?</span>
                        </span>
                      ))}
              </div>
            </div>
          )
        })}
      </div>

      {deciding && hist ? (
        <ActionBar
          hist={hist}
          toCall={state.toCall}
          pot={state.pot}
          bb={hand.stakes.bb}
          onChoose={choose}
        />
      ) : null}

      {note ? (
        <div className={`card coach ${note.grade}`}>
          <h3>{note.headline}</h3>
          <p>{note.detail}</p>
          {note.math ? <p style={{ marginTop: 8 }}>{note.math}</p> : null}
          <p className="muted" style={{ marginTop: 8 }}>
            Real action: {actionLabel(hist!)}
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" type="button" onClick={continueHand}>
              See the rest of the real hand
            </button>
          </div>
        </div>
      ) : null}

      {done ? (
        <div className="card">
          <h3>Hand over</h3>
          <p>
            That is the real ending. Board: {hand.board.join(' ') || 'never dealt'}. Play another —
            the coach is watching for the same leak twice.
          </p>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" type="button" onClick={() => loadHand((index + 1) % HANDS.length)}>
              Next real hand
            </button>
          </div>
        </div>
      ) : null}

      <details className="card">
        <summary>Action log (what actually happened)</summary>
        <ol className="log">
          {hand.actions.map((a, i) => (
            <li key={`${a.player}-${i}`} className={i === cursor ? 'hi' : ''}>
              {a.street}: {a.player} {actionLabel(a)}
            </li>
          ))}
        </ol>
      </details>
    </div>
  )
}

function ActionBar({
  hist,
  toCall,
  pot,
  bb,
  onChoose,
}: {
  hist: HistAction
  toCall: number
  pot: number
  bb: number
  onChoose: (c: UserChoice) => void
}) {
  const canCheck = toCall <= 0
  return (
    <div className="card stack">
      <p>
        Your turn. {canCheck ? 'Nobody has bet yet this street.' : `It costs ${fmt(toCall, bb)} to call.`}
      </p>
      <div className="row">
        {canCheck ? (
          <>
            <button className="btn ghost" type="button" onClick={() => onChoose({ type: 'check' })}>
              Check
            </button>
            <button className="btn" type="button" onClick={() => onChoose({ type: 'bet', amount: Math.round(pot / 3) })}>
              Bet 1/3 pot
            </button>
            <button className="btn" type="button" onClick={() => onChoose({ type: 'bet', amount: pot })}>
              Bet pot
            </button>
          </>
        ) : (
          <>
            <button className="btn danger" type="button" onClick={() => onChoose({ type: 'fold' })}>
              Fold
            </button>
            <button className="btn" type="button" onClick={() => onChoose({ type: 'call', amount: toCall })}>
              Call {fmt(toCall, bb)}
            </button>
            <button className="btn gold" type="button" onClick={() => onChoose({ type: 'raise', amount: toCall * 3 })}>
              Raise
            </button>
          </>
        )}
      </div>
      <p className="muted">After you click, the coach talks. Then we follow the real hand so the story stays true.</p>
      <span hidden>{hist.type}</span>
    </div>
  )
}
