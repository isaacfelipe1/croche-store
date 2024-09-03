import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "loja de croche",
  description: "Aqui você  vai comprar e vender seu  crochê",
  viewport: "width=device-width, initial-scale=1",
  keywords: ["crochê", "venda", "compra"],
  openGraph: {
    
    title: "loja de croche",
    description: "Aqui você  vai comprar e vender seu  crochê",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
