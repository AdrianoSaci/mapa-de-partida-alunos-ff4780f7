
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Caregiver, Child } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [caregiverName, setCaregiverName] = useState(initialData?.caregiver?.name || '');
  const [caregiverEmail, setCaregiverEmail] = useState(initialData?.caregiver?.email || '');
  const [caregiverWhatsapp, setCaregiverWhatsapp] = useState(initialData?.caregiver?.whatsapp || '');
  const [childName, setChildName] = useState(initialData?.child?.name || '');
  
  // Initialize date state based on device type and initial data format
  const initializeDateOfBirth = () => {
    const initialDate = initialData?.child?.dateOfBirth || '';
    if (!initialDate) return '';
    
    // If mobile and date is in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (isMobile && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
      const [year, month, day] = initialDate.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return initialDate;
  };
  
  const [childDateOfBirth, setChildDateOfBirth] = useState(initializeDateOfBirth());

  // Format date for mobile display (DD/MM/YYYY) - only for initial data conversion
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return dateStr;
    
    // Only convert if it's a complete YYYY-MM-DD date and all parts are defined
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        return `${day}/${month}/${year}`;
      }
    }
    
    return dateStr;
  };

  // Convert date to ISO format (YYYY-MM-DD) for storage
  const convertToISODate = (dateStr: string) => {
    if (!dateStr) return '';
    
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Apply progressive date mask for mobile input
  const applyProgressiveMask = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length === 0) return '';
    if (numericValue.length <= 2) return numericValue + '/MM/AAAA'.slice(numericValue.length);
    if (numericValue.length <= 4) {
      const day = numericValue.slice(0, 2);
      const month = numericValue.slice(2);
      return `${day}/${month}${'M/AAAA'.slice(month.length)}`;
    }
    
    const day = numericValue.slice(0, 2);
    const month = numericValue.slice(2, 4);
    const year = numericValue.slice(4, 8);
    return `${day}/${month}/${year}`;
  };

  // Robust date validation with real date checks
  const validateDate = (dateStr: string) => {
    if (!dateStr) return false;
    
    let day, month, year;
    
    if (isMobile) {
      // Validate DD/MM/YYYY format
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
      [day, month, year] = dateStr.split('/').map(Number);
    } else {
      // Validate YYYY-MM-DD format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
      [year, month, day] = dateStr.split('-').map(Number);
    }
    
    // Basic range validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    // Create date and validate it exists (handles leap years, month lengths, etc.)
    const date = new Date(year, month - 1, day);
    const isValidDate = date.getDate() === day && 
                       date.getMonth() === month - 1 && 
                       date.getFullYear() === year;
    
    if (!isValidDate) return false;
    
    // Additional business logic: don't allow future dates
    const today = new Date();
    return date <= today;
  };

  // Get actual numeric input for progressive mask
  const getNumericInput = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (isMobile) {
      const maskedValue = applyProgressiveMask(value);
      setChildDateOfBirth(maskedValue);
    } else {
      setChildDateOfBirth(value);
    }
  };

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

    // Validate date format
    if (!validateDate(childDateOfBirth)) {
      toast({
        title: "Erro",
        description: isMobile ? "Por favor, digite uma data válida no formato DD/MM/AAAA." : "Por favor, selecione uma data válida.",
        variant: "destructive"
      });
      return;
    }

    // Convert to ISO format for validation and storage
    const isoDate = isMobile ? convertToISODate(childDateOfBirth) : childDateOfBirth;
    const birthDate = new Date(isoDate);
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
      dateOfBirth: isMobile ? convertToISODate(childDateOfBirth) : childDateOfBirth
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
                  <Label htmlFor="childDateOfBirth">Data de Nascimento *</Label>
                  <Input
                    id="childDateOfBirth"
                    type={isMobile ? "text" : "date"}
                    value={childDateOfBirth}
                    onChange={handleDateChange}
                    placeholder={isMobile ? "DD/MM/AAAA" : undefined}
                    maxLength={isMobile ? 10 : undefined}
                    required
                  />
                  {isMobile && (
                    <p className="text-sm text-muted-foreground">
                      Digite a data no formato DD/MM/AAAA
                    </p>
                  )}
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
