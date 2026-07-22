import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
    <html lang="pt-BR" className={poppins.variable}>
      <body className="bg-bg text-body min-h-screen antialiased">{children}</body>
    </html>
  );
}
