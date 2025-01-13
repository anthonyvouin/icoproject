import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICO Project",
  description: "ICO Project Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
