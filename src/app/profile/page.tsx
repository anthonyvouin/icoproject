"use client";

import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick"; 

interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Game {
  id: number;
  startDate: string;
  endDate: string;
  user_id: number;
}
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function ProfilePage() {
  const [parties, setParties] = useState<Game[]>([]);
  const [partiesNigth, setPartiesNigth] = useState<Game[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, gamesResponse] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/game"),
        ]);

        const profileData = await profileResponse.json();
        const gamesData = await gamesResponse.json();

        if (!profileResponse.ok || !gamesResponse.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        setProfile(profileData);
        const playerGames = gamesData.filter(
          (game: Game) => game.user_id == profileData.id
        );
        setParties(playerGames);

        const playerGamesNigth = gamesData.filter(
          (game: Game) => game.user_id == profileData.id && game.startDate > "22:00"
        );
        setPartiesNigth(playerGamesNigth);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center">
        <div className="animate-pulse text-2xl text-indigo-600 font-semibold">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-red-500 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-[#E8DBC2] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl  mx-auto">
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#7D4E1D] px-4 py-8 sm:px-6">
            <div className="flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl">
                  {profile?.name?.[0]?.toUpperCase() ||
                    profile?.email[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="max-w-3xl  mx-auto">
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-white">
                    {profile?.name || "Utilisateur"}
                  </h2>
                  <p className="text-[#E8DBC2]">{profile?.email}</p>
                </div>
            </div>
          </div>
          </div>
          

            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-2 gap-2 rounded-lg  sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-[#E9DBC2]   rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-m font-bold text-[#7D4E1D]">
                    ID Utilisateur
                  </h3>
                  <p className="mt-1 text-lg text-[#7D4E1D]">{profile?.id}</p>
                </div>

                <div className="bg-[#E9DBC2]  rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-m font-bold text-[#7D4E1D]">
                    Membre depuis
                  </h3>
                  <p className="mt-1 text-lg text-[#7D4E1D]">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                          dateStyle: "long",
                        })
                      : "-"}
                  </p>
                </div>

                <div className="bg-[#E9DBC2]  rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-m font-bold text-[#7D4E1D]">
                    Dernière mise à jour
                  </h3>
                  <p className="mt-1 text-lg text-[#7D4E1D]">
                    {profile?.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString("fr-FR", {
                          dateStyle: "long",
                        })
                      : "-"}
                  </p>
                </div>

                <div className="bg-[#E9DBC2]  rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-m font-bold text-[#7D4E1D]">Statut</h3>
                  <div className="mt-1 flex items-center">
                    <span className="h-3 w-3 bg-green-400 rounded-full mr-2"></span>
                    <span className="text-lg text-[#7D4E1D]">Actif</span>
                  </div>
                </div>
              </div>
           
              <div>
                  <div className="mt-8 px-4 py-5 sm:p-6 bg-[#E9DBC2]  rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h1 className="text-lg font-semibold text-[#7D4E1D]">Vos badges</h1>
                    <div className="mt-4">
                      <Slider {...settings}>
                        {parties.length > 0 ? (
                          <div className="bg-[#7D4E1D] font-bold rounded-lg p-8 hover:shadow-md transition-shadow">
                              <div className="relative w-full h-full mb-4">
                                <img 
                                  src="/trésor.webp"
                                  alt="Badge Image"
                                  className="relative  w-full h-full rounded-lg"
                                />
                              </div>
                          <h3 className="text-m p-2 bg-[#F5E1B5] rounded-lg text-black font-bold flex items-center justify-center">Le roi des parties</h3>
                        </div>
                        ) : (
                          <div className="bg-[#F5E1B5] rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="text-m p-2 bg-[#F5E1B5] rounded-lg text-black font-bold flex items-center justify-center">Le roi des partie</h3>
                          </div>
                        )}

                        {partiesNigth.length > 0 ? (
                          <div className="bg-[#383837] rounded-lg p-8 hover:shadow-md transition-shadow">
                            <h3 className="text-m p-2 bg-[#f5e1b5] rounded-lg text-black font-bold flex items-center justify-center">Couche Tard</h3>
                          </div>
                        ) : (
                          <div className="bg-[#383837] rounded-lg p-8 hover:shadow-md transition-shadow ">
                            <div className="relative w-full h-full mb-4">
                                <img 
                                  src="/hibou.webp" 
                                  alt="badge couche tard "
                                  className="object-cover w-full h-full rounded-lg"
                                />
                              </div>
                            <h3 className="text-m p-2 bg-[#f5e1b5] rounded-lg text-black font-bold flex items-center justify-center">Couche Tard</h3>
                          </div>
                        )}
                      </Slider>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#7D4E1D] hover:bg-[#8E5D2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7D4E1D]">
                      Modifier le profil
                    </button>
                    <button className="inline-flex items-center px-6 py-3 border border-[#F5E1B5] text-base font-medium rounded-md shadow-sm text-[#7D4E1D] bg-white hover:bg-[#F5E1B5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7D4E1D]">
                      Changer le mot de passe
                    </button>
                  </div>
              </div>
            </div>
      </div>
    </div>
  );
}
