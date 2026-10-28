import { GripHorizontal } from "lucide-react";
import Cat from "../cats/Cat";
import Pin from "./Pin";

// Contenido de cada tipo de objeto. Los textos solo se editan cuando la herramienta activa es "Mover".
// Franja para agarrar y arrastrar objetos con texto (el texto en sí se edita al hacer clic)
function Handle({ className = "" }) {
  return (
    <div aria-hidden="true" className={`flex h-6 items-center justify-center text-ink/45 ${className}`}>
      <GripHorizontal size={18} />
    </div>
  );
}

export default function ItemBody({ item, kind, url, editable, onChange }) {
  const field = "block w-full resize-none select-text bg-transparent font-hand text-hand focus:outline-none";

  if (item.type === "note") {
    return (
      <div className="relative aspect-square shadow-soft" style={{ backgroundColor: item.color }}>
        <Pin kind={kind} id={item.id} />
        <Handle className="absolute inset-x-0 top-0 bg-ink/5" />
        <textarea
          value={item.content ?? ""}
          onChange={(e) => onChange({ content: e.target.value })}
          readOnly={!editable}
          maxLength={300}
          aria-label="Texto del post-it"
          placeholder="Escribe aquí…"
          className={`${field} absolute inset-x-0 bottom-0 top-6 h-[calc(100%-1.5rem)] px-3 pb-3 pt-1 text-ink placeholder:text-ink/60`}
        />
      </div>
    );
  }

  if (item.type === "text") {
    return (
      <div>
        <Handle />
        <textarea
        value={item.content ?? ""}
        onChange={(e) => onChange({ content: e.target.value })}
        readOnly={!editable}
        rows={3}
        maxLength={600}
        aria-label="Texto suelto"
        placeholder="Escribe algo…"
        className={`${field} p-1 placeholder:text-muted`}
        style={{ color: item.color }}
      />
      </div>
    );
  }

  if (item.type === "image") {
    return (
      <div className="relative bg-white p-2 pb-6 shadow-soft">
        <Pin kind={kind} id={item.id} />
        {url ? (
          <img src={url} alt="Imagen pegada en la pizarra" draggable={false} className="block w-full select-none" />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-paper text-sm text-muted">Cargando…</div>
        )}
      </div>
    );
  }

  return <Cat variant={item.content} color={item.color} size={item.w} />;
}
