import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ageFromBirth } from "../../lib/life";

const ctl = "mt-1 block w-full rounded-xl border border-line bg-surface px-3 py-2 text-base font-normal hover:border-muted focus:border-accent disabled:bg-paper disabled:text-muted";

const toNumber = (text) => (text.trim() === "" ? null : Number(text.replace(",", ".")));

export default function LifeControls({ settings, today, onChange }) {
  const [ageText, setAgeText] = useState(settings.age_years?.toString() ?? "");
  const [expText, setExpText] = useState(String(settings.life_expectancy));
  const fromBirth = settings.birth_date ? ageFromBirth(settings.birth_date, today) : null;

  // Cuando hay fecha de nacimiento, la edad se calcula sola y se muestra deshabilitada
  useEffect(() => {
    if (fromBirth) setAgeText(`${fromBirth.years}`);
  }, [fromBirth?.years]); // eslint-disable-line react-hooks/exhaustive-deps

  const ageNum = toNumber(ageText);
  const ageError = !fromBirth && ageText.trim() !== "" && (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) ? "Escribe una edad entre 0 y 120." : null;
  const expNum = toNumber(expText);
  const expError = expNum === null || !Number.isInteger(expNum) || expNum < 1 || expNum > 120 ? "Elige entre 1 y 120 años." : null;
  const birthError = settings.birth_date && !fromBirth ? "La fecha de nacimiento no puede ser futura." : null;

  return (
    <section aria-label="Tus datos" className="space-y-4 rounded-2xl bg-surface p-5 shadow-soft">
      <label className="block text-sm font-semibold">
        Mi edad (años)
        <input
          inputMode="decimal"
          value={ageText}
          disabled={!!fromBirth}
          onChange={(e) => {
            setAgeText(e.target.value);
            const n = toNumber(e.target.value);
            if (n === null) onChange({ age_years: null });
            else if (!Number.isNaN(n) && n >= 0 && n <= 120) onChange({ age_years: n });
          }}
          placeholder="Ej. 24 o 24,5"
          className={ctl}
        />
        {ageError && <span role="alert" className="mt-1 block text-sm font-normal text-urgent">{ageError}</span>}
        {fromBirth && <span className="mt-1 block text-sm font-normal text-muted">Calculada desde tu fecha de nacimiento.</span>}
      </label>

      <div>
        <label className="block text-sm font-semibold">
          Mi fecha de nacimiento (opcional)
          <input
            type="date"
            value={settings.birth_date ?? ""}
            min="1900-01-01"
            max={today}
            onChange={(e) => onChange({ birth_date: e.target.value || null })}
            className={ctl}
          />
        </label>
        <p className="mt-1 text-sm text-muted">Con ella tus semanas se pintan solas cada semana, sin volver a escribir la edad.</p>
        {birthError && <p role="alert" className="text-sm text-urgent">{birthError}</p>}
        {settings.birth_date && (
          <button
            onClick={() => {
              onChange({ birth_date: null, age_years: fromBirth ? fromBirth.years + fromBirth.weeks / 52 : null });
              setAgeText(fromBirth ? String(Math.round((fromBirth.years + fromBirth.weeks / 52) * 10) / 10) : "");
            }}
            className="mt-1 flex items-center gap-1 text-sm font-semibold text-accent underline underline-offset-4"
          >
            <X size={14} aria-hidden="true" /> Quitar la fecha y escribir mi edad
          </button>
        )}
      </div>

      <label className="block text-sm font-semibold">
        Contar hasta los (años)
        <input
          inputMode="numeric"
          value={expText}
          onChange={(e) => {
            setExpText(e.target.value);
            const n = toNumber(e.target.value);
            if (n !== null && Number.isInteger(n) && n >= 1 && n <= 120) onChange({ life_expectancy: n });
          }}
          className={ctl}
        />
        {expError ? (
          <span role="alert" className="mt-1 block text-sm font-normal text-urgent">{expError}</span>
        ) : (
          <span className="mt-1 block text-sm font-normal text-muted">Por defecto 80, el promedio de vida.</span>
        )}
      </label>
    </section>
  );
}
