import { useMemo, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { lessonById, nextLesson, prevLesson, type LessonCheck } from '../../data/lessons'
import { recordLesson } from '../../lib/progress'
import { nearInt } from '../../engine/math'
import {
  ComboWidget,
  EvWidget,
  GridExplainerWidget,
  ImpliedWidget,
  MdfWidget,
  PolarWidget,
  PositionsWidget,
  PotOddsWidget,
  PreflopWidget,
  SizingWidget,
  SprWidget,
  StreetsWidget,
  TextureWidget,
  ThreeBetWidget,
  GameExplainerWidget,
  StreetWalkWidget,
  RankingsWidget,
  BettingWidget,
  BlindsWidget,
  RangePlainWidget,
} from '../../components/widgets'
import { Formula } from '../../components/Formula'

const widgets: Record<string, () => ReactNode> = {
  game: () => <GameExplainerWidget />,
  streetsWalk: () => <StreetWalkWidget />,
  rankings: () => <RankingsWidget />,
  betting: () => <BettingWidget />,
  blinds: () => <BlindsWidget />,
  rangePlain: () => <RangePlainWidget />,
  positions: () => <PositionsWidget />,
  spr: () => <SprWidget />,
  potOdds: () => <PotOddsWidget />,
  ev: () => <EvWidget />,
  implied: () => <ImpliedWidget />,
  combos: () => <ComboWidget />,
  grid: () => <GridExplainerWidget />,
  polar: () => <PolarWidget />,
  preflop: () => <PreflopWidget />,
  threebet: () => <ThreeBetWidget />,
  mdf: () => <MdfWidget />,
  sizing: () => <SizingWidget />,
  texture: () => <TextureWidget />,
  streets: () => <StreetsWidget />,
}

export function LessonPage() {
  const { id = '' } = useParams()
  const lesson = lessonById(id)
  if (!lesson) return <Navigate to="/academy" replace />

  const prev = prevLesson(lesson.id)
  const next = nextLesson(lesson.id)
  const Widget = widgets[lesson.widget]

  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">{lesson.chapter}</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>
      <div className="grid-2">
        <article className="card lesson-copy">
          {lesson.blocks.map((block, i) => {
            if (block.type === 'p') return <p key={i}>{block.text}</p>
            if (block.type === 'h') return <h2 key={i}>{block.text}</h2>
            if (block.type === 'formula') return <Formula key={i} eq={block.eq} note={block.note} />
            if (block.type === 'list') {
              return (
                <ul key={i}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }
            return (
              <div className="callout" key={i}>
                <strong>{block.title}</strong>
                {block.text}
              </div>
            )
          })}
        </article>
        <aside className="card stack">
          <h3>Worked example</h3>
          {Widget ? Widget() : null}
        </aside>
      </div>
      <Checks lessonId={lesson.id} checks={lesson.checks} />
      <div className="row">
        {prev ? (
          <Link className="btn ghost" to={`/academy/${prev.id}`}>
            ← {prev.title}
          </Link>
        ) : (
          <Link className="btn ghost" to="/academy">
            All lessons
          </Link>
        )}
        {next ? (
          <Link className="btn" to={`/academy/${next.id}`}>
            {next.title} →
          </Link>
        ) : (
          <Link className="btn" to="/ranges">
            Drill ranges →
          </Link>
        )}
      </div>
    </div>
  )
}

function Checks({ lessonId, checks }: { lessonId: string; checks: LessonCheck[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const results = useMemo(() => {
    return checks.map((check, i) => grade(check, answers[i] ?? ''))
  }, [answers, checks])

  const correct = results.filter(Boolean).length

  return (
    <section className="card stack">
      <h3>Checks</h3>
      <p className="muted">Answer these before you move on. A miss shows a short hint — that is the point of practice.</p>
      <div className="checks">
        {checks.map((check, i) => (
          <div key={check.question} className={`check${submitted ? (results[i] ? ' ok' : ' bad') : ''}`}>
            <div className="check-q">{check.question}</div>
            {check.kind === 'choice' ? (
              <div className="choices">
                {check.choices?.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    className={answers[i] === choice ? 'picked' : ''}
                    onClick={() => {
                      setSubmitted(false)
                      setAnswers((prev) => ({ ...prev, [i]: choice }))
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : (
              <label className="field">
                <span>Your number</span>
                <input
                  type="number"
                  value={answers[i] ?? ''}
                  onChange={(e) => {
                    setSubmitted(false)
                    setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                  }}
                />
              </label>
            )}
            {submitted ? <div className="hint">{check.hint}</div> : null}
          </div>
        ))}
      </div>
      <div className="row">
        <button
          className="btn"
          type="button"
          onClick={() => {
            setSubmitted(true)
            recordLesson(lessonId, correct, checks.length)
          }}
        >
          Check answers
        </button>
        {submitted ? (
          <span className={correct === checks.length ? 'ok' : 'bad'}>
            {correct}/{checks.length} correct
          </span>
        ) : null}
      </div>
    </section>
  )
}

function grade(check: LessonCheck, raw: string): boolean {
  if (check.kind === 'choice') return raw === check.answer
  return nearInt(Number(raw), Number(check.answer))
}
