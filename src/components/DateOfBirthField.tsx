import React, { useEffect, useRef, useState } from "react";

type Props = {
  label?: string;
  value?: string;  // "yyyy-mm-dd" vindo do form
  onChange?: (iso: string | null) => void;
  maxYear?: number; // default = ano atual
  minYear?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
function toISO(dd: number, mm: number, yyyy: number) {
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d.toISOString().slice(0, 10); // "yyyy-mm-dd"
}
function parseISO(iso?: string) {
  if (!iso) return { dd: "", mm: "", yyyy: "" };
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return { dd: "", mm: "", yyyy: "" };
  return { dd: m[3], mm: m[2], yyyy: m[1] };
}

export default function DateOfBirthField({
  label = "Data de nascimento",
  value,
  onChange,
  maxYear = new Date().getFullYear(),
  minYear,
  required,
  disabled,
  error,
}: Props) {
  const init = parseISO(value);
  const [dd, setDD] = useState(init.dd);
  const [mm, setMM] = useState(init.mm);
  const [yyyy, setYYYY] = useState(init.yyyy);

  const ddRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const _d = parseInt(dd || "0", 10);
    const _m = parseInt(mm || "0", 10);
    const _y = parseInt(yyyy || "0", 10);

    if (_d && _m && String(yyyy).length === 4) {
      let year = _y;
      if (minYear) year = Math.max(year, minYear);
      year = Math.min(year, maxYear);

      const month = clamp(_m, 1, 12);
      const maxDay = daysInMonth(month, year);
      const day = clamp(_d, 1, maxDay);

      if (String(day).padStart(2, "0") !== dd) setDD(String(day).padStart(2, "0"));
      if (String(month).padStart(2, "0") !== mm) setMM(String(month).padStart(2, "0"));
      if (String(year) !== yyyy) setYYYY(String(year));

      onChange?.(toISO(day, month, year));
    } else {
      onChange?.(null);
    }
  }, [dd, mm, yyyy, minYear, maxYear, onChange]);

  const onlyDigits = (s: string, maxLen: number) => s.replace(/\D+/g, "").slice(0, maxLen);

  return (
    <div className="w-full">
      <label className="block mb-1 text-sm font-medium">
        {label}{required ? " *" : ""}
      </label>
      <div className="flex items-center gap-2">
        <input
          ref={ddRef}
          type="text"
          inputMode="numeric"
          pattern="\\d*"
          placeholder="DD"
           className="w-14 rounded-xl border px-3 py-2 text-base border-input bg-background"
          autoComplete="bday-day"
          value={dd}
          onChange={(e) => {
            const v = onlyDigits(e.target.value, 2);
            setDD(v);
            if (v.length === 2) mmRef.current?.focus();
          }}
          onBlur={() => dd && setDD(String(clamp(parseInt(dd,10)||0,1,31)).padStart(2,"0"))}
          disabled={disabled}
          aria-label="Dia"
        />
        <span className="select-none">/</span>
        <input
          ref={mmRef}
          type="text"
          inputMode="numeric"
          pattern="\\d*"
          placeholder="MM"
          className="w-14 rounded-xl border px-3 py-2 text-base border-input bg-background"
          autoComplete="bday-month"
          value={mm}
          onChange={(e) => {
            const v = onlyDigits(e.target.value, 2);
            setMM(v);
            if (v.length === 2) yyyyRef.current?.focus();
          }}
          onBlur={() => mm && setMM(String(clamp(parseInt(mm,10)||0,1,12)).padStart(2,"0"))}
          disabled={disabled}
          aria-label="Mês"
        />
        <span className="select-none">/</span>
        <input
          ref={yyyyRef}
          type="text"
          inputMode="numeric"
          pattern="\\d*"
          placeholder="AAAA"
          className="w-20 rounded-xl border px-3 py-2 text-base border-input bg-background"
          autoComplete="bday-year"
          value={yyyy}
          onChange={(e) => setYYYY(onlyDigits(e.target.value, 4))}
          onBlur={() => {
            if (!yyyy) return;
            let y = parseInt(yyyy,10) || maxYear;
            if (minYear) y = Math.max(y, minYear);
            y = Math.min(y, maxYear);
            setYYYY(String(y));
          }}
          disabled={disabled}
          aria-label="Ano"
        />
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-gray-500">Formato: dd/mm/aaaa</p>
      )}
    </div>
  );
}