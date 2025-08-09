
import React, { useState } from 'react';
import { InstructionsPage } from '@/pages/InstructionsPage';
import { EvaluationFlow } from '@/components/evaluation/EvaluationFlow';
import { Header } from '@/components/Header';

type AppFlow = 'instructions' | 'evaluation';

const Index = () => {
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('instructions');

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
