import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface EmailConfirmationWaitingProps {
  email: string;
  onBack: () => void;
}

export const EmailConfirmationWaiting: React.FC<EmailConfirmationWaitingProps> = ({ 
  email, 
  onBack 
}) => {
  const [isResending, setIsResending] = useState(false);
  const { resendConfirmation } = useAuth();

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await resendConfirmation(email);
      toast({
        title: "Email reenviado",
        description: "Um novo email de confirmação foi enviado. Verifique sua caixa de entrada e spam."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao reenviar email. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary">
          Confirme seu email
        </CardTitle>
        <CardDescription>
          Enviamos um link de confirmação para seu email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Email enviado para:
            </p>
            <p className="font-medium text-foreground">{email}</p>
          </div>
          
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="font-medium text-foreground mb-2">
              Não recebeu o email?
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verifique sua pasta de <strong>spam/lixo eletrônico</strong></li>
              <li>• Aguarde alguns minutos para a entrega</li>
              <li>• Verifique se o email está correto</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reenviar email
              </>
            )}
          </Button>
          
          <Button 
            onClick={onBack}
            variant="ghost"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          Após confirmar seu email, você será redirecionado automaticamente para fazer login.
        </div>
      </CardContent>
    </Card>
  );
};