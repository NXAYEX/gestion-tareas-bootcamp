// Ramita con hojas y florecitas. Decorativa.
const LEAVES = [[34, 16], [46, 28], [30, 40], [44, 52], [28, 64]];

export default function Sprig({ size = 80, className = "" }) {
  return (
    <svg viewBox="0 0 70 100" width={size} height={size * 1.4} className={className} aria-hidden="true" focusable="false">
      <path d="M32 96C30 60 36 30 40 6" stroke="#2B2630" strokeWidth="2" strokeLinecap="round" fill="none" />
      {LEAVES.map(([x, y], i) => {
        const cx = x + (i % 2 ? 8 : -8);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={y}
            rx="10"
            ry="5"
            fill="#B9D9B9"
            stroke="#2B2630"
            strokeWidth="1.6"
            transform={`rotate(${i % 2 ? -30 : 30} ${cx} ${y})`}
          />
        );
      })}
      <circle cx="40" cy="6" r="4.5" fill="#F4B6CC" stroke="#2B2630" strokeWidth="1.6" />
      <circle cx="54" cy="24" r="3.5" fill="#F2E0A0" stroke="#2B2630" strokeWidth="1.4" />
    </svg>
  );
}
