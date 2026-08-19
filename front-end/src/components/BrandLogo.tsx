import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { asset } from '../lib/asset'

export function BrandLogo({ size = 46, className = '' }: { size?: number; className?: string }) {
  const { theme } = useTheme()
  const src = asset(theme === 'dark' ? '/logos/logo-dark.jpeg' : '/logos/logo-light.jpeg')

  return (
    <span className={className} style={{ width: size, height: size, display: 'inline-grid', placeItems: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt="LK-group"
          width={size}
          height={size}
          initial={{ rotateY: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: 90, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%' }}
        />
      </AnimatePresence>
    </span>
  )
}

export function BrandPoster() {
  const { theme } = useTheme()
  const src = asset(theme === 'dark' ? '/logos/brand-dark.jpeg' : '/logos/brand-light.jpeg')

  return (
    <AnimatePresence mode="wait">
      <motion.img
        key={src}
        src={src}
        alt="LK-group — Solutions that inspire"
        initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', borderRadius: 28, boxShadow: 'var(--shadow)' }}
      />
    </AnimatePresence>
  )
}
