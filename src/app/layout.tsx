import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

// Carregamento dinâmico do Navbar e Footer
const Navbar = dynamic(() => import('../app/components/navbar'), { ssr: false });
const Footer = dynamic(() => import('../app/components/footer'), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amor & Crochê",
  description: "Aqui você vai encontrar o melhor crochê para seu lar! Trabalhamos com encomendas e pronta entrega!",
  viewport: "width=device-width, initial-scale=1",
  keywords: ["crochê", "venda", "compra"],
  openGraph: {
    title: " Amor & Crochê",
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
        
        {/* Mantemos o preload da fonte Inter apenas se ela for estática */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" as="style" />

        {/* Favicon */}
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
