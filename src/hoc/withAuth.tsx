import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies'; // Importando nookies para gerenciar cookies

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const cookies = parseCookies(); // Recuperando os cookies
      const token = cookies.token; // Obtendo o token dos cookies

      if (!token) {
        // Se o token não existir, redireciona para a página inicial (ou página de login)
        router.push('/');
      } else {
        // Caso o token exista, considera que o usuário está autenticado
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return null; // Ou você pode retornar um spinner/carregando aqui
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
