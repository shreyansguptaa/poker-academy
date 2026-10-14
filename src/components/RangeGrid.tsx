import { RANKS } from '../engine/cards'
import { gridHand, type HandAction } from '../engine/ranges'

type Props = {
  actions: Map<string, HandAction>
  highlight?: string | null
  onToggle?: (hand: string) => void
  mistakes?: Set<string>
}

export function RangeGrid({ actions, highlight, onToggle, mistakes }: Props) {
  return (
    <div className="range-grid" role="grid" aria-label="Starting hand grid">
      {RANKS.map((_, row) =>
        RANKS.map((__, col) => {
          const hand = gridHand(row, col)
          const action = actions.get(hand) ?? 'fold'
          const classes = [
            'range-cell',
            row === col ? 'pair' : '',
            action,
            highlight === hand ? 'hi' : '',
            mistakes?.has(hand) ? 'miss' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={hand}
              type="button"
              className={classes}
              onClick={() => onToggle?.(hand)}
              title={`${hand} · ${action}`}
            >
              {hand}
            </button>
          )
        }),
      )}
    </div>
  )
}

export function RangeLegend() {
  return (
    <div className="legend">
      <span>
        <i className="swatch raise" />
        Raise
      </span>
      <span>
        <i className="swatch call" />
        Call
      </span>
      <span>
        <i className="swatch fold" />
        Fold
      </span>
    </div>
  )
}
