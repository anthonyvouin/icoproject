"use client";

import { useState, useEffect } from "react";

interface Rule {
  id: number;
  title: string;
  content: string;
  order: number;
}

interface RuleForm {
  title: string;
  content: string;
  order: number;
}

export default function AdminRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [formData, setFormData] = useState<RuleForm>({
    title: "",
    content: "",
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/admin/rules");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement des règles");
      }

      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout de la règle");
      }

      setSuccess(true);
      setFormData({
        title: "",
        content: "",
        order: 0,
      });
      fetchRules(); // Rafraîchir la liste des règles
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ruleId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rules?ruleId=${ruleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setRules(rules.filter((rule) => rule.id !== ruleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  if (loading && rules.length === 0) {
    return (
      <div className="min-h-screen bg-[#E8DBC2] m-6 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-[#7D4E1D] font-semibold">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 ml-4 mr-4 sm:mt-12 sm:ml-6 sm:mr-6 lg:mt-16 lg:ml-8 lg:mr-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#E8DBC2] backdrop-blur-sm shadow-lg rounded-lg mt-8">
          <div className="px-4 mb-4 py-5 sm:px-6 bg-white/50 backdrop-blur-sm rounded-t-lg">
            <h1 className="text-3xl text-black font-bold mb-8">Gestion des règles</h1>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl text-black font-semibold mb-4">
            Ajouter une nouvelle règle
          </h2>

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
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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
                    Règle ajoutée avec succès !
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Titre de la section
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-2 p-2 block w-full rounded-md border-black border-2 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Contenu
              </label>
              <textarea
                id="content"
                required
                rows={6}
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="mt-2 p-2 block w-full rounded-md border-black border-2 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700"
              >
                Ordre d'affichage
              </label>
              <input
                type="number"
                id="order"
                required
                min="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value),
                  }))
                }
                className="mt-2 p-2 block w-full text-black rounded-md border-black border-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-s"
              />
              <p className="mt-1 text-sm text-gray-500">
                L'ordre détermine la position de la règle dans la liste (0 =
                premier)
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`text-white font-bold px-3 py-1 rounded-md bg-[#7D4E1D] hover:bg-[#7D4E1D]/90 transition-colors duration-150 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Ajout en cours..." : "Ajouter la règle"}
              </button>
            </div>
          </form>

        </div>
        
        {/* Liste des règles existantes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl text-black font-semibold mb-4">Règles existantes</h2>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="border border-[#7D4E1D] rounded-lg p-4 hover:bg-[#E8DBC2] "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg text-black font-medium">{rule.title}</h3>
                    <p className="text-sm text-[#7D4E1D] mt-1">
                      Ordre d'affichage : {rule.order}
                    </p>
                    <p className="mt-2 text-black">{rule.content}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="m-6 text-white px-3 py-1 rounded-md bg-[#7D4E1D] hover:bg-[#7D4E1D]/90 transition-colors duration-150"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            {rules.length === 0 && (
              <p className="text-black text-center py-4">Aucune règle n'a été créée pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
