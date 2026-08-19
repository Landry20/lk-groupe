import { motion } from 'framer-motion'
import { ArrowRight, Code2, Laptop, Megaphone, PenTool, LineChart, Cloud } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { company, flagshipProducts, services, stats } from '../data/content'
import { Scene3D } from '../components/Scene3D'
import { DeveloperScene } from '../components/DeveloperScene'
import { Reveal } from '../components/Reveal'

const serviceIcons = [Code2, Laptop, Megaphone, PenTool, LineChart, Cloud]

export function HomePage() {
  const navigate = useNavigate()
  const stock = flagshipProducts[0]
  const [variant, setVariant] = useState(0)

  return (
    <div className="page-wrap">
      <section className="hero">
        <div>
          <motion.div className="kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <i /> {company.name} · logiciels d’entreprise
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Des applications qui travaillent.
            <br />
            Des <em>logiciels</em> qui restent.
          </motion.h1>
          <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {company.focus} Notre force : le développement d’applications et le développement de logiciels de solutions d’entreprise.
          </motion.p>
          <div className="hero-cta">
            <button className="bubble-btn primary" type="button" onClick={() => navigate('/portfolio')}>
              Voir le portfolio <ArrowRight size={16} />
            </button>
            <button className="bubble-btn accent" type="button" onClick={() => navigate('/contact')}>
              Contactez-nous
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <Scene3D />
          <motion.div
            className="hero-badge card"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <strong>Solutions that inspire</strong>
            <p className="muted" style={{ margin: '6px 0 0' }}>
              experiences that leave a mark.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="grid-4">
          {stats.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="card stat">
                <b>{item.value}</b>
                {item.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker"><i /> Ce que nous faisons</div>
            <h2>Deux piliers. Quatre autres métiers autour.</h2>
          </div>
          <p>
            Le cœur de LK-group, c’est le code métier. Le reste — design, communication, conseil — sert à faire vivre ce code dans l’entreprise.
          </p>
        </div>
        <div className="grid-3">
          {services.map((service, i) => {
            const Icon = serviceIcons[i]
            return (
              <Reveal key={service.id} delay={i * 0.06}>
                <motion.article className={`card ${service.highlight ? 'hot' : ''}`} whileHover={{ y: -8, rotateX: 4 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                  <div className="ico"><Icon size={22} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker"><i /> Logiciel phare</div>
            <h2>{stock.name} — deux gestions de stock</h2>
          </div>
          <p>{stock.summary}</p>
        </div>
        <div className="tabs">
          {stock.variants?.map((item, i) => (
            <button key={item.title} className="chip" type="button" onClick={() => setVariant(i)}>
              {variant === i && <motion.span layoutId="stock-pip" className="pip" />}
              {item.title}
            </button>
          ))}
        </div>
        <Reveal>
          <article className="card">
            <h3>{stock.variants?.[variant].title}</h3>
            <p>{stock.variants?.[variant].text}</p>
            <ul className="list">
              {stock.details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button
              className="bubble-btn primary"
              type="button"
              style={{ marginTop: 16 }}
              onClick={() => navigate(variant === 0 ? '/portfolio/stock-magasin' : '/portfolio/stock-auto')}
            >
              Voir ce logiciel <ArrowRight size={16} />
            </button>
          </article>
        </Reveal>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker"><i /> Suites métier</div>
            <h2>Les logiciels qui portent l’entreprise</h2>
          </div>
          <p>Cliniques, résidences, établissements scolaires — chacun a son rythme. Nous le traduisons en logiciel.</p>
        </div>
        <div className="grid-3">
          {flagshipProducts.slice(1).map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08}>
              <button type="button" className="card card-hit" onClick={() => navigate(`/portfolio/${product.id === 'ecole' ? 'scolarnet' : product.id}`)}>
                <div className="kicker">{product.tag}</div>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <ul className="list">
                  {product.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <span className="muted" style={{ fontWeight: 800 }}>Voir le projet →</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" id="dev-desk">
        <div className="section-head">
          <div>
            <div className="kicker"><i /> En train d’écrire le prochain</div>
            <h2>On scrolle. Il tape.</h2>
          </div>
          <p>
            Un développeur LK-group, à sa chaise, sur son clavier. Plus vous descendez, plus le code avance.
          </p>
        </div>
        <div className="dev-frame card">
          <DeveloperScene />
        </div>
      </section>
    </div>
  )
}
