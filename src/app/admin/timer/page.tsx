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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Configuration du Timer</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="timer"
                className="block text-sm font-medium text-gray-700"
              >
                Durée du timer (en secondes)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="timer"
                  id="timer"
                  min="1"
                  value={timer}
                  onChange={(e) => setTimer(Number(e.target.value))}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Définissez la durée du timer pour la révélation des rôles
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">
                  Timer mis à jour avec succès
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
