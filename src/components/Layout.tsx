import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LESSONS } from '../data/lessons'
import { loadProgress } from '../lib/progress'

const links = [
  { to: '/', label: 'Home', hint: 'Start here', end: true },
  { to: '/academy', label: 'Lessons', hint: 'Learn the game' },
  { to: '/words', label: 'Word list', hint: 'What words mean' },
  { to: '/lab', label: 'Calculators', hint: 'Play with numbers' },
  { to: '/ranges', label: 'Starting hands', hint: 'What to play' },
  { to: '/quizzes', label: 'Practice', hint: 'Try a question' },
  { to: '/play', label: 'Play a table', hint: 'Real hands + coach' },
]

export function Layout() {
  useLocation()
  const progress = loadProgress()
  const done = LESSONS.filter((l) => progress.lessons[l.id]?.completed).length
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>Poker Academy</strong>
          <span>Beginner classroom</span>
        </div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span>
                {link.label}
                <em className="nav-hint">{link.hint}</em>
              </span>
              {link.to === '/academy' ? (
                <small>
                  {done}/{LESSONS.length}
                </small>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <p className="sidebar-foot">No real-money play. Just study. Stuck on a word? Open the word list.</p>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
