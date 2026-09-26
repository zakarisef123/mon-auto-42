import { useEffect, useState } from 'react';
import { PhoneIcon, WheelPaths } from './Icons.jsx';
import { PHONE_DISPLAY, PHONE_TEL } from '../data.jsx';

const LINKS = [
  ['#services', 'Services'],
  ['#occasions', 'Occasions'],
  ['#garage', 'Le garage'],
  ['#devis', 'Devis'],
  ['#contact', 'Contact'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('keydown', onKey);
    onScroll();

    // Lien actif selon la section visible
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
      spy.disconnect();
    };
  }, []);

  return (
    <header className={'header' + (scrolled ? ' is-scrolled' : '')} id="top">
      <div className="container header__inner">
        <a href="#top" className="logo" aria-label="Mon Auto 42 — accueil">
          <svg className="logo__mark" viewBox="0 0 48 48" aria-hidden="true">
            <WheelPaths />
            <path d="M2 16h8M0 24h8M2 32h8" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="logo__text">
            <small>Mon</small>Auto 42
          </span>
        </a>

        <nav className={'nav' + (open ? ' is-open' : '')} id="nav" aria-label="Navigation principale">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className={active === href ? 'is-active' : undefined} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="btn btn--accent header__cta" href={PHONE_TEL}>
          <PhoneIcon />
          <span>{PHONE_DISPLAY}</span>
        </a>

        <button
          className="burger"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
