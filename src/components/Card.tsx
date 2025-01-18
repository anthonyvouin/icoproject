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
  
        setCard(roleCards);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
      }
    };
  
    getRolesCard();
  }, [nom]);
  

  return (

    card && (
      <div className=" fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="max-w-xl min-w-xl bg-white border border-gray-200 rounded-lg shadow m-8">
          <div className="bg-[#E9DBC2] rounded-lg p-6 shadow-lg relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              ✕
            </button>

            <div className="flex items-center justify-center m-2">
              <img className="m-4" alt={"image-" + card.nom} src={card.image} />
            </div>
            <div className="py-5">
              <p className="mb-3 text-gray-700 font-bold m-2">{card.description}</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="text-center bg-[#383837] text-white font-bold py-2 px-8 rounded"
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
      try {
        const response = await fetch('/api/admin/cards');
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des cartes : ${response.status}`);
        }
        const cards = await response.json();
  
        const roleCards = cards.find((c: Card) => {
          return c.nom.toLowerCase() === nom.toLowerCase();
        });
  
        setCard(roleCards);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
      }
    };
  
    getRolesCard();
  }, [nom]);

  return (

    card && (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                <div className="flex items-center justify-center w-24">
                    <img alt={"image-" + card.nom} 
                        src={card.image} 
                    />
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
                    className="text-center bg-[#E8DCC5] text-black font-bold py-2 px-10 rounded"
                >
                    Non
                </button>
                <button onClick={() => handleResponse(true)}
                    className="text-center bg-[#383837]  text-white font-bold py-2 px-10 rounded-lg"
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
        <div className="max-w-md bg-white mx-4 rounded-lg p-6 shadow-lg relative">
            <h5 className="mb-4 text-xl text-center text-gray-900">{nom}</h5>
            <div className="flex justify-center space-x-4">
                <button onClick={() => onClose()}
                    className="text-center bg-[#383837] text-white font-bold py-2 px-10 rounded-lg"
                >
                    Fermer
                </button>
            </div>
        </div>
    </div>
    );
};


