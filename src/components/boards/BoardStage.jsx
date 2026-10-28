import { useEffect, useRef, useState } from "react";
import { BOARD_H, BOARD_W, MIN_SCALE, clamp } from "../../lib/board";

const FRAME = 14;

const CORK = {
  backgroundColor: "#C99A6B",
  backgroundImage:
    "radial-gradient(#B07F52 1.2px, transparent 1.6px), radial-gradient(#DDB588 1px, transparent 1.4px), radial-gradient(#9C6C42 1px, transparent 1.4px)",
  backgroundSize: "23px 23px, 17px 17px, 31px 31px",
  backgroundPosition: "0 0, 7px 9px, 13px 3px",
};
const WHITE = { backgroundColor: "#FDFDFE", backgroundImage: "linear-gradient(160deg, #FFFFFF 0%, #F1F4F8 100%)" };

// Escenario de 1200 x 800 que se escala al ancho disponible. En pantallas angostas se desplaza de lado.
export default function BoardStage({ kind, onBackgroundDown, children }) {
  const box = useRef(null);
  const [scale, setScale] = useState(1);
  const white = kind === "white";

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setScale(clamp((entry.contentRect.width - FRAME * 2) / BOARD_W, MIN_SCALE, 1)));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="w-full overflow-x-auto pb-1">
      <div
        className={`rounded-2xl shadow-soft ring-1 ring-ink/15 ${white ? "bg-fog" : "bg-[#D9BC98]"}`}
        style={{ width: BOARD_W * scale + FRAME * 2, padding: FRAME }}
      >
        <div className="relative overflow-hidden rounded-md ring-1 ring-ink/20" style={{ width: BOARD_W * scale, height: BOARD_H * scale }}>
          <div
            onPointerDown={onBackgroundDown}
            className="relative origin-top-left"
            style={{ width: BOARD_W, height: BOARD_H, transform: `scale(${scale})`, ...(white ? WHITE : CORK) }}
          >
            {children(scale)}
          </div>
        </div>
        {white && (
          <div aria-hidden="true" className="mx-auto mt-2 flex h-4 w-1/2 items-center justify-center gap-3 rounded-b-xl bg-line">
            {["#2B2630", "#B5433A", "#3F6FB5"].map((c) => (
              <span key={c} className="h-2 w-10 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
