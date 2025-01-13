"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="));
    if (email) {
      setUserEmail(email);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Coucou 👋
        </h2>
        {userEmail && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Connecté avec : {userEmail}
          </p>
        )}
      </div>
    </div>
  );
}
