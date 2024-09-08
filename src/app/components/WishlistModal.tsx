import React, { useEffect, useState } from 'react';
import Modal from './modal'; 
import { getProducts, Product } from '../api'

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setLoading(true);
      try {
        // Recupera os IDs dos produtos favoritos do Local Storage
        const savedFavoritesIds = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');

        // Busca todos os produtos da API
        const allProducts = await getProducts();

        // Filtra apenas os produtos que estão na lista de favoritos
        const filteredProducts = allProducts.filter(product =>
          savedFavoritesIds.includes(product.id)
        );

        setFavoriteProducts(filteredProducts);
      } catch (error) {
        setError('Erro ao carregar produtos favoritos.');
        console.error('Erro ao buscar produtos favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchFavoriteProducts();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-[#734230]">Minha Lista de Desejos</h2>
      {loading ? (
        <p className="text-gray-700">Carregando produtos favoritos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : favoriteProducts.length === 0 ? (
        <p className="text-gray-700">Sua lista de desejos está vazia.</p>
      ) : (
        <ul>
          {favoriteProducts.map((product) => (
            <li key={product.id} className="mb-4 flex items-center">
              <img
                src={`http://localhost:5207${product.imageUrl}`}
                alt={product.name}
                className="w-16 h-16 mr-4 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold text-[#432721]">{product.name}</h3>
                <p className="text-sm text-[#432721]">
                  Preço: R${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default WishlistModal;
