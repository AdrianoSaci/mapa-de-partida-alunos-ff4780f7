
import React, { useState } from 'react';
import { CaregiverDataForm } from './CaregiverDataForm';
import { SkillsEvaluationForm } from './SkillsEvaluationForm';
import { ReviewForm } from './ReviewForm';
import { ResultsPage } from './ResultsPage';
import { EvaluationData, Caregiver, Child } from '@/types';

type EvaluationStep = 'caregiver-data' | 'skills-evaluation' | 'review' | 'results';

interface EvaluationFlowProps {
  onBackToInstructions: () => void;
}

export const EvaluationFlow: React.FC<EvaluationFlowProps> = ({ onBackToInstructions }) => {
  const [currentStep, setCurrentStep] = useState<EvaluationStep>('caregiver-data');
  const [evaluationData, setEvaluationData] = useState<Partial<EvaluationData>>({
    selectedSkills: {},
    scores: {}
  });

  const handleCaregiverData = (caregiver: Caregiver, child: Child) => {
    setEvaluationData(prev => ({
      ...prev,
      caregiver,
      child
    }));
    setCurrentStep('skills-evaluation');
  };

  const handleSkillsData = (selectedSkills: Record<string, string[]>, scores: Record<string, number>) => {
    setEvaluationData(prev => ({
      ...prev,
      selectedSkills,
      scores
    }));
    setCurrentStep('review');
  };

  const handleSubmitEvaluation = (communicationAge: string) => {
    const dataHoraPreenchimento = new Date().toLocaleString("pt-BR");
    setEvaluationData(prev => ({
      ...prev,
      communicationAge,
      dataHoraPreenchimento
    }));
    setCurrentStep('results');
  };

  const handleRestartEvaluation = () => {
    setEvaluationData({
      selectedSkills: {},
      scores: {}
    });
    setCurrentStep('caregiver-data');
  };

  switch (currentStep) {
    case 'caregiver-data':
      return (
        <CaregiverDataForm 
          onNext={handleCaregiverData}
          onBack={onBackToInstructions}
          initialData={{
            caregiver: evaluationData.caregiver,
            child: evaluationData.child
          }}
        />
      );
    
    case 'skills-evaluation':
      return (
        <SkillsEvaluationForm 
          onNext={handleSkillsData}
          onBack={() => setCurrentStep('caregiver-data')}
          initialData={evaluationData.selectedSkills || {}}
        />
      );
    
    case 'review':
      return (
        <ReviewForm 
          evaluationData={evaluationData as EvaluationData}
          onSubmit={handleSubmitEvaluation}
          onBack={() => setCurrentStep('skills-evaluation')}
        />
      );
    
    case 'results':
      return (
        <ResultsPage 
          evaluationData={evaluationData as EvaluationData}
          onRestart={handleRestartEvaluation}
          onBackToInstructions={onBackToInstructions}
        />
      );
    
    default:
      return null;
  }
};
