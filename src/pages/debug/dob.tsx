import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EventLog = {
  timestamp: string;
  field: string;
  eventType: string;
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
  nativeData?: string;
};

export default function DebugDateOfBirth() {
  const [dd, setDD] = useState("");
  const [mm, setMM] = useState("");
  const [yyyy, setYYYY] = useState("");
  const [logs, setLogs] = useState<EventLog[]>([]);

  const ddRef = useRef<HTMLInputElement>(null);
  const mmRef = useRef<HTMLInputElement>(null);
  const yyyyRef = useRef<HTMLInputElement>(null);

  const addLog = (
    field: string,
    eventType: string,
    target: HTMLInputElement,
    nativeEvent?: any
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    const log: EventLog = {
      timestamp,
      field,
      eventType,
      value: target.value,
      selectionStart: target.selectionStart,
      selectionEnd: target.selectionEnd,
      nativeData: nativeEvent?.data || undefined,
    };
    setLogs((prev) => [log, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const clearLogs = () => setLogs([]);

  const createEventHandlers = (field: string, setValue: (v: string) => void, ref: React.RefObject<HTMLInputElement>) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      addLog(field, "onFocus", e.currentTarget);
    },
    onBeforeInput: (e: React.FormEvent<HTMLInputElement>) => {
      addLog(field, "onBeforeInput", e.currentTarget, e.nativeEvent);
    },
    onInput: (e: React.FormEvent<HTMLInputElement>) => {
      addLog(field, "onInput", e.currentTarget, e.nativeEvent);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      addLog(field, "onKeyDown", e.currentTarget, { data: e.key });
      // Navegação com /
      if (e.key === "/" || e.key === ".") {
        e.preventDefault();
        if (field === "DD") mmRef.current?.focus();
        if (field === "MM") yyyyRef.current?.focus();
      }
      // Navegação com Backspace
      if (e.key === "Backspace" && e.currentTarget.value === "") {
        e.preventDefault();
        if (field === "MM") ddRef.current?.focus();
        if (field === "YYYY") mmRef.current?.focus();
      }
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D+/g, "").slice(0, field === "YYYY" ? 4 : 2);
      setValue(value);
      addLog(field, "onChange", e.currentTarget);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      addLog(field, "onBlur", e.currentTarget);
    },
  });

  const ddHandlers = createEventHandlers("DD", setDD, ddRef);
  const mmHandlers = createEventHandlers("MM", setMM, mmRef);
  const yyyyHandlers = createEventHandlers("YYYY", setYYYY, yyyyRef);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Debug DateOfBirth - Event Logs</h1>
          <p className="text-muted-foreground mt-2">
            Teste especialmente no mobile: digite em campo cheio (2 dígitos) para ver quais eventos disparam
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Date of Birth Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium">Data de nascimento</label>
                <div className="flex items-center gap-2">
                  <input
                    ref={ddRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="DD"
                    className="w-16 rounded-xl border px-3 py-2 text-base border-input bg-background"
                    maxLength={2}
                    value={dd}
                    {...ddHandlers}
                  />
                  <span>/</span>
                  <input
                    ref={mmRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    className="w-16 rounded-xl border px-3 py-2 text-base border-input bg-background"
                    maxLength={2}
                    value={mm}
                    {...mmHandlers}
                  />
                  <span>/</span>
                  <input
                    ref={yyyyRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="AAAA"
                    className="w-20 rounded-xl border px-3 py-2 text-base border-input bg-background"
                    maxLength={4}
                    value={yyyy}
                    {...yyyyHandlers}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Current Values:</strong>
                </div>
                <div className="font-mono text-sm bg-muted p-2 rounded">
                  DD: "{dd}" | MM: "{mm}" | YYYY: "{yyyy}"
                </div>
              </div>

              <Button onClick={clearLogs} variant="outline" className="w-full">
                Clear Logs
              </Button>
            </CardContent>
          </Card>

          {/* Event Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Event Logs (Real-time)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-muted-foreground text-center p-4">
                    No events logged yet. Interact with the inputs above.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className="text-xs bg-muted p-2 rounded border-l-4 border-primary"
                    >
                      <div className="font-semibold">
                        {log.timestamp} | {log.field} | {log.eventType}
                      </div>
                      <div>value: "{log.value}"</div>
                      <div>
                        selection: {log.selectionStart}-{log.selectionEnd}
                      </div>
                      {log.nativeData && (
                        <div className="text-orange-600">
                          nativeEvent.data: "{log.nativeData}"
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Teste Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold">Cenário Principal (Android/iOS):</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Digite "23" no campo DD (deve ficar cheio)</li>
                  <li>Sem selecionar o texto, digite "1" para tentar mudar para "13"</li>
                  <li><strong>Observe:</strong> Se onKeyDown dispara com "1"</li>
                  <li><strong>Se não:</strong> Veja se onBeforeInput dispara com nativeEvent.data="1"</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold">Cenários Adicionais:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Teste também com campo MM</li>
                  <li>Teste seleção manual + digitação</li>
                  <li>Teste navegação com "/" e Backspace</li>
                  <li>Compare comportamento Desktop vs Mobile</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                <strong>Para mobile:</strong> Teste em dispositivo real ou emulador para 
                verificar se onKeyDown funciona corretamente com teclado numérico virtual.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}