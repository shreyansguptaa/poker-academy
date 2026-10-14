import { isRed, parseCard, suitGlyph } from '../engine/cards'

type Props = {
  code: string
}

export function PlayingCard({ code }: Props) {
  const card = parseCard(code)
  return (
    <span className={`playing-card${isRed(card.suit) ? ' red' : ''}`}>
      <span className="r">{card.rank}</span>
      <span className="s">{suitGlyph(card.suit)}</span>
    </span>
  )
}

export function CardRow({ codes }: { codes: string[] }) {
  return (
    <div className="row">
      {codes.map((code) => (
        <PlayingCard key={code} code={code} />
      ))}
    </div>
  )
}
