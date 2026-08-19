import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { BrandLogo } from '../components/BrandLogo'
import { CvDownloadButton } from '../components/CvDownload'
import { cv } from '../data/content'
import { projects } from '../data/projects'

const filters = ['Tout', 'Logiciel phare', 'CV'] as const

export function PortfolioPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof filters)[number]>('Tout')
  const visible =
    filter === 'CV'
      ? []
      : filter === 'Logiciel phare'
        ? projects.filter((p) => p.category === 'Logiciel phare')
        : projects

  return (
    <div className="page-wrap">
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="kicker"><i /> Portfolio</div>
        <h2>Ce que nous avons développé. Et qui le développe.</h2>
        <p className="lede">
          Cliquez un projet : le détail s’ouvre, avec le métier, les modules, les photos s’il y en a, le lien et le QR.
        </p>
        <div className="tabs" style={{ marginTop: 22 }}>
          {filters.map((item) => (
            <button key={item} className="chip" type="button" onClick={() => setFilter(item)}>
              {filter === item && <motion.span layoutId="pf-pip" className="pip" />}
              {item}
            </button>
          ))}
        </div>
      </section>

      {filter !== 'CV' && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="grid-3">
            {visible.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.04} preset={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right'}>
                <button type="button" className="card card-hit" onClick={() => navigate(`/portfolio/${project.id}`)}>
                  <div className="kicker">{project.category}</div>
                  <h3>{project.title}</h3>
                  <p>{project.blurb}</p>
                  <span className="muted" style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
                    Voir le projet <ArrowRight size={14} />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {(filter === 'CV' || filter === 'Tout') && (
        <section className="section" style={{ paddingTop: filter === 'CV' ? 0 : undefined }}>
          <div className="section-head">
            <div>
              <div className="kicker"><i /> Curriculum</div>
              <h2>{cv.name}</h2>
            </div>
            <p>{cv.role} · {cv.company}</p>
          </div>
          <CvDownloadButton />
          <div className="cv" style={{ marginTop: 18 }}>
            <Reveal>
              <article className="card" style={{ textAlign: 'left' }}>
                <BrandLogo size={120} />
                <h3 style={{ marginTop: 16 }}>{cv.name}</h3>
                <p>{cv.role}</p>
                <p>{cv.education.diploma} · {cv.education.school}, {cv.education.place}</p>
                <div className="stack-pills" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
                  {cv.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="card">
                <p>{cv.pitch}</p>
                <h3>Forces</h3>
                <ul className="list">
                  {cv.strengths.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                {cv.chapters.map((chapter) => (
                  <div key={chapter.title}>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.text}</p>
                  </div>
                ))}
              </article>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}
