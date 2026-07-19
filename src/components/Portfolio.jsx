import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal, prefersReducedMotion } from '../lib/useReveal.js'
import { BEFORE_IMG, AFTER_IMG } from '../lib/constants.js'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

/*
 * Dark immersive project work. GENUINE JOBS ONLY — every entry here must be
 * a real photo of real work. To add a project, append to PROJECTS with the
 * photo URL; the painted-in reveal and dimensional frame are automatic.
 */
const PROJECTS = [
  {
    title: 'Full room redecoration',
    where: 'Wirral',
    detail:
      'Bare plaster to a clean, finished room — prepped properly, painted properly, left tidy.',
    img: AFTER_IMG,
    before: BEFORE_IMG,
  },
  // { title: '…', where: '…', detail: '…', img: '…' },
]

function ProjectFrame({ project }) {
  const frameRef = useRef(null)
  const innerRef = useRef(null)

  /* the photo is painted in with four roller passes, alternating direction */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const strips = innerRef.current.querySelectorAll('.folio__strip')
    const ctx = gsap.context(() => {
      strips.forEach((s, i) => {
        const fromLeft = i % 2 === 0
        gsap.fromTo(
          s,
          { clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
          {
            clipPath: 'inset(0 -1% 0 -1%)',
            duration: 0.85,
            delay: i * 0.16,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: frameRef.current, start: 'top 72%', once: true },
          }
        )
      })
      // one controlled pass of light across the finished surface
      gsap.fromTo(
        frameRef.current.querySelector('.folio__sheen'),
        { xPercent: -130, opacity: 0 },
        {
          xPercent: 130,
          opacity: 0.55,
          duration: 1.4,
          delay: 1.05,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: frameRef.current, start: 'top 72%', once: true },
        }
      )
    }, frameRef)
    return () => ctx.revert()
  }, [])

  /* subtle dimensional response to the cursor — a few degrees, no more */
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const frame = frameRef.current
    const onMove = (e) => {
      const r = frame.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      gsap.to(frame, { rotateY: px * 4.5, rotateX: -py * 3.5, duration: 0.6, ease: 'power2.out' })
      gsap.to(innerRef.current, { x: px * -10, y: py * -8, duration: 0.6, ease: 'power2.out' })
    }
    const onLeave = () => {
      gsap.to(frame, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' })
      gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.9, ease: 'power3.out' })
    }
    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', onLeave)
    return () => {
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="folio__stage">
      <div className="folio__frame" ref={frameRef}>
        <div className="folio__inner" ref={innerRef}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="folio__strip"
              style={{
                backgroundImage: `url(${project.img})`,
                backgroundPosition: `center ${(i / 3) * 100}%`,
              }}
            />
          ))}
          <span className="folio__sheen" aria-hidden="true" />
        </div>
        {project.before && (
          <figure className="folio__before">
            <img src={project.before} alt={`Before — the same room prior to decoration`} loading="lazy" />
            <figcaption>Before</figcaption>
          </figure>
        )}
      </div>
    </div>
  )
}

/*
 * Reels filmed on Reece's actual jobs — genuine footage only.
 * portrait = 9:16 card, landscape spans two columns.
 */
const REELS = [
  /* r4 + r7 live in the See the Difference section — not repeated here */
  { src: '/reels/r2.mp4', poster: '/reels/r2.jpg', portrait: true, label: 'Hallway — panelling, fresh walls & woodwork' },
  { src: '/reels/r9.mp4', poster: '/reels/r9.jpg', portrait: true, label: 'Landing — sage green over dado panelling' },
  { src: '/reels/r5.mp4', poster: '/reels/r5.jpg', portrait: true, label: 'Landing — wallpaper & glass balustrade' },
  { src: '/reels/r6.mp4', poster: '/reels/r6.jpg', portrait: false, label: 'Exterior — garage doors & front door' },
  { src: '/reels/r3.mp4', poster: '/reels/r3.jpg', portrait: false, label: 'Bedroom — finished in a warm neutral' },
  { src: '/reels/r1.mp4', poster: '/reels/r1.jpg', portrait: true, label: 'Prep — fresh plaster, ready to decorate' },
  { src: '/reels/r8.mp4', poster: '/reels/r8.jpg', portrait: true, label: 'Exterior — fascias & stonework' },
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
        aria-label={reel.label}
      />
      <figcaption>{reel.label}</figcaption>
    </figure>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  useReveal(ref)
  const p = PROJECTS[0]

  return (
    <section className="folio" id="work" ref={ref}>
      <div className="wrap">
        <p className="eyebrow" data-rv="up">Project work</p>
        <h2 data-rv="mask">Real rooms, painted properly</h2>

        <div className="folio__grid">
          <ProjectFrame project={p} />
          <div className="folio__text">
            <h3 data-rv="up">{p.title}</h3>
            <p className="folio__where" data-rv="up">{p.where}</p>
            <p data-rv="up">{p.detail}</p>
            <p className="folio__note" data-rv="up">
              Every photo here is our own work — no stock, no staging. More
              projects are added as they&rsquo;re finished.
            </p>
            <a className="btn btn-ghost" href="#estimate" data-rv="up">
              Start yours <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* ---- straight from the jobs: real reels, filmed on site ---- */}
        <div className="folio__reels">
          <h3 data-rv="up">Straight from the jobs</h3>
          <p className="folio__reelsub" data-rv="up">
            Filmed on site, on real jobs — prep and all.
          </p>
          <div className="folio__reelgrid" data-rv="stagger">
            {REELS.map((r) => (
              <Reel reel={r} key={r.src} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
