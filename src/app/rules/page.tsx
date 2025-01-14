"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch("/api/rules");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors du chargement des règles");
        }

        setRules(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-indigo-600 font-semibold">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-red-500 text-center">
            <h3 className="text-lg font-medium">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Règles du jeu ICO</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
          {rules.length === 0 ? (
            <p className="text-gray-500 text-center">
              Aucune règle disponible pour le moment.
            </p>
          ) : (
            rules.map((rule) => (
              <section key={rule.id}>
                <h2 className="text-2xl font-semibold mb-4">{rule.title}</h2>
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-700">{rule.content}</p>
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
