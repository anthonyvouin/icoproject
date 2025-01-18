import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#E9DBC2] py-4">
      <div className="flex justify-between items-center px-8">
        <button 
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white bg-cover bg-center"
          style={{ backgroundImage: 'url(/regle.jpg)' }}
          onClick={() => window.location.href = "/rules"}
        >
        </button>

        <button 
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white bg-cover bg-center"
          style={{ backgroundImage: 'url(/Iconjoueur.webp)' }}
          onClick={() => window.location.href = "/profile"}
        >
        </button>

        <button 
          onClick={() => {
            localStorage.clear();
            document.cookie = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/";  // Redirige vers la page d'accueil après la déconnexion
          }}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-white bg-cover bg-center"
          style={{ backgroundImage: 'url(/deconnexion.webp)' }}
        >
        </button>
      </div>
    </footer>
  );
}
