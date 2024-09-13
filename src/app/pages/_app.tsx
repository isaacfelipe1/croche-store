import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Layout from '../layout';
import Script from 'next/script';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Inicializar o Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-RKLDDZR4WL'); // Substitua pelo seu ID da métrica
  }, []);

  return (
    <Layout>
      {/* Script do Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-RKLDDZR4WL`} // Substitua pelo seu ID da métrica
      />
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
