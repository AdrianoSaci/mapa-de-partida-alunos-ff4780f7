import React, { useState } from 'react';
import DateOfBirthField from '@/components/DateOfBirthField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function DebugDateOfBirth() {
  const [dateValue, setDateValue] = useState<string>('');
  const [minYear, setMinYear] = useState<number>(2000);
  const [maxYear, setMaxYear] = useState<number>(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Debug: DateOfBirthField</h1>
          <p className="text-lg text-gray-600">Teste o componente com diferentes configurações</p>
        </div>

        <div className="space-y-6">
          {/* Configuration Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600">Configurações de Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minYear">Ano Mínimo</Label>
                  <Select value={String(minYear)} onValueChange={(value) => setMinYear(Number(value))}>
                    <SelectTrigger id="minYear">
                      <SelectValue placeholder="Selecione o ano mínimo" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.slice().reverse().map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxYear">Ano Máximo</Label>
                  <Select value={String(maxYear)} onValueChange={(value) => setMaxYear(Number(value))}>
                    <SelectTrigger id="maxYear">
                      <SelectValue placeholder="Selecione o ano máximo" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DateOfBirthField Test */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600">Componente DateOfBirthField</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DateOfBirthField
                  label="Data de nascimento da criança"
                  required
                  minYear={minYear}
                  maxYear={maxYear}
                  value={dateValue}
                  onChange={(iso) => setDateValue(iso || '')}
                />

                {/* Debug Output */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Debug Output:</h3>
                  <div className="space-y-2 font-mono text-sm">
                    <div>
                      <span className="font-semibold">Valor ISO:</span> 
                      <span className="ml-2 text-blue-600">{dateValue || '(vazio)'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Ano mínimo:</span> 
                      <span className="ml-2 text-green-600">{minYear}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Ano máximo:</span> 
                      <span className="ml-2 text-green-600">{maxYear}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Válido:</span> 
                      <span className="ml-2 text-purple-600">
                        {dateValue ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    {dateValue && (
                      <div>
                        <span className="font-semibold">Data formatada:</span> 
                        <span className="ml-2 text-orange-600">
                          {new Date(dateValue).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Cases */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Casos de Teste:</h3>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Digite "31/02/2023" - deve corrigir para "28/02/2023"</li>
                    <li>• Digite dia &gt; 31 - deve corrigir automaticamente</li>
                    <li>• Digite mês &gt; 12 - deve corrigir automaticamente</li>
                    <li>• Digite ano fora do range - deve corrigir automaticamente</li>
                    <li>• Use Tab para navegar entre os campos</li>
                    <li>• Teste no mobile - deve ter font-size ≥ 16px (sem zoom)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}