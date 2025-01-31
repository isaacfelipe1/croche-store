"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import withAuth from "../../hoc/withAuth";
import { parseCookies } from "nookies";

const CreateProductPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stockQuantity, setStockQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = parseFloat(price.replace(",", "."));
    if (parsedPrice <= 0) {
      alert("O preço deve ser um valor positivo.");
      return;
    }

    const parsedStockQuantity = parseInt(stockQuantity, 10);
    if (parsedStockQuantity < 0) {
      alert("A quantidade em estoque não pode ser negativa.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Description", description);
      formData.append("Price", parsedPrice.toString());
      formData.append("Category", category);
      formData.append("Color", color);
      formData.append("Size", size);
      formData.append("StockQuantity", parsedStockQuantity.toString());

      if (imageFile) {
        formData.append("ImageFile", imageFile);
      }

      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        alert("Você precisa estar logado para criar um produto.");
        return;
      }

      const response = await axios.post(
        "https://crochetstoreapi.onrender.com/api/Products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Produto criado com sucesso!");
        router.push("/");
      }
    } catch (error: any) {
      console.error(
        "Falha ao criar o produto:",
        error.response?.data || error.message
      );
      alert("Falha ao criar o produto. Verifique suas entradas ou permissões.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg dark:bg-[#1A1A1A]">
      <h2 className="text-3xl font-semibold text-[#734230] mb-8 dark:text-[#F5F5F5] text-center">
        Criar Novo Produto
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
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
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          required
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
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full md:col-span-2 lg:col-span-3 p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] resize-none dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
          rows={4}
          required
        />
        <input
          type="file"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
          className="w-full md:col-span-2 lg:col-span-3 p-3 border border-[#61B785] rounded-md focus:outline-none focus:ring-2 focus:ring-[#61B785] dark:bg-[#1A1A1A] dark:text-[#F5F5F5]"
        />
        <div className="lg:col-span-3 md:col-span-2">
          <button
            type="submit"
            className={`w-full p-3 bg-[#61B785] text-white rounded-md hover:bg-[#734230] transition-colors duration-300 ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Criar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreateProductPage);
