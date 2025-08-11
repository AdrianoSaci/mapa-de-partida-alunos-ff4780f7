import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <img 
            src="/lovable-uploads/2ee55b29-2182-4bec-84b0-cbf8867a39db.png"
            alt="Programa Filho que Fala - Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>
    </header>
  );
};