// src/components/CreateProductModal.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from './modal'; // Assumindo que você tem um componente Modal genérico

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await axios.post('http://localhost:5207/api/Products', {
        name,
        description,
        price: parseFloat(price),
        category,
        color,
        size,
        imageUrl,
        stockQuantity: parseInt(stockQuantity, 10),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.status === 201) {
        alert('Produto criado com sucesso!');
        router.push('/'); // Redireciona para a página inicial ou outra página desejada
        onClose(); // Fecha o modal após o sucesso
      }
    } catch (error: any) {
      console.error('Falha ao criar o produto:', error.response?.data || error.message);
      alert('Falha ao criar o produto. Verifique suas entradas ou permissões.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Criar Novo Produto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
          min="0"
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Cor"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Tamanho"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          placeholder="Quantidade em Estoque"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
          min="0"
        />
        <button
          type="submit"
          className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Carregando...' : 'Criar Produto'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateProductModal;
