import { useEffect, useRef } from 'react'
import { useReveal, prefersReducedMotion } from '../lib/useReveal.js'
import './Portfolio.css'

/*
 * Dark immersive project work — GENUINE FOOTAGE ONLY, grouped by job
 * (pairings confirmed by the client). r4 + r7 live in See the Difference
 * and aren't repeated here. To add a job, append to JOBS.
 */
const JOBS = [
  {
    title: 'Bedroom — fresh plaster to finished',
    reels: [
      { src: '/reels/r1.mp4', poster: '/reels/r1.jpg', portrait: true, tag: 'Before', tone: 'before' },
      { src: '/reels/r3.mp4', poster: '/reels/r3.jpg', portrait: false, tag: 'After', tone: 'after' },
    ],
  },
  {
    title: 'Hallway & landing — one job, both finished',
    reels: [
      { src: '/reels/r2.mp4', poster: '/reels/r2.jpg', portrait: true, tag: 'Hallway' },
      { src: '/reels/r9.mp4', poster: '/reels/r9.jpg', portrait: true, tag: 'Landing' },
    ],
  },
  {
    title: 'Exterior — doors, fascias & stonework, one job',
    reels: [
      { src: '/reels/r6.mp4', poster: '/reels/r6.jpg', portrait: false, tag: 'Doors', tone: 'after' },
      { src: '/reels/r8.mp4', poster: '/reels/r8.jpg', portrait: true, tag: 'Fascias' },
    ],
  },
  {
    title: 'Landing — wallpaper & glass balustrade',
    reels: [
      { src: '/reels/r5.mp4', poster: '/reels/r5.jpg', portrait: true, tag: 'Finished' },
    ],
  },
]

function Reel({ reel }) {
  const vidRef = useRef(null)

  useEffect(() => {
    const vid = vidRef.current
    if (!vid) return
    if (prefersReducedMotion()) return // tap to play instead
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
    <figure className={`reel ${reel.portrait ? '' : 'reel--wide'}`} onClick={toggle}>
      <video
        ref={vidRef}
        src={reel.src}
        poster={reel.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={reel.tag}
      />
      {reel.tag && (
        <figcaption className={`reel__tag ${reel.tone === 'after' ? 'reel__tag--after' : ''} ${reel.tone === 'before' ? 'reel__tag--before' : ''}`}>
          {reel.tag}
        </figcaption>
      )}
    </figure>
  )
}

function Job({ job }) {
  return (
    <article className="job">
      <div className="job__media">
        {job.reels.map((r) => (
          <Reel reel={r} key={r.src} />
        ))}
      </div>
      <h4 className="job__title">{job.title}</h4>
    </article>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <section className="folio" id="work" ref={ref}>
      <div className="wrap">
        <p className="eyebrow" data-rv="up">Project work</p>
        <h2 data-rv="mask">Real rooms, painted properly</h2>
        <p className="folio__reelsub" data-rv="up">
          Filmed on site, on real jobs — grouped by job, prep and all. No
          stock, no staging: every frame here is our own work.
        </p>

        <div className="folio__jobs" data-rv="stagger">
          {JOBS.map((j) => (
            <Job job={j} key={j.title} />
          ))}
        </div>

        <div className="folio__cta" data-rv="up">
          <a className="btn btn-ghost" href="#estimate">
            Start yours <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
