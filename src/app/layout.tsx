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
        {!pathname.startsWith("/admin") &&  pathname !== "/"  && (
          <div className="fixed top-0 left-0 w-full z-50">
            <Header />
          </div>
        )}

        <div className="mt-20 z-10 relative flex-grow pb-20"> 
          <main className="flex-grow">{children}</main>
        </div>

        {/* Footer fixé en bas */}
        {!pathname.startsWith("/admin") && pathname !== "/game" && (
          <div className="fixed bottom-0 left-0 w-full z-40">
            <Footer />
          </div>
        )}
      </body>
    </html>
  );
}
