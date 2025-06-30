
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/pages/AuthPage';
import { InstructionsPage } from '@/pages/InstructionsPage';
import { EvaluationFlow } from '@/components/evaluation/EvaluationFlow';
import { Header } from '@/components/Header';

type AppFlow = 'instructions' | 'evaluation';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('instructions');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      {currentFlow === 'instructions' ? (
        <InstructionsPage onContinue={() => setCurrentFlow('evaluation')} />
      ) : (
        <EvaluationFlow onBackToInstructions={() => setCurrentFlow('instructions')} />
      )}
    </div>
  );
};

export default Index;
