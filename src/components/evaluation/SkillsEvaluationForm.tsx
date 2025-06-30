
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { skillsData } from '@/data/skills';
import { toast } from '@/hooks/use-toast';

interface SkillsEvaluationFormProps {
  onNext: (selectedSkills: Record<string, string[]>, scores: Record<string, number>) => void;
  onBack: () => void;
  initialData: Record<string, string[]>;
}

export const SkillsEvaluationForm: React.FC<SkillsEvaluationFormProps> = ({ 
  onNext, 
  onBack, 
  initialData 
}) => {
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string[]>>(initialData);

  const handleSkillToggle = (ageRange: string, skill: string) => {
    setSelectedSkills(prev => {
      const currentSkills = prev[ageRange] || [];
      const isSelected = currentSkills.includes(skill);
      
      if (isSelected) {
        return {
          ...prev,
          [ageRange]: currentSkills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          [ageRange]: [...currentSkills, skill]
        };
      }
    });
  };

  const handleSubmit = () => {
    const scores: Record<string, number> = {};
    
    skillsData.forEach(group => {
      const skillsForAge = selectedSkills[group.ageRange] || [];
      scores[group.ageRange] = skillsForAge.length;
    });

    onNext(selectedSkills, scores);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Avaliação de Habilidades</h1>
          <p className="text-lg text-gray-600">Marque apenas as habilidades que a criança faz consistentemente</p>
        </div>

        <div className="space-y-6">
          {skillsData.map((group) => (
            <Card key={group.ageRange}>
              <CardHeader>
                <CardTitle className="text-xl text-green-600">
                  {group.ageRange}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {group.skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${group.ageRange}-${skill}`}
                        checked={(selectedSkills[group.ageRange] || []).includes(skill)}
                        onCheckedChange={() => handleSkillToggle(group.ageRange, skill)}
                      />
                      <label
                        htmlFor={`${group.ageRange}-${skill}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Revisar Respostas
          </Button>
        </div>
      </div>
    </div>
  );
};
