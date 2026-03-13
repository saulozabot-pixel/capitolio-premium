import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Capitólio Premium - Mansões de Luxo em Capitólio/MG",
  description: "Aluguel de mansões de luxo à beira da represa em Capitólio, Minas Gerais. Experiências incríveis com serviços de concierge, passeios de lancha e muito mais.",
  keywords: ["capitólio", "aluguel", "mansão", "luxo", "represa", "minas gerais", "hospedagem"],
  openGraph: {
    title: "Capitólio Premium - Mansões de Luxo em Capitólio/MG",
    description: "Aluguel de mansões de luxo à beira da represa em Capitólio, Minas Gerais.",
    url: "https://capitolio-premium.vercel.app",
    siteName: "Capitólio Premium",
    images: [
      {
        url: "https://capitolio-premium.vercel.app/images/geral/canions-de-capitolio-mg.jpg",
        width: 975,
        height: 1300,
        alt: "Cânions de Capitólio MG",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capitólio Premium - Mansões de Luxo em Capitólio/MG",
    description: "Aluguel de mansões de luxo à beira da represa em Capitólio, Minas Gerais.",
    images: ["https://capitolio-premium.vercel.app/images/geral/canions-de-capitolio-mg.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
