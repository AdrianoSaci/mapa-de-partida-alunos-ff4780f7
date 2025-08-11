import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.log('Erro ao carregar imagem:', '/lovable-uploads/29f394a3-c240-4e89-82fb-3d728d6ca40a.png');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Imagem carregada com sucesso');
    setImageLoaded(true);
  };

  // Testar diferentes extensões
  const imagePaths = [
    '/lovable-uploads/29f394a3-c240-4e89-82fb-3d728d6ca40a.png',
    '/lovable-uploads/29f394a3-c240-4e89-82fb-3d728d6ca40a.jpg',
    '/lovable-uploads/29f394a3-c240-4e89-82fb-3d728d6ca40a.jpeg',
    'lovable-uploads/29f394a3-c240-4e89-82fb-3d728d6ca40a.png'
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          {!imageError ? (
            <img 
              src={imagePaths[0]}
              alt="Programa Filho que Fala - Logo" 
              className="h-16 w-auto object-contain"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="text-primary text-2xl font-bold">
              Programa Filho que Fala
            </div>
          )}
          {!imageLoaded && !imageError && (
            <div className="text-muted-foreground text-sm ml-2">
              Carregando logo...
            </div>
          )}
        </div>
      </div>
    </header>
  );
};