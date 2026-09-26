import { useEffect, useRef } from 'react';

// Titre qui apparaît mot par mot quand il arrive à l'écran
export default function RevealTitle({ as: Tag = 'h2', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      el?.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = String(children).split(' ');
  return (
    <Tag ref={ref} className="split-title" aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="word">
            <span style={{ transitionDelay: `${0.06 * i}s` }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
