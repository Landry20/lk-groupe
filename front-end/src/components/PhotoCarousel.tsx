import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { ProjectPhoto } from '../data/projects'

export function PhotoCarousel({ photos }: { photos: ProjectPhoto[] }) {
  const [index, setIndex] = useState(0)
  if (photos.length === 0) return null
  const current = photos[index]

  function go(step: number) {
    setIndex((value) => (value + step + photos.length) % photos.length)
  }

  return (
    <div className="carousel">
      <div className="carousel-stage">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.caption}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>
        {photos.length > 1 && (
          <>
            <button className="bubble icon-bubble carousel-nav prev" type="button" onClick={() => go(-1)} aria-label="Photo précédente">
              <ChevronLeft size={18} />
            </button>
            <button className="bubble icon-bubble carousel-nav next" type="button" onClick={() => go(1)} aria-label="Photo suivante">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <p className="muted" style={{ margin: '10px 0 0', fontWeight: 700 }}>
        {current.caption} · {index + 1}/{photos.length}
      </p>
    </div>
  )
}
