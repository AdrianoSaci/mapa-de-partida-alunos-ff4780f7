
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsPageProps {
  evaluationData: EvaluationData;
  onRestart: () => void;
  onBackToInstructions: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ 
  evaluationData, 
  onRestart, 
  onBackToInstructions 
}) => {
  const chartData = [
    { name: '0-11m', desired: 13, minimum: 8, achieved: evaluationData.scores['0 a 11 meses'] || 0 },
    { name: '12m', desired: 14, minimum: 9, achieved: evaluationData.scores['12 meses'] || 0 },
    { name: '18m', desired: 10, minimum: 6, achieved: evaluationData.scores['18 meses'] || 0 },
    { name: '24m', desired: 15, minimum: 9, achieved: evaluationData.scores['24 meses'] || 0 },
    { name: '3a', desired: 15, minimum: 9, achieved: evaluationData.scores['3 anos'] || 0 },
    { name: '4a', desired: 11, minimum: 7, achieved: evaluationData.scores['4 anos'] || 0 },
    { name: '5a', desired: 11, minimum: 7, achieved: evaluationData.scores['5 anos'] || 0 }
  ];

  const handleShare = (platform: string) => {
    const message = `Resultado da avaliação de comunicação para ${evaluationData.child.name}: ${evaluationData.communicationAge}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(message)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Resultado da Avaliação&body=${encodeURIComponent(message)}`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Resultado da Avaliação</h1>
          <p className="text-lg text-gray-600">Idade de comunicação calculada</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center text-green-600">
                Idade de Comunicação: {evaluationData.communicationAge}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-4">
                  Criança: <strong>{evaluationData.child.name}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Avaliação realizada em: {evaluationData.dataHoraPreenchimento}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-600">Gráfico de Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="desired" fill="#10b981" name="Desejado" />
                    <Bar dataKey="minimum" fill="#f59e0b" name="Mínimo" />
                    <Bar dataKey="achieved" fill="#3b82f6" name="Alcançado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Refazer Avaliação
            </Button>
            
            <Button 
              onClick={() => handleShare('whatsapp')}
              className="bg-green-600 hover:bg-green-700"
            >
              Compartilhar WhatsApp
            </Button>
            
            <Button 
              onClick={() => handleShare('telegram')}
              className="bg-sky-600 hover:bg-sky-700"
            >
              Compartilhar Telegram
            </Button>
            
            <Button 
              onClick={() => handleShare('email')}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Compartilhar Email
            </Button>
          </div>

          <div className="text-center">
            <Button 
              variant="outline"
              onClick={onBackToInstructions}
              className="mt-4"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
