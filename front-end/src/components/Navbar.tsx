import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { navItems } from '../data/content'
import { useTheme } from '../context/ThemeContext'
import { BrandLogo } from './BrandLogo'

export function Navbar() {
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const admin = pathname.startsWith('/admin')
  const home = pathname === '/'
  const [visible, setVisible] = useState(!home)

  useEffect(() => {
    if (!home) {
      setVisible(true)
      return
    }
    const onScroll = () => {
      const show = window.scrollY > 36
      setVisible(show)
      if (!show) setOpen(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])

  if (admin) return null

  return (
    <>
      <motion.header
        className="nav"
        initial={false}
        animate={{
          y: visible ? 0 : -120,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <BrandLogo />
          <span className="brand-copy">
            <strong>LK-group</strong>
            <span>inspire · mark</span>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Principal">
          {navItems.map((item) => {
            const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)
            return (
            <NavLink key={item.to} to={item.to} className="bubble-link">
              {active && (
                <motion.span layoutId="nav-pip" className="pip" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
              {item.label}
            </NavLink>
            )
          })}
        </nav>

        <div className="nav-actions">
          <button className="bubble icon-bubble" onClick={toggle} aria-label="Changer le thème" type="button">
            <AnimatePresence mode="wait">
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                style={{ display: 'grid' }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button className="bubble-btn primary hide-sm" type="button" onClick={() => navigate('/contact')}>
            Parler d’un projet
          </button>
          <button className="bubble icon-bubble menu-toggle" type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && visible && (
          <motion.nav
            className="mobile-panel"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="bubble-link" onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <button className="bubble-btn primary" type="button" onClick={() => { setOpen(false); navigate('/contact') }}>
              Parler d’un projet
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

export function Footer() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="footer card">
      <div>
        <BrandLogo size={42} />
        <p style={{ margin: '10px 0 0', fontWeight: 800 }}>LK-group</p>
        <p className="muted" style={{ margin: '4px 0 0' }}>
          Solutions that <em style={{ color: 'var(--orange)', fontStyle: 'normal' }}>inspire</em>, experiences that leave a mark.
        </p>
      </div>
      <div className="muted">
        Développement d’applications · Logiciels d’entreprise
        <br />
        © {new Date().getFullYear()} LK-group
      </div>
    </footer>
  )
}
