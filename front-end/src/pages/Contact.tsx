import { useEffect, useState, type FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { acceptSubmission, burnTicket, cleanText, issueTicket } from '../lib/guard'

type Status = 'idle' | 'ok' | 'wait'

export function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    issueTicket()
  }, [])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const payload = {
      name: cleanText(String(data.get('name') ?? ''), 80),
      email: cleanText(String(data.get('email') ?? ''), 180),
      company: cleanText(String(data.get('company') ?? ''), 160),
      message: cleanText(String(data.get('message') ?? ''), 2000),
      trap: String(data.get('website') ?? ''),
    }

    const ok = acceptSubmission(payload)
    setStatus('ok')
    if (ok) {
      burnTicket()
      event.currentTarget.reset()
      issueTicket()
    }
  }

  return (
    <div className="page-wrap">
      <section className="section" style={{ paddingTop: 28 }}>
        <div className="kicker"><i /> Contactez-nous</div>
        <h2>Parlons de votre logiciel.</h2>
        <p className="lede">
          Une clinique, un dépôt, une école, une résidence, une flotte : décrivez le métier. Nous répondons avec une
          architecture, pas avec un slogan.
        </p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          <Reveal>
            <form className="card form" onSubmit={onSubmit} autoComplete="on">
              <label className="field">
                <span>Nom</span>
                <input name="name" required maxLength={80} />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" required maxLength={180} />
              </label>
              <label className="field">
                <span>Entreprise</span>
                <input name="company" maxLength={160} />
              </label>
              <label className="hp" aria-hidden="true">
                <span>Site</span>
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <label className="field">
                <span>Message</span>
                <textarea name="message" required maxLength={2000} />
              </label>
              <button className="bubble-btn primary" type="submit">
                Envoyer le message
              </button>
              {status === 'ok' && <p className="toast">Message reçu. Nous revenons vers vous.</p>}
              {status === 'wait' && <p className="toast">Un instant…</p>}
            </form>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="card">
              <h3>LK-group</h3>
              <p>
                Développement d’applications · Développement de logiciels · Design UI/UX · Communication digitale ·
                Marketing digital · Conseil
              </p>
              <p className="muted">
                Les liens de démonstration des projets seront ajoutés ici dès que vous les transmettrez. En attendant,
                le portfolio décrit déjà chaque réalisation.
              </p>
            </article>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
