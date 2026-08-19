import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

const presets = {
  up: { hidden: { opacity: 0, y: 48, filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  left: { hidden: { opacity: 0, x: -56, rotate: -2 }, show: { opacity: 1, x: 0, rotate: 0 } },
  right: { hidden: { opacity: 0, x: 56, rotate: 2 }, show: { opacity: 1, x: 0, rotate: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.86 }, show: { opacity: 1, scale: 1 } },
}

export function Reveal({
  children,
  delay = 0,
  preset = 'up',
}: {
  children: ReactNode
  delay?: number
  preset?: keyof typeof presets
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.22, margin: '-8%' }}
      variants={presets[preset]}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function PageFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const numeric = Number.parseInt(value, 10)
  const suffix = value.replace(/^[0-9]+/, '')
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 70, damping: 18 })

  useEffect(() => {
    if (!inView || !Number.isFinite(numeric)) return
    motionValue.set(numeric)
  }, [inView, motionValue, numeric])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    return spring.on('change', (latest) => {
      if (!Number.isFinite(numeric)) {
        el.textContent = value
        return
      }
      el.textContent = `${Math.round(latest)}${suffix}`
    })
  }, [numeric, spring, suffix, value])

  return <span ref={ref}>{inView ? value : '0'}</span>
}
