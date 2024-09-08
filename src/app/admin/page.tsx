// src/app/admin/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import withAuth from '../../hoc/withAuth'; // Importando o HOC de autenticação

const CreateProductPage: React.FC = () => {
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
            }
        } catch (error: any) {
            console.error('Falha ao criar o produto:', error.response?.data || error.message);
            alert('Falha ao criar o produto. Verifique suas entradas ou permissões.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg dark:bg-[#1A1A1A]">
            <h2 className="text-3xl font-semibold text-[#734230] mb-6 dark:text-[#F5F5F5]">Criar Novo Produto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    type="text"
                    placeholder="URL da Imagem"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
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
                    {isLoading ? 'Carregando...' : 'Criar Produto'}
                </button>
            </form>
        </div>
    );
};

export default withAuth(CreateProductPage); // Envolva o componente com withAuth para proteger a rota
