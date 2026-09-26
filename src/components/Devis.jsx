import { useState } from 'react';
import { WhatsAppIcon } from './Icons.jsx';
import { PHONE_DISPLAY, PHONE_INTL, PHONE_TEL, SUJETS } from '../data.jsx';
import RevealTitle from './RevealTitle.jsx';

const REQUIRED = ['nom', 'tel', 'message'];

// Formulaire de devis : prépare un message WhatsApp ou SMS (aucune donnée stockée)
export default function Devis({ sujet, onSujetChange }) {
  const [values, setValues] = useState({ nom: '', tel: '', vehicule: '', message: '' });
  const [invalid, setInvalid] = useState({});
  const [showError, setShowError] = useState(false);

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  function send(channel) {
    const bad = Object.fromEntries(REQUIRED.map((k) => [k, values[k].trim() === '']));
    setInvalid(bad);
    const ok = !Object.values(bad).some(Boolean);
    setShowError(!ok);
    if (!ok) return;

    const text =
      'Bonjour Mon Auto 42,\n\n' +
      `Demande : ${sujet}\n` +
      (values.vehicule.trim() ? `Véhicule : ${values.vehicule.trim()}\n` : '') +
      `\n${values.message.trim()}\n\n` +
      `${values.nom.trim()} — ${values.tel.trim()}`;

    const url =
      channel === 'sms'
        ? `sms:+${PHONE_INTL}?&body=${encodeURIComponent(text)}`
        : `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  }

  const onSubmit = (e) => {
    e.preventDefault();
    send(e.nativeEvent.submitter?.dataset.channel || 'whatsapp');
  };

  return (
    <section className="section section--tint" id="devis">
      <div className="container devis">
        <div className="devis__intro reveal">
          <p className="kicker">Devis gratuit</p>
          <RevealTitle>Décrivez votre besoin, on vous répond rapidement.</RevealTitle>
          <p>
            Remplissez le formulaire : votre demande s'ouvre directement dans WhatsApp (ou par SMS), prête à nous être
            envoyée. Vous préférez parler ? Appelez-nous.
          </p>
          <a className="devis__phone" href={PHONE_TEL}>
            <span>Appel direct</span>
            {PHONE_DISPLAY}
          </a>
        </div>

        <form className="form reveal" id="devis-form" noValidate onSubmit={onSubmit}>
          <div className="form__row">
            <label>
              Nom
              <input type="text" name="nom" autoComplete="name" required value={values.nom} onChange={set('nom')} aria-invalid={!!invalid.nom} />
            </label>
            <label>
              Téléphone
              <input type="tel" name="tel" autoComplete="tel" inputMode="tel" required value={values.tel} onChange={set('tel')} aria-invalid={!!invalid.tel} />
            </label>
          </div>
          <label>
            Objet de la demande
            <select name="sujet" id="sujet" value={sujet} onChange={(e) => onSujetChange(e.target.value)}>
              {SUJETS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Véhicule <span className="opt">(marque, modèle, année)</span>
            <input type="text" name="vehicule" placeholder="Ex. Peugeot 308 — 2018" value={values.vehicule} onChange={set('vehicule')} />
          </label>
          <label>
            Votre message
            <textarea
              name="message"
              rows="4"
              placeholder="Décrivez le problème ou votre besoin…"
              required
              value={values.message}
              onChange={set('message')}
              aria-invalid={!!invalid.message}
            />
          </label>
          {showError && (
            <p className="form__error" id="form-error" role="alert">
              Merci de renseigner votre nom, votre téléphone et un message.
            </p>
          )}
          <div className="form__actions">
            <button type="submit" className="btn btn--accent btn--lg" data-channel="whatsapp">
              <WhatsAppIcon />
              Envoyer via WhatsApp
            </button>
            <button type="submit" className="btn btn--outline btn--lg" data-channel="sms">
              Envoyer par SMS
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
