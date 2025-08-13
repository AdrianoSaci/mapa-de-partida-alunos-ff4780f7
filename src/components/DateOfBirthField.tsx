import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const init = parseISO(value);
  const [dd, setDD] = useState(init.dd);
  const [mm, setMM] = useState(init.mm);
  const [yyyy, setYYYY] = useState(init.yyyy);
  const [isTyping, setIsTyping] = useState(false);
  const [futureError, setFutureError] = useState(false);

  const ddValRef = useRef(dd);
  const mmValRef = useRef(mm);
  useEffect(() => { ddValRef.current = dd; }, [dd]);
  useEffect(() => { mmValRef.current = mm; }, [mm]);

  const yyyyValRef = useRef(yyyy);
  useEffect(() => { yyyyValRef.current = yyyy; }, [yyyy]);

  const ddRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dayLen = dd?.length ?? 0;
    const monthLen = mm?.length ?? 0;
    const yearLen = yyyy?.length ?? 0;

    // Enquanto incompleto, não valida nem emite
    if (!(dayLen === 2 && monthLen === 2 && yearLen === 4)) {
      setFutureError(false);
      onChange?.(null);
      return;
    }

    // Parse seguro
    let _dd = parseInt(dd, 10);
    let _mm = parseInt(mm, 10);
    let _yy = parseInt(yyyy, 10);

    // Limites de ano
    if (minYear) _yy = Math.max(_yy, minYear);
    _yy = Math.min(_yy, maxYear);

    // Normalização de mês/dia
    _mm = clamp(_mm, 1, 12);
    const maxDay = daysInMonth(_mm, _yy);
    _dd = clamp(_dd, 1, maxDay);

    // Datas locais (zera horário para evitar fuso)
    const selected = new Date(_yy, _mm - 1, _dd); selected.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);

    // Bloqueio de data futura
    if (selected.getTime() > today.getTime()) {
      setFutureError(true);
      onChange?.(null); // impede submit; schema tratará como inválido/obrigatório
      return;
    } else {
      setFutureError(false);
    }

    // Atualiza UI só se precisou corrigir dd/mm/aaaa
    const ddP = String(_dd).padStart(2, "0");
    const mmP = String(_mm).padStart(2, "0");
    const yyP = String(_yy);
    if (ddP !== dd) setDD(ddP);
    if (mmP !== mm) setMM(mmP);
    if (yyP !== yyyy) setYYYY(yyP);

    // Emite ISO válido
    const iso = toISO(_dd, _mm, _yy);
    onChange?.(iso);
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
          placeholder="DD"
          className="w-14 rounded-xl border px-3 py-2 text-base border-input bg-background"
          autoComplete="bday-day"
          value={dd}
          onFocus={(e) => {
            requestAnimationFrame(() => {
              try { e.currentTarget.setSelectionRange(0, e.currentTarget.value.length); } catch {}
            });
          }}
          onBeforeInput={(e: React.FormEvent<HTMLInputElement> & { nativeEvent: InputEvent }) => {
            const el = e.currentTarget;
            const data = (e.nativeEvent && (e.nativeEvent as any).data) || "";
            const isDigit = /^\d$/.test(data);
            const hasSelection = el.selectionStart !== el.selectionEnd;
            if (isDigit && ddValRef.current.length >= 2 && !hasSelection) {
              e.preventDefault();
              setDD(data);
              requestAnimationFrame(() => {
                try { el.setSelectionRange(1, 1); } catch {}
              });
            }
          }}
          onInput={(e) => {
            // Fallback universal (mobile/desktop)
            const el = e.currentTarget as HTMLInputElement;
            const ne: any = (e as any).nativeEvent;
            const data: string = (ne && ne.data) || "";
            const isDigit = /^\d$/.test(data);
            const noSelection = el.selectionStart === el.selectionEnd;
            const caretAtEnd = el.selectionStart === (el.value?.length ?? 0);
            if (isDigit && ddValRef.current.length >= 2 && noSelection && caretAtEnd) {
              setDD(data);
              requestAnimationFrame(() => {
                try { el.setSelectionRange(1, 1); } catch {}
              });
              return;
            }
          }}
          onKeyDown={(e) => {
            // Desktop fallback
            if (/^\d$/.test(e.key)) {
              const el = e.currentTarget as HTMLInputElement;
              const hasSelection = el.selectionStart !== el.selectionEnd;
              if (ddValRef.current.length >= 2 && !hasSelection) {
                e.preventDefault();
                setDD(e.key);
                requestAnimationFrame(() => {
                  try { el.setSelectionRange(1, 1); } catch {}
                });
                return;
              }
            }
            if (e.key === "/" || e.key === ".") { e.preventDefault(); mmRef.current?.focus(); }
          }}
          onChange={(e) => {
            // Sanitização final baseada no DOM + ref (evita closures antigas)
            const el = e.currentTarget;
            let raw = e.target.value.replace(/\D+/g, "");

            if (raw.length > 2) {
              const noSelection = el.selectionStart === el.selectionEnd;
              const caretAtEnd = el.selectionStart === (el.value?.length ?? 0);
              raw = (ddValRef.current.length >= 2 && noSelection && caretAtEnd)
                ? raw.slice(-1)   // reinicia com o último dígito
                : raw.slice(-2);  // caso geral: mantém só os 2 últimos
            }
            if (raw.length > 2) raw = raw.slice(-2);
            setDD(raw);
          }}
          onBlur={() => {
            if (!dd) return;
            const n = Math.max(1, Math.min(parseInt(dd, 10) || 0, 31));
            const pad = String(n).padStart(2, "0");
            if (pad !== dd) setDD(pad);
          }}
          disabled={disabled}
          aria-label="Dia"
        />
        <span className="select-none">/</span>
        <input
          ref={mmRef}
          type="text"
          inputMode="numeric"
          placeholder="MM"
          className="w-14 rounded-xl border px-3 py-2 text-base border-input bg-background"
          autoComplete="bday-month"
          value={mm}
          onFocus={(e) => {
            requestAnimationFrame(() => {
              try { e.currentTarget.setSelectionRange(0, e.currentTarget.value.length); } catch {}
            });
          }}
          onBeforeInput={(e: React.FormEvent<HTMLInputElement> & { nativeEvent: InputEvent }) => {
            const el = e.currentTarget;
            const data = (e.nativeEvent && (e.nativeEvent as any).data) || "";
            const isDigit = /^\d$/.test(data);
            const hasSelection = el.selectionStart !== el.selectionEnd;
            if (isDigit && mmValRef.current.length >= 2 && !hasSelection) {
              e.preventDefault();
              setMM(data);
              requestAnimationFrame(() => {
                try { el.setSelectionRange(1, 1); } catch {}
              });
            }
          }}
          onInput={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const ne: any = (e as any).nativeEvent;
            const data: string = (ne && ne.data) || "";
            const isDigit = /^\d$/.test(data);
            const noSelection = el.selectionStart === el.selectionEnd;
            const caretAtEnd = el.selectionStart === (el.value?.length ?? 0);
            if (isDigit && mmValRef.current.length >= 2 && noSelection && caretAtEnd) {
              setMM(data);
              requestAnimationFrame(() => {
                try { el.setSelectionRange(1, 1); } catch {}
              });
              return;
            }
          }}
          onKeyDown={(e) => {
            if (/^\d$/.test(e.key)) {
              const el = e.currentTarget as HTMLInputElement;
              const hasSelection = el.selectionStart !== el.selectionEnd;
              if (mmValRef.current.length >= 2 && !hasSelection) {
                e.preventDefault();
                setMM(e.key);
                requestAnimationFrame(() => {
                  try { el.setSelectionRange(1, 1); } catch {}
                });
                return;
              }
            }
            if (e.key === "/" || e.key === ".") { e.preventDefault(); yyyyRef.current?.focus(); }
            if (e.key === "Backspace" && mm === "") { e.preventDefault(); ddRef.current?.focus(); }
          }}
          onChange={(e) => {
            let raw = e.target.value.replace(/\D+/g, "");
            const el = e.currentTarget;
            if (raw.length > 2) {
              const noSelection = el.selectionStart === el.selectionEnd;
              const caretAtEnd = el.selectionStart === (el.value?.length ?? 0);
              raw = (mmValRef.current.length >= 2 && noSelection && caretAtEnd)
                ? raw.slice(-1)
                : raw.slice(-2);
            }
            if (raw.length > 2) raw = raw.slice(-2);
            setMM(raw);
          }}
          onBlur={() => {
            if (!mm) return;
            const n = Math.max(1, Math.min(parseInt(mm, 10) || 0, 12));
            const pad = String(n).padStart(2, "0");
            if (pad !== mm) setMM(pad);
          }}
          disabled={disabled}
          aria-label="Mês"
        />
        <span className="select-none">/</span>
        <input
          ref={yyyyRef}
          type="text"
          inputMode="numeric"
          placeholder="AAAA"
          className="w-20 rounded-xl border px-3 py-2 text-base border-input bg-background"
          autoComplete="bday-year"
          value={yyyy}
          onFocus={(e) => {
            requestAnimationFrame(() => {
              try { e.currentTarget.setSelectionRange(0, e.currentTarget.value.length); } catch {}
            });
          }}
          onBeforeInput={(e: React.FormEvent<HTMLInputElement> & { nativeEvent: InputEvent }) => {
            const el = e.currentTarget;
            const data = (e.nativeEvent && (e.nativeEvent as any).data) || "";
            const isDigit = /^\d$/.test(data);
            const hasSelection = el.selectionStart !== el.selectionEnd;
            if (isDigit && yyyyValRef.current.length >= 4 && !hasSelection) {
              e.preventDefault();
              setYYYY(data);
              requestAnimationFrame(() => {
                try { el.setSelectionRange(1, 1); } catch {}
              });
            }
          }}
          onInput={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const ne: any = (e as any).nativeEvent;
            const data: string = (ne && ne.data) || "";
            const isDigit = /^\d$/.test(data);
            const noSelection = el.selectionStart === el.selectionEnd;
            const caretAtEnd = el.selectionStart === (el.value?.length ?? 0);
            if (isDigit && yyyyValRef.current.length >= 4 && noSelection && caretAtEnd) {
              setYYYY(data);
              requestAnimationFrame(() => {
                try { el.setSelectionRange(1, 1); } catch {}
              });
              return;
            }
          }}
          onKeyDown={(e) => {
            // Desktop fallback: sobrescrever quando já tem 4 dígitos e não há seleção
            if (/^\d$/.test(e.key)) {
              const el = e.currentTarget as HTMLInputElement;
              const hasSelection = el.selectionStart !== el.selectionEnd;
              if (yyyyValRef.current.length >= 4 && !hasSelection) {
                e.preventDefault();
                setYYYY(e.key);
                requestAnimationFrame(() => {
                  try { el.setSelectionRange(1, 1); } catch {}
                });
                return;
              }
            }
            // Navegação como já existia:
            if (e.key === "Backspace" && yyyy === "") { e.preventDefault(); mmRef.current?.focus(); }
          }}
          onChange={(e) => {
            let raw = e.target.value.replace(/\D+/g, "");
            const el = e.currentTarget;
            if (raw.length > 4) {
              const noSelection = el.selectionStart === el.selectionEnd;
              const caretAtEnd = el.selectionStart === (el.value?.length ?? 0);
              raw = (yyyyValRef.current.length >= 4 && noSelection && caretAtEnd)
                ? raw.slice(-1)   // reinicia a partir do dígito mais recente
                : raw.slice(-4);  // caso geral: mantém os 4 últimos
            }
            if (raw.length > 4) raw = raw.slice(-4);
            setYYYY(raw);
          }}
          onBlur={() => {
            if (!yyyy) return;
            let y = parseInt(yyyy, 10) || maxYear;
            if (minYear) y = Math.max(y, minYear);
            y = Math.min(y, maxYear);
            const fixed = String(y);
            if (fixed !== yyyy) setYYYY(fixed);
          }}
          disabled={disabled}
          aria-label="Ano"
        />
      </div>
      {(error || futureError) ? (
        <p className="mt-1 text-sm text-red-600">
          {error ?? "Data no futuro não é permitida"}
        </p>
      ) : (
        <p className="mt-1 text-xs text-gray-500">Formato: dd/mm/aaaa</p>
      )}
    </div>
  );
}