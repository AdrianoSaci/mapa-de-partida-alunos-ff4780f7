import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationData } from '@/types';
import { skillsData } from '@/data/skills';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
interface ReviewFormProps {
  evaluationData: EvaluationData;
  onSubmit: (communicationAge: string) => void;
  onBack: () => void;
}
export const ReviewForm: React.FC<ReviewFormProps> = ({
  evaluationData,
  onSubmit,
  onBack
}) => {
  const {
    user
  } = useAuth();
  const calculateCommunicationAge = () => {
    const ageRanges = [{
      range: '0 a 11 meses',
      min: 8,
      desired: 13
    }, {
      range: '12 meses',
      min: 9,
      desired: 14
    }, {
      range: '18 meses',
      min: 6,
      desired: 10
    }, {
      range: '24 meses',
      min: 9,
      desired: 15
    }, {
      range: '3 anos',
      min: 9,
      desired: 15
    }, {
      range: '4 anos',
      min: 7,
      desired: 11
    }, {
      range: '5 anos',
      min: 7,
      desired: 11
    }];
    let communicationAge = 'Idade de comunicação abaixo de 12 meses';
    for (let i = ageRanges.length - 1; i >= 0; i--) {
      const ageRange = ageRanges[i];
      const score = evaluationData.scores[ageRange.range] || 0;
      if (score >= ageRange.min) {
        communicationAge = ageRange.range;
        break;
      }
    }
    return communicationAge;
  };
  const handleSubmit = async () => {
    const communicationAge = calculateCommunicationAge();
    if (user) {
      try {
        // Save evaluation to Supabase
        const {
          error
        } = await supabase.from('evaluations').insert({
          user_id: user.id,
          caregiver_name: evaluationData.caregiver.name,
          caregiver_email: evaluationData.caregiver.email,
          caregiver_whatsapp: evaluationData.caregiver.whatsapp,
          child_name: evaluationData.child.name,
          child_date_of_birth: evaluationData.child.dateOfBirth,
          selected_skills: evaluationData.selectedSkills,
          scores: evaluationData.scores,
          communication_age: communicationAge,
          data_hora_preenchimento: new Date().toLocaleString("pt-BR")
        });
        if (error) {
          console.error('Error saving evaluation:', error);
          toast({
            title: "Erro",
            description: "Não foi possível salvar a avaliação. Tente novamente.",
            variant: "destructive"
          });
          return;
        }
        toast({
          title: "Sucesso",
          description: "Avaliação salva com sucesso!"
        });
      } catch (error) {
        console.error('Error saving evaluation:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a avaliação. Tente novamente.",
          variant: "destructive"
        });
        return;
      }
    }
    onSubmit(communicationAge);
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Revisão das Respostas</h1>
          <p className="text-lg text-gray-600">Confira as informações antes de finalizar!</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-600">Dados do Responsável</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <p><strong>Nome:</strong> {evaluationData.caregiver.name}</p>
                <p><strong>Email:</strong> {evaluationData.caregiver.email}</p>
                <p><strong>WhatsApp:</strong> {evaluationData.caregiver.whatsapp}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-600">Dados da Criança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <p><strong>Nome:</strong> {evaluationData.child.name}</p>
                <p><strong>Data de Nascimento:</strong> {new Date(evaluationData.child.dateOfBirth).toLocaleDateString('pt-BR')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-600">Habilidades Selecionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map(group => {
                const selectedSkills = evaluationData.selectedSkills[group.ageRange] || [];
                if (selectedSkills.length === 0) return null;
                return <div key={group.ageRange}>
                      <h4 className="font-semibold text-gray-800 mb-2">{group.ageRange} ({selectedSkills.length} habilidades)</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {selectedSkills.map(skill => <li key={skill}>{skill}</li>)}
                      </ul>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mt-8">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          <Button type="button" onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
            Finalizar Avaliação
          </Button>
        </div>
      </div>
    </div>;
};