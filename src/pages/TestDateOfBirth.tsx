import React, { useState } from "react";
import DateOfBirthField from "@/components/DateOfBirthField";

export default function TestDateOfBirth() {
  const [birthDate, setBirthDate] = useState<string | null>(null);

  const handleDateChange = (isoDate: string | null) => {
    setBirthDate(isoDate);
    console.log("DateOfBirthField value changed:", isoDate);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Teste DateOfBirthField</h1>
        
        <div className="space-y-4">
          <DateOfBirthField
            label="Data de nascimento (teste)"
            value={birthDate || ""}
            onChange={handleDateChange}
            required
          />
          
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Valor ISO retornado:</h2>
            <div className="p-4 bg-muted rounded-lg border">
              <code className="text-foreground">
                {birthDate ? `"${birthDate}"` : "null"}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Testes a verificar:</h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Digitar 22 no dia fica 22 (sem pular de campo)</li>
              <li>Digitar 11, 12 no mês fica sem pular de campo</li>
              <li>Pressionar / no dia foca o mês</li>
              <li>Pressionar / no mês foca o ano</li>
              <li>Backspace no mês vazio volta para dia</li>
              <li>Backspace no ano vazio volta para mês</li>
              <li>Em blur: 3 vira 03 (dia), 7 vira 07 (mês)</li>
              <li>Mobile: teclado numérico aparece</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Console Log:</h2>
            <p className="text-xs text-muted-foreground">
              Verifique o console do navegador para ver os valores sendo logados em tempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}