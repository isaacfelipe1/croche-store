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
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('User ID:', storedUserId); 
      console.log('Token:', token); 

      if (storedUserId && token) {
        setUserId(storedUserId);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (!userId) {
        throw new Error('User ID não encontrado. Por favor, faça o login novamente.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await fetch(`http://localhost:5207/Auth/edit/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ email, nome, currentPassword, password: newPassword }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o perfil.');
      }

      const result = await response.json();
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error);
      setMessage('Erro ao atualizar o perfil. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!confirmation) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await fetch(`http://localhost:5207/Auth/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir a conta.');
      }

      alert('Conta excluída com sucesso!');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.push('/'); 
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
      alert('Erro ao excluir a conta. Por favor, tente novamente.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Editar Perfil</h2>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium">Nome</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium">Senha Atual</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium">Nova Senha</label>
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
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
        </button>
        <button
          onClick={handleDeleteAccount}
          className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 mt-4"
        >
          Excluir Conta
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditProfile);
