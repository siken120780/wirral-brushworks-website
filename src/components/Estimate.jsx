import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReveal, prefersReducedMotion } from '../lib/useReveal.js'
import {
  SERVICES_Q, ROOMS_Q, SIZES_Q, TIMING_Q, PRICE_MATRIX,
  EMAIL, PHONE_DISPLAY, PHONE_TEL,
} from '../lib/constants.js'
import './Estimate.css'

const STEPS = ['What do you need?', 'How many rooms or areas?', 'Rough size?', 'When are you looking to get it done?', 'Where should we send this?']

function estimateFor(type, rooms, size) {
  const row = PRICE_MATRIX[type]?.[size]
  if (!row) return null
  return { min: row[0] * rooms, max: row[1] * rooms }
}

export default function Estimate() {
  const ref = useRef(null)
  const priceRef = useRef(null)
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState({ type: null, rooms: null, roomsLabel: '', size: null, sizeLabel: '', timing: null })
  const [contact, setContact] = useState({ name: '', phone: '', postcode: '' })
  const [sent, setSent] = useState(false)
  useReveal(ref)

  const est = ans.type && ans.rooms && ans.size ? estimateFor(ans.type, ans.rooms, ans.size) : null

  // count the guide price up when it appears
  useEffect(() => {
    if (step !== 4 || !est || !priceRef.current) return
    if (prefersReducedMotion()) {
      priceRef.current.textContent = `£${est.min} – £${est.max}`
      return
    }
    const obj = { a: Math.max(0, est.min - 140), b: Math.max(0, est.max - 260) }
    const el = priceRef.current
    const tween = gsap.to(obj, {
      a: est.min,
      b: est.max,
      duration: 1.1,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = `£${Math.round(obj.a)} – £${Math.round(obj.b)}`
      },
    })
    return () => tween.kill()
  }, [step, est?.min, est?.max])

  const pick = (patch, next) => {
    setAns((a) => ({ ...a, ...patch }))
    setStep(next)
  }

  const submit = (e) => {
    e.preventDefault()
    const lines = [
      'Instant estimate request — from the Wirral Brushworks website',
      '',
      `Job: ${ans.type}`,
      `Rooms/areas: ${ans.roomsLabel}`,
      `Rough size: ${ans.sizeLabel}`,
      `Timing: ${ans.timing}`,
      est ? `Guide price shown: £${est.min} – £${est.max}` : 'Guide price shown: free site visit needed',
      '',
      `Name: ${contact.name}`,
      `Phone: ${contact.phone}`,
      `Postcode: ${contact.postcode}`,
    ]
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Estimate request — ${contact.name} (${contact.postcode})`)}&body=${encodeURIComponent(lines.join('\n'))}`
    window.location.href = href
    setSent(true)
  }

  const restart = () => {
    setStep(0)
    setAns({ type: null, rooms: null, roomsLabel: '', size: null, sizeLabel: '', timing: null })
    setContact({ name: '', phone: '', postcode: '' })
    setSent(false)
  }

  return (
    <section className="est" id="estimate" ref={ref}>
      <div className="wrap est__wrap">
        <div className="est__head">
          <p className="eyebrow" data-rv="up">Sixty seconds, no forms to chase</p>
          <h2 data-rv="mask">Get an instant estimate in under a minute</h2>
          <p className="est__sub" data-rv="up">
            Answer a few quick questions and get a ballpark price, sent straight to us.
          </p>
        </div>

        <div className="est__card" data-rv="scale">
          {/* progress — five palette dots that fill as you go */}
          <div className="est__progress" aria-hidden="true">
            {STEPS.map((_, i) => (
              <i key={i} className={i <= step ? 'is-done' : ''} data-dot={i} />
            ))}
          </div>

          {sent ? (
            <div className="est__pane est__done">
              <h3>Nearly there — press send</h3>
              <p>
                Your email app has opened with everything filled in. Press send and
                we&rsquo;ll come back to you to arrange a free visit.
              </p>
              <p className="est__alt">
                Prefer to talk? Call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.
              </p>
              <button className="btn btn-ghost est__restart" type="button" onClick={restart}>
                Start another estimate
              </button>
            </div>
          ) : (
            <>
              <div className="est__crumbs" aria-hidden="true">
                {ans.type && <span>{ans.type}</span>}
                {ans.roomsLabel && <span>{ans.roomsLabel}</span>}
                {ans.sizeLabel && <span>{ans.sizeLabel}</span>}
                {ans.timing && <span>{ans.timing}</span>}
              </div>

              <h3 className="est__q">{STEPS[step]}</h3>

              {step === 0 && (
                <div className="est__opts">
                  {SERVICES_Q.map((s) => (
                    <button key={s} type="button" className="est__opt" onClick={() => pick({ type: s }, 1)}>
                      {s} <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="est__opts">
                  {ROOMS_Q.map((r) => (
                    <button key={r.label} type="button" className="est__opt" onClick={() => pick({ rooms: r.value, roomsLabel: r.label }, 2)}>
                      {r.label} <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="est__opts">
                  {SIZES_Q.map((s) => (
                    <button key={s.value} type="button" className="est__opt" onClick={() => pick({ size: s.value, sizeLabel: `${s.label} (${s.hint})` }, 3)}>
                      {s.label} <small>({s.hint})</small> <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="est__opts">
                  {TIMING_Q.map((t) => (
                    <button key={t} type="button" className="est__opt" onClick={() => pick({ timing: t }, 4)}>
                      {t} <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <form className="est__final" onSubmit={submit}>
                  <div className="est__price-card">
                    {est ? (
                      <>
                        <span className="est__price-label">Estimated guide price</span>
                        <strong className="est__price" ref={priceRef}>£{est.min} – £{est.max}</strong>
                        <span className="est__price-note">
                          This is a guide only. A firm price follows a quick free visit.
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="est__price-label">Our recommendation</span>
                        <strong className="est__price">Free site visit</strong>
                        <span className="est__price-note">
                          For jobs like this we take a quick look first, then give you a firm price.
                        </span>
                      </>
                    )}
                  </div>

                  <div className="est__fields">
                    <input
                      required
                      placeholder="Your Name"
                      autoComplete="name"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    />
                    <input
                      required
                      placeholder="Postcode"
                      autoComplete="postal-code"
                      value={contact.postcode}
                      onChange={(e) => setContact({ ...contact, postcode: e.target.value })}
                    />
                  </div>

                  <button className="btn btn-paint est__send" type="submit">
                    Send it to us <span className="arrow" aria-hidden="true">→</span>
                  </button>
                </form>
              )}

              {step > 0 && (
                <button className="est__back" type="button" onClick={() => setStep(step - 1)}>
                  ← Back
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
