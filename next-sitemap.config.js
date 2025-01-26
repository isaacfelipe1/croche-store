/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://croche-store.vercel.app/', // Substitua pelo seu domínio
  generateRobotsTxt: true, // Gera automaticamente o arquivo robots.txt
  exclude: [
    '/painel',
    '/admin',
    '/editar',
    '/excluir',
    '/listar'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/painel',
          '/admin',
          '/editar',
          '/excluir',
          '/listar'
        ],
      },
    ],
  },
  transform: async (config, path) => {
    // Excluir rotas específicas do sitemap
    if (['/painel', '/admin', '/editar', '/excluir', '/listar'].includes(path)) {
      return null;
    }
    return {
      loc: path, // URL
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};

module.exports = config;
