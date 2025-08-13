import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DateOfBirthField from "@/components/DateOfBirthField";
import { validateBirthDate } from "@/utils/dateValidation";
import { toast } from "@/hooks/use-toast";

export default function DebugDateOfBirth() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [validationResult, setValidationResult] = useState<{isValid: boolean, error: string | null} | null>(null);

  const handleDateChange = (isoDate: string | null) => {
    const dateValue = isoDate || "";
    setBirthDate(dateValue);
    console.log("DateOfBirthField onChange:", isoDate);
    
    // Test schema validation in real time
    if (dateValue) {
      const validation = validateBirthDate(dateValue);
      setValidationResult(validation);
      console.log("Schema validation:", validation);
    } else {
      setValidationResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with birthDate:", birthDate);
    
    if (!birthDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a data de nascimento.",
        variant: "destructive"
      });
      return;
    }

    const validation = validateBirthDate(birthDate);
    setValidationResult(validation);
    
    if (validation.isValid) {
      toast({
        title: "Sucesso",
        description: `Data válida: ${birthDate}`,
        variant: "default"
      });
    } else {
      toast({
        title: "Erro de validação",
        description: validation.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Debug DateOfBirthField</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Teste com Formulário</CardTitle>
          </CardHeader>
          <CardContent>
            <form noValidate onSubmit={handleSubmit} className="space-y-6">
              <DateOfBirthField
                label="Data de nascimento (debug)"
                value={birthDate}
                onChange={handleDateChange}
                required
                minYear={2000}
                maxYear={new Date().getFullYear()}
              />
              
              <Button type="submit" className="w-full">
                Testar Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores em Tempo Real</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Valor ISO:</h3>
              <div className="p-3 bg-muted rounded-lg border font-mono">
                {birthDate ? `"${birthDate}"` : "null"}
              </div>
            </div>

            {validationResult && (
              <div>
                <h3 className="font-semibold mb-2">Validação do Schema:</h3>
                <div className={`p-3 rounded-lg border ${
                  validationResult.isValid 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  <div className="font-mono text-sm">
                    isValid: {validationResult.isValid.toString()}
                  </div>
                  {validationResult.error && (
                    <div className="font-mono text-sm mt-1">
                      error: "{validationResult.error}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist de Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-gray-300 rounded"></span>
                <span>Digitar "13" no dia e "05" no mês funciona sem mensagens nativas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-gray-300 rounded"></span>
                <span>Submit não mostra "É preciso que o formato corresponda ao exigido"</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-gray-300 rounded"></span>
                <span>Valor ISO "2024-05-13" passa no schema</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border border-gray-300 rounded"></span>
                <span>Mobile: teclado numérico, sem picker forçado, sem erro nativo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste Específico: 13/05/2024</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => setBirthDate("2024-05-13")}
              className="w-full"
            >
              Preencher com 13/05/2024
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Clique para preencher automaticamente e testar a validação
            </p>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          <p><strong>Console:</strong> Abra o DevTools para ver os logs em tempo real</p>
          <p><strong>Mobile:</strong> Teste em dispositivo móvel para verificar o teclado numérico</p>
        </div>
      </div>
    </div>
  );
}