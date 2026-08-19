import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PhotoCarousel } from '../components/PhotoCarousel'
import { QrBlock } from '../components/QrBlock'
import { getProject } from '../data/projects'

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = id ? getProject(id) : undefined

  if (!project) {
    return (
      <div className="page-wrap">
        <section className="section">
          <h2>Projet introuvable</h2>
          <button className="bubble-btn" type="button" onClick={() => navigate('/portfolio')}>
            Retour au portfolio
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="page-wrap project-page">
      <section className="section" style={{ paddingTop: 18, paddingBottom: 20 }}>
        <button className="bubble-btn" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="kicker" style={{ marginTop: 18 }}><i /> {project.category}</div>
        <h2>{project.title}</h2>
        <p className="lede">{project.purpose}</p>
      </section>

      {project.photos.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <PhotoCarousel photos={project.photos} />
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          <article className="card">
            <h3>De A à Z</h3>
            {project.story.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <h3>Modules</h3>
            <ul className="list">
              {project.modules.map((module) => (
                <li key={module}>{module}</li>
              ))}
            </ul>
            <div className="stack-pills" style={{ marginTop: 16 }}>
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </article>
          <article className="card">
            <h3>Ouvrir le projet</h3>
            {project.link ? (
              <>
                <p className="muted">{project.link.replace('https://', '')}</p>
                <a className="bubble-btn primary" href={project.link} target="_blank" rel="noopener noreferrer" style={{ marginTop: 8 }}>
                  Visiter le logiciel <ExternalLink size={14} />
                </a>
                <QrBlock url={project.link} />
              </>
            ) : (
              <p className="muted">
                Le lien public n’est pas encore branché pour ce projet. Le QR et la visite arriveront dès que l’adresse
                sera en ligne.
              </p>
            )}
            <p style={{ marginTop: 18 }}>
              <Link to="/portfolio" className="bubble-btn">Tous les projets</Link>
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
