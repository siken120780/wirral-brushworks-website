import { useEffect, useState } from 'react'
import { PHONE_DISPLAY, PHONE_TEL } from '../lib/constants.js'
import './Nav.css'

export function DotsLogo() {
  return (
    <a className="logo" href="#top" aria-label="Wirral Brushworks — back to top">
      <span className="dots" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
      <span className="logo__word">Wirral Brushworks</span>
    </a>
  )
}

export default function Nav() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="wrap nav__row">
        <DotsLogo />
        <div className="nav__actions">
          <a className="nav__phone" href={PHONE_TEL}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{PHONE_DISPLAY}</span>
          </a>
          <a className="btn btn-paint nav__cta" href="#estimate">
            <span className="nav__cta-long">Get an instant estimate</span>
            <span className="nav__cta-short">Instant estimate</span>
          </a>
        </div>
      </div>
    </header>
  )
}
