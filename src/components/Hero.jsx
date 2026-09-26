import { Suspense, lazy, useEffect, useMemo, useRef } from 'react';

// Three.js est lourd : la roue 3D est chargée après le reste de la page
const Wheel3D = lazy(() => import('./Wheel3D.jsx'));

const TITLE = [
  { text: 'Votre voiture entre' },
  { text: 'de bonnes mains.', em: true },
];

// Titre découpé mot par mot pour l'animation d'apparition
function AnimatedTitle() {
  let i = 0;
  const words = (text) =>
    text.split(' ').map((w, k, arr) => (
      <span key={k}>
        <span className="word">
          <span style={{ transitionDelay: `${0.08 * i++}s` }}>{w}</span>
        </span>
        {k < arr.length - 1 ? ' ' : null}
      </span>
    ));
  return (
    <h1>
      {TITLE.map((part, k) =>
        part.em ? (
          <em key={k}>{words(part.text)}</em>
        ) : (
          <span key={k}>
            {words(part.text)}{' '}
          </span>
        )
      )}
    </h1>
  );
}

function Counter({ to, ready }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let start = null;
    let frame;
    const tick = (t) => {
      if (start === null) start = t + 500;
      const p = Math.max(0, Math.min(1, (t - start) / 1200));
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    el.textContent = '0';
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready, to]);
  return <strong ref={ref}>{to}</strong>;
}

export default function Hero({ ready }) {
  // Traînées de vitesse générées une seule fois
  const streaks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, s) => ({
        top: `${8 + Math.random() * 84}%`,
        animationDuration: `${1.4 + Math.random() * 2.2}s`,
        animationDelay: `${Math.random() * 4}s`,
        width: `${12 + Math.random() * 22}%`,
        ...(s % 5 === 0 ? { background: 'linear-gradient(90deg, transparent, rgba(227,38,47,.6))' } : {}),
      })),
    []
  );

  return (
    <section className="hero">
      <img
        className="hero__bg"
        src="/assets/img/facade-garage.jpg"
        alt="Façade du garage Mon Auto 42 à Saint-Étienne avec des véhicules d'occasion exposés"
        fetchpriority="high"
      />
      <div className="hero__overlay" />
      <div className="hero__lights" aria-hidden="true" />
      <div className="hero__speed" aria-hidden="true">
        {streaks.map((style, k) => (
          <span key={k} style={style} />
        ))}
      </div>
      <Suspense fallback={null}>
        <Wheel3D className="hero__3d" />
      </Suspense>

      <div className="container hero__content">
        <p className="eyebrow reveal">
          <span className="dot" /> Garage indépendant · Saint-Étienne (42)
        </p>
        <AnimatedTitle />
        <p className="hero__lead reveal">
          Mécanique, carrosserie, pare-brise, dépannage et carte grise — plus un parc de véhicules d'occasion sélectionnés.
          Un seul interlocuteur pour tout ce qui roule.
        </p>
        <div className="hero__actions reveal">
          <a href="#devis" className="btn btn--accent btn--lg">
            Demander un devis
          </a>
          <a href="#occasions" className="btn btn--ghost btn--lg">
            Voir nos occasions
          </a>
        </div>
        <ul className="hero__facts reveal">
          <li>
            <svg className="gauge" viewBox="0 0 44 26" aria-hidden="true">
              <path className="track" d="M4 24a18 18 0 0 1 36 0" fill="none" strokeWidth="4" strokeLinecap="round" />
              <path className="fill" d="M4 24a18 18 0 0 1 36 0" fill="none" strokeWidth="4" strokeLinecap="round" />
              <line x1="22" y1="24" x2="22" y2="10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <Counter to={5} ready={ready} />
            <span>métiers sous un même toit</span>
          </li>
          <li>
            <strong>Vente</strong>
            <span>achat &amp; reprise</span>
          </li>
          <li>
            <strong>Devis</strong>
            <span>gratuit et rapide</span>
          </li>
        </ul>
      </div>
      <span className="scroll-hint" aria-hidden="true" />
    </section>
  );
}
