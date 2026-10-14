import { useMemo, useState } from 'react'
import { gradeQuiz, makeQuiz, type QuizKind, type QuizQuestion } from '../../engine/quiz'
import { recordQuiz } from '../../lib/progress'
import { loadProgress, quizStats, accuracy } from '../../lib/progress'
import { pct } from '../../engine/math'
import { CardRow } from '../../components/PlayingCard'
import { cardId } from '../../engine/cards'

const kinds: { id: QuizKind; label: string; blurb: string }[] = [
  { id: 'odds', label: 'Is the price good?', blurb: 'Someone bet. Should you call or fold, given how often you win?' },
  { id: 'sizing', label: 'Bet sizes', blurb: 'Later chapter. Match a size to how often you must keep playing.' },
  { id: 'preflop', label: 'Before the flop', blurb: 'What does the study chart do with this starting hand?' },
  { id: 'combos', label: 'Counting hands', blurb: 'How many versions of a hand are still possible?' },
]

export function QuizzesPage() {
  const [kind, setKind] = useState<QuizKind>('odds')
  const [seed, setSeed] = useState(() => Date.now())
  const [version, setVersion] = useState(0)
  const question = makeQuiz(kind, seed)
  const stats = useMemo(() => quizStats(loadProgress()), [version])
  const bucket = stats.byKind[kind]

  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">Practice</p>
        <h1>Try a question. See the math.</h1>
        <p>
          “Apply the arithmetic” only means: pick an answer, then read why the numbers say that.
          Start with “Is the price good?” after the pot-odds lesson. Wrong answers are useful.
          {stats.total ? ` Your score so far: ${pct(accuracy(stats.correct, stats.total), 0)}.` : ''}
        </p>
      </header>
      <div className="grid-3">
        {kinds.map((item) => (
          <button
            key={item.id}
            type="button"
            className="card"
            style={{ textAlign: 'left', cursor: 'pointer', borderColor: kind === item.id ? '#2a6d4d' : undefined }}
            onClick={() => {
              setKind(item.id)
              setSeed(Date.now())
            }}
          >
            <h3>{item.label}</h3>
            <p>{item.blurb}</p>
          </button>
        ))}
      </div>
      {bucket ? (
        <p className="muted">
          {kinds.find((k) => k.id === kind)?.label} accuracy {pct(accuracy(bucket.correct, bucket.total), 0)} ({bucket.correct}/{bucket.total})
        </p>
      ) : null}
      <QuizCard
        question={question}
        onGraded={() => setVersion((n) => n + 1)}
        onNext={() => setSeed(Date.now() + Math.floor(Math.random() * 1000))}
      />
    </div>
  )
}

function QuizCard({
  question,
  onNext,
  onGraded,
}: {
  question: QuizQuestion
  onNext: () => void
  onGraded: () => void
}) {
  const [input, setInput] = useState<string | number>('')
  const [result, setResult] = useState<{ correct: boolean; detail: string } | null>(null)

  const submit = (value: string | number) => {
    const graded = gradeQuiz(question, value)
    setInput(value)
    setResult(graded)
    recordQuiz(question.kind, graded.correct)
    onGraded()
  }

  return (
    <section className="card stack">
      <p className="quiz-prompt">{question.prompt}</p>
      {question.kind === 'combos' ? (
        <CardRow codes={question.dead.map(cardId)} />
      ) : null}

      {question.kind === 'odds' ? (
        <div className="row">
          <button className="btn" type="button" disabled={!!result} onClick={() => submit('call')}>
            Call
          </button>
          <button className="btn danger" type="button" disabled={!!result} onClick={() => submit('fold')}>
            Fold
          </button>
        </div>
      ) : null}

      {question.kind === 'sizing' ? (
        <div className="stack">
          {question.choices.map((choice, i) => (
            <button key={choice.label} className="btn ghost" type="button" disabled={!!result} onClick={() => submit(i)}>
              {choice.label}
            </button>
          ))}
        </div>
      ) : null}

      {question.kind === 'preflop' ? (
        <div className="row">
          {(['raise', 'call', 'fold'] as const).map((action) => (
            <button key={action} className="btn" type="button" disabled={!!result} onClick={() => submit(action)}>
              {action}
            </button>
          ))}
        </div>
      ) : null}

      {question.kind === 'combos' ? (
        <div className="toolbar">
          <label className="field">
            <span>Combos remaining</span>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!!result}
            />
          </label>
          <button className="btn" type="button" disabled={!!result} onClick={() => submit(Number(input))}>
            Submit
          </button>
        </div>
      ) : null}

      {result ? (
        <div className={result.correct ? 'ok' : 'bad'}>
          <strong>{result.correct ? 'Correct.' : 'Not quite.'}</strong> {result.detail}
        </div>
      ) : null}

      <div className="row">
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            setInput('')
            setResult(null)
            onNext()
          }}
        >
          Next question
        </button>
      </div>
    </section>
  )
}
