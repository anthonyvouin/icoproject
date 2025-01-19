import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#E9DBC2] py-2 md:py-4 z-50">
      <div className="flex justify-between items-center px-4 md:px-8 max-w-screen-xl mx-auto">
        <button 
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-white bg-cover bg-center shadow-md hover:scale-105 transition-transform"
          style={{ backgroundImage: 'url(/regle.jpg)' }}
          onClick={() => window.location.href = "/rules"}
          aria-label="Règles du jeu"
        >
        </button>

        <button 
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-white bg-cover bg-center shadow-md hover:scale-105 transition-transform"
          style={{ backgroundImage: 'url(/Iconjoueur.webp)' }}
          onClick={() => window.location.href = "/profile"}
          aria-label="Profil"
        >
        </button>

        <button 
          onClick={() => {
            localStorage.clear();
            document.cookie = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/";
          }}
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-white bg-cover bg-center shadow-md hover:scale-105 transition-transform"
          style={{ backgroundImage: 'url(/deconnexion.webp)' }}
          aria-label="Déconnexion"
        >
        </button>
      </div>
    </footer>
  );
}