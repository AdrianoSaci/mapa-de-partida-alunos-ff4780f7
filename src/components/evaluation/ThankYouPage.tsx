import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ThankYouPageProps {
  onRestart: () => void;
  onBackToInstructions: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  onRestart,
  onBackToInstructions
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-24 h-24 text-green-600" />
          </div>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-600 mb-4">
                AVALIAÇÃO FINALIZADA!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-700 mb-8">
                Em caso de dúvidas entre em contato com nossa Equipe de Suporte
              </p>
              
              <div className="space-y-4 max-w-md mx-auto">
                <Button 
                  onClick={onRestart} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                >
                  Nova Avaliação
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={onBackToInstructions} 
                  className="w-full text-lg py-3"
                >
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};