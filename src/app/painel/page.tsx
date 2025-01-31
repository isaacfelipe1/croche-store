'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import withAuth from '../../hoc/withAuth';
import AlertModal from '../components/AlertModal';
import { parseCookies } from 'nookies';

const EditProfile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const storedUserId = cookies.userId;

    if (storedUserId && token) {
      setUserId(storedUserId);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleAuthError = (error: string) => {
    setMessage(error);
    console.error(error);
    setIsLoading(false);
    setIsModalOpen(true);
  };

  const handleAction = async (url: string, method: string, body?: object) => {
    const cookies = parseCookies();
    const token = cookies.token;
    if (!userId || !token)
      return handleAuthError('Token de autenticação não encontrado.');

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) throw new Error('Erro na operação.');

      if (method === 'DELETE') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setMessage('Conta excluída com sucesso!');
        setIsModalOpen(true);

        window.dispatchEvent(new CustomEvent('accountDeleted'));

        router.push('/');
      } else {
        return true;
      }
    } catch (error) {
      handleAuthError('Erro na operação. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await handleAction(
      `https://crochetstoreapi.onrender.com/Auth/edit/${userId}`,
      'PUT',
      {
        email,
        nome,
        currentPassword,
        password: newPassword,
      }
    );
    if (success) {
      setMessage('Perfil atualizado com sucesso!');
      setIsModalOpen(true);
    }
  };

  const handleDeleteAccount = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteAccount = () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);
    handleAction(
      `https://crochetstoreapi.onrender.com/Auth/delete/${userId}`,
      'DELETE'
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 px-4 lg:px-20">
      {/* Seção lateral para desktop */}
      <div className="hidden lg:block lg:w-1/2 max-w-lg p-10 bg-white rounded-lg shadow-lg text-gray-800 mr-8">
        <h2 className="text-3xl font-bold mb-6">Configuração de Perfil</h2>
        <p className="text-lg leading-relaxed">
          Aqui você pode atualizar seus dados de perfil e senha. Por favor, preencha os campos corretamente para evitar erros. Certifique-se de salvar suas alterações antes de sair.
        </p>
      </div>

      {/* Seção do formulário */}
      <div className="w-full lg:w-1/2 max-w-xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Configuração</h2>
        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <div className="flex items-center mt-1 border rounded">
              <FiMail className="ml-2 text-gray-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2 border-none focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-800"
            >
              Nome
            </label>
            <div className="flex items-center mt-1 border rounded">
              <FiUser className="ml-2 text-gray-500" />
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="block w-full p-2 border-none focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-800"
            >
              Senha Atual
            </label>
            <div className="flex items-center mt-1 border rounded relative">
              <FiLock className="ml-2 text-gray-500" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full p-2 border-none focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-800"
            >
              Nova Senha
            </label>
            <div className="flex items-center mt-1 border rounded relative">
              <FiLock className="ml-2 text-gray-500" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full p-2 border-none focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded hover:bg-blue-700 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ backgroundColor: '#61B785', color: '#FFFFFF' }}
              disabled={isLoading}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-3 px-4 rounded hover:bg-red-700 mt-4"
              style={{ backgroundColor: '#734230', color: '#FFFFFF' }}
              type="button"
            >
              Excluir Conta
            </button>
          </div>
        </form>

        <AlertModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Mensagem"
          message={message}
        />

        <AlertModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirmação"
          message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!"
          onConfirm={confirmDeleteAccount}
          confirmButtonText="Excluir"
        />
      </div>
    </div>
  );
};

export default withAuth(EditProfile);
