import React from 'react';
import type { AppProps } from 'next/app';
import Layout from '../layout';
import Script from 'next/script';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      {/* Script para o Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-RKLDDZR4WL`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RKLDDZR4WL');
        `}
      </Script>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
