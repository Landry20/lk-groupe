import { motion } from 'framer-motion'
import { Pause } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'

export function AdminPage() {
  return (
    <div className="page-wrap admin-shell">
      <header className="nav" style={{ position: 'relative', top: 0, translate: 'none', width: '100%', marginBottom: 18 }}>
        <div className="brand">
          <BrandLogo />
          <span className="brand-copy">
            <strong>LK Admin</strong>
            <span>espace en pause</span>
          </span>
        </div>
        <Link to="/" className="bubble-btn">Retour au site</Link>
      </header>

      <div className="admin-grid" style={{ position: 'relative' }}>
        <aside className="card">
          {['Tableau', 'Projets', 'Messages', 'Médias', 'Équipe'].map((item) => (
            <div key={item} className="skeleton" style={{ height: 36, opacity: 0.7 }} />
          ))}
        </aside>
        <section className="card" style={{ position: 'relative', minHeight: 420 }}>
          <div className="skeleton" style={{ width: '40%', height: 22 }} />
          <div className="skeleton" style={{ width: '90%' }} />
          <div className="skeleton" style={{ width: '80%' }} />
          <div className="grid-3" style={{ marginTop: 24 }}>
            <div className="skeleton" style={{ height: 90 }} />
            <div className="skeleton" style={{ height: 90 }} />
            <div className="skeleton" style={{ height: 90 }} />
          </div>
          <div className="paused-seal">
            <motion.div
              className="card"
              animate={{ rotateY: [0, 8, 0], y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ maxWidth: 420 }}
            >
              <Pause />
              <h3>Espace admin — en pause</h3>
              <p className="muted">
                La PWA administration est en place. Le métier (édition, médias, messages) arrivera pas à pas. Rien n’est
                encore branché, volontairement.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
