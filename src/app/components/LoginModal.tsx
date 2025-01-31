"use client";
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaSpinner, FaSun, FaMoon } from 'react-icons/fa'; 
import Modal from './modal';
import RegisterModal from './registerModal'; 
import { FiLock } from 'react-icons/fi';
import { setCookie, parseCookies } from 'nookies'; 

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, userId: string, roles: string[]) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true); 
  const [theme, setTheme] = useState('light'); 
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); 
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false); 
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(''); 

  const decodeToken = (token: string): { email: string; roles: string[] } | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const parsedToken = JSON.parse(jsonPayload);
      const email = parsedToken.sub;

      const roles = Array.isArray(parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
        ? parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        : [parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]];
      
      return { email, roles };
    } catch (error) {
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://crochetstoreapi.onrender.com/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Falha no login');
      }

      const { token, userId } = await response.json(); 

      setCookie(null, 'token', token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      setCookie(null, 'userId', userId.toString(), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      const decoded = decodeToken(token);
      if (decoded) {
        onLoginSuccess(token, userId, decoded.roles);
      } else {
        throw new Error('Falha ao decodificar o token.');
      }
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://crochetstoreapi.onrender.com/Auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar solicitação de recuperação de senha');
      }

      setForgotPasswordMessage('Verifique seu email para redefinir sua senha.');
    } catch (err) {
      setForgotPasswordMessage('Falha ao enviar solicitação de recuperação de senha. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(email));
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark'); 
      setTheme('light');
      localStorage.setItem('theme', 'light'); 
    } else {
      html.classList.add('dark'); 
      setTheme('dark');
      localStorage.setItem('theme', 'dark'); 
    }
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
    onClose(); 
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleOpenForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    onClose();
  };

  const handleCloseForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleRegisterSuccess = (token: string, userId: string) => {
    onLoginSuccess(token, userId, []);
    handleCloseRegisterModal(); 
  };

  useEffect(() => {
    const userTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    if (userTheme === 'dark') {
      html.classList.add('dark');
      setTheme('dark');
    } else {
      html.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto animate-slideIn">

          <h2 className="text-3xl font-semibold text-center mb-6 text-[#734230] dark:text-white">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 dark:text-gray-300 font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border ${isEmailValid ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:outline-none focus:ring-2 ${isEmailValid ? 'focus:ring-[#61B785]' : 'focus:ring-red-500'} transition`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                required
                aria-invalid={!isEmailValid}
              />
              {!isEmailValid && <p className="text-red-500 text-sm">Por favor, insira um e-mail válido.</p>}
            </div>
            <div className="mb-5 relative">
              <label htmlFor="password" className="block text-gray-600 dark:text-gray-300 font-medium mb-1">Senha</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61B785] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash size={20} className='mt-4' /> : <FaEye size={20} className='mt-4' />}
              </button>
            </div>
            <button
              type="submit"
              className={`w-full bg-[#61B785] text-white py-3 rounded-lg font-semibold hover:bg-[#734230] transition-colors duration-200 shadow-md hover:shadow-lg flex justify-center items-center ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin mr-2" size={20} />
              ) : (
                'Acessar'
              )}
            </button>
          </form>
          {/* <button onClick={toggleTheme} className="mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center">
            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button> */}
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">Esqueceu sua senha? 
            <button onClick={handleOpenForgotPasswordModal} className="text-[#734230] dark:text-white font-semibold hover:underline ml-1">
              Recuperar senha
            </button>
          </p>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">Não está cadastrado? 
            <button onClick={handleOpenRegisterModal} className="text-[#734230] dark:text-white font-semibold hover:underline ml-1">
              Cadastre-se
            </button>
          </p>
        </div>
      </Modal>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onRegisterSuccess={handleRegisterSuccess} 
      />

      {/* Modal de recuperação de senha */}
      {isForgotPasswordModalOpen && (
        <Modal isOpen={isForgotPasswordModalOpen} onClose={handleCloseForgotPasswordModal}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto animate-slideIn">
            <h2 className="text-2xl font-semibold text-center mb-6 text-[#734230] dark:text-white">Recuperar Senha</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Por favor, insira seu email para receber um link de recuperação de senha.</p>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#61B785] transition mb-4"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {forgotPasswordMessage && (
              <p className="text-center text-green-500">{forgotPasswordMessage}</p>
            )}
            <button 
              className="w-full bg-[#61B785] text-white py-3 rounded-lg font-semibold hover:bg-[#734230] transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : 'Enviar'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LoginModal;
