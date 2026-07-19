import { useRef } from 'react'
import { useReveal } from '../lib/useReveal.js'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/constants.js'
import './FinalCta.css'

export default function FinalCta() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="fcta" ref={ref}>
      <div className="fcta__band" aria-hidden="true" />
      <div className="wrap fcta__inner">
        <h2 data-rv="mask">
          Ready for a finish you&rsquo;ll be <em>proud of</em>?
        </h2>
        <p data-rv="up">
          Free, no-obligation quotes across the entire Wirral peninsula.
        </p>
        <div className="fcta__ctas" data-rv="up">
          <a className="btn btn-paint" href="#estimate">
            Get an instant estimate <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href={PHONE_TEL}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  )
}
