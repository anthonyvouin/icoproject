import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="grid grid-cols-2 gap-4">
        <button className="py-2 xl rounded flex items-center justify-center">
          <img
            src="/img/parchemin logo.png"
            alt="Logo du parchemin"
            className="w-12 h-12 object-contain"
          />
        </button>
        <button className="py-2 xl rounded flex items-center justify-center">
          <img
            src="/Icon - joueur-conf.png"
            alt="Logo du parchemin"
            className="w-12 h-12 object-contain"
          />
        </button>
      </div>
    </footer>
  );
}