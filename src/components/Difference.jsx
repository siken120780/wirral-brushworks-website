import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReveal, prefersReducedMotion } from '../lib/useReveal.js'
import { BEFORE_IMG, AFTER_IMG } from '../lib/constants.js'
import './Difference.css'

gsap.registerPlugin(ScrollTrigger)

export default function Difference() {
  const ref = useRef(null)
  const [pos, setPos] = useState(50)
  useReveal(ref)

  // one slow sweep when the slider first scrolls into view, so the
  // transformation shows itself even before anyone touches it
  useEffect(() => {
    if (prefersReducedMotion()) return
    const obj = { p: 12 }
    const tween = gsap.to(obj, {
      p: 55,
      duration: 1.8,
      ease: 'power2.inOut',
      delay: 0.35,
      scrollTrigger: { trigger: ref.current, start: 'top 62%', once: true },
      onUpdate: () => setPos(obj.p),
    })
    return () => tween.kill()
  }, [])

  return (
    <section className="diff sec-warm" ref={ref}>
      <div className="wrap">
        <p className="eyebrow" data-rv="up">Real job, real photos</p>
        <h2 data-rv="mask">See the difference</h2>

        <div className="diff__stage" data-rv="scale">
          <div className="diff__frame" style={{ '--pos': `${pos}%` }}>
            <img className="diff__after" src={AFTER_IMG} alt="After — the room freshly painted and finished" />
            <div className="diff__before-clip" aria-hidden="true">
              <img className="diff__before" src={BEFORE_IMG} alt="" />
            </div>
            <span className="diff__tag diff__tag--before" aria-hidden="true">Before</span>
            <span className="diff__tag diff__tag--after" aria-hidden="true">After</span>
            <div className="diff__handle" aria-hidden="true">
              <span />
            </div>
            <input
              className="diff__range"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Reveal more of the before or after photo"
            />
          </div>
        </div>

        <p className="diff__caption" data-rv="up">Drag the slider to see the before and after</p>
      </div>
    </section>
  )
}
