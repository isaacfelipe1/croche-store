'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaWhatsapp, FaSpinner } from 'react-icons/fa';
import { getProducts, Product } from '../app/api';
import dynamic from 'next/dynamic';
import CategoryFilter from '../app/components/categoryFilter';
import { parseCookies } from 'nookies';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import FavoriteButton from './components/FavoriteButton';

// Carregamento dinâmico dos modais
const ImageModal = dynamic(() => import('../app/components/imageModal'));
const LoginRequiredModal = dynamic(() => import('../app/components/LoginRequiredModal'));
const Alert = dynamic(() => import('../app/components/alert'));
const SearchInput = dynamic(() => import('../app/components/SearchInput'));

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<{ url: string; alt: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Verificar o token ao carregar a página
    const cookies = parseCookies();
    const token = cookies.token;
    
    if (token) {
      setIsLoggedIn(true); // Atualiza o estado de login
    }

    // Carregar favoritos do localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    setFavoriteProducts(savedFavorites);

    // Monitora mudanças no localStorage para login
    const handleStorageChange = () => {
      const updatedToken = parseCookies().token;
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  }, [selectedCategory, searchTerm, products]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setVisibleCount((prevCount) => prevCount + 6);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    const cookies = parseCookies(); 
    const token = cookies.token;

    if (!token) {
      setModalMessage('Você precisa estar logado para favoritar um produto.');
      setIsLoginModalOpen(true);
      return;
    }

    const updatedFavorites = favoriteProducts.includes(productId)
      ? favoriteProducts.filter((id) => id !== productId)
      : [...favoriteProducts, productId];

    setFavoriteProducts(updatedFavorites);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavorites));
  }, [favoriteProducts]);
  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    [setSearchTerm]
  );
  const handleWhatsappRedirect = useCallback((product: Product) => {
    const cookies = parseCookies();
    const token = cookies.token;

    if (!token) {
      setModalMessage('Você precisa estar logado para realizar a compra.');
      setIsLoginModalOpen(true);
      return;
    }

    const phoneNumber = '5592991928559';
    const message = `Olá!\nEstou interessado em comprar o produto: *${product.name}*\nCor: _${product.color}_\nPreço: *R$${product.price.toLocaleString(
      'pt-BR',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}*\nO produto é este: ${product.imageUrl}`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    setPurchaseFeedback('Redirecionando para o WhatsApp...');
    setTimeout(() => setPurchaseFeedback(null), 3000);
  }, []);

  const openImageModal = useCallback((imageUrl: string, altText: string) => {
    setCurrentImage({ url: imageUrl, alt: altText });
    setIsImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setCurrentImage(null);
    setIsImageModalOpen(false);
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#432721]" />
        <p className="ml-2 text-center text-lg mt-4">Carregando produtos...</p>
      </div>
    );
   
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoginModalOpen && modalMessage && (
        <LoginRequiredModal
          message={modalMessage}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}

      {purchaseFeedback && <p className="text-center text-green-500 mb-4">{purchaseFeedback}</p>}

      <div className="flex justify-center mt-14 mb-6">
        <SearchInput value={searchTerm} onChange={(e) => debouncedSearch(e.target.value)} />
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:mr-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="w-full md:w-3/4">
          {filteredProducts.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.slice(0, visibleCount).map((product) => (
                <li
                  key={product.id}
                  className="bg-[#FDFDFD] border border-[#432721] rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden mx-2 sm:mx-0 flex flex-col justify-between"
                >
                  <div className="overflow-hidden rounded-t-lg cursor-pointer relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                      width={500}
                      height={500}
                      loading="lazy" 
                      onClick={() => openImageModal(product.imageUrl, product.name)}
                    />
                    <FavoriteButton
                      isFavorite={favoriteProducts.includes(product.id)}
                      onClick={() => toggleFavorite(product.id)}
                      onLoginRequired={() => setModalMessage('Você precisa estar logado para favoritar um produto.')}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div className="flex-grow">
                      <h2 className="text-lg font-semibold text-[#432721] mb-2 hover:text-[#E56446] transition-colors duration-200">
                        {product.name}
                      </h2>
                      <p className="text-base text-[#432721] mb-1 font-semibold">
                        Preço:{' '}
                        <span className="text-[#E56446] font-bold text-xl">
                          R$
                          {product.price.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                      {product.description === 'Feito por encomenda' && (
                        <p className="text-sm text-[#432721] mb-2 font-bold">
                          {product.description}
                        </p>
                      )}

                      <p className="text-sm text-[#432721] mb-2 font-bold">
                        Cor: <span className="font-medium">{product.color}</span>
                      </p>
                      <p className="text-sm text-[#432721] mb-2 font-bold">
                        Tamanho: <span className="font-medium">{product.size}</span>{' '}
                      </p>
                    </div>

                    <div className="mt-auto">
                      {product.description === 'Feito por encomenda' ? (
                        <button
                          onClick={() => handleWhatsappRedirect(product)}
                          className="w-full py-2 px-4 bg-[#61B785] text-white rounded hover:bg-[#734230] transition-colors duration-200"
                        >
                          Encomendar
                        </button>
                      ) : (
                        <>
                          <p className="text-sm text-[#432721] mb-2 font-bold">
                            Quantidade: <span className="font-medium">{product.stockQuantity} Un</span>
                          </p>
                          {product.stockQuantity < 2 ? (
                            <p className="text-[#E56446] font-bold text-sm mb-2">
                              Compre já, poucas unidades!
                            </p>
                          ) : (
                            <p className="text-[#61B785] font-bold text-sm mb-2">Em estoque</p>
                          )}
                          <button
                            onClick={() => handleWhatsappRedirect(product)}
                            className="w-full py-2 px-4 bg-[#5bb75b] text-white rounded hover:bg-[#44a044] transition-colors duration-200 flex items-center justify-center rounded-full"

                          >
                            <FaWhatsapp className="mr-2 text-xl" /> Comprar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-red-500">Nenhum produto encontrado com o nome informado.</p>
          )}
        </div>
      </div>

      {currentImage && (
        <ImageModal isOpen={isImageModalOpen} onClose={closeImageModal} imageUrl={currentImage.url} altText={currentImage.alt} />
      )}
    </div>
  );
};

export default React.memo(ProductsList);
