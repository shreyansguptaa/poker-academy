import { useMemo, useState } from 'react'
import { searchGlossary } from '../../data/glossary'

export function GlossaryPage() {
  const [query, setQuery] = useState('')
  const entries = useMemo(() => searchGlossary(query), [query])
  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">Word list</p>
        <h1>Every word this app uses, in English</h1>
        <p>
          Poker players talk in shorthand. That is not a personality test. Tap a word whenever a
          lesson feels like a foreign language.
        </p>
      </header>
      <label className="field">
        <span>Search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="range, pot odds, NLHE, button…"
        />
      </label>
      <div className="glossary">
        {entries.map((entry) => (
          <article className="card" key={entry.term}>
            <h3>{entry.term}</h3>
            {entry.say ? <p className="chip" style={{ width: 'fit-content' }}>Said: {entry.say}</p> : null}
            <p style={{ marginTop: 8 }}>{entry.plain}</p>
            {entry.extra ? <p style={{ marginTop: 8 }}>{entry.extra}</p> : null}
          </article>
        ))}
      </div>
      {entries.length === 0 ? <p className="muted">Nothing matches. Try “blind”, “fold”, or “range”.</p> : null}
    </div>
  )
}
