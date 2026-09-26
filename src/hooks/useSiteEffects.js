import { useEffect } from 'react';

// Effets globaux au niveau de la page : apparitions au scroll, barre de progression,
// parallaxe du hero, cartes 3D et boutons magnétiques.
export default function useSiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups = [];
    const on = (el, type, fn, opts) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    // Apparitions en cascade
    const targets = document.querySelectorAll('.reveal, .img-reveal');
    const counts = new Map();
    targets.forEach((el) => {
      const n = counts.get(el.parentNode) || 0;
      el.style.setProperty('--d', `${Math.min(n, 6) * 0.08}s`);
      counts.set(el.parentNode, n + 1);
    });
    if ('IntersectionObserver' in window && !reduced) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      targets.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    } else {
      targets.forEach((el) => el.classList.add('is-visible'));
    }

    // Barre de progression + parallaxe du hero
    const progress = document.querySelector('.progress');
    const heroBg = document.querySelector('.hero__bg');
    let ticking = false;
    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      if (heroBg && !reduced && window.scrollY < window.innerHeight) heroBg.style.translate = `0 ${window.scrollY * 0.3}px`;
      ticking = false;
    };
    on(window, 'scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    on(window, 'resize', update);
    update();

    if (finePointer && !reduced) {
      // Cartes : tilt 3D + halo qui suit la souris
      document.querySelectorAll('.card').forEach((card) => {
        on(card, 'mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          card.classList.add('is-tilting');
          card.style.transform = `rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-4px)`;
          card.style.setProperty('--mx', `${x * 100}%`);
          card.style.setProperty('--my', `${y * 100}%`);
        });
        on(card, 'mouseleave', () => {
          card.classList.remove('is-tilting');
          card.style.transform = '';
        });
      });

      // Boutons magnétiques
      document.querySelectorAll('.hero__actions .btn, .split__actions .btn, .header__cta').forEach((btn) => {
        btn.classList.add('magnetic');
        on(btn, 'mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          btn.style.transform = `translate(${x * 0.25}px,${y * 0.35}px)`;
        });
        on(btn, 'mouseleave', () => {
          btn.style.transform = '';
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
