"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import withAuth from '../../hoc/withAuth'; 
import debounce from 'lodash/debounce'; 
import { parseCookies } from 'nookies'; 

const EditProductPage: React.FC = () => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    color: '',
    size: '',
    stockQuantity: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchProductData = useCallback(
    debounce(async (id: string) => {
      if (!id.trim()) return;

      try {
        const cookies = parseCookies(); 
        const token = cookies.token; 

        if (!token) {
          alert('Você precisa estar logado para buscar dados do produto.');
          return;
        }

        console.log(`Fetching product data for ID: ${id}`);
        
        const response = await axios.get(`https://crochetstoreapi.onrender.com/api/Products/${id.trim()}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        const productData = response.data;
        console.log('Product data fetched successfully:', productData);

        setProduct({
          id: productData.id,
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
          category: productData.category,
          color: productData.color,
          size: productData.size,
          stockQuantity: productData.stockQuantity.toString(),
        });
      } catch (error) {
        console.error('Erro ao buscar dados do produto:', error);
        alert('Produto não encontrado. Verifique o ID inserido.');
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (product.id) {
      console.log('Fetching product data with ID:', product.id);
      fetchProductData(product.id);
    }
  }, [product.id, fetchProductData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Changing product field: ${name} to ${value}`);
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    console.log('Selected file:', file);
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productId = String(product.id).trim(); // Garantir que o ID seja uma string

    console.log('Submitting product update for ID:', productId);

    if (!productId) {
      alert('ID do produto é obrigatório.');
      return;
    }

    if (parseFloat(product.price) <= 0) {
      alert('O preço deve ser um valor positivo.');
      return;
    }

    if (parseInt(product.stockQuantity, 10) < 0) {
      alert('A quantidade em estoque não pode ser negativa.');
      return;
    }

    setIsLoading(true);

    try {
      const cookies = parseCookies();
      const token = cookies.token; 

      if (!token) {
        alert('Você precisa estar logado para atualizar o produto.');
        return;
      }

      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        formData.append(key, product[key as keyof typeof product]);
      });

      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      console.log('Sending PUT request to update product:', formData);

      const response = await axios.put(
        `https://crochetstoreapi.onrender.com/api/Products/${productId}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data', 
          },
        }
      );

      if (response.status === 204) {
        console.log('Product updated successfully.');
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
          name="id"
          placeholder="ID do Produto"
          value={product.id}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={product.name}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <textarea
          name="description"
          placeholder="Descrição"
          value={product.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] resize-none dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          rows={4}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Preço"
          value={product.price}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
          min="0"
        />
        <input
          type="text"
          name="category"
          placeholder="Categoria"
          value={product.category}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
        />
        <input
          type="text"
          name="color"
          placeholder="Cor"
          value={product.color}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <input
          type="text"
          name="size"
          placeholder="Tamanho"
          value={product.size}
          onChange={handleInputChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
        />
        <input
          type="number"
          name="stockQuantity"
          placeholder="Quantidade em Estoque"
          value={product.stockQuantity}
          onChange={handleInputChange}
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
