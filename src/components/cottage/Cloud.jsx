// Nubecita con carita. Decorativa.
export default function Cloud({ size = 90, color = "#FFFFFF", face = true, className = "" }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={className} aria-hidden="true" focusable="false">
      <path
        d="M26 52a16 16 0 0 1-2-31.8A20 20 0 0 1 62 14a18 18 0 0 1 20 17 14 14 0 0 1-4 21z"
        fill={color}
        stroke="#2B2630"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {face && (
        <g stroke="#2B2630" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M38 34q2-3 4 0M56 34q2-3 4 0" />
          <path d="M45 40q4 3 8 0" />
        </g>
      )}
    </svg>
  );
}
