"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import withAuth from '../../hoc/withAuth'; 
import debounce from 'lodash/debounce'; // Importa o debounce do lodash
import { parseCookies } from 'nookies'; // Importa nookies para gerenciar cookies

const EditProductPage: React.FC = () => {
  const [productId, setProductId] = useState(''); 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchProductData = useCallback(
    debounce(async (id: string) => {
      if (id.trim()) {
        try {
          const cookies = parseCookies(); // Obtendo os cookies
          const token = cookies.token; // Obtendo o token dos cookies

          if (!token) {
            alert('Você precisa estar logado para buscar dados do produto.');
            return;
          }

          const response = await axios.get(`https://crochetstoreapi.onrender.com/api/Products/${id.trim()}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Usando o token dos cookies
            },
          });
          const product = response.data;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          setCategory(product.category);
          setColor(product.color);
          setSize(product.size);
          setImageFile(null); // Reset the image file since the original URL is not available
          setStockQuantity(product.stockQuantity.toString());
        } catch (error) {
          console.error('Erro ao buscar dados do produto:', error);
          alert('Produto não encontrado. Verifique o ID inserido.');
        }
      }
    }, 500), 
    []
  );

  useEffect(() => {
    fetchProductData(productId);
  }, [productId, fetchProductData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId.trim()) {
      alert('ID do produto é obrigatório.');
      return;
    }

    if (parseFloat(price) <= 0) {
      alert('O preço deve ser um valor positivo.');
      return;
    }

    if (parseInt(stockQuantity, 10) < 0) {
      alert('A quantidade em estoque não pode ser negativa.');
      return;
    }

    setIsLoading(true);

    try {
      const cookies = parseCookies(); // Obtendo os cookies
      const token = cookies.token; // Obtendo o token dos cookies

      if (!token) {
        alert('Você precisa estar logado para atualizar o produto.');
        return;
      }

      // Cria um objeto FormData para enviar os dados como formulário
      const formData = new FormData();
      formData.append('id', productId.trim());
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', parseFloat(price).toString());
      formData.append('category', category);
      formData.append('color', color);
      formData.append('size', size);
      formData.append('stockQuantity', stockQuantity);

      // Adiciona o arquivo de imagem ao FormData se estiver presente
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.put(
        `https://crochetstoreapi.onrender.com/api/Products/${productId.trim()}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Usando o token dos cookies
            'Content-Type': 'multipart/form-data', // Define o tipo de conteúdo correto
          },
        }
      );

      if (response.status === 204) {
        alert('Produto atualizado com sucesso!');
        router.push('/listar'); 
      }
    } catch (error: any) {
      console.error('Erro ao atualizar o produto:', error.response?.data || error.message);
      alert('Falha ao atualizar o produto. Verifique suas entradas ou permissões.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg dark:bg-[#1A1A1A]">
      <h2 className="text-3xl font-semibold text-[#734230] mb-6 dark:text-[#F5F5F5]">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="ID do Produto"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] resize-none dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          rows={4}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
          min="0"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
        />
        <input
          type="text"
          placeholder="Cor"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <input
          type="text"
          placeholder="Tamanho"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
        />
        <input
          type="number"
          placeholder="Quantidade em Estoque"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
          min="0"
        />
        <button
          type="submit"
          className={`w-full p-3 bg-[#61B785] text-white rounded-md hover:bg-[#734230] transition-colors duration-300 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditProductPage);
