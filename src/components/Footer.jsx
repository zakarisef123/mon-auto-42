import { PhoneIcon } from './Icons.jsx';
import { ADDRESS_LINE1, ADDRESS_LINE2, PHONE_TEL } from '../data.jsx';

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <p className="footer__brand">Mon Auto 42</p>
            <p>
              Garage automobile · Vente · Achat · Reprise
              <br />
              {ADDRESS_LINE1}, {ADDRESS_LINE2}
            </p>
          </div>
          <nav aria-label="Liens de pied de page">
            <a href="#services">Services</a>
            <a href="#occasions">Occasions</a>
            <a href="#devis">Devis</a>
            <a href="/mentions-legales.html">Mentions légales</a>
          </nav>
          <p className="footer__copy">© {new Date().getFullYear()} Mon Auto 42. Tous droits réservés.</p>
        </div>
      </footer>

      {/* Bouton d'appel flottant (mobile) */}
      <a className="fab" href={PHONE_TEL} aria-label="Appeler le garage">
        <PhoneIcon />
      </a>
    </>
  );
}
