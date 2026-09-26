import { useEffect, useRef, useState } from 'react';
import RevealTitle from './RevealTitle.jsx';
import { PROCESS } from '../data.jsx';

// Tracé de la route (repère 100 x 1000, étiré sur la hauteur de la section)
const ROAD = 'M50 0 C 85 90, 85 160, 50 250 S 15 410, 50 500 S 85 660, 50 750 S 15 910, 50 1000';

// « Comment ça se passe » : une route se dessine au scroll et une voiture la parcourt
export default function Process() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const carRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    const car = carRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = path.getTotalLength();
    let ticking = false;

    const update = () => {
      ticking = false;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand le haut de la route passe au milieu de l'écran, 1 quand le bas y arrive
      const p = reduced ? 1 : Math.max(0, Math.min(1, (vh * 0.55 - r.top) / r.height));
      setProgress(p);
      wrap.style.setProperty('--road-p', p);

      // Position et orientation de la voiture sur le tracé
      const len = Math.max(0.5, p * total);
      const pt = path.getPointAtLength(len);
      const ahead = path.getPointAtLength(Math.min(total, len + 4));
      const behind = path.getPointAtLength(Math.max(0, len - 4));
      const svg = path.ownerSVGElement.getBoundingClientRect();
      const sx = svg.width / 100;
      const sy = svg.height / 1000;
      const ox = svg.left - r.left;
      const angle = Math.atan2((ahead.y - behind.y) * sy, (ahead.x - behind.x) * sx) * (180 / Math.PI);
      car.style.transform = `translate(${ox + pt.x * sx}px, ${pt.y * sy}px) translate(-50%, -50%) rotate(${angle + 90}deg)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section className="section section--dark process" id="process">
      <div className="container">
        <header className="section__head reveal">
          <p className="kicker">Comment ça se passe</p>
          <RevealTitle>De l'appel à la remise des clés, en 5 étapes.</RevealTitle>
          <p>Simple, transparent, sans mauvaise surprise.</p>
        </header>

        <div className="process__track" ref={wrapRef}>
          <svg className="process__road" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d={ROAD} className="road-base" vectorEffect="non-scaling-stroke" />
            <path d={ROAD} className="road-dash" vectorEffect="non-scaling-stroke" />
            <path d={ROAD} className="road-progress" pathLength="1" vectorEffect="non-scaling-stroke" ref={pathRef} />
          </svg>

          <div className="process__car" ref={carRef} aria-hidden="true">
            <svg viewBox="0 0 24 40">
              <rect x="2" y="2" width="20" height="36" rx="7" fill="#e3262f" />
              <path d="M5 11 Q12 7 19 11 L18 16 H6 Z" fill="#0b1d3a" />
              <path d="M6 27 H18 L19 32 Q12 35 5 32 Z" fill="#0b1d3a" />
              <rect x="4" y="2.5" width="4" height="2.5" rx="1" fill="#fff6c8" />
              <rect x="16" y="2.5" width="4" height="2.5" rx="1" fill="#fff6c8" />
            </svg>
          </div>

          <ol className="process__steps">
            {PROCESS.map((step, i) => {
              const reached = progress >= (i + 0.5) / PROCESS.length - 0.02;
              return (
                <li key={step.title} className={'process__step' + (reached ? ' is-reached' : '')}>
                  <span className="process__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
