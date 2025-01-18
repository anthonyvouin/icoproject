'use client';

import { useState, useEffect } from 'react';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupération des contacts depuis une API fictive
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/admin/contacts');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors du chargement des messages');
        }

        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Fonction pour gérer le clic sur un message et mettre à jour son statut
  const handleMessageClick = async (id: number) => {
    try {
      // Mettre à jour le statut côté serveur
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'READ' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour le statut localement si l'API réussit
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === id ? { ...contact, status: 'READ' } : contact
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du message:', error);
    }
  };

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
    <div className="mt-8 ml-4 mr-4 sm:mt-12 sm:ml-6 sm:mr-6 lg:mt-16 lg:ml-8 lg:mr-8">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-sm shadow-lg rounded-lg mt-8">
          <div className="bg-[#E8DBC2] px-4 mb-6 py-5 sm:px-6 backdrop-blur-sm rounded-t-lg">
            <h1 className="text-3xl text-black font-bold mb-8">Messages de Contact</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <div className="text-m font-bold text-gray-500">Total</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {contacts.length}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <div className="text-m text-gray-500 font-bold">Nouveaux</div>
                <div className="mt-1 text-3xl font-semibold text-green-600">
                  {contacts.filter((c) => c.status === 'PENDING').length}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <div className="text-m font-bold text-gray-500">Lus</div>
                <div className="mt-1 text-3xl font-semibold text-blue-600">
                  {contacts.filter((c) => c.status === 'READ').length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => handleMessageClick(contact.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-lg">
                          {(contact.name || contact.email || '?')
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {contact.name || contact.email}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {contact.name ? contact.email : ''}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              contact.status === 'PENDING'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {contact.status === 'PENDING' ? 'Nouveau' : 'Lu'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(contact.createdAt).toLocaleDateString('fr-FR', {
                              dateStyle: 'long',
                            })}{' '}
                            à{' '}
                            {new Date(contact.createdAt).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
