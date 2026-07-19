import Intro from './components/Intro.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Difference from './components/Difference.jsx'
import Portfolio from './components/Portfolio.jsx'
import Estimate from './components/Estimate.jsx'
import Services from './components/Services.jsx'
import Trust from './components/Trust.jsx'
import Process from './components/Process.jsx'
import About from './components/About.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'
import Tape from './components/Tape.jsx'
import WhatsApp from './components/WhatsApp.jsx'
import { prefersReducedMotion } from './lib/useReveal.js'

const seenThisSession = (() => {
  try { return sessionStorage.getItem('bwIntroSeen') === '1' } catch { return false }
})()

const wantsIntro =
  typeof window !== 'undefined' &&
  !new URLSearchParams(window.location.search).has('nointro') &&
  !seenThisSession &&
  !prefersReducedMotion()

if (typeof window !== 'undefined' && !wantsIntro) {
  window.__bwIntroDone = true
}

export default function App() {
  return (
    <>
      <Intro enabled={wantsIntro} />
      <Nav />
      <main>
        {/* 1 — cinematic dark hero */}
        <Hero />
        {/* 2 — warm neutral transformation section */}
        <Difference />
        {/* 3 — dark immersive project work */}
        <Portfolio />
        <Tape />
        {/* 4 — dark immersive estimate */}
        <Estimate />
        {/* 4 — brand-colour services moment */}
        <Services />
        <Tape />
        <Trust />
        <Process />
        {/* 5 — lighter human section */}
        <About />
        {/* 6 — strong dark quote section */}
        <FinalCta />
      </main>
      <Footer />
      <WhatsApp />
    </>
  )
}
