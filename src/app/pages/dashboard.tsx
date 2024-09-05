

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Bem-vindo ao Dashboard!</h2>
        <p className="text-center">Você fez login com sucesso!</p>
      </div>
    </div>
  );
};

export default DashboardPage;
