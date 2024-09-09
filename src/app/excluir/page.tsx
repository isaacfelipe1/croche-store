// src/app/excluir/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import withAuth from '../../hoc/withAuth'; // Importando o HOC de autenticação

const DeleteProductPage: React.FC = () => {
  const [productId, setProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!productId) {
      alert('Por favor, insira o ID do produto.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setIsLoading(true);
      try {
        const response = await axios.delete(`https://crochetstoreapi.onrender.com/api/Products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 204) {
          alert('Produto excluído com sucesso!');
          router.push('/listar'); // Redireciona para a lista de produtos
        } else {
          console.error('Erro ao excluir o produto: Resposta inesperada', response);
          alert('Falha ao excluir o produto. Verifique suas permissões.');
        }
      } catch (error: any) {
        console.error('Erro ao excluir o produto:', error.response?.data || error.message);
        alert('Falha ao excluir o produto. Verifique suas permissões.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg dark:bg-[#1A1A1A]">
      <h2 className="text-3xl font-semibold text-[#734230] mb-6 dark:text-[#F5F5F5]">Excluir Produto</h2>
      <div className="mb-4">
        <label htmlFor="productId" className="block text-sm font-medium text-[#333333] dark:text-[#F5F5F5]">
          ID do Produto
        </label>
        <input
          type="text"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mt-1 p-3 border border-[#61B785] w-full rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          placeholder="Digite o ID do produto"
        />
      </div>
      <button
        onClick={handleDelete}
        className={`w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : 'Excluir Produto'}
      </button>
    </div>
  );
};

export default withAuth(DeleteProductPage); // Envolva o componente com withAuth para proteger a rota
