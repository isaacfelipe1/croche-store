import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from '../app/components/footer';
import Navbar from '../app/components/navbar'; 
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "loja de crochê",
  description: "Aqui você vai encontrar o melhor crochê para seu lar! Trabalhamos com encomendas e pronta entrega!",
  viewport: "width=device-width, initial-scale=1",
  keywords: ["crochê", "venda", "compra"],
  openGraph: {
    title: "loja de crochê",
    description: "Aqui você vai encontrar o melhor crochê para seu lar! Trabalhamos com encomendas e pronta entrega!",
    images: [
      {
        url: "https://croche-store1.s3.us-east-2.amazonaws.com/NovaLogoAmorECroche.png", // Substitua pelo URL da imagem desejada
        width: 1200, // Largura da imagem
        height: 630,  // Altura da imagem
        alt: "Imagem representando a loja de crochê", // Texto alternativo para a imagem
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="https://croche-store1.s3.us-east-2.amazonaws.com/NovaLogoAmorECroche.png" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
