"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Rule {
  id: number;
  title: string;
  content: string;
  order: number;
}

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  
  const ruleImages: { [key: number]: string | string[] } = {
    0: "/icons/logo_ICO.png",
    1: "/icons/cartes_carte_marin.png",
    2: "/icons/cartes_carte_pirate.png",
    3: "/icons/cartes_carte_sirene.png",
    4: "/icons/resultat.png",
    5: "/icons/yeux.png",
    6: "/icons/cartes_capitaine.png",
    7: "/icons/selection_equipage.png",
    8: ["/icons/carte_ile.png", "/icons/carte_poison.png"], 
    9: "/icons/resultat.png",
    10: "/icons/reflexion.png",
    11: "/icons/cartes_carte-tresor.png",
    12: "/icons/winning.png",
  };

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch("/api/rules");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors du chargement des règles");
        }

        const sortedRules = data.sort((a: Rule, b: Rule) => a.order - b.order);
        setRules(sortedRules);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? rules.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === rules.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-2xl text-black font-semibold">
          Chargement des règles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-100 p-6 rounded-lg shadow-lg">
          <div className="text-black text-center">
            <h3 className="text-lg font-medium">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 text-black">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">
          ⚓ Règles du jeu ICO ⚓
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8 flex flex-col items-center">
          {rules.length > 0 && (
            <section key={rules[currentIndex].id} className="text-center">
              {/* Affiche l'image liée à la règle */}
              <div className="mb-4 flex justify-center items-center">
                {Array.isArray(ruleImages[rules[currentIndex].order]) ? (
                  (ruleImages[rules[currentIndex].order] as string[]).map((src, index) => (
                    <Image
                      key={index}
                      src={src}
                      alt={`Illustration ${index + 1}`}
                      width={200}
                      height={200}
                      className="mx-2 rounded-lg shadow-md"
                    />
                  ))
                ) : (
                  <Image
                    src={ruleImages[rules[currentIndex].order] as string}
                    alt={`Illustration de ${rules[currentIndex].title}`}
                    width={300}
                    height={300}
                    className="rounded-lg shadow-md"
                  />
                )}
              </div>

              <h2 className="text-3xl font-bold mb-4">
                {rules[currentIndex].title}
              </h2>

              <p className="text-lg leading-relaxed px-4 whitespace-pre-line">
                {rules[currentIndex].content}
              </p>
            </section>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handlePrev}
              className="px-6 py-3 bg-[#E8DBC2] text-black font-semibold rounded-lg hover:bg-[#D6C3A9] shadow-md transition duration-300"
            >
              Précédent
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-[#E8DBC2] text-black font-semibold rounded-lg hover:bg-[#D6C3A9] shadow-md transition duration-300"
            >
              Suivant
            </button>
          </div>

          <p className="text-sm text-black">
            Règle {currentIndex + 1} sur {rules.length}
          </p>
        </div>
      </div>
    </div>
  );
}
