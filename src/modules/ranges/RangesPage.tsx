import { useMemo, useState } from 'react'
import { CHARTS, chartStats, type ChartDef } from '../../data/charts'
import { allStartingHands, overlapScore, type HandAction } from '../../engine/ranges'
import { pct } from '../../engine/math'
import { RangeGrid, RangeLegend } from '../../components/RangeGrid'
import { recordRangeBuild, recordRangeDrill, loadProgress, accuracy } from '../../lib/progress'

type Mode = 'study' | 'drill' | 'build'

function emptyPaint(): Map<string, HandAction> {
  const map = new Map<string, HandAction>()
  for (const hand of allStartingHands()) map.set(hand, 'fold')
  return map
}

function cycle(action: HandAction): HandAction {
  if (action === 'fold') return 'raise'
  if (action === 'raise') return 'call'
  return 'fold'
}

export function RangesPage() {
  const [mode, setMode] = useState<Mode>('study')
  const [chartId, setChartId] = useState(CHARTS[0]!.id)
  const chart = CHARTS.find((c) => c.id === chartId) ?? CHARTS[0]!
  const stats = chartStats(chart)
  const progress = loadProgress()
  const drill = progress.ranges[chart.id]

  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">Starting hands</p>
        <h1>Which two cards do I play?</h1>
        <p>
          A <strong>range</strong> is the group of hands you would still play in a spot. This page is
          a map of all 169 starting-hand types. Green = raise. Gold = call. Dark = fold. Learn the
          “what is a range?” lesson before you try to memorize anything.
        </p>
      </header>

      <div className="toolbar">
        <label className="field">
          <span>Chart</span>
          <select value={chartId} onChange={(e) => setChartId(e.target.value)}>
            {CHARTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          {(['study', 'drill', 'build'] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`btn${mode === item ? '' : ' ghost'}`}
              onClick={() => setMode(item)}
            >
              {item[0]!.toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{chart.title}</h3>
        <p>{chart.blurb}</p>
        <p className="muted" style={{ marginTop: 8 }}>
          Raise {pct(stats.raisePct, 0)}
          {stats.call ? ` · call ${pct(stats.call / 1326, 0)}` : ''} · continue {pct(stats.continuePct, 0)}
          {drill ? ` · your drill ${pct(accuracy(drill.correct, drill.total), 0)} (${drill.correct}/${drill.total})` : ''}
        </p>
      </div>

      {mode === 'study' ? <StudyMode chart={chart} /> : null}
      {mode === 'drill' ? <DrillMode chart={chart} /> : null}
      {mode === 'build' ? <BuildMode chart={chart} /> : null}
    </div>
  )
}

function StudyMode({ chart }: { chart: ChartDef }) {
  return (
    <div className="card stack">
      <RangeLegend />
      <RangeGrid actions={chart.actions} />
    </div>
  )
}

function DrillMode({ chart }: { chart: ChartDef }) {
  const hands = useMemo(() => allStartingHands(), [])
  const [hand, setHand] = useState(() => hands[Math.floor(Math.random() * hands.length)]!)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const truth = chart.actions.get(hand) ?? 'fold'
  const options: HandAction[] = chart.kind === 'open' ? ['raise', 'fold'] : ['raise', 'call', 'fold']

  const guess = (action: HandAction) => {
    const ok = action === truth
    setLastCorrect(ok)
    setFeedback(
      ok
        ? `Correct. ${hand} is a ${truth.toUpperCase()} on ${chart.title}.`
        : `Not quite. ${hand} is a ${truth.toUpperCase()} on ${chart.title}.`,
    )
    recordRangeDrill(chart.id, ok)
  }

  const next = () => {
    setHand(hands[Math.floor(Math.random() * hands.length)]!)
    setFeedback(null)
    setLastCorrect(null)
  }

  return (
    <div className="card stack">
      <p className="quiz-prompt">
        {chart.title}: what do you do with <span className="chip">{hand}</span>?
      </p>
      <div className="row">
        {options.map((action) => (
          <button key={action} className="btn" type="button" onClick={() => guess(action)} disabled={feedback !== null}>
            {action === 'raise' ? (chart.kind === 'open' ? 'Open' : '3-bet / raise') : action[0]!.toUpperCase() + action.slice(1)}
          </button>
        ))}
      </div>
      {feedback ? (
        <div className={lastCorrect ? 'ok' : 'bad'}>
          {feedback}{' '}
          <button className="btn ghost" type="button" onClick={next}>
            Next hand
          </button>
        </div>
      ) : null}
      <RangeLegend />
      <RangeGrid actions={chart.actions} highlight={hand} />
    </div>
  )
}

function BuildMode({ chart }: { chart: ChartDef }) {
  const [paint, setPaint] = useState<Map<string, HandAction>>(emptyPaint)
  const [score, setScore] = useState<ReturnType<typeof overlapScore> | null>(null)
  const mistakes = useMemo(() => {
    if (!score) return undefined
    const set = new Set<string>()
    for (const hand of allStartingHands()) {
      if ((paint.get(hand) ?? 'fold') !== (chart.actions.get(hand) ?? 'fold')) set.add(hand)
    }
    return set
  }, [score, paint, chart])

  return (
    <div className="card stack">
      <p className="muted">Click a cell to cycle fold → raise → call. Then score it against the study chart.</p>
      <RangeLegend />
      <RangeGrid
        actions={paint}
        mistakes={score ? mistakes : undefined}
        onToggle={(hand) => {
          setScore(null)
          setPaint((prev) => {
            const next = new Map(prev)
            next.set(hand, cycle(next.get(hand) ?? 'fold'))
            return next
          })
        }}
      />
      <div className="row">
        <button
          className="btn"
          type="button"
          onClick={() => {
            const result = overlapScore(paint, chart.actions)
            setScore(result)
            recordRangeBuild(chart.id, result.correct, result.total)
          }}
        >
          Score my range
        </button>
        <button className="btn ghost" type="button" onClick={() => { setPaint(emptyPaint()); setScore(null) }}>
          Clear
        </button>
        {score ? (
          <span className={score.percent > 0.9 ? 'ok' : 'bad'}>
            {score.correct}/169 cells ({pct(score.percent, 0)})
          </span>
        ) : null}
      </div>
    </div>
  )
}
