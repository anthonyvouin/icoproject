import React from 'react';
import Image from 'next/image';

const OnlinePage: React.FC = () => {
  return (
    <div className="flex  flex-col m-4 rounded-lg  items-center justify-center h-screen ">
      <div className="bg-white p-8 m-4 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="mb-6">
          <Image
            src="/Fichier 4logo_ICO.svg" 
            alt="Illustration"
            width={400}
            height={300}
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Vous pouvez bientôt commander en ligne
        </h1>
        <p className="text-gray-600">Restez connecté pour plus d'informations.</p>
      </div>
    </div>
  );
};

export default OnlinePage;
