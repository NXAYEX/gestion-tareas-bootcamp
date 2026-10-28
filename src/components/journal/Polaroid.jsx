import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

const MAX_MB = 15;
const GINGHAM = {
  backgroundImage: "linear-gradient(90deg, #F4B6CC55 50%, transparent 50%), linear-gradient(#F4B6CC55 50%, transparent 50%)",
  backgroundSize: "16px 16px",
};

// Foto instantánea con cinta washi y cuadriculado rosa, como en el cuaderno de referencia
export default function Polaroid({ url, hasPhoto, onFile, onRemove }) {
  const input = useRef(null);
  const [tooBig, setTooBig] = useState(false);

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const big = file.size > MAX_MB * 1024 * 1024;
    setTooBig(big);
    if (!big) onFile(file);
  };

  return (
    <div className="relative mx-auto w-full max-w-[300px] rotate-1">
      <span aria-hidden="true" className="absolute -top-3 right-2 z-10 h-6 w-16 rotate-12 bg-pink/80" />
      <div className="bg-white p-3 pb-0 shadow-soft ring-1 ring-line">
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-paper">
          {hasPhoto ? (
            url ? (
              <img src={url} alt="Foto de esta página del diario" className="h-full w-full object-cover" />
            ) : (
              <p className="text-sm text-muted">Cargando foto…</p>
            )
          ) : (
            <button onClick={() => input.current.click()} className="flex flex-col items-center gap-2 p-4 text-sm font-semibold text-muted hover:text-ink">
              <ImagePlus size={28} aria-hidden="true" /> Pegar una foto
            </button>
          )}
        </div>
        <div className="mt-3 h-12" style={GINGHAM} />
      </div>
      <input ref={input} type="file" accept="image/*" className="sr-only" onChange={pick} aria-label="Elegir foto" />
      {hasPhoto && (
        <div className="mt-2 flex justify-center gap-1 text-sm">
          <button onClick={() => input.current.click()} className="rounded-full px-3 py-1 font-semibold text-muted hover:bg-surface hover:text-ink">
            Cambiar foto
          </button>
          <button onClick={onRemove} className="flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-muted hover:bg-surface hover:text-urgent">
            <Trash2 size={14} aria-hidden="true" /> Quitar
          </button>
        </div>
      )}
      {tooBig && (
        <p role="alert" className="mt-1 text-center text-sm text-urgent">
          La foto pesa más de {MAX_MB} MB. Elige una más liviana.
        </p>
      )}
    </div>
  );
}
