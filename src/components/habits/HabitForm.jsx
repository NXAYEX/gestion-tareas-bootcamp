import { useState } from "react";
import { HABIT_ICONS } from "../../lib/habitExamples";
import { COLORS } from "../../lib/palette";
import Cat from "../cats/Cat";
import ColorPicker from "../countdown/ColorPicker";

const ctl = "mt-1 block w-full rounded-xl border border-line bg-surface px-3 py-2 text-base font-normal hover:border-muted focus:border-accent";

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
      {error && <span role="alert" className="mt-1 block text-sm font-normal text-urgent">{error}</span>}
    </label>
  );
}

export default function HabitForm({ habit, onSubmit, onCancel }) {
  const [v, setV] = useState({
    name: habit?.name ?? "",
    description: habit?.description ?? "",
    icon: habit?.icon ?? "happy",
    color: habit?.color ?? COLORS[1].hex,
    daily_goal_label: habit?.daily_goal_label ?? "",
    monthly_goal: habit?.monthly_goal ?? "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const set = (key) => (e) => setV((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    const goal = v.monthly_goal === "" ? null : Number(v.monthly_goal);
    if (!v.name.trim()) found.name = "Escribe un nombre para el hábito.";
    if (goal !== null && (!Number.isInteger(goal) || goal < 1 || goal > 31)) found.monthly_goal = "La meta mensual va de 1 a 31 días.";
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    const err = await onSubmit({
      name: v.name.trim(),
      description: v.description.trim() || null,
      icon: v.icon,
      color: v.color,
      daily_goal_label: v.daily_goal_label.trim() || null,
      monthly_goal: goal,
    });
    setBusy(false);
    if (err) setSaveError("No se pudo guardar el hábito. Inténtalo de nuevo.");
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Nombre del hábito" error={errors.name}>
        <input autoFocus value={v.name} onChange={set("name")} maxLength={60} placeholder="Ej. Beber agua" className={ctl} />
      </Field>
      <div>
        <p className="mb-2 text-sm font-semibold">Gatito</p>
        <div role="radiogroup" aria-label="Gatito del hábito" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {HABIT_ICONS.map((i) => (
            <button
              type="button"
              key={i.id}
              role="radio"
              aria-checked={v.icon === i.id}
              aria-label={i.name}
              title={i.name}
              onClick={() => setV((p) => ({ ...p, icon: i.id }))}
              className={`flex items-center justify-center rounded-xl p-1 ${v.icon === i.id ? "bg-paper ring-2 ring-ink" : "ring-1 ring-line hover:ring-muted"}`}
            >
              <Cat variant={i.id} color={v.color} size={40} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Color</p>
        <ColorPicker value={v.color} onChange={(color) => setV((p) => ({ ...p, color }))} label="Color del hábito" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meta diaria (opcional)">
          <input value={v.daily_goal_label} onChange={set("daily_goal_label")} maxLength={40} placeholder="Ej. 8 vasos" className={ctl} />
        </Field>
        <Field label="Meta mensual en días (opcional)" error={errors.monthly_goal}>
          <input type="number" min={1} max={31} value={v.monthly_goal} onChange={set("monthly_goal")} placeholder="Ej. 20" className={ctl} />
        </Field>
      </div>
      <Field label="Descripción (opcional)">
        <textarea value={v.description} onChange={set("description")} maxLength={200} rows={2} className={ctl} />
      </Field>
      {saveError && <p role="alert" className="text-sm text-urgent">{saveError}</p>}
      <div className="flex gap-2">
        <button disabled={busy} className="rounded-full bg-accent px-5 py-2 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
          {busy ? "Guardando…" : habit ? "Guardar cambios" : "Crear hábito"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full px-5 py-2 font-semibold text-muted hover:bg-paper hover:text-ink">
          Cancelar
        </button>
      </div>
    </form>
  );
}
