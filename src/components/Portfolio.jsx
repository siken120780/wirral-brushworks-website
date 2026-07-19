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
      </div>
    </section>
  )
}
