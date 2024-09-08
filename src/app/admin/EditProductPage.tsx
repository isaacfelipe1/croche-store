// src/app/admin/EditProductPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '../../hoc/withAuth';

const EditProductPage: React.FC = () => {
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
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  useEffect(() => {
    // Fetch product data by ID for editing
    if (productId) {
      axios
        .get(`http://localhost:5207/api/Products/${productId}`)
        .then((response) => {
          const product = response.data;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          setCategory(product.category);
          setColor(product.color);
          setSize(product.size);
          setImageUrl(product.imageUrl);
          setStockQuantity(product.stockQuantity.toString());
        })
        .catch((error) => console.error('Error fetching product data:', error));
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5207/api/Products/${productId}`,
        {
          id: productId,
          name,
          description,
          price: parseFloat(price),
          category,
          color,
          size,
          imageUrl,
          stockQuantity: parseInt(stockQuantity, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 204) {
        alert('Produto atualizado com sucesso!');
        router.push('/admin');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar o produto:', error.response?.data || error.message);
      alert('Falha ao atualizar o produto. Verifique suas entradas ou permissões.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Editar Produto</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário para edição de produto */}
        {/* Mesmos campos que o formulário de criação */}
        {/* Implemente o formulário de forma semelhante ao componente de criação */}
      </form>
    </div>
  );
};

export default withAuth(EditProductPage);
