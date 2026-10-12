import { useState } from "react";
import { EVENT_TYPES, PRIORITIES, STATUSES } from "../../lib/countdown";
import { DEFAULT_COLOR } from "../../lib/palette";
import ColorPicker from "./ColorPicker";

const ctl = "mt-1 block w-full rounded-xl border border-line bg-surface px-3 py-2 text-base font-normal hover:border-muted focus:border-accent";

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-sm font-normal text-urgent">
          {error}
        </span>
      )}
    </label>
  );
}

export default function EventForm({ event, defaultDate, subjects, onSubmit, onCancel }) {
  const [v, setV] = useState({
    title: event?.title ?? "",
    type: event?.type ?? "certamen",
    event_date: event?.event_date ?? defaultDate ?? "",
    color: event?.color ?? DEFAULT_COLOR,
    description: event?.description ?? "",
    priority: event?.priority ?? "medium",
    subject: event?.subject ?? "",
    status: event?.status ?? "pending",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const set = (key) => (e) => setV((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!v.title.trim()) next.title = "Escribe un nombre para el evento.";
    else if (v.title.trim().length > 120) next.title = "El nombre admite hasta 120 caracteres.";
    if (!v.event_date) next.event_date = "Elige la fecha del evento.";
    if (v.subject.trim().length > 60) next.subject = "La asignatura admite hasta 60 caracteres.";
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    const err = await onSubmit({
      ...v,
      title: v.title.trim(),
      description: v.description.trim() || null,
      subject: v.subject.trim() || null,
    });
    setBusy(false);
    if (err) setSaveError("No se pudo guardar el evento. Revisa tu conexión e inténtalo de nuevo.");
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Nombre del evento" error={errors.title}>
        <input autoFocus value={v.title} onChange={set("title")} maxLength={130} placeholder="Ej. Certamen de Computación Científica" className={ctl} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo">
          <select value={v.type} onChange={set("type")} className={ctl}>
            {EVENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="Fecha del evento" error={errors.event_date}>
          <input type="date" value={v.event_date} onChange={set("event_date")} className={ctl} />
        </Field>
        <Field label="Prioridad">
          <select value={v.priority} onChange={set("priority")} className={ctl}>
            {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Asignatura (opcional)" error={errors.subject}>
          <input value={v.subject} onChange={set("subject")} list="subjects" placeholder="Ej. Computación" className={ctl} />
          <datalist id="subjects">{subjects.map((s) => <option key={s} value={s} />)}</datalist>
        </Field>
      </div>
      {event && (
        <Field label="Estado">
          <select value={v.status} onChange={set("status")} className={ctl}>
            {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
      )}
      <div>
        <p className="mb-2 text-sm font-semibold">Color</p>
        <ColorPicker value={v.color} onChange={(color) => setV((p) => ({ ...p, color }))} />
      </div>
      <Field label="Descripción (opcional)">
        <textarea value={v.description} onChange={set("description")} rows={2} className={ctl} />
      </Field>
      {saveError && <p role="alert" className="text-sm text-urgent">{saveError}</p>}
      <div className="flex gap-2">
        <button disabled={busy} className="rounded-full bg-accent px-5 py-2 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
          {busy ? "Guardando…" : event ? "Guardar cambios" : "Crear evento"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full px-5 py-2 font-semibold text-muted hover:bg-paper hover:text-ink">
          Cancelar
        </button>
      </div>
    </form>
  );
}
