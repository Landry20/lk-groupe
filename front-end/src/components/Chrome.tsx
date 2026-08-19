import type { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'

export function AnimatedBackground() {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/logos/logo-dark.jpeg' : '/logos/logo-light.jpeg'

  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-gradient" />
      <div className="orbit-ring">
        <img className="orbit-logo" src={src} alt="" />
      </div>
    </div>
  )
}

export function BubbleButton({
  children,
  className = '',
  type = 'button',
  onClick,
}: {
  children: ReactNode
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
}) {
  return (
    <button type={type} className={`bubble-btn ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
