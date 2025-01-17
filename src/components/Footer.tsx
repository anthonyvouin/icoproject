import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="grid grid-cols-3 gap-4">
        <Link href="/rules" className="py-2 xl rounded flex items-center justify-center">
            <img
              src="/img/parchemin logo.png"
              alt="Logo du parchemin"
              className="w-12 h-12 object-contain"
            />
        </Link>

        <Link href="/profile" className="py-2 xl rounded flex items-center justify-center">
          <img
            src="/Icon - joueur-conf.png"
            alt="Logo du parchemin"
            className="w-12 h-12 object-contain"
          />
        </Link>
        <button onClick={() => {
            localStorage.clear();
            document.cookie = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }}
          className="flex flex-col py-2 xl rounded flex items-center justify-center"
        >
          <img
            src="/img/capitaine_illu.png"
            alt="déconnexion"
            className="w-12 h-12 object-contain"
          />
          Se déconnecter
        </button>
      </div>
    </footer>
  );
}