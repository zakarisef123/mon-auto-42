import { MARQUEE } from '../data.jsx';

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((label, k) => (
          <span key={k}>{label}</span>
        ))}
      </div>
    </div>
  );
}
