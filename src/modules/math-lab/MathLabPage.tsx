import {
  ComboWidget,
  EquityWidget,
  EvWidget,
  ImpliedWidget,
  MdfWidget,
  PotOddsWidget,
  SprWidget,
} from '../../components/widgets'

export function MathLabPage() {
  return (
    <div className="stack">
      <header className="page-head">
        <p className="kicker">Calculators</p>
        <h1>Type a number. See what it means.</h1>
        <p>
          Do not start here if you are new. Finish the first lessons first. Each box is a tool from
          those chapters: how expensive a call is, whether a bet is “worth it,” how committed you are.
        </p>
      </header>

      <section className="card stack">
        <h3>How expensive is this call? (pot odds)</h3>
        <PotOddsWidget />
      </section>
      <section className="card stack">
        <h3>Is this decision profitable on average? (EV)</h3>
        <EvWidget />
      </section>
      <section className="card stack">
        <h3>Can future chips rescue a bad price? (implied odds)</h3>
        <ImpliedWidget />
      </section>
      <section className="card stack">
        <h3>How committed am I? (stack vs pot)</h3>
        <SprWidget />
      </section>
      <section className="card stack">
        <h3>How often must I continue? (later chapter)</h3>
        <MdfWidget />
      </section>
      <section className="card stack">
        <h3>How many versions of this hand are left?</h3>
        <ComboWidget />
      </section>
      <section className="card stack">
        <h3>How often does this hand win? (equity)</h3>
        <EquityWidget />
      </section>
    </div>
  )
}
