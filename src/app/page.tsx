"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 via-indigo-900 to-indigo-800">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Texte */}
              <div className="text-center md:text-left">
                <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white mb-8">
                  CardMaster
                </h1>
                <p className="text-xl text-indigo-100 mb-10 max-w-3xl">
                  Plongez dans un univers de stratégie et de tactique où chaque carte peut changer le cours de la partie.
                </p>
                <div className="space-x-4">
                  <Link 
                    href="/game"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-md shadow-lg hover:shadow-indigo-500/30 transition-all"
                  >
                    Jouer maintenant  
                  </Link>
                  <Link 
                    href="/rules"
                    className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-md transition-all"
                  >
                    Découvrir les règles
                  </Link>
                </div>
              </div>

              {/* Image Hero */}
              <div className="hidden md:block">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/jeu.webp"
                    alt="Image principale du jeu"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vague décorative */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-24 fill-white" viewBox="0 0 1440 74" preserveAspectRatio="none">
              <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Featured Section - Blanc */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Un jeu de cartes révolutionnaire
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Mécanique innovante",
                    description: "Un système de jeu unique qui combine stratégie et tactique"
                  },
                  {
                    title: "Illustrations époustouflantes",
                    description: "Des cartes magnifiquement illustrées qui donnent vie à l'univers du jeu"
                  },
                  {
                    title: "Hautement compétitif",
                    description: "Organisez des tournois et devenez le meilleur joueur de votre communauté"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Image Featured */}
            <div className="aspect-square bg-gradient-to-br from-indigo-50 to-white rounded-2xl overflow-hidden shadow-xl border border-indigo-100">
              <Image
                src="/jeu.webp"
                alt="Image du jeu"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Showcase - Indigo */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Des cartes uniques et puissantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="group">
                <div className="aspect-[3/4] bg-white rounded-lg shadow-xl transform transition-transform group-hover:scale-105 overflow-hidden">
                  <Image
                    src="/jeu.webp"
                    alt={`Carte ${index}`}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Rejoignez la communauté
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Commencez votre aventure dès maintenant et devenez un maître du jeu.
            </p>
            <Link 
              href="/register"
              className="inline-block bg-white text-indigo-600 font-bold py-4 px-8 rounded-md shadow-lg hover:shadow-white/20 transition-all"
            >
              S'inscrire maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

