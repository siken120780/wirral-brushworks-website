import { useEffect, useRef } from 'react'
import { useReveal, prefersReducedMotion } from '../lib/useReveal.js'
import './Difference.css'

/*
 * The transformation, on film: the same staircase — first protected and
 * prepped mid-job, then finished in deep teal. Genuine footage from the
 * actual job, confirmed by the client.
 */

function DiffReel({ src, poster, tag, tone }) {
  const vidRef = useRef(null)

  useEffect(() => {
    const vid = vidRef.current
    if (!vid || prefersReducedMotion()) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) vid.play().catch(() => {})
        else vid.pause()
      },
      { threshold: 0.35 }
    )
    io.observe(vid)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const vid = vidRef.current
    if (!vid) return
    if (vid.paused) vid.play().catch(() => {})
    else vid.pause()
  }

  return (
    <figure className="diff__reel" onClick={toggle}>
      <video
        ref={vidRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${tag} — the staircase transformation`}
      />
      <figcaption className={`diff__tag diff__tag--${tone}`}>{tag}</figcaption>
    </figure>
  )
}

export default function Difference() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="diff sec-warm" ref={ref}>
      <div className="wrap">
        <p className="eyebrow" data-rv="up">Real job, real footage</p>
        <h2 data-rv="mask">See the difference</h2>

        <div className="diff__pair" data-rv="stagger">
          <DiffReel src="/reels/r7.mp4" poster="/reels/r7.jpg" tag="Before" tone="before" />
          <DiffReel src="/reels/r4.mp4" poster="/reels/r4.jpg" tag="After" tone="after" />
        </div>

        <p className="diff__caption" data-rv="up">
          The same staircase — protected and prepped properly, then finished
          in deep teal with crisp white spindles.
        </p>
      </div>
    </section>
  )
}
