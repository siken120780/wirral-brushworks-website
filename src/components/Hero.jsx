import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../lib/useReveal.js'
import { PHONE_TEL } from '../lib/constants.js'
import './Hero.css'

const TICKS = [
  ['Interior & Exterior', 'var(--green)'],
  ['Reliable', 'var(--blue)'],
  ['Quality Finish', 'var(--purple)'],
  ['Clean & Tidy', 'var(--orange)'],
  ['Local & Trusted', 'var(--pink)'],
]

export default function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      // no roller pass — show the finished wall, fully painted
      ref.current.querySelectorAll('.hero__undercoat, .hero__roller').forEach((el) => el.remove())
      return
    }
    let ctx = null
    let started = false
    let safety = null
    const start = () => {
      if (started || !ref.current) return
      started = true
      ctx = buildTimeline()
    }
    const buildTimeline = () => gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      // one clean roller pass: the undercoat is covered by the finished wall
      tl.fromTo(
        '.hero__roller',
        { left: '-4%' },
        { left: '104%', duration: 1.15, ease: 'power2.inOut' },
        0.15
      )
        .fromTo(
          '.hero__coat',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 -2% 0 0)', duration: 1.15, ease: 'power2.inOut' },
          0.15
        )
        .set('.hero__roller', { autoAlpha: 0 })
        // headline lines appear like brush strokes
        .fromTo(
          '.hero__line > span',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 -2% 0 0)', duration: 0.75, stagger: 0.16, ease: 'power2.out' },
          0.95
        )
        .fromTo(
          '.hero__sub, .hero__ctas',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
          1.7
        )
        .fromTo(
          '.hero__ticks li',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' },
          2.05
        )
    }, ref)

    // hold the text back until the roller can be seen
    gsap.set(
      ref.current.querySelectorAll('.hero__line > span, .hero__sub, .hero__ctas, .hero__ticks li'),
      { opacity: 0 }
    )
    gsap.set(ref.current.querySelectorAll('.hero__line > span'), {
      clipPath: 'inset(0 100% 0 0)', opacity: 1,
    })

    // the roller pass starts once the intro has finished (or immediately
    // when there is no intro)
    if (window.__bwIntroDone) start()
    else {
      window.addEventListener('bw:introdone', start, { once: true })
      safety = setTimeout(start, 9000) // never leave the hero blank
    }

    return () => {
      window.removeEventListener('bw:introdone', start)
      clearTimeout(safety)
      ctx?.revert()
    }
  }, [])

  return (
    <section className="hero" id="top" ref={ref}>
      {/* undercoat wall (visible for a beat before the coat sweeps over it) */}
      <div className="hero__undercoat" aria-hidden="true" />
      {/* finished wall, revealed by the roller pass */}
      <div className="hero__coat" aria-hidden="true" />
      <div className="hero__roller" aria-hidden="true">
        <span className="hero__roller-head" />
      </div>
      {/* ambient colour drifting on the wall */}
      <div className="hero__glow hero__glow--pink" aria-hidden="true" />
      <div className="hero__glow hero__glow--blue" aria-hidden="true" />

      <div className="wrap hero__inner">
        <h1 className="hero__title">
          <span className="hero__line"><span>Clean, Tidy, Modern</span></span>
          <span className="hero__line"><span>Decorating Across</span></span>
          <span className="hero__line"><span>the <em>Wirral</em></span></span>
        </h1>

        <p className="hero__sub">
          Interior and exterior painting, wallpapering and full redecoration.
          Free no-obligation quotes and a finish you&rsquo;ll be proud of.
        </p>

        <div className="hero__ctas">
          <a className="btn btn-paint" href="#estimate">
            Get an instant estimate <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn btn-ghost" href={PHONE_TEL}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call us
          </a>
        </div>

        <ul className="hero__ticks">
          {TICKS.map(([label, colour]) => (
            <li key={label}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" opacity="0.45" />
                <path d="m8.5 12.2 2.4 2.4 4.6-5" />
              </svg>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
