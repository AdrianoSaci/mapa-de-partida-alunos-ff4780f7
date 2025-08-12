
import React, { useState, useRef, useEffect } from 'react';
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
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [caregiverName, setCaregiverName] = useState(initialData?.caregiver?.name || '');
  const [caregiverEmail, setCaregiverEmail] = useState(initialData?.caregiver?.email || '');
  const [caregiverWhatsapp, setCaregiverWhatsapp] = useState(initialData?.caregiver?.whatsapp || '');
  const [childName, setChildName] = useState(initialData?.child?.name || '');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  
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

  // Format date input with progressive mask - only shows valid numbers
  const formatDateInput = (value: string) => {
    // Extract only numbers from input
    const numbers = value.replace(/\D/g, '');
    
    // Validate digits as they're typed
    if (numbers.length === 0) return '';
    
    // Day validation (01-31)
    if (numbers.length === 1) {
      const firstDigit = parseInt(numbers[0]);
      if (firstDigit > 3) return ''; // Day can't start with > 3
      return numbers;
    }
    
    if (numbers.length === 2) {
      const day = parseInt(numbers);
      if (day === 0 || day > 31) return numbers[0]; // Keep only first digit if invalid
      return numbers + '/';
    }
    
    // Month validation (01-12)
    if (numbers.length === 3) {
      const day = parseInt(numbers.slice(0, 2));
      const monthFirstDigit = parseInt(numbers[2]);
      if (day === 0 || day > 31) return numbers.slice(0, 1);
      if (monthFirstDigit > 1) return numbers.slice(0, 2) + '/'; // Month can't start with > 1
      return numbers.slice(0, 2) + '/' + numbers[2];
    }
    
    if (numbers.length === 4) {
      const day = parseInt(numbers.slice(0, 2));
      const month = parseInt(numbers.slice(2, 4));
      if (day === 0 || day > 31) return numbers.slice(0, 1);
      if (month === 0 || month > 12) return numbers.slice(0, 2) + '/' + numbers[2]; // Keep only first month digit
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/';
    }
    
    // Year validation (1900-current year)
    if (numbers.length >= 5) {
      const day = parseInt(numbers.slice(0, 2));
      const month = parseInt(numbers.slice(2, 4));
      const currentYear = new Date().getFullYear();
      
      if (day === 0 || day > 31) return numbers.slice(0, 1);
      if (month === 0 || month > 12) return numbers.slice(0, 2) + '/' + numbers[2];
      
      let year = numbers.slice(4, 8);
      
      // Prevent future years as they're typed
      if (year.length >= 4) {
        const fullYear = parseInt(year);
        if (fullYear > currentYear) {
          year = currentYear.toString();
        }
        if (fullYear < 1900) {
          year = '1900';
        }
      }
      
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + year;
    }
    
    return numbers;
  };

  // Validate if date is complete and correct
  const validateDate = (dateStr: string) => {
    if (!dateStr) return false;
    
    let day, month, year;
    
    if (isMobile) {
      // Must be complete DD/MM/YYYY format
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
      [day, month, year] = dateStr.split('/').map(Number);
    } else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
      [year, month, day] = dateStr.split('-').map(Number);
    }
    
    // Validate ranges
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    // Check if the date actually exists (handles leap years, etc.)
    const date = new Date(year, month - 1, day);
    const isValidDate = date.getDate() === day && 
                       date.getMonth() === month - 1 && 
                       date.getFullYear() === year;
    
    if (!isValidDate) return false;
    
    // Don't allow future dates
    const today = new Date();
    return date <= today;
  };

  // Handle date input with proper cursor management
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (isMobile) {
      const formatted = formatDateInput(value);
      setChildDateOfBirth(formatted);
      
      // Calculate new cursor position
      const numbersInInput = value.replace(/\D/g, '').length;
      let newPosition = formatted.length;
      
      // Adjust cursor position based on where slashes are added
      if (numbersInInput === 2 && formatted.endsWith('/')) {
        newPosition = formatted.length;
      } else if (numbersInInput === 4 && formatted.endsWith('/')) {
        newPosition = formatted.length;
      } else {
        // Keep cursor at the end of numbers typed
        const numbersInFormatted = formatted.replace(/\D/g, '').length;
        if (numbersInFormatted <= 2) {
          newPosition = numbersInFormatted;
        } else if (numbersInFormatted <= 4) {
          newPosition = numbersInFormatted + 1; // +1 for first slash
        } else {
          newPosition = numbersInFormatted + 2; // +2 for both slashes
        }
      }
      
      setCursorPosition(newPosition);
    } else {
      setChildDateOfBirth(value);
    }
  };
  
  // Effect to manage cursor position
  useEffect(() => {
    if (isMobile && dateInputRef.current) {
      const input = dateInputRef.current;
      // Small delay to ensure the value has been updated
      setTimeout(() => {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  }, [childDateOfBirth, cursorPosition, isMobile]);

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
                    ref={dateInputRef}
                    id="childDateOfBirth"
                    type={isMobile ? "text" : "date"}
                    value={childDateOfBirth}
                    onChange={handleDateChange}
                    placeholder={isMobile ? "DD/MM/AAAA" : undefined}
                    maxLength={isMobile ? 10 : undefined}
                    inputMode={isMobile ? "numeric" : undefined}
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
