"use client";

import { usePathname } from "next/navigation";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="fr">
      <body className={`${geist.className} flex flex-col min-h-screen`}>
        {/* Affiche le Header sauf sur la page d'accueil */}
        {pathname !== "/" && <Header />}
        <main className="flex-grow">{children}</main>
        {/* Affiche le Footer sauf sur la page /game */}
        {pathname !== "/game" && <Footer />}
      </body>
    </html>
  );
}
