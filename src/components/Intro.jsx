import { useEffect, useState } from 'react';
import { WheelPaths } from './Icons.jsx';

// Écran de démarrage : affiché une seule fois par visite
export default function Intro({ onDone }) {
  const [state, setState] = useState(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('ma42-intro') === '1';
    } catch {}
    return reduced || seen ? 'hidden' : 'visible';
  });

  useEffect(() => {
    if (state === 'hidden') {
      const id = requestAnimationFrame(() => requestAnimationFrame(onDone));
      return () => cancelAnimationFrame(id);
    }
    if (state !== 'visible') return;
    try {
      sessionStorage.setItem('ma42-intro', '1');
    } catch {}
    document.documentElement.style.overflow = 'hidden';
    const timers = [
      setTimeout(() => {
        setState('leaving');
        document.documentElement.style.overflow = '';
      }, 1300),
      setTimeout(onDone, 1550),
      setTimeout(() => setState('hidden'), 2100),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === 'hidden') return null;

  return (
    <div className={'intro' + (state === 'leaving' ? ' is-leaving' : '')} aria-hidden="true">
      <div className="intro__streaks">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="intro__inner">
        <svg className="intro__wheel" viewBox="4 0 48 48">
          <WheelPaths />
        </svg>
        <div className="intro__name">
          <span>Mon Auto 42</span>
        </div>
        <div className="intro__bar" />
      </div>
    </div>
  );
}
