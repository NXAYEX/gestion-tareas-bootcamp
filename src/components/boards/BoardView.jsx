import { useState } from "react";
import { useBoardItems } from "../../hooks/useBoardItems";
import { useImageUrls } from "../../hooks/useImageUrls";
import { useStrokes } from "../../hooks/useStrokes";
import { MAX_ITEMS, PEN_COLORS } from "../../lib/board";
import { resizeImage } from "../../lib/image";
import * as api from "../../services/boards";
import Cat from "../cats/Cat";
import SaveStatus from "../habits/SaveStatus";
import BoardItem from "./BoardItem";
import BoardStage from "./BoardStage";
import DrawLayer from "./DrawLayer";
import SelectedBar from "./SelectedBar";
import Toolbar from "./Toolbar";

const merge = (a, b) => ([a, b].includes("error") ? "error" : [a, b].includes("saving") ? "saving" : [a, b].includes("saved") ? "saved" : "idle");

export default function BoardView({ kind }) {
  const white = kind === "white";
  const b = useBoardItems(kind);
  const s = useStrokes(kind, white);
  const urls = useImageUrls(b.items);
  const [tool, setTool] = useState("select");
  const [pen, setPen] = useState({ color: PEN_COLORS[0].hex, width: 6 });
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState(null);

  const selected = b.items.find((i) => i.id === selectedId);
  const loading = b.loading || s.loading;
  const error = b.error || s.error;
  const hasAnything = b.items.length > 0 || s.strokes.length > 0;

  const add = async (type, extra) => {
    setNotice(null);
    const { item, error } = await b.add(type, extra);
    if (error) setNotice(error.message === "limit" ? `La pizarra admite hasta ${MAX_ITEMS} objetos.` : "No se pudo agregar. Inténtalo de nuevo.");
    else {
      setTool("select");
      setSelectedId(item.id);
    }
  };

  const addImage = async (file) => {
    setNotice("Subiendo imagen…");
    try {
      const { data: path, error } = await api.uploadImage(await resizeImage(file, 1000));
      if (error) throw error;
      await add("image", { image_path: path });
      setNotice(null);
    } catch {
      setNotice("No se pudo subir la imagen. Revisa tu conexión e inténtalo de nuevo.");
    }
  };

  const actions = { select: setSelectedId, move: b.move, commit: b.commit, change: b.change, remove: b.remove };

  if (loading) return <div className="h-[520px] animate-pulse rounded-2xl bg-surface shadow-soft" role="status" aria-label="Abriendo la pizarra" />;
  if (error) {
    return (
      <div role="alert" className="rounded-2xl bg-surface p-6 shadow-soft">
        <p className="text-urgent">{error}</p>
        <button onClick={() => { b.reload(); s.reload(); }} className="mt-2 text-sm font-semibold text-accent underline underline-offset-4">Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 min-h-5">
        <SaveStatus status={merge(b.status, s.status)} onRetry={() => (s.status === "error" ? s.retry() : b.reload())} />
        {notice && <p role="status" className="text-sm text-muted">{notice}</p>}
      </div>
      <Toolbar
        white={white} tool={tool} onTool={setTool} pen={pen} onPen={setPen}
        canUndo={s.strokes.length > 0} onUndo={s.undo} onClear={s.clear}
        onAdd={add} onImage={addImage} tooBigNotice={setNotice}
      />
      {selected && tool === "select" && (
        <SelectedBar item={selected} onChange={b.change} onFront={b.front} onDelete={(id) => { b.remove(id); setSelectedId(null); }} />
      )}
      <BoardStage kind={kind} onBackgroundDown={(e) => e.target === e.currentTarget && setSelectedId(null)}>
        {(scale) => (
          <>
            {white && <DrawLayer strokes={s.strokes} tool={tool} color={pen.color} width={pen.width} onStroke={s.add} />}
            {b.items.map((item) => (
              <BoardItem
                key={item.id} item={item} kind={kind} scale={scale} url={urls[item.image_path]}
                selected={item.id === selectedId} interactive={tool === "select"} actions={actions}
              />
            ))}
            {!hasAnything && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-4">
                <Cat variant="curious" color="#F4B6CC" size={90} />
                <p className="max-w-xs rounded-2xl bg-white/85 p-4 text-base text-ink">
                  {white ? "Dibuja con el lápiz o pega un post-it, un texto o una imagen." : "Pincha tu primera nota, foto o gatito aquí."}
                </p>
              </div>
            )}
          </>
        )}
      </BoardStage>
    </div>
  );
}
