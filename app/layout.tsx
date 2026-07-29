import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diagnóstico Financeiro | iFood",
  description:
    "Diagnóstico financeiro para restaurantes que vendem pelo iFood: descubra quanto você está gastando em Serviços e Promoções.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-bg text-body min-h-screen antialiased">{children}</body>
    </html>
  );
}
