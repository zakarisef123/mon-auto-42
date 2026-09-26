import { SERVICES } from '../data.jsx';

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <header className="section__head reveal">
          <p className="kicker">Nos services</p>
          <h2>Tout l'entretien et la réparation, au même endroit.</h2>
          <p>Toutes marques, particuliers et professionnels. On diagnostique, on vous explique, on chiffre — et on répare.</p>
        </header>

        <div className="services">
          {SERVICES.map((s) => (
            <article key={s.title} className={'card reveal' + (s.highlight ? ' card--highlight' : '')}>
              <div className="card__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {s.icon}
                </svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.link && (
                <a href={s.link.href} className="card__link">
                  {s.link.label}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
