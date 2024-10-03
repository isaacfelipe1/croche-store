/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://croche-store.vercel.app/', // Seu domínio
  generateRobotsTxt: true, // Gera automaticamente o arquivo robots.txt
  exclude: ['/editar', '/excluir', '/listar'], // Exclui essas páginas do sitemap e do robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/', // Permite a indexação da página inicial
        disallow: ['/editar', '/excluir', '/listar'], // Bloqueia a indexação das páginas específicas
      },
    ],
  },
};

module.exports = config;
