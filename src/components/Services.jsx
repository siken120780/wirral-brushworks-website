import { useRef } from 'react'
import { useReveal } from '../lib/useReveal.js'
import './Services.css'

/* copy verbatim from the existing site */
const SERVICES = [
  {
    title: 'Interior Painting',
    body: 'Walls, ceilings and woodwork, done properly.',
    colour: 'var(--pink)',
    icon: (
      <path d="M4 4h12v5H4zM8 9v3l4 1v7" />
    ),
  },
  {
    title: 'Wallpapering & Feature Walls',
    body: 'Precise hanging, crisp finish.',
    colour: 'var(--orange)',
    icon: (
      <path d="M5 3v18M12 3v18M19 3v18M5 8c2.3 0 2.3-2 4.7-2M12 14c2.3 0 2.3-2 4.7-2" />
    ),
  },
  {
    title: 'Full Redecoration',
    body: 'Whole rooms transformed start to finish.',
    colour: 'var(--green)',
    icon: (
      <path d="M3 11 12 4l9 7M6 9.5V20h12V9.5M10 20v-5h4v5" />
    ),
  },
  {
    title: 'Exterior Painting',
    body: 'Weatherproof, hard-wearing, smart.',
    colour: 'var(--blue)',
    icon: (
      <path d="M12 3v3M5.6 5.6l2 2M3 12h3M18.4 5.6l-2 2M21 12h-3M7 21a5 5 0 0 1 10 0z" />
    ),
  },
  {
    title: 'Ceilings & Coving',
    body: 'Clean lines and neat detail.',
    colour: 'var(--purple)',
    icon: (
      <path d="M3 6h18M3 6c4 0 4 4 8 4M21 6c-4 0-4 4-8 4M12 10v10" />
    ),
  },
  {
    title: 'Prep & Repairs',
    body: 'Filling, sanding and prep for a flawless finish.',
    colour: 'var(--pink)',
    icon: (
      <path d="M4 15 15 4l5 5L9 20H4zM13 6l5 5" />
    ),
  },
]

export default function Services() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="svc" id="services" ref={ref}>
      <div className="wrap">
        <p className="eyebrow" data-rv="up">What we do</p>
        <h2 data-rv="mask">Expert decorating services</h2>

        <div className="svc__grid" data-rv="stagger">
          {SERVICES.map((s) => (
            <article className="svc__card" key={s.title} style={{ '--c': s.colour }}>
              <span className="svc__swatch" aria-hidden="true" />
              <span className="svc__icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
