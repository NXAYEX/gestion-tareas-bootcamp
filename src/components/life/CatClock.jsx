// Gatito mirando un reloj entre sus patitas. Decorativo.
export default function CatClock({ size = 130, className = "" }) {
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 130 110" width={size} height={size * 0.85} className={className} aria-hidden="true" focusable="false">
      {/* Reloj */}
      <g stroke="#2B2630" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="72" cy="31" r="7" fill="#F4B6CC" />
        <circle cx="100" cy="31" r="7" fill="#F4B6CC" />
        <circle cx="86" cy="66" r="32" fill="#FFFFFF" />
        <circle cx="86" cy="66" r="25" fill="#FBF7F2" strokeWidth="1.4" />
        {ticks.map((a) => (
          <path key={a} d="M86 43.5v3.5" strokeWidth="1.6" transform={`rotate(${a} 86 66)`} />
        ))}
        <path d="M86 66V50M86 66l11 6" />
      </g>
      <circle cx="86" cy="66" r="2.6" fill="#2B2630" />
      {/* Gatito mirando el reloj */}
      <g stroke="#2B2630" strokeWidth="2.4" strokeLinejoin="round">
        <path d="M12 44 8 18l22 12zM50 38l8-20-20 8z" fill="#F6CBA6" />
        <ellipse cx="32" cy="58" rx="26" ry="23" fill="#F6CBA6" />
      </g>
      <circle cx="26" cy="56" r="3.2" fill="#2B2630" />
      <circle cx="43" cy="56" r="3.2" fill="#2B2630" />
      <circle cx="27.4" cy="54.8" r="1.1" fill="#fff" />
      <circle cx="44.4" cy="54.8" r="1.1" fill="#fff" />
      <ellipse cx="34" cy="63" rx="2.6" ry="2" fill="#F4B6CC" stroke="#2B2630" strokeWidth="1.4" />
      <path d="M31 68q3 3 6 0" stroke="#2B2630" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M9 60 1 58M9 66l-8 3" stroke="#2B2630" strokeWidth="1.6" strokeLinecap="round" />
      {/* Patitas sosteniendo el reloj */}
      <g fill="#F6CBA6" stroke="#2B2630" strokeWidth="2.2">
        <ellipse cx="60" cy="84" rx="8" ry="6" />
        <ellipse cx="72" cy="96" rx="8" ry="6" />
      </g>
    </svg>
  );
}
