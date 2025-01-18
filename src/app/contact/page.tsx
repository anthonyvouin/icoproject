"use client";

import { useState } from "react";

type TicketType = "BUG" | "SUGGESTION";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "BUG" as TicketType,
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue");
        return;
      }

      setSuccess(true);
      setFormData({
        type: "BUG",
        email: "",
        message: "",
      });
    } catch (err) {
      setError("Une erreur est survenue");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen from-indigo-100 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#E8DBC2] py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 rounded-full bg-[#7D4E1D] flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black">Contactez-nous</h2>
            <p className="mt-2 text-black">
              Signalez un bug ou proposez une suggestion
            </p>
          </div>

          {/* Messages de succès/erreur */}
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
                    Votre message a été envoyé avec succès !
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-black"
              >
                Type de ticket
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black hover:bg-white"
              >
                <option value="BUG">Bug</option>
                <option value="SUGGESTION">Suggestion</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-black"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border rounded-lg shadow-sm text-m font-bold text-white bg-[#7D4E1D]"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
