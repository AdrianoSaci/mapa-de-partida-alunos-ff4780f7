
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { EmailConfirmationWaiting } from '@/components/auth/EmailConfirmationWaiting';

type AuthMode = 'login' | 'register' | 'forgot' | 'awaiting-confirmation';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleToggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleForgotPassword = () => {
    setMode('forgot');
  };

  const handleBackToLogin = () => {
    setMode('login');
  };

  const handleAwaitingConfirmation = (email: string) => {
    setUserEmail(email);
    setMode('awaiting-confirmation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm 
            onToggleMode={handleToggleMode}
            onForgotPassword={handleForgotPassword}
          />
        )}
        {mode === 'register' && (
          <RegisterForm 
            onToggleMode={handleToggleMode} 
            onAwaitingConfirmation={handleAwaitingConfirmation}
          />
        )}
        {mode === 'forgot' && (
          <ForgotPasswordForm onBack={handleBackToLogin} />
        )}
        {mode === 'awaiting-confirmation' && (
          <EmailConfirmationWaiting 
            email={userEmail}
            onBack={handleBackToLogin} 
          />
        )}
      </div>
    </div>
  );
};
