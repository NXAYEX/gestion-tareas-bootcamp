// Gatito ilustrado en SVG propio. Decorativo: no lleva información, por eso aria-hidden.
const FACES = {
  // Ojos y boca según el ánimo
  happy: { eyes: "arc", mouth: "smile" },
  sleepy: { eyes: "line", mouth: "small" },
  cheer: { eyes: "star", mouth: "open" },
  curious: { eyes: "dot", mouth: "small" },
};

function Eyes({ type }) {
  if (type === "arc") {
    return <path d="M24 38q4-6 8 0M48 38q4-6 8 0" stroke="#2B2630" strokeWidth="2.4" strokeLinecap="round" fill="none" />;
  }
  if (type === "line") {
    return <path d="M24 39h8M48 39h8" stroke="#2B2630" strokeWidth="2.4" strokeLinecap="round" />;
  }
  if (type === "star") {
    return (
      <g fill="#2B2630">
        <circle cx="28" cy="38" r="3.6" />
        <circle cx="52" cy="38" r="3.6" />
        <circle cx="29.2" cy="36.8" r="1.2" fill="#fff" />
        <circle cx="53.2" cy="36.8" r="1.2" fill="#fff" />
      </g>
    );
  }
  return (
    <g fill="#2B2630">
      <circle cx="28" cy="38" r="3" />
      <circle cx="52" cy="38" r="3" />
    </g>
  );
}

export default function Cat({ variant = "happy", color = "#F6CBA6", size = 56, className = "" }) {
  const face = FACES[variant] ?? FACES.happy;
  return (
    <svg viewBox="0 0 80 72" width={size} height={size * 0.9} className={className} aria-hidden="true" focusable="false">
      <path d="M14 30 10 6l22 12zM66 30l4-24-22 12z" fill={color} stroke="#2B2630" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M17 24 15 13l9 5zM63 24l2-11-9 5z" fill="#F4B6CC" />
      <ellipse cx="40" cy="42" rx="30" ry="25" fill={color} stroke="#2B2630" strokeWidth="2.4" />
      <Eyes type={face.eyes} />
      <ellipse cx="40" cy="47" rx="3" ry="2.2" fill="#F4B6CC" stroke="#2B2630" strokeWidth="1.6" />
      {face.mouth === "open" ? (
        <path d="M34 52q6 8 12 0z" fill="#B5433A" stroke="#2B2630" strokeWidth="1.8" strokeLinejoin="round" />
      ) : (
        <path d={face.mouth === "smile" ? "M33 51q3.5 4 7 0q3.5 4 7 0" : "M36 52q4 3 8 0"} stroke="#2B2630" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      <circle cx="20" cy="48" r="4" fill="#F4B6CC" opacity="0.7" />
      <circle cx="60" cy="48" r="4" fill="#F4B6CC" opacity="0.7" />
      <path d="M12 44 2 42M12 50 3 54M68 44l10-2M68 50l9 4" stroke="#2B2630" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
