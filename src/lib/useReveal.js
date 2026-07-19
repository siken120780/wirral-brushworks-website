import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-reveal system themed around laying down paint.
 *
 *   data-rv="up"      – small rise + fade (default)
 *   data-rv="coat"    – clip-path wipe left→right, like a roller stroke
 *   data-rv="mask"    – clip-path wipe from the bottom
 *   data-rv="left"    – slide in from the left
 *   data-rv="right"   – slide in from the right
 *   data-rv="scale"   – gentle scale-settle
 *   data-rv="line"    – horizontal rule draws in
 *   data-rv="stagger" – direct children stagger upward
 */
export function useReveal(scopeRef) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      scopeRef.current
        ?.querySelectorAll('[data-rv]')
        .forEach((el) => el.classList.add('is-in'))
      return
    }

    const ctx = gsap.context(() => {
      const els = scopeRef.current?.querySelectorAll('[data-rv]') ?? []
      els.forEach((el) => {
        const kind = el.dataset.rv || 'up'
        const base = {
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          duration: 0.9,
          ease: 'power3.out',
          onStart: () => el.classList.add('is-in'),
        }
        el.classList.add('rv')

        if (kind === 'coat') {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', ...base, duration: 1.1, ease: 'power2.inOut' }
          )
        } else if (kind === 'mask') {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0 0 0)', y: 24 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, ...base, duration: 1.05 }
          )
        } else if (kind === 'left') {
          gsap.fromTo(el, { x: -44 }, { x: 0, ...base })
        } else if (kind === 'right') {
          gsap.fromTo(el, { x: 44 }, { x: 0, ...base })
        } else if (kind === 'scale') {
          gsap.fromTo(el, { scale: 0.94, y: 18 }, { scale: 1, y: 0, ...base, duration: 1.0 })
        } else if (kind === 'line') {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', ...base })
        } else if (kind === 'stagger') {
          const kids = [...el.children]
          gsap.set(el, { opacity: 1 })
          el.classList.add('is-in')
          gsap.fromTo(
            kids,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.09,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            }
          )
        } else {
          gsap.fromTo(el, { y: 30 }, { y: 0, ...base })
        }
      })
    }, scopeRef)

    return () => ctx.revert()
  }, [scopeRef])
}
