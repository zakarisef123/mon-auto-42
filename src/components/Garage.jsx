import { GALLERY, WHY } from '../data.jsx';
import RevealTitle from './RevealTitle.jsx';

export default function Garage() {
  return (
    <section className="section" id="garage">
      <div className="container">
        <header className="section__head reveal">
          <p className="kicker">Le garage</p>
          <RevealTitle>Un atelier équipé, un accueil simple et direct.</RevealTitle>
          <p>
            Ponts élévateurs, outillage de diagnostic, espace d'exposition extérieur : on a tout sur place pour intervenir
            vite et bien.
          </p>
        </header>

        <div className="gallery">
          {GALLERY.map((g) => (
            <figure key={g.src} className={'gallery__item img-reveal' + (g.wide ? ' gallery__item--wide' : '')}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className="why">
          {WHY.map((w, k) => (
            <div key={w.title} className="why__item reveal">
              <span className="why__num">{String(k + 1).padStart(2, '0')}</span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
