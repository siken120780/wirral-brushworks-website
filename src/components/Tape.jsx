import { useEffect, useRef } from 'react'

/* A strip of masking tape that peels away as you reach it, leaving the
   crisp edge every decorator is proud of. */
export default function Tape() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-peeled')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="tape" ref={ref} aria-hidden="true">
      <span className="tape__strip" />
    </div>
  )
}
