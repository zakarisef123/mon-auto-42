import { useEffect, useRef } from 'react';

// Route : la voiture avance avec le défilement de la page
export default function Road() {
  const roadRef = useRef(null);
  const carRef = useRef(null);

  useEffect(() => {
    const road = roadRef.current;
    const car = carRef.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;

    const update = () => {
      const r = road.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand la route entre par le bas, 1 quand elle sort par le haut
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      const dist = p * (road.offsetWidth + car.offsetWidth * 2) - car.offsetWidth * 1.2;
      road.style.setProperty('--car-x', `${dist}px`);
      road.style.setProperty('--wheel', `${dist * 2.2}deg`);
      road.style.setProperty('--road-x', `${-dist * 0.3}px`);
      ticking = false;
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
    <div className="road" ref={roadRef} aria-hidden="true">
      <div className="road__car" ref={carRef}>
        <svg viewBox="0 0 150 50">
          <defs>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0" stopColor="#fff6c8" stopOpacity=".9" />
              <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="beam" d="M140 30 L200 18 L200 44 Z" fill="url(#beam)" transform="translate(-8 0)" />
          <path
            d="M6 36 C6 28 12 26 22 25 L44 23 C54 14 66 10 82 10 C98 10 108 16 118 23 L134 26 C142 27 146 30 146 36 L146 38 L6 38 Z"
            fill="#e3262f"
          />
          <path d="M50 23 C58 16 68 13 80 13 L82 23 Z M86 13 C96 13 104 17 111 23 L86 23 Z" fill="#0b1d3a" opacity=".85" />
          <rect x="139" y="28" width="7" height="4" rx="2" fill="#fff6c8" />
          <rect x="6" y="29" width="5" height="4" rx="1.5" fill="#ff8a8a" />
          {[36, 118].map((cx) => (
            <g className="wheel" key={cx}>
              <circle cx={cx} cy="38" r="10" fill="#111" />
              <circle cx={cx} cy="38" r="5" fill="#9aa3b2" />
              <path d={`M${cx} 30v16M${cx - 8} 38h16`} stroke="#111" strokeWidth="2" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
