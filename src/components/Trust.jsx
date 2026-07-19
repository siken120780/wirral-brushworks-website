import { useRef } from 'react'
import { useReveal } from '../lib/useReveal.js'
import './Trust.css'

/* the four promises, verbatim from the existing site */
const PROMISES = [
  ['Free, no-obligation quotes', 'var(--pink)'],
  ['Clean, tidy, respectful, on time', 'var(--orange)'],
  ['Quality finish, no shortcuts', 'var(--green)'],
  ['Local Wirral, and proud of it', 'var(--blue)'],
]

export default function Trust() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="trust" ref={ref}>
      <div className="wrap trust__grid">
        <div className="trust__copy">
          <p className="eyebrow" data-rv="up">Our word, in writing</p>
          <h2 data-rv="mask">Why Wirral homeowners trust us</h2>
          <p className="trust__body" data-rv="up">
            Craftsmanship in every coat — from the first sheet of masking tape
            to the final cut-in line.
          </p>
          <a className="btn btn-paint" href="#estimate" data-rv="up">
            Get your free quote <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <ul className="trust__list" data-rv="stagger">
          {PROMISES.map(([label, colour]) => (
            <li key={label} style={{ '--c': colour }}>
              <span className="trust__tick" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
