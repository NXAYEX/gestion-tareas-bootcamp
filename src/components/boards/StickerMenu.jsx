import { useEffect, useRef, useState } from "react";
import { Cat as CatIcon } from "lucide-react";
import { STICKERS } from "../../lib/board";
import Cat from "../cats/Cat";

const PINKS = "#F4B6CC";

export default function StickerMenu({ onPick, btnClass }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => (e.type === "keydown" ? e.key === "Escape" && setOpen(false) : !root.current.contains(e.target) && setOpen(false));
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className={btnClass}>
        <CatIcon size={16} aria-hidden="true" /> Gatito
      </button>
      {open && (
        <div role="menu" aria-label="Elegir gatito" className="absolute left-0 top-full z-40 mt-1 grid w-56 grid-cols-4 gap-1 rounded-2xl bg-surface p-2 shadow-soft ring-1 ring-line">
          {STICKERS.map((variant) => (
            <button
              key={variant}
              role="menuitem"
              aria-label={`Pegar gatito ${variant}`}
              onClick={() => {
                onPick(variant, PINKS);
                setOpen(false);
              }}
              className="rounded-xl p-1 hover:bg-paper"
            >
              <Cat variant={variant} color={PINKS} size={44} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
