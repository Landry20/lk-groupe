import { BrandPoster } from '../components/BrandLogo'
import { CvDownloadButton } from '../components/CvDownload'
import { Reveal } from '../components/Reveal'
import { company, cv } from '../data/content'

export function AboutPage() {
  return (
    <div className="page-wrap">
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="kicker"><i /> À propos</div>
        <h2>LK-group, une maison de logiciels.</h2>
        <p className="lede">
          {company.tagline} Nous existons pour une chose : concevoir des applications et des logiciels d’entreprise qui
          tiennent la route, le lundi matin, quand les équipes arrivent.
        </p>
        <div className="hero-cta">
          <CvDownloadButton />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          <Reveal>
            <BrandPoster />
          </Reveal>
          <Reveal delay={0.1}>
            <article className="card">
              <h3>Pourquoi nous</h3>
              <p>
                Parce qu’un logiciel d’entreprise n’est pas un site vitrine. C’est un outil de décision. Stocks, dossiers
                patients, notes d’élèves, calendriers de résidences : si le flux est faux, la journée casse.
              </p>
              <p>
                LK-group construit ces flux. D’abord le métier. Ensuite l’interface. Ensuite l’installation — souvent en
                PWA, pour que le logiciel vive dans la poche autant que sur le bureau.
              </p>
              <p>
                Autour du code, nous accompagnons : design UI/UX, communication, marketing, conseil. Mais la grande force,
                celle qu’on met en avant, reste le développement d’applications et de logiciels de solutions d’entreprise.
              </p>
              <h3>Le fondateur</h3>
              <p>
                {cv.name} — {cv.role}. Formation à {cv.education.school}, {cv.education.place} ({cv.education.diploma}).
              </p>
              <CvDownloadButton />
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="grid-3">
          {[
            { t: 'Clarté', d: 'Un écran, une action. Les équipes comprennent sans formation-marathon.' },
            { t: 'Solidité', d: 'Rôles, traces, documents, données séparées quand le métier l’exige.' },
            { t: 'Beauté utile', d: 'Un logiciel peut être beau. Quand il l’est, on l’ouvre plus souvent.' },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 0.08} preset={i === 1 ? 'scale' : i === 0 ? 'left' : 'right'}>
              <article className="card">
                <h3>{item.t}</h3>
                <p>{item.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
