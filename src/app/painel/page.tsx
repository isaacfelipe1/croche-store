"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../../hoc/withAuth';

const EditProfile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (storedUserId && token) setUserId(storedUserId);
    else router.push('/');
  }, [router]);

  const handleAuthError = (error: string) => {
    setMessage(error);
    console.error(error);
    setIsLoading(false);
  };

  const handleAction = async (url: string, method: string, body?: object) => {
    const token = localStorage.getItem('token');
    if (!userId || !token) return handleAuthError('Token de autenticação não encontrado.');

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) throw new Error('Erro na operação.');

      if (method === 'DELETE') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        alert('Conta excluída com sucesso!');
        router.push('/');
      } else {
        setMessage('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      handleAuthError('Erro na operação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleAction(`http://localhost:5207/Auth/edit/${userId}`, 'PUT', { email, nome, currentPassword, password: newPassword });
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      setIsLoading(true);
      handleAction(`http://localhost:5207/Auth/delete/${userId}`, 'DELETE');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Editar Perfil</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-800">Nome</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-800">Senha Atual</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800">Nova Senha</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ backgroundColor: '#61B785', color: '#FFFFFF' }}
          disabled={isLoading}
        >
          {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full py-2 px-4 rounded hover:bg-red-700 mt-4"
          style={{ backgroundColor: '#734230', color: '#FFFFFF' }}
        >
          Excluir Conta
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditProfile);