"use client";

import { useState, useEffect } from "react";

export default function TimerSettings() {
  const [timer, setTimer] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const response = await fetch("/api/admin/timer");
        const data = await response.json();
        if (data.timer) {
          setTimer(data.timer);
        }
      } catch (error) {
        setError("Erreur lors de la récupération du timer");
      }
    };

    fetchTimer();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/timer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timer }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du timer");
      }

      setSuccess(true);
    } catch (error) {
      setError("Erreur lors de la mise à jour du timer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-indigo-100 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E8DBC2] py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="text-center mb-8">
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
            <h2 className="text-3xl font-bold text-black">Configuration du Timer</h2>
            <p className="mt-2 text-black">
              Définissez la durée du timer pour la révélation des rôles
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Timer mis à jour avec succès
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="timer"
                className="block text-sm font-medium text-black"
              >
                Durée du timer (en secondes)
              </label>
              <input
                type="number"
                id="timer"
                name="timer"
                min="1"
                value={timer}
                onChange={(e) => setTimer(Number(e.target.value))}
                className="appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border rounded-lg shadow-sm text-m font-bold text-white bg-[#7D4E1D] disabled:opacity-50"
              >
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
