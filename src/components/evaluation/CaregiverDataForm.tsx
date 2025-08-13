
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Caregiver, Child } from '@/types';
import { toast } from '@/hooks/use-toast';
import DateOfBirthField from "@/components/DateOfBirthField";

interface CaregiverDataFormProps {
  onNext: (caregiver: Caregiver, child: Child) => void;
  onBack: () => void;
  initialData?: {
    caregiver?: Caregiver;
    child?: Child;
  };
}

export const CaregiverDataForm: React.FC<CaregiverDataFormProps> = ({ 
  onNext, 
  onBack, 
  initialData 
}) => {
  const [caregiverName, setCaregiverName] = useState(initialData?.caregiver?.name || '');
  const [caregiverEmail, setCaregiverEmail] = useState(initialData?.caregiver?.email || '');
  const [caregiverWhatsapp, setCaregiverWhatsapp] = useState(initialData?.caregiver?.whatsapp || '');
  const [childName, setChildName] = useState(initialData?.child?.name || '');
  const [childDateOfBirth, setChildDateOfBirth] = useState(initialData?.child?.dateOfBirth || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caregiverName || !caregiverEmail || !caregiverWhatsapp || !childName || !childDateOfBirth) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(caregiverEmail)) {
      toast({
        title: "Erro",
        description: "Por favor, digite um email válido.",
        variant: "destructive"
      });
      return;
    }

    // Validate date of birth is not in the future
    const birthDate = new Date(childDateOfBirth);
    const today = new Date();
    if (birthDate > today) {
      toast({
        title: "Erro",
        description: "A data de nascimento não pode ser no futuro.",
        variant: "destructive"
      });
      return;
    }

    const caregiver: Caregiver = {
      name: caregiverName,
      email: caregiverEmail,
      whatsapp: caregiverWhatsapp
    };

    const child: Child = {
      name: childName,
      dateOfBirth: childDateOfBirth
    };

    onNext(caregiver, child);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Dados Iniciais</h1>
          <p className="text-lg text-gray-600">Preencha as informações do responsável e da criança</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center text-green-600">
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Dados do Responsável
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="caregiverName">Nome Completo do Responsável *</Label>
                  <Input
                    id="caregiverName"
                    type="text"
                    value={caregiverName}
                    onChange={(e) => setCaregiverName(e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caregiverEmail">Email do Responsável *</Label>
                  <Input
                    id="caregiverEmail"
                    type="email"
                    value={caregiverEmail}
                    onChange={(e) => setCaregiverEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caregiverWhatsapp">WhatsApp de Contato *</Label>
                  <Input
                    id="caregiverWhatsapp"
                    type="tel"
                    value={caregiverWhatsapp}
                    onChange={(e) => setCaregiverWhatsapp(e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Dados da Criança
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="childName">Nome da Criança *</Label>
                  <Input
                    id="childName"
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Digite o nome da criança"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <DateOfBirthField
                    label="Data de nascimento"
                    required
                    minYear={2000}
                    maxYear={new Date().getFullYear()}
                    value={childDateOfBirth}
                    onChange={(iso) => setChildDateOfBirth(iso || '')}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continuar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
