import { useRef } from "react";
import { clampPos } from "../../lib/board";
import ItemBody from "./ItemBody";

const LABELS = { note: "Post-it", text: "Texto", image: "Imagen", sticker: "Gatito" };
const ARROWS = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };

// Objeto de la pizarra: se arrastra con el puntero o se mueve con las flechas del teclado
export default function BoardItem({ item, kind, scale, url, selected, interactive, actions }) {
  const drag = useRef(null);
  const { select, move, commit, change, remove } = actions;

  const down = (e) => {
    if (!interactive) return;
    select(item.id);
    if (e.target.closest("textarea")) return; // dentro del texto se escribe, no se arrastra
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, x: item.x, y: item.y };
  };

  const moveTo = (e) => {
    const d = drag.current;
    if (!d) return;
    move(item.id, clampPos(d.x + (e.clientX - d.sx) / scale, d.y + (e.clientY - d.sy) / scale));
  };

  const up = () => {
    if (!drag.current) return;
    drag.current = null;
    commit(item.id, ["x", "y"]);
  };

  const keys = (e) => {
    if (e.target.closest("textarea")) return;
    if (ARROWS[e.key]) {
      e.preventDefault();
      const [dx, dy] = ARROWS[e.key];
      change(item.id, clampPos(item.x + dx, item.y + dy));
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      remove(item.id);
    }
  };

  return (
    <div
      role="group"
      aria-label={`${LABELS[item.type]}. Usa las flechas para moverlo`}
      tabIndex={interactive ? 0 : -1}
      onPointerDown={down}
      onPointerMove={moveTo}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={keys}
      className={`absolute select-none ${interactive ? "cursor-grab touch-none active:cursor-grabbing" : ""} ${selected && interactive ? "outline-dashed outline-2 outline-offset-4 outline-accent" : ""}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.w,
        zIndex: item.z,
        transform: `rotate(${item.rotation}deg)`,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <ItemBody item={item} kind={kind} url={url} editable={interactive} onChange={(patch) => change(item.id, patch)} />
    </div>
  );
}
