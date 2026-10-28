// Margarita en SVG propio. Decorativa.
export default function Daisy({ size = 48, petal = "#FFFFFF", center = "#F2E0A0", className = "" }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <g stroke="#2B2630" strokeWidth="1.6" fill={petal}>
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="30" cy="14" rx="6" ry="11" transform={`rotate(${i * 45} 30 30)`} />
        ))}
      </g>
      <circle cx="30" cy="30" r="7" fill={center} stroke="#2B2630" strokeWidth="1.6" />
    </svg>
  );
}
