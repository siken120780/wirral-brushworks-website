import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Intro.css'

/*
 * Opening title — a premium paint-film treatment. No illustrated objects.
 *
 *   · a near-black wall under one soft key light, with paper grain
 *   · a single broad stroke of brand pink is pulled across the wall —
 *     built from dozens of overlapping bristle lines, so it has body,
 *     streaks, ragged dry edges and a wet leading bead
 *   · WIRRAL BRUSHWORKS is stencilled through the paint as it passes
 *   · a beat — then the letters open into the site and the coat lifts away
 *
 * ≈ 3.2s. Once per session. Skippable. Reduced motion bypasses entirely.
 */

const PINK = '#ff0091'

export const introDone = () => {
  if (window.__bwIntroDone) return
  window.__bwIntroDone = true
  window.dispatchEvent(new Event('bw:introdone'))
}

export default function Intro({ enabled }) {
  const [alive, setAlive] = useState(enabled)
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const state = useRef({})

  useEffect(() => {
    if (!enabled) return
    const root = ref.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) { introDone(); setAlive(false); return }
    const st = state.current
    document.body.style.overflow = 'hidden'
    try { document.fonts?.load('800 120px Sora') } catch { /* fallback */ }

    const lite = window.innerWidth < 640
    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2)
    const mount = performance.now()

    // offscreen layers
    const SC = document.createElement('canvas') // accumulated paint
    const scx = SC.getContext('2d')
    const TC = document.createElement('canvas') // the stencilled wordmark
    const tcx = TC.getContext('2d')
    const L = document.createElement('canvas')  // paint ∖ letters, per frame
    const lcx = L.getContext('2d')
    const M = document.createElement('canvas')  // the reveal mask
    const mcx = M.getContext('2d')

    // grain tile
    const grain = document.createElement('canvas')
    grain.width = grain.height = 140
    const gcx = grain.getContext('2d')
    const gd = gcx.createImageData(140, 140)
    for (let i = 0; i < gd.data.length; i += 4) {
      const v = 118 + Math.random() * 137
      gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = v
      gd.data[i + 3] = 255
    }
    gcx.putImageData(gd, 0, 0)

    let W, H, grad = {}
    const bandY = () => H * 0.44
    const bandH = () => H * (lite ? 0.3 : 0.23)

    const size = () => {
      W = canvas.width = SC.width = TC.width = L.width = M.width = window.innerWidth * dpr
      H = canvas.height = SC.height = TC.height = L.height = M.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      grad.wall = ctx.createLinearGradient(0, 0, 0, H)
      grad.wall.addColorStop(0, '#080706')
      grad.wall.addColorStop(0.55, '#12100e')
      grad.wall.addColorStop(1, '#0a0908')
      grad.key = ctx.createRadialGradient(W * 0.42, H * 0.2, 0, W * 0.42, H * 0.2, H * 1.1)
      grad.key.addColorStop(0, 'rgba(255, 246, 228, 0.07)')
      grad.key.addColorStop(0.55, 'rgba(255, 246, 228, 0.02)')
      grad.key.addColorStop(1, 'rgba(255, 246, 228, 0)')
      grad.vig = ctx.createRadialGradient(W / 2, H * 0.44, H * 0.3, W / 2, H * 0.44, H * 0.98)
      grad.vig.addColorStop(0, 'rgba(0,0,0,0)')
      grad.vig.addColorStop(1, 'rgba(0,0,0,0.5)')
      grad.pattern = ctx.createPattern(grain, 'repeat')
      buildText()
    }

    /* ---- the wordmark, drawn white for stencilling ---- */
    function buildText() {
      tcx.clearRect(0, 0, W, H)
      tcx.fillStyle = '#ffffff'
      tcx.textAlign = 'center'
      tcx.textBaseline = 'middle'
      const fit = (txt, maxW, startFs) => {
        let fs = startFs
        tcx.font = `800 ${fs}px Sora, system-ui, sans-serif`
        const w = tcx.measureText(txt).width
        if (w > maxW) fs = fs * (maxW / w)
        return fs
      }
      const cy = bandY()
      if (lite) {
        const fs = Math.min(fit('BRUSHWORKS', W * 0.86, H * 0.09), bandH() * 0.4)
        tcx.font = `800 ${fs}px Sora, system-ui, sans-serif`
        tcx.fillText('WIRRAL', W / 2, cy - fs * 0.6)
        tcx.fillText('BRUSHWORKS', W / 2, cy + fs * 0.6)
      } else {
        const fs = Math.min(fit('WIRRAL BRUSHWORKS', W * 0.8, H * 0.11), bandH() * 0.62)
        tcx.font = `800 ${fs}px Sora, system-ui, sans-serif`
        tcx.fillText('WIRRAL BRUSHWORKS', W / 2, cy)
      }
    }

    /* ---- the stroke: dozens of bristle lines with real variation ---- */
    const shade = (t) => {
      // pink varied between deep and light — never flat
      const mix = (a, b, k) => Math.round(a + (b - a) * k)
      const from = [209, 0, 119]
      const to = [255, 92, 183]
      return `rgb(${mix(from[0], to[0], t)},${mix(from[1], to[1], t)},${mix(from[2], to[2], t)})`
    }
    /* the coat is built in three layers: a solid base of fat overlapping
       strokes, fine streaks of tonal variation through it, and darker wet
       edges — continuous paths, so it reads as one pulled stroke of paint */
    const BRISTLES = [
      // base coat — full-bodied (width resolved at draw time as a share of
      // the band height, since the canvas may not be sized yet)
      ...[-0.27, -0.04, 0.19, 0.36].map((off) => ({
        off,
        wf: 0.36,
        a: 0.97,
        c: shade(0.32 + Math.random() * 0.12),
        phase: Math.random() * 10,
        wob: 3 + Math.random() * 4,
        dry: 0.86 + Math.random() * 0.12,
      })),
      // tonal streaks dragged through the wet paint
      ...Array.from({ length: lite ? 16 : 26 }, () => ({
        off: (Math.random() - 0.5) * 0.92,
        w: (1.8 + Math.random() * 4) * dpr,
        a: 0.08 + Math.random() * 0.14,
        c: Math.random() < 0.5 ? shade(0.75 + Math.random() * 0.25) : 'rgba(120, 0, 68, 1)',
        phase: Math.random() * 10,
        wob: 2 + Math.random() * 3,
        dry: 0.68 + Math.random() * 0.3,
      })),
    ]
    const yOf = (b, x) =>
      bandY() + b.off * bandH() +
      Math.sin(x * 0.0035 + b.phase) * b.wob * dpr +
      Math.sin(x * 0.021 + b.phase * 2.7) * 1.4 * dpr // fine tremor in the pull
    st.head = { x: null }
    st.drips = []
    const advance = (x) => {
      if (st.head.x === null) st.head.x = x
      const x0 = st.head.x
      if (x <= x0) return
      const step = 6 * dpr
      scx.lineCap = 'butt' // butt caps keep chunk seams invisible
      scx.lineJoin = 'round'
      BRISTLES.forEach((b) => {
        const alphaAt = (u) => {
          let a = b.a
          if (u > b.dry) a *= Math.max(0, 1 - (u - b.dry) / 0.12) // dry-brush tail
          if (u < 0.04) a *= Math.max(0, u) / 0.04 // soft start
          return a
        }
        scx.strokeStyle = b.c
        scx.lineWidth = b.wf ? bandH() * b.wf : b.w
        const inTaper = x / W > b.dry - 0.03 || x0 / W < 0.05
        if (inTaper) {
          // per-step segments so the fade is a smooth gradient, not blocks
          for (let s = x0; s < x; s += step) {
            const e = Math.min(s + step, x)
            const a = alphaAt((s + e) / 2 / W)
            if (a <= 0.004) continue
            scx.globalAlpha = a
            scx.beginPath()
            scx.moveTo(s, yOf(b, s))
            scx.lineTo(e, yOf(b, e))
            scx.stroke()
          }
        } else {
          const a = alphaAt((x0 + x) / 2 / W)
          if (a <= 0.004) return
          scx.globalAlpha = a
          scx.beginPath()
          scx.moveTo(x0, yOf(b, x0))
          for (let s = x0 + step; s <= x + 0.01; s += step) scx.lineTo(s, yOf(b, s))
          scx.lineTo(x, yOf(b, x))
          scx.stroke()
        }
      })
      // an occasional controlled run — kept left of centre, clear of the caption
      const um = x / W
      if (Math.random() < 0.05 && st.drips.length < 3 && um > 0.1 && um < 0.42) {
        st.drips.push({
          x, y: bandY() + bandH() * 0.48, len: (18 + Math.random() * 30) * dpr,
          w: (2 + Math.random() * 2) * dpr, born: performance.now(),
        })
      }
      scx.globalAlpha = 1
      st.head.x = x
    }
    st.advance = advance

    /* ---- reveal machinery (site shows through the letters, then all) ---- */
    st.fade = { paint: 1, cap: 0 }
    st.dilate = { p: 0 }
    st.openLetters = () => mcx.drawImage(TC, 0, 0)
    st.applyDilate = () => {
      const r = Math.hypot(W, H) * 0.72 * st.dilate.p
      if (r <= 0) return
      const g = mcx.createRadialGradient(W / 2, bandY(), r * 0.55, W / 2, bandY(), r)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      mcx.fillStyle = g
      mcx.beginPath()
      mcx.arc(W / 2, bandY(), r, 0, Math.PI * 2)
      mcx.fill()
    }
    st.sheen = { p: -1 }

    size()
    window.addEventListener('resize', size)

    /* ---- render ---- */
    const loop = () => {
      const now = performance.now()
      const ramp = Math.min(1, (now - mount) / 550)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = grad.wall
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = ramp
      ctx.fillStyle = grad.key
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1
      ctx.fillStyle = grad.vig
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 0.05
      ctx.fillStyle = grad.pattern
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1

      // the paint, with the wordmark stencilled out of it
      if (st.head.x !== null && st.fade.paint > 0.01) {
        // drips grow slowly, viscous
        st.drips.forEach((d) => {
          const t = Math.min(1, (now - d.born) / 1600)
          const e = 1 - Math.pow(1 - t, 2.6)
          scx.globalAlpha = 0.5
          scx.strokeStyle = shade(0.2)
          scx.lineWidth = d.w
          scx.lineCap = 'round'
          scx.beginPath()
          scx.moveTo(d.x, d.y)
          scx.lineTo(d.x, d.y + d.len * e)
          scx.stroke()
          scx.globalAlpha = 1
        })
        lcx.clearRect(0, 0, W, H)
        lcx.globalCompositeOperation = 'source-over'
        lcx.drawImage(SC, 0, 0)
        // the pass of light lives ON the paint only
        if (st.sheen.p >= 0 && st.sheen.p <= 1) {
          const sx = W * (st.sheen.p * 1.4 - 0.2)
          const g = lcx.createLinearGradient(sx - W * 0.12, 0, sx + W * 0.12, 0)
          g.addColorStop(0, 'rgba(255,250,240,0)')
          g.addColorStop(0.5, 'rgba(255,250,240,0.14)')
          g.addColorStop(1, 'rgba(255,250,240,0)')
          lcx.globalCompositeOperation = 'source-atop'
          lcx.fillStyle = g
          lcx.fillRect(0, 0, W, H)
        }
        lcx.globalCompositeOperation = 'destination-out'
        lcx.drawImage(TC, 0, 0)
        lcx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = st.fade.paint
        ctx.drawImage(L, 0, 0)
        ctx.globalAlpha = 1

        // wet leading bead while the stroke is being pulled
        if (st.head.x < W * 0.99) {
          const g = ctx.createRadialGradient(st.head.x, bandY(), 0, st.head.x, bandY(), bandH() * 0.5)
          g.addColorStop(0, 'rgba(170, 0, 95, 0.4)')
          g.addColorStop(1, 'rgba(170, 0, 95, 0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.ellipse(st.head.x, bandY(), bandH() * 0.2, bandH() * 0.52, 0, 0, Math.PI * 2)
          ctx.fill()
        }

      }

      // punch the reveal through everything
      ctx.globalCompositeOperation = 'destination-out'
      ctx.drawImage(M, 0, 0)
      ctx.globalCompositeOperation = 'source-over'

      st.raf = requestAnimationFrame(loop)
    }
    st.raf = requestAnimationFrame(loop)

    /* ---- choreography ---- */
    const caption = root.querySelector('.intro__caption')
    gsap.set(caption, { opacity: 0, y: 10 })

    const sweep = { x: -W * 0.06 }
    const tl = gsap.timeline()
    st.tl = tl

    tl.to(sweep, {
      x: W * 1.02,
      duration: 1.05,
      ease: 'power2.inOut',
      onStart: () => {
        root.style.background = 'transparent'
        st.head.x = sweep.x // begin off-frame so the edge never pops in
      },
      onUpdate: () => st.advance(sweep.x),
    }, 0.45)
      // light passes over the fresh coat; the caption settles in
      .to(st.sheen, { p: 1, duration: 0.9, ease: 'power2.inOut' }, 1.55)
      .to(caption, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.6)
      // a beat — then the letters open into the site
      .add(() => st.openLetters(), 2.5)
      .to(st.fade, { paint: 0, duration: 0.45, ease: 'power1.inOut' }, 2.62)
      .to(caption, { opacity: 0, duration: 0.3 }, 2.62)
      .add(introDone, 2.66)
      // and the coat lifts away
      .to(st.dilate, {
        p: 1, duration: 0.5, ease: 'power2.inOut',
        onUpdate: () => st.applyDilate(),
      }, 2.86)
      .to(root, { autoAlpha: 0, duration: 0.2 }, 3.3)
      .add(() => finish(), 3.5)

    const finish = () => {
      cancelAnimationFrame(st.raf)
      window.removeEventListener('resize', size)
      document.body.style.overflow = ''
      try { sessionStorage.setItem('bwIntroSeen', '1') } catch { /* private mode */ }
      introDone()
      setAlive(false)
    }
    st.finish = finish

    return () => {
      cancelAnimationFrame(st.raf)
      st.tl?.kill()
      window.removeEventListener('resize', size)
      document.body.style.overflow = ''
    }
  }, [enabled])

  if (!alive) return null

  const skip = () => {
    const st = state.current
    st.tl?.kill()
    gsap.to(ref.current, {
      autoAlpha: 0,
      duration: 0.3,
      onComplete: () => st.finish?.(),
    })
  }

  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <canvas className="intro__canvas" ref={canvasRef} />
      <p className="intro__caption">Painting &amp; Decorating&ensp;·&ensp;Wirral</p>
      <button className="intro__skip" type="button" onClick={skip}>
        Skip intro →
      </button>
    </div>
  )
}
