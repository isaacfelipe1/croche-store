"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import SobreModal from './sobreModal';
import ContatoModal from './contatoModal';
import LoginModal from './LoginModal';
import RegisterModal from './registerModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSobreModalOpen, setIsSobreModalOpen] = useState(false);
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const decodeToken = (token: string): string | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { sub } = JSON.parse(jsonPayload);
      return sub;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUserEmail(null); 
    setIsOpen(false);
    console.log('Usuário deslogado, token e userId removidos.');
    window.dispatchEvent(new Event('storage')); // Dispara o evento storage manualmente
  };

  const handleLoginSuccess = (token: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    const email = decodeToken(token);
    if (email) {
      setUserEmail(email);
    }
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const email = decodeToken(token);
      if (email) {
        setUserEmail(email);
      }
    }

    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const email = decodeToken(token);
        if (email) {
          setUserEmail(email);
        }
      } else {
        setUserEmail(null); 
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openSobreModal = () => {
    setIsSobreModalOpen(true);
    setIsOpen(false);
  };

  const closeSobreModal = () => setIsSobreModalOpen(false);
  const openContatoModal = () => {
    setIsContatoModalOpen(true);
    setIsOpen(false);
  };
  const closeContatoModal = () => setIsContatoModalOpen(false);
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsOpen(false);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsOpen(false);
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#432721] text-[#F1E4A6] px-6 py-4 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link href="/">Crochê Store</Link>
          </div>

          {/* Número de telefone (Visível no Desktop) */}
          <div className="hidden lg:flex lg:items-center">
            <p className="text-[#F1E4A6] text-sm mr-6 flex items-center">
              <FaWhatsapp className="mr-2 text-xl text-[#E56446]" />
              Nosso contato: (91) 99192-1009
            </p>
          </div>

          {/* Botão do menu para dispositivos móveis */}
          <button
            onClick={toggleMenu}
            className="block lg:hidden text-[#F1E4A6] focus:outline-none"
          >
            <svg
              className="h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.3 5.7a1 1 0 010 1.4L13.4 12l4.9 4.9a1 1 0 11-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 01-1.4-1.4L10.6 12 5.7 7.1a1 1 0 111.4-1.4L12 10.6l4.9-4.9a1 1 0 011.4 0z"
                  stroke="#F1E4A6"
                />
              ) : (
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="#F1E4A6"
                />
              )}
            </svg>
          </button>

          {/* Links de navegação (Menu para Desktop) */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <Link href="/" className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300">
              Início
            </Link>
            <button onClick={openSobreModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300">
              Sobre
            </button>
            {userEmail ? (
              <div className="relative group">
                <span className="py-2 px-3 text-[#F1E4A6] cursor-pointer">Bem-vindo, {userEmail}</span>
                <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white text-[#432721] shadow-lg rounded">
                  <Link href="/painel" className="block px-4 py-2 hover:bg-[#61B785]">Editar Perfil</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-[#61B785]">Sair</button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={openLoginModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300">
                  Login
                </button>
                <button onClick={openRegisterModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300">
                  Cadastrar
                </button>
              </>
            )}
            <button onClick={openContatoModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300">
              Contato
            </button>
          </div>
        </div>

        {/* Menu para dispositivos móveis */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-[#432721] text-[#F1E4A6] z-50 transform lg:hidden transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {isOpen && (
            <div className="flex flex-col items-start p-4 space-y-4">
              <Link href="/" className="py-2 hover:text-[#61B785] transition-colors duration-300" onClick={toggleMenu}>
                Início
              </Link>
              <button onClick={openSobreModal} className="py-2 hover:text-[#61B785] transition-colors duration-300">
                Sobre
              </button>
              {userEmail ? (
                <>
                  <span className="py-2 text-[#F1E4A6]">Bem-vindo, {userEmail}</span>
                  <Link href="/painel" className="py-2 hover:text-[#61B785] transition-colors duration-300" onClick={toggleMenu}>
                    Editar Perfil
                  </Link>
                  <button onClick={handleLogout} className="py-2 hover:text-[#61B785] transition-colors duration-300">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button onClick={openLoginModal} className="py-2 hover:text-[#61B785] transition-colors duration-300">
                    Login
                  </button>
                  <button onClick={openRegisterModal} className="py-2 hover:text-[#61B785] transition-colors duration-300">
                    Cadastrar
                  </button>
                </>
              )}
              <button onClick={openContatoModal} className="py-2 hover:text-[#61B785] transition-colors duration-300">
                Contato
              </button>
              <p className="py-2 text-sm text-[#F1E4A6]">Contato: (92) 99192-1009</p>
            </div>
          )}
        </div>
      </nav>

      {/* Modal Sobre */}
      <SobreModal isOpen={isSobreModalOpen} onClose={closeSobreModal} />

      {/* Modal Contato */}
      <ContatoModal isOpen={isContatoModalOpen} onClose={closeContatoModal} />

      {/* Modal Login */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />

      {/* Modal Cadastro */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onRegisterSuccess={handleLoginSuccess} />
    </>
  );
};

export default Navbar;
