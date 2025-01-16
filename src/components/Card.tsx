import React, { useState, useEffect } from 'react';

import { Card } from '../app/game/types';

interface CardProps {
  nom: string;
  onClose: () => void;
}

export const CardPopin: React.FC<CardProps> = ({ nom, onClose }) => {
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    const getRolesCard = async () => {
      try {
        const response = await fetch('/api/admin/cards');
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des cartes : ${response.status}`);
        }
        const cards = await response.json();
  
        const roleCards = cards.find((c: Card) => {
          return c.nom.toLowerCase() === nom.toLowerCase();
        });
  
        setCard(roleCards || null); // Gérer le cas où aucune carte n'est trouvée
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
      }
    };
  
    getRolesCard();
  }, [nom]);
  

  return (

    card && (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
            <div className="bg-white rounded-lg p-6 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 text-2xl"
                >
                    ✕
                </button>

                <div className="flex items-center justify-center">
                    <img className="rounded-full" alt={"image-" + card.nom} 
                        src="https://fastly.picsum.photos/id/129/200/200.jpg?hmac=Y7ERTUfFi4RdOFkUcoOnX_xjWnsy4PA7pJkkFmaQt8c" 
                    />
                </div>
                <div className="py-5">
                    <h5 className="mb-2 text-2xl text-center font-bold uppercase">{card.nom}</h5>
                    <p className="mb-3 font-normal text-gray-700">{card.description}</p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-center bg-indigo-500 text-white font-bold py-2 px-8 rounded"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    </div>
    )
  );
};

interface CardActionProps {
  nom: string;
}

export const CardAction: React.FC<CardActionProps> = ({ nom }) => {

 const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    const getRolesCard = async () => {
      const response = await fetch('/api/admin/cards');
      const cards = await response.json();
      const roleCards = cards.find((c: Card) => c.nom = nom );
      setCard(roleCards);
    };
    getRolesCard();

  }, [nom]);

  return (

    card && (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="bg-white rounded-lg p-6 shadow-lg relative">
                <div className="flex items-center justify-center w-24">
                    <img className="rounded-full" alt={"image-" + card.nom} 
                        src="https://fastly.picsum.photos/id/129/200/200.jpg?hmac=Y7ERTUfFi4RdOFkUcoOnX_xjWnsy4PA7pJkkFmaQt8c" 
                    />
                </div>
            <h5 className="mb-2 text-2xl text-center font-bold tracking-tight text-gray-900">{card.nom}</h5>
        </div>
    </div>
    )
  );
}

export const CardConfirm: React.FC<CardProps & { onConfirm: (response: boolean) => void }> = ({ nom, onClose, onConfirm }) => {   
    const handleResponse = (response: boolean) => {
        onConfirm(response);
        onClose();
    };

    return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-full bg-white mx-4 rounded-lg p-6 shadow-lg relative">
            <h5 className="mb-4 text-xl text-center text-gray-900">{nom}</h5>
            <div className="flex justify-center space-x-4">
                <button onClick={() => handleResponse(false)}
                    className="text-center bg-red-500 text-white font-bold py-2 px-10 rounded"
                >
                    Non
                </button>
                <button onClick={() => handleResponse(true)}
                    className="text-center bg-[#E8DCC5] text-white font-bold py-2 px-10 rounded"
                >
                    Oui
                </button>
            </div>
        </div>
    </div>
    );
};

export const CardInfo: React.FC<CardProps> = ({ nom, onClose }) => {   
    return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-full bg-white mx-4 rounded-lg p-6 shadow-lg relative">
            <h5 className="mb-4 text-xl text-center text-gray-900">{nom}</h5>
            <div className="flex justify-center space-x-4">
                <button onClick={() => onClose()}
                    className="text-center bg-[#E8DCC5] text-white font-bold py-2 px-10 rounded"
                >
                    Fermer
                </button>
            </div>
        </div>
    </div>
    );
};