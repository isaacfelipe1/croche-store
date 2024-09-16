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
        url: "https://croche-store1.s3.us-east-2.amazonaws.com/NovaLogoAmorECroche.png", 
        width: 1200, 
        height: 630, 
        alt: "Imagem representando a loja de crochê", 
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
        {/* Meta tag de verificação do Google */}
        <meta name="google-site-verification" content="AVrxxVnnTxjRMLjb33XhOwBh-ig3hG6XRFs0FcOA9zk" />
        <link rel="icon" href="https://croche-store1.s3.us-east-2.amazonaws.com/NovaLogoAmorECroche.png" />

        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-RKLDDZR4WL`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RKLDDZR4WL');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
