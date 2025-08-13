import React, { useState } from 'react';
import DateOfBirthField from '@/components/DateOfBirthField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function DebugDateOfBirth() {
  const [dateValue, setDateValue] = useState<string>('');
  const [minYear, setMinYear] = useState<number>(2000);
  const [maxYear, setMaxYear] = useState<number>(new Date().getFullYear());
  const [savedId, setSavedId] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // Checklist items with test functions
  const [checklistItems, setChecklistItems] = useState([
    {
      id: 'manual-input',
      title: 'Inserção manual no Android e iOS (sem abrir calendário)',
      description: 'Toque nos campos DD/MM/AAAA e digite diretamente com teclado numérico',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'auto-format',
      title: 'Auto-formatação em blur (ex.: digitar 3 em dia → vira 03)',
      description: 'Digite "3" no campo dia e clique fora para ver se vira "03"',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'invalid-correction',
      title: 'Correção: 32/13/2035 deve virar valor válido',
      description: 'Digite valores inválidos e veja se são corrigidos automaticamente',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'invalid-dates',
      title: 'Datas inválidas (31/02/2023) corrigidas',
      description: 'Digite 31/02/2023 e veja se corrige para 28/02/2023',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'future-block',
      title: 'Bloquear data futura',
      description: 'Tente digitar uma data futura (ano > atual)',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'backend-save',
      title: 'Salvar no backend (Supabase) mantendo "yyyy-mm-dd"',
      description: 'Teste salvamento e recuperação dos dados',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'accessibility',
      title: 'Acessibilidade: labels, aria-label, foco sequencial DD→MM→AAAA',
      description: 'Use Tab para navegar entre campos e teste leitores de tela',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    },
    {
      id: 'mobile-font',
      title: 'Fonte ≥ 16px no mobile (evitar zoom iOS)',
      description: 'Teste no iOS Safari - não deve fazer zoom automático',
      tested: false,
      status: 'pending' as 'pending' | 'success' | 'failed'
    }
  ]);

  const updateChecklistItem = (id: string, tested: boolean, status: 'pending' | 'success' | 'failed') => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, tested, status } : item
    ));
  };

  const testAutoFormat = () => {
    setDateValue('');
    toast({
      title: "Teste Auto-formatação",
      description: "Digite '3' no campo dia e pressione Tab. Deve virar '03'.",
    });
  };

  const testInvalidCorrection = () => {
    setDateValue('');
    toast({
      title: "Teste Correção Inválida",
      description: "Digite '32/13/2035' e veja a correção automática.",
    });
  };

  const testInvalidDate = () => {
    setDateValue('');
    toast({
      title: "Teste Data Inválida",
      description: "Digite '31/02/2023' e veja se corrige para '28/02/2023'.",
    });
  };

  const saveToSupabase = async () => {
    if (!dateValue) {
      toast({
        title: "Erro",
        description: "Preencha uma data primeiro.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('evaluations')
        .insert({
          caregiver_name: 'Teste Debug',
          caregiver_email: 'teste@debug.com',
          caregiver_whatsapp: '123456789',
          child_name: 'Criança Teste',
          child_date_of_birth: dateValue,
          communication_age: '0-6 meses',
          data_hora_preenchimento: new Date().toISOString(),
          selected_skills: {},
          scores: {}
        })
        .select()
        .single();

      if (error) throw error;

      setSavedId(data.id);
      updateChecklistItem('backend-save', true, 'success');
      toast({
        title: "Sucesso",
        description: `Dados salvos com ID: ${data.id}`,
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      updateChecklistItem('backend-save', true, 'failed');
      toast({
        title: "Erro ao salvar",
        description: "Verifique se o Supabase está conectado.",
        variant: "destructive"
      });
    }
  };

  const loadFromSupabase = async () => {
    if (!savedId) {
      toast({
        title: "Erro",
        description: "Salve dados primeiro para poder carregar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', savedId)
        .single();

      if (error) throw error;

      setDateValue(data.child_date_of_birth);
      toast({
        title: "Sucesso",
        description: `Dados carregados. Data: ${data.child_date_of_birth}`,
      });
    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast({
        title: "Erro ao carregar",
        description: "Erro ao recuperar dados do Supabase.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✅ Passou</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">❌ Falhou</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">⏳ Pendente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Checklist Interativo: DateOfBirthField</h1>
          <p className="text-lg text-gray-600">Teste todos os requisitos do componente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Component Test */}
          <div className="space-y-6">
            {/* Configuration Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Configurações de Teste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minYear">Ano Mínimo</Label>
                    <Select value={String(minYear)} onValueChange={(value) => setMinYear(Number(value))}>
                      <SelectTrigger id="minYear">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.slice().reverse().map((year) => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxYear">Ano Máximo</Label>
                    <Select value={String(maxYear)} onValueChange={(value) => setMaxYear(Number(value))}>
                      <SelectTrigger id="maxYear">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
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
                <CardTitle className="text-lg text-green-600">Componente de Teste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DateOfBirthField
                  label="Data de nascimento da criança"
                  required
                  minYear={minYear}
                  maxYear={maxYear}
                  value={dateValue}
                  onChange={(iso) => setDateValue(iso || '')}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={testAutoFormat} variant="outline" size="sm">
                    Testar Auto-formatação
                  </Button>
                  <Button onClick={testInvalidCorrection} variant="outline" size="sm">
                    Testar Correção
                  </Button>
                  <Button onClick={testInvalidDate} variant="outline" size="sm">
                    Testar Data Inválida
                  </Button>
                  <Button onClick={() => setDateValue('')} variant="outline" size="sm">
                    Limpar Campo
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={saveToSupabase} className="bg-blue-600 hover:bg-blue-700">
                    Salvar no Supabase
                  </Button>
                  <Button onClick={loadFromSupabase} variant="outline">
                    Carregar do Supabase
                  </Button>
                </div>

                {/* Debug Output */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold mb-2">Debug Output:</h3>
                  <div className="space-y-1 font-mono text-sm">
                    <div><strong>Valor ISO:</strong> <span className="text-blue-600">{dateValue || '(vazio)'}</span></div>
                    <div><strong>Range:</strong> <span className="text-green-600">{minYear} - {maxYear}</span></div>
                    <div><strong>Válido:</strong> <span className="text-purple-600">{dateValue ? 'Sim' : 'Não'}</span></div>
                    {dateValue && (
                      <div><strong>Formatada:</strong> <span className="text-orange-600">{new Date(dateValue).toLocaleDateString('pt-BR')}</span></div>
                    )}
                    {savedId && (
                      <div><strong>ID Salvo:</strong> <span className="text-red-600">{savedId}</span></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Interactive Checklist */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">Checklist Interativo</CardTitle>
                <p className="text-sm text-gray-600">Marque cada item após testar</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={item.tested}
                            onCheckedChange={(checked) => 
                              updateChecklistItem(item.id, checked as boolean, checked ? 'success' : 'pending')
                            }
                          />
                          <span className="font-medium text-sm">{item.title}</span>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-gray-600 ml-6">{item.description}</p>
                      
                      {item.id === 'backend-save' && (
                        <div className="mt-2 ml-6">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateChecklistItem(item.id, true, 'success')}
                              className="text-xs"
                            >
                              ✅ Passou
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateChecklistItem(item.id, true, 'failed')}
                              className="text-xs"
                            >
                              ❌ Falhou
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {item.id !== 'backend-save' && item.tested && (
                        <div className="mt-2 ml-6">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateChecklistItem(item.id, true, 'success')}
                              className="text-xs"
                            >
                              ✅ Passou
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateChecklistItem(item.id, true, 'failed')}
                              className="text-xs"
                            >
                              ❌ Falhou
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Resumo dos Testes:</h3>
                  <div className="text-sm space-y-1">
                    <div>✅ Passou: {checklistItems.filter(i => i.status === 'success').length}</div>
                    <div>❌ Falhou: {checklistItems.filter(i => i.status === 'failed').length}</div>
                    <div>⏳ Pendente: {checklistItems.filter(i => i.status === 'pending').length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}