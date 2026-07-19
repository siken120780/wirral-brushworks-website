import { WHATSAPP_URL } from '../lib/constants.js'
import './WhatsApp.css'

/* Floating WhatsApp button — customers can send photos of their rooms,
   which is halfway to a quote before we've even visited. */
export default function WhatsApp() {
  return (
    <a
      className="wa"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Message us on WhatsApp"
    >
      <span className="wa__label">Message us on WhatsApp</span>
      <span className="wa__btn">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff" aria-hidden="true">
          <path d="M16.04 4C9.5 4 4.2 9.3 4.2 15.83c0 2.09.55 4.12 1.6 5.92L4 28l6.42-1.68a11.8 11.8 0 0 0 5.62 1.43h.01c6.53 0 11.84-5.3 11.84-11.84C27.89 9.3 22.57 4 16.04 4zm0 21.75h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.65-.24-.37a9.8 9.8 0 0 1-1.51-5.29c0-5.43 4.43-9.84 9.87-9.84a9.8 9.8 0 0 1 9.86 9.85c0 5.43-4.42 9.91-9.82 9.91zm5.4-7.37c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.14-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.5l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.06c.15.2 2.09 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </span>
    </a>
  )
}
