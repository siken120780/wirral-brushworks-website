import { useRef } from 'react'
import { useReveal } from '../lib/useReveal.js'
import './Process.css'

/* grounded in the existing copy: instant estimate → free visit → firm price */
const STEPS = [
  {
    n: '01',
    title: 'Tell us what you need',
    body: 'Sixty seconds with the instant estimate, or just pick up the phone.',
    colour: 'var(--pink)',
  },
  {
    n: '02',
    title: 'Free, no-obligation visit',
    body: 'We take a proper look, talk colours and finishes, and answer everything.',
    colour: 'var(--orange)',
  },
  {
    n: '03',
    title: 'A firm price, then the finish',
    body: 'No surprises on cost — and a finish you’ll be proud of.',
    colour: 'var(--green)',
  },
]

export default function Process() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="proc" ref={ref}>
      <div className="wrap">
        <p className="eyebrow" data-rv="up">How it works</p>
        <h2 data-rv="mask">From first look to final coat</h2>

        <ol className="proc__row" data-rv="stagger">
          {STEPS.map((s) => (
            <li className="proc__step" key={s.n} style={{ '--c': s.colour }}>
              <span className="proc__n" aria-hidden="true">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
