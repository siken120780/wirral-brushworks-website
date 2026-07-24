import { DotsLogo } from './Nav.jsx'
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, HOURS } from '../lib/constants.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__grid">
        <div className="foot__brand">
          <DotsLogo />
          <p>Professional painters and decorators serving the entire Wirral peninsula.</p>
        </div>

        <div className="foot__col">
          <h4>Contact</h4>
          <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>

        <div className="foot__col">
          <h4>Opening Hours</h4>
          {HOURS.map(([d, h]) => (
            <span key={d}>
              {d}: {h}
            </span>
          ))}
        </div>
      </div>

      <div className="wrap foot__base">
        <span>© 2026 Wirral Brushworks. All rights reserved.</span>
        <p className="foot__credit">Website designed & built by <a href="https://meridiagrowth.co.uk" target="_blank" rel="noopener noreferrer">Meridia Growth</a></p>
      </div>
    </footer>
  )
}
