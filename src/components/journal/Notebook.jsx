import { formatLong } from "../../lib/dates";
import Cat from "../cats/Cat";
import Daisy from "../cottage/Daisy";
import Tulip from "../cottage/Tulip";
import MoodPicker from "./MoodPicker";
import Polaroid from "./Polaroid";
import PostItNote from "./PostItNote";

// Renglones del papel: cada línea mide 32 px, igual que el interlineado del texto manuscrito
const LINED = {
  lineHeight: "32px",
  backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #E8DFD6 31px, #E8DFD6 32px)",
  backgroundAttachment: "local",
};

export default function Notebook({ date, draft, photo, onChange, onFile, onRemove }) {
  const hand = "w-full bg-transparent font-hand text-hand text-ink placeholder:text-muted focus:outline-none";

  return (
    <section aria-label="Diario" className="relative rounded-3xl bg-pink p-2 shadow-soft sm:p-3">
      {/* Anillas entre las dos páginas (solo escritorio) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-8 left-1/2 z-20 hidden w-9 -translate-x-1/2 flex-col justify-between md:flex">
        {Array.from({ length: 13 }, (_, i) => (
          <span key={i} className="block h-3 w-9 rounded-full border-2 border-ink/70 bg-line" />
        ))}
      </div>

      <div className="grid overflow-hidden rounded-2xl bg-white md:grid-cols-2">
        <div className="border-b-2 border-dashed border-line p-5 pb-6 md:border-b-0 md:border-r md:border-solid md:p-8 md:pr-10">
          <p className="font-hand text-2xl font-bold text-accent-dark">{formatLong(date)}</p>
          <label className="block">
            <span className="sr-only">Título de la página</span>
            <input
              value={draft.title}
              onChange={(e) => onChange({ title: e.target.value })}
              maxLength={120}
              placeholder="Un título para hoy"
              className={`${hand} mb-1 mt-1 border-b border-line font-bold`}
            />
          </label>
          <label className="block">
            <span className="sr-only">Lo que quieres escribir hoy</span>
            <textarea
              value={draft.body}
              onChange={(e) => onChange({ body: e.target.value })}
              maxLength={20000}
              placeholder="Querido diario…"
              style={{ ...LINED, minHeight: 448 }}
              className={`${hand} block resize-y`}
            />
          </label>
        </div>

        <div className="relative space-y-6 bg-[linear-gradient(#FBF7F2,#FFFFFF)] p-5 pb-6 md:p-8 md:pl-10">
          <MoodPicker value={draft.mood} onChange={(mood) => onChange({ mood })} />
          <Polaroid url={photo} hasPhoto={!!draft.photo_path} onFile={onFile} onRemove={onRemove} />
          <PostItNote value={draft.note} onChange={(note) => onChange({ note })} />
          <div aria-hidden="true" className="pointer-events-none flex items-end justify-between">
            <Cat variant={draft.mood ?? "sleepy"} color="#F4B6CC" size={64} />
            <span className="flex items-end gap-1">
              <Tulip size={34} color="#CFC2F0" />
              <Daisy size={44} />
              <Tulip size={30} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
