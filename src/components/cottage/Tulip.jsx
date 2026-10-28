// Tulipán con tallo y hojas. Decorativo.
export default function Tulip({ size = 64, color = "#F4B6CC", className = "" }) {
  return (
    <svg viewBox="0 0 50 90" width={size} height={size * 1.8} className={className} aria-hidden="true" focusable="false">
      <path d="M25 40v46" stroke="#2B2630" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M25 78c-10-2-16-10-16-22 10 0 16 8 16 22zM25 70c8-1 13-8 13-18-8 0-13 7-13 18z"
        fill="#B9D9B9"
        stroke="#2B2630"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 12c0 18 6 28 15 28s15-10 15-28l-8 8-7-12-7 12z" fill={color} stroke="#2B2630" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
