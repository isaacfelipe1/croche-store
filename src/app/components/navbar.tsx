"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  FaWhatsapp,
  FaHome,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaEnvelope,
  FaHeart,
  FaUserEdit,
  FaSignOutAlt,
} from 'react-icons/fa';
import SobreModal from './sobreModal';
import ContatoModal from './contatoModal';
import LoginModal from './LoginModal';
import RegisterModal from './registerModal';
import WishlistModal from './WishlistModal';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSobreModalOpen, setIsSobreModalOpen] = useState(false);
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null); 

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
      const email = parsedToken.sub || parsedToken.email;

      const roles = Array.isArray(parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
        ? parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        : [parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]].filter(Boolean);
      
      return { email, roles };
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

  const handleLogout = () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'userId');
    setUserEmail(null);
    setUserRoles([]);
    setIsOpen(false);
    console.log('Usuário deslogado, cookies removidos.');
    window.dispatchEvent(new Event('storage'));
  };

  const handleLoginSuccess = (token: string, userId: string, roles: string[]) => {
    setCookie(null, 'token', token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    setCookie(null, 'userId', userId, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    setUserEmail(decodeToken(token)?.email ?? null);
    setUserRoles(roles);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserEmail(decoded.email);
        setUserRoles(decoded.roles);
      }
    }

    const handleStorageChange = () => {
      const cookies = parseCookies();
      const token = cookies.token;
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          setUserEmail(decoded.email);
          setUserRoles(decoded.roles);
        }
      } else {
        setUserEmail(null);
        setUserRoles([]);
      }
    };

    const handleAccountDeleted = () => {
      setUserEmail(null);
      setUserRoles([]);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('accountDeleted', handleAccountDeleted);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('accountDeleted', handleAccountDeleted);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeAllModals = () => {
    setIsSobreModalOpen(false);
    setIsContatoModalOpen(false);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsWishlistModalOpen(false);
  };

  const openSobreModal = () => {
    setIsSobreModalOpen(true);
    setIsOpen(false);
  };

  const closeSobreModal = () => {
    setIsSobreModalOpen(false);
  };

  const openContatoModal = () => {
    setIsContatoModalOpen(true);
    setIsOpen(false);
  };

  const closeContatoModal = () => {
    setIsContatoModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsOpen(false);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const openWishlistModal = () => {
    setIsWishlistModalOpen(true);
    setIsOpen(false);
  };

  const closeWishlistModal = () => {
    setIsWishlistModalOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#390D0C] text-[#F1E4A6] px-6 py-1 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
          <img src="/logo-croche.jpg" alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
          <div className="hidden lg:flex lg:items-center">
            <p className="text-[#F1E4A6] text-sm mr-6 flex items-center">
              <FaWhatsapp className="mr-2 text-xl text-[#E56446]" />
              Nosso contato: (92) 99192-8559
            </p>
          </div>

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
                <path d="M4 6h16M4 12h16M4 18h16" stroke="#F1E4A6" />
              )}
            </svg>
          </button>

          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <Link href="/" className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300 font-bold">
              Início
            </Link>
            <button onClick={openSobreModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300 font-bold">
              Sobre
            </button>
            {userEmail ? (
              <div className="relative group">
                <span className="py-2 px-3 text-[#F1E4A6] cursor-pointer">Olá, {userEmail}</span>
                <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white text-[#432721] shadow-lg rounded">
                  {userRoles.includes('Admin') && (
                    <div className="bg-[#5c3a2e] rounded">
                      <p className="px-4 py-2 text-sm font-bold text-[#F1E4A6]">Administração</p>
                      <Link href="/admin" className="block px-4 py-2 hover:bg-[#61B785] font-bold">Cadastrar Produtos</Link>
                      <Link href="/listar" className="block px-4 py-2 hover:bg-[#61B785] font-bold">Listar Produtos</Link>
                      <Link href="/editar" className="block px-4 py-2 hover:bg-[#61B785] font-bold">Editar Produtos</Link>
                      <Link href="/excluir" className="block px-4 py-2 hover:bg-[#61B785] font-bold">Excluir Produto</Link>
                    </div>
                  )}
                  {!userRoles.includes('Admin') && (
                    <button onClick={openWishlistModal} className="block px-4 py-2 hover:bg-[#61B785] font-bold">
                      Minha Lista de Desejos
                    </button>
                  )}
                  <Link href="/painel" className="block px-4 py-2 hover:bg-[#61B785] font-bold">Editar Perfil</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-[#61B785] font-bold">Sair</button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={openLoginModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300 font-bold">
                  Login
                </button>
                <button onClick={openRegisterModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300 font-bold">
                  Cadastrar-se
                </button>
              </>
            )}
            <button onClick={openContatoModal} className="py-2 px-3 hover:text-[#61B785] transition-colors duration-300 font-bold">
              Contato
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          ref={menuRef} 
          className={`fixed top-0 right-0 h-full w-64 bg-[#390D0C] text-[#F1E4A6] z-50 transform lg:hidden transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ height: '100vh', overflowY: 'auto' }} 
        >
          {isOpen && (
            <div className="flex flex-col items-start p-6 h-full">
              <div className="flex-grow space-y-6">
                <Link href="/" onClick={toggleMenu} className="flex items-center gap-2 mb-4 font-bold">
                  <FaHome className="text-4xl text-[#F1E4A6] hover:text-[#61B785] transition-colors duration-300" />
                </Link>
                <button onClick={openSobreModal} className="flex items-center gap-2 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mb-6">
                  <FaInfoCircle className="text-2xl" /> Sobre
                </button>
                {userEmail && (
                  <>
                    <span className="text-lg text-[#F1E4A6] mb-2">Olá, {userEmail}</span>
                    <hr className="border-t border-[#E56446] w-full" />
                  </>
                )}
                {userEmail ? (
                  <>
                    {userRoles.includes('Admin') && (
                      <div className="bg-[#5c3a2e] rounded w-full px-4 py-2 mb-4">
                        <p className="text-sm font-bold text-[#F1E4A6] mb-2">Administração</p>
                        <Link href="/admin" className="block py-1 hover:bg-[#61B785] font-bold" onClick={toggleMenu}>
                          Cadastrar Produtos
                        </Link>
                        <Link href="/listar" className="block py-1 hover:bg-[#61B785] font-bold" onClick={toggleMenu}>
                          Listar Produtos
                        </Link>
                        <Link href="/editar" className="block py-1 hover:bg-[#61B785] font-bold" onClick={toggleMenu}>
                          Editar Produtos
                        </Link>
                        <Link href="/excluir" className="block py-1 hover:bg-[#61B785] font-bold" onClick={toggleMenu}>
                          Excluir Produto
                        </Link>
                      </div>
                    )}
                    {!userRoles.includes('Admin') && (
                      <button onClick={openWishlistModal} className="flex items-center gap-0.5 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mt-4">
                        <FaHeart className="text-xl" /> Minha Lista de Desejos
                      </button>
                    )}
                    <Link href="/painel" className="flex items-center gap-1 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mt-4" onClick={toggleMenu}>
                      <FaUserEdit className="text-2xl" /> Editar Perfil
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-1 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mt-4">
                      <FaSignOutAlt className="text-2xl" /> Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={openLoginModal} className="flex items-center gap-2 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mt-4">
                      <FaSignInAlt className="text-2xl" /> Login
                    </button>
                    <button onClick={openRegisterModal} className="flex items-center gap-2 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mt-4">
                      <FaUserPlus className="text-2xl" /> Cadastrar-se
                    </button>
                  </>
                )}
                <button onClick={openContatoModal} className="flex items-center gap-2 text-lg hover:text-[#61B785] transition-colors duration-300 font-bold mt-4">
                  <FaEnvelope className="text-2xl" /> Contato
                </button>
              </div>
              <p className="mt-auto text-sm text-[#F1E4A6]">Nosso Contato: (92) 99192-8559</p>
            </div>
          )}
        </div>
      </nav>

      {/* Modais */}
      <SobreModal isOpen={isSobreModalOpen} onClose={closeSobreModal} />
      <ContatoModal isOpen={isContatoModalOpen} onClose={closeContatoModal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onRegisterSuccess={(token, userId) => handleLoginSuccess(token, userId, [])} />
      <WishlistModal isOpen={isWishlistModalOpen} onClose={closeWishlistModal} />
    </>
  );
};

export default Navbar;