"use client";
import React, { useEffect, useState, memo } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { getProducts, Product } from '../app/api';
import CategoryFilter from '../app/components/categoryFilter';
import ImageModal from '../app/components/imageModal'; 

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data); 
      } catch (error) {
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleWhatsappPurchase = (product: Product) => {
    const phoneNumber = "5581999999999"; 
    const message = `Olá! Estou interessado em comprar o produto ${product.name} na cor ${product.color} por R$${product.price}.`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const openImageModal = (imageUrl: string, altText: string) => {
    setCurrentImage({ url: imageUrl, alt: altText });
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setCurrentImage(null);
    setIsImageModalOpen(false);
  };

  const categories = Array.from(new Set(products.map((product) => product.category)));

  if (loading) return <p className="text-center text-lg mt-4">Carregando produtos...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#432721]">Tapetes Crochê</h1>
      
      {/* Campo de Pesquisa Centralizado */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Pesquisar por nome do produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:border-[#61B785]"
        />
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Componente de Filtro de Categorias */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:mr-8">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory} 
          />
        </div>

        {/* Lista de Produtos */}
        <div className="w-full md:w-3/4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <li key={product.id} className="bg-[#FDFDFD] border border-[#432721] rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden mx-2 sm:mx-0">
                <div className="overflow-hidden rounded-t-lg cursor-pointer" onClick={() => openImageModal(product.imageUrl, product.name)}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-[#432721] mb-2">{product.name}</h2>
                  <p className="text-[#432721] mb-1">Preço: <span className="text-[#E56446] font-bold">R${product.price}</span></p>
                  <p className="text-[#432721] mb-2">Cor: {product.color}</p>
                  {product.stockQuantity < 2 ? (
                    <p className="text-[#E56446] font-bold mb-2">Quase acabando!</p>
                  ) : product.stockQuantity >= 2 ? (
                    <p className="text-[#61B785] font-bold mb-2">Em estoque</p>
                  ) : null}
                  <button 
                    onClick={() => handleWhatsappPurchase(product)} 
                    className="w-full py-2 px-4 bg-[#E56446] text-white rounded hover:bg-[#432721] transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2 text-xl" /> Comprar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {/* Botão Ver Mais */}
          {filteredProducts.length > visibleCount && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleShowMore} 
                className="py-2 px-4 bg-[#432721] text-white rounded hover:bg-[#E56446] transition-colors duration-200"
              >
                Ver mais
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Imagem */}
      {currentImage && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
          imageUrl={currentImage.url}
          altText={currentImage.alt}
        />
      )}
    </div>
  );
};

export default memo(ProductsList);
