import { Link } from 'react-router-dom'
import { LESSONS, lessonsByChapter } from '../../data/lessons'
import { loadProgress } from '../../lib/progress'

export function AcademyPage() {
  const progress = loadProgress()
  const groups = lessonsByChapter()
  let index = 0
  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">Lessons</p>
        <h1>Learn in this order</h1>
        <p>
          Start at lesson 1 even if you have watched poker on TV. The first six chapters assume you
          have never sat at a table. Later chapters add the math great players actually use.
        </p>
      </header>
      {groups.map((group) => (
        <section key={group.chapter} className="stack">
          <h2 className="serif" style={{ margin: '8px 0 0' }}>
            {group.chapter}
          </h2>
          <div className="lesson-list">
            {group.lessons.map((lesson) => {
              index += 1
              const done = progress.lessons[lesson.id]?.completed
              return (
                <Link key={lesson.id} to={`/academy/${lesson.id}`}>
                  <span className={`idx${done ? ' done' : ''}`}>{index}</span>
                  <span>
                    <strong>{lesson.title}</strong>
                    <div className="muted">{lesson.summary}</div>
                  </span>
                  <span className="muted">{lesson.minutes} min</span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
      <p className="muted">
        {LESSONS.length} lessons. A word you don’t know? Open Word list. A number you don’t trust? Open
        Calculators after the lesson that introduces it.
      </p>
    </div>
  )
}
