"use client";

import { useState, useEffect } from "react";

interface GameSettings {
  id: number;
  roundsToWin: number;
  updatedAt: string;
}

export default function GameSettingsPage() {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/game-settings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement des paramètres");
      }

      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/game-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roundsToWin: settings?.roundsToWin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setSuccess(true);
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-100 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-[#7D4E1D] font-semibold">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-indigo-100 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E8DBC2] py-8 px-4 shadow-xl rounded-lg sm:px-10">
        <div className="flex-shrink-0">
                  <div className="mx-auto h-20 w-20 rounded-full bg-[#7D4E1D] flex items-center justify-center mb-4">
                    <svg
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {/* Cercle du chronomètre */}
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      {/* Aiguille du chronomètre */}
                      <line
                        x1="12"
                        y1="12"
                        x2="12"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Base du chronomètre */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 2v2M12 14l4 4"
                      />
                    </svg>
                  </div>
                </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black">Paramètres du jeu</h2>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0"></div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Paramètres mis à jour avec succès !
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="roundsToWin"
                className="block text-sm font-medium text-black"
              >
                Nombre de manches pour gagner
              </label>
              <input
                type="number"
                min="1"
                id="roundsToWin"
                value={settings?.roundsToWin || ""}
                onChange={(e) =>
                  setSettings((prev) =>
                    prev
                      ? { ...prev, roundsToWin: parseInt(e.target.value) }
                      : null
                  )
                }
                className="appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border rounded-lg shadow-sm text-m font-bold text-white bg-[#7D4E1D] disabled:opacity-50"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
