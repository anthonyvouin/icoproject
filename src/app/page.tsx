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
          <div className="text-black font-cormorant font-bold italic grid grid-cols-1 gap-4 md:gap-8 w-full">
            {[
              {
                title: "Acheter le jeu",
                link: "/online",
                subtitle: "Commmandez en 2min",
              },
              {
                title: "Jouer en local",
                link: "/game",
                subtitle: "7-20 joueurs",
              },
            ].map((item, index) => (
              <div key={index} className="w-full bg-[#E9DBC2] rounded-lg p-2">
                <Link href={item.link}>
                  <div className="mt-2 text-center">
                    <div className="text-lg md:text-xl font-bold">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-md md:text-sm text-gray-700">{item.subtitle}</div>
                    )}
                  </div>                
                </Link>

              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}