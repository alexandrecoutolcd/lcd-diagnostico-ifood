import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="pt-BR" className={`${barlowCondensed.variable} ${ibmPlexSans.variable}`}>
      <body className="bg-bg text-body min-h-screen antialiased">{children}</body>
    </html>
  );
}
