"use client";

import { useState, useEffect } from "react";

import { CardType, Card } from "../../game/types";

export default function Cards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CardType>("ROLE" as CardType);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/api/admin/cards");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors du chargement des cartes"
          );
        }
        setCards(data);
      } catch (err) {
        console.error("Erreur lors du chargement des cartes:", err);
      }
    }
    fetchCards();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cardId = event.target.value;
    const card = cards.find((c: Card) => c.id === Number(cardId));
    if (card) {
      setSelectedCard(card);
      setNom(card.nom);
      setDescription(card.description);
      setType(card.type);
    }
  };

  const handleUpdateCard = async () => {
    if (!selectedCard) return;
  
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("type", type);
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const response = await fetch(`/api/admin/cards/${selectedCard.id}`, {
        method: "PATCH",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la carte");
      }
  
      const updatedCard = await response.json();
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        )
      );
      setSelectedCard(null);
      setNom("");
      setDescription("");
      setType("ROLE" as CardType);
      setImage(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la carte:", err);
    }
  };

  return (
    <div className="min-h-screen m-7 ">
      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#E9DBC2] backdrop-blur-sm shadow-lg rounded-lg mt-8">
            <div className="px-4 mb-2 py-3 sm:px-6 bg-white/50 backdrop-blur-sm rounded-t-lg">
              <h3 className="text-lg p-4 leading-6 font-medium text-gray-900">
                Mettre à jour une carte
              </h3>
            </div>

            <div className="mx-6 sm:p-4">
              <div>
                <select
                  id="card-select"
                  className="mt-1 p-4  block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={selectedCard?.id || ""}
                  onChange={handleCardChange}
                >
                  <option value="" disabled>
                    Sélectionner une carte
                  </option>
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.nom}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCard && (
                <div>
                  <div className="my-2">
                    <label htmlFor="description" className="block text-m font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      className="mt-1 p-2 block w-full shadow-sm sm:text-sm text-black border-gray-300 rounded-md h-24"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between my-2 space-x-4">
                    <div className="flex-1">
                      <label htmlFor="image" className="block text-m font-medium text-gray-700">
                        Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="mt-1 block w-full text-m text-gray-500 border-gray-300 rounded"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleUpdateCard}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-m font-medium rounded-md shadow-sm text-white bg-[#383837] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Mettre à jour la carte
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg mt-8">
            <div className="px-4 py-4 sm:px-6 bg-white/50 backdrop-blur-sm rounded-t-lg">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Liste des cartes
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de mise à jour
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cards.map((card) => (
                    <tr
                      key={card.id}
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{card.id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {card.nom}
                        </div>
                      </td>
                      <td className="px-4 mx-20 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {card.description}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            card.type === "ROLE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          } transition-colors duration-150 ease-in-out`}
                        >
                          {card.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(card.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(card.updatedAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
</div>




  );
}
