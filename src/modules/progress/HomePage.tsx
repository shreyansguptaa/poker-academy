import { Link } from 'react-router-dom'
import { LESSONS } from '../../data/lessons'
import { loadProgress } from '../../lib/progress'

const rooms = [
  {
    to: '/academy',
    title: 'Lessons',
    blurb: 'Start here. Short chapters that teach the game from zero — what the cards do, then the math.',
  },
  {
    to: '/words',
    title: 'Word list',
    blurb: 'NLHE, range, pot, EV… every term in plain English. Open this any time a sentence feels opaque.',
  },
  {
    to: '/lab',
    title: 'Calculators',
    blurb: 'After a few lessons, type numbers and watch the formula move. Not day-one homework.',
  },
  {
    to: '/ranges',
    title: 'Starting hands',
    blurb: 'A map of which two cards to play from each seat. Use this after the “what is a range?” lesson.',
  },
  {
    to: '/quizzes',
    title: 'Practice',
    blurb: 'Tiny questions with the arithmetic shown afterward. “Apply the arithmetic” just means: try a problem.',
  },
  {
    to: '/play',
    title: 'Play a table',
    blurb: 'Sit in a real published hand. Other people play their real line. A coach tells you what to fix.',
  },
]

export function HomePage() {
  const progress = loadProgress()
  const lessonsDone = LESSONS.filter((l) => progress.lessons[l.id]?.completed).length
  const next = LESSONS.find((l) => !progress.lessons[l.id]?.completed) ?? LESSONS[0]!

  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">You do not need to know anything yet</p>
        <h1>This is a poker classroom, not a casino.</h1>
        <p>
          We are learning <strong>no-limit Texas Hold’em</strong> — the game on TV and most home
          games — at a <strong>six-player cash table</strong>. That sentence is the whole “NLHE
          6-max cash” label. If a word is new, open the word list. If a page feels advanced, come
          back to Lessons and keep going in order.
        </p>
      </header>

      <div className="card">
        <h3>Do this next</h3>
        <p>
          Next up: <strong>{next.title}</strong>. {next.summary}
        </p>
        <div className="row" style={{ marginTop: 14 }}>
          <Link className="btn" to={`/academy/${next.id}`}>
            Start the next lesson
          </Link>
          <Link className="btn ghost" to="/words">
            Open the word list
          </Link>
        </div>
        <div className="progress-bar" style={{ marginTop: 16 }}>
          <span style={{ width: `${(lessonsDone / LESSONS.length) * 100}%` }} />
        </div>
        <p className="muted" style={{ marginTop: 8 }}>
          {lessonsDone} / {LESSONS.length} lessons finished. Nobody becomes great in a week. They
          become great by not skipping the boring definitions.
        </p>
      </div>

      <h2 className="serif" style={{ margin: '8px 0 0' }}>
        The rooms
      </h2>
      <div className="grid-2">
        {rooms.map((room) => (
          <Link className="card room-card" key={room.to} to={room.to}>
            <h3>{room.title}</h3>
            <p>{room.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="callout">
        <strong>About “greatest in the world”</strong>
        Great players are fluent in three things: the rules, the prices (odds), and other people’s
        possible hands (ranges). This app is the first two, plus training wheels for the third. Play
        real hands later. Study here first so those hands teach you something.
      </div>
    </div>
  )
}
