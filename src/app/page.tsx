"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-20 w-full">
        <div className="w-full h-16 md:h-32 bg-white flex items-center justify-center shadow-2xl rounded-lg">
          <img
            src="/Fichier 4logo_ICO.svg"
            alt="Logo du jeu"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Contenu principal avec flex-grow pour pousser les colonnes vers le bas */}
      <div className="flex-grow">
        {/* Tableau des 4 lignes en bas de la page */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-24 w-full">
          <div className="text-black font-cormorant font-bold italic grid grid-cols-2 gap-2 md:gap-8 w-full">
            {[
              {
                title: "Acheter le jeu",
                link: "/online",
                subtitle: "Commmandez en 2min",
                logo: "/path/to/logo1.svg", // Chemin vers le logo
              },
              {
                title: "Jouer en local",
                link: "/game",
                subtitle: "7-20 joueurs",
                logo: "/path/to/logo2.svg", // Chemin vers le logo
              },
            ].map((item, index) => (
              <div key={index} className="w-full">
                {/* Colonne avec logo */}
                <div className="bg-[#E9DBC2] hover:bg-[#E9DBC2]/90 text-gray-900 font-bold py-3 md:py-6 px-4 md:px-8 rounded-md text-center text-sm md:text-xl transition-all transform hover:scale-105">
                  <Link href={item.link}>
                    <div className="flex items-center justify-center">
                      <img
                        src={item.logo}
                        alt={`Logo ${item.title}`}
                        className="w-6 h-6 md:w-16 md:h-16 object-contain"
                      />
                    </div>
                  </Link>
                </div>

                {/* Texte à l'extérieur de la colonne */}
                <div className="mt-2 text-center">
                  <div className="text-sm md:text-xl font-bold">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-xs md:text-sm text-gray-700">{item.subtitle}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer fixé en bas */}
      <Footer />
    </div>
  );
}