import { PhoneIcon } from './Icons.jsx';
import { ADDRESS_LINE1, ADDRESS_LINE2, HOURS, MAPS_DIRECTIONS, MAPS_EMBED, PHONE_DISPLAY, PHONE_TEL } from '../data.jsx';

export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container contact">
        <div className="contact__info reveal">
          <p className="kicker">Nous trouver</p>
          <h2>Passez nous voir.</h2>
          <ul className="contact__list">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <div>
                <strong>Adresse</strong>
                <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener">
                  {ADDRESS_LINE1}
                  <br />
                  {ADDRESS_LINE2}
                </a>
              </div>
            </li>
            <li>
              <PhoneIcon />
              <div>
                <strong>Téléphone</strong>
                <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>
              </div>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <div>
                <strong>Horaires</strong>
                <span>
                  {HOURS.map((h, k) => (
                    <span key={k}>
                      {h}
                      {k < HOURS.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            </li>
          </ul>
          <a className="btn btn--accent" href={MAPS_DIRECTIONS} target="_blank" rel="noopener">
            Itinéraire
          </a>
        </div>
        <div className="contact__map reveal">
          <iframe
            title="Plan d'accès au garage Mon Auto 42"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
