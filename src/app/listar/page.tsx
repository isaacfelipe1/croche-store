// src/app/listar/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '../../hoc/withAuth'; // Importando o HOC de autenticação

const ProductsListPage: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUserRoles(decodedToken.roles);
        console.log('Funções do usuário decodificadas:', decodedToken.roles);
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://crochetstoreapi.onrender.com/api/Products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const decodeToken = (token: string): { roles: string[] } | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { role } = JSON.parse(jsonPayload);
      const roles = Array.isArray(role) ? role : [role];
      return { roles };
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg dark:bg-[#1A1A1A]">
      <h2 className="text-3xl font-semibold text-center text-[#734230] mb-6 dark:text-[#F5F5F5]">Lista de Produtos</h2>
      {products.length === 0 ? (
        <p className="text-center text-[#333333] dark:text-[#F5F5F5]">Nenhum produto encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#61B785] border border-[#61B785]">
            <thead className="bg-[#61B785] dark:bg-[#734230]">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-white">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-white">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-white">Descrição</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-white">Preço</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-white">Categoria</th>
                {userRoles.includes('Admin') && (
                  <th className="px-4 py-2 text-left text-sm font-semibold text-white">Ações</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#61B785] dark:bg-[#1A1A1A]">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-[#f0f0f0] dark:hover:bg-[#333333]">
                  <td className="px-4 py-2 text-sm text-[#333333] dark:text-[#F5F5F5]">{product.id}</td>
                  <td className="px-4 py-2 text-sm text-[#333333] dark:text-[#F5F5F5]">{product.name}</td>
                  <td className="px-4 py-2 text-sm text-[#333333] dark:text-[#F5F5F5]">{product.description}</td>
                  <td className="px-4 py-2 text-sm text-[#333333] dark:text-[#F5F5F5]">R$ {product.price}</td>
                  <td className="px-4 py-2 text-sm text-[#333333] dark:text-[#F5F5F5]">{product.category}</td>
                  {userRoles.includes('Admin') && (
                    <td className="px-4 py-2 text-sm text-[#333333] dark:text-[#F5F5F5] flex space-x-2">
                      <Link href={`/editar?id=${product.id}`} passHref>
                        <button className="bg-[#61B785] text-white px-3 py-1 rounded-md hover:bg-[#734230] transition-colors duration-300">
                          Editar
                        </button>
                      </Link>
                      <Link href={`/excluir?id=${product.id}`} passHref>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-300">
                          Excluir
                        </button>
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default withAuth(ProductsListPage);
