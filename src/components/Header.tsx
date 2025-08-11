import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <img 
            src="/lovable-uploads/73a0fc07-4e62-4ee9-9a17-5d9cbb958d03.png"
            alt="Programa Filho que Fala - Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
};