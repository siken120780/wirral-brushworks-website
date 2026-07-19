import { useRef } from 'react'
import { useReveal } from '../lib/useReveal.js'
import { HOURS } from '../lib/constants.js'
import './About.css'

/*
 * The lighter, human section. Copy uses only what the business already
 * says about itself — no invented credentials, no invented history.
 */

const SWATCHES = [
  ['var(--pink)', 'Pink'],
  ['var(--orange)', 'Orange'],
  ['var(--green)', 'Green'],
  ['var(--blue)', 'Blue'],
  ['var(--purple)', 'Purple'],
]

export default function About() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="about sec-warm" id="about" ref={ref}>
      <div className="wrap about__grid">
        <div className="about__copy">
          <p className="eyebrow" data-rv="up">Behind the brush</p>
          <h2 data-rv="mask">Meet Reece</h2>
          <p data-rv="up">
            Wirral Brushworks is Reece — a decorator building his name the only
            way that lasts: on standards, graft and word of mouth. Interior and
            exterior painting, wallpapering and full redecoration, across the
            entire Wirral peninsula.
          </p>
          <p data-rv="up">
            He&rsquo;s 21, he&rsquo;s dedicated, and the work speaks for
            itself — every reel on this page is his, filmed on real jobs.
            Clean, tidy, respectful of your home, and never a shortcut on prep.
          </p>
          <dl className="about__hours" data-rv="up">
            {HOURS.map(([d, h]) => (
              <div key={d}>
                <dt>{d}</dt>
                <dd>{h}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about__fanzone" data-rv="scale">
          {/* the brand palette, fanned like a swatch book */}
          <div className="fan" aria-hidden="true">
            {SWATCHES.map(([c, name], i) => (
              <span className="fan__card" key={name} style={{ '--c': c, '--i': i }}>
                <b>{name}</b>
              </span>
            ))}
          </div>
          <p className="about__fanlabel">The Brushworks palette</p>
        </div>
      </div>
    </section>
  )
}
