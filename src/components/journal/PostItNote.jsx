// Post-it con una nota corta, pegado con cinta
export default function PostItNote({ value, onChange }) {
  return (
    <div className="relative mx-auto w-44 -rotate-3">
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 bg-white/70" />
      <label className="block bg-butter p-3 pt-4 shadow-soft">
        <span className="sr-only">Nota corta</span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={140}
          rows={4}
          placeholder="Una nota para ti…"
          className="block w-full resize-none bg-transparent font-hand text-hand text-ink placeholder:text-ink/60 focus:outline-none"
        />
      </label>
    </div>
  );
}
