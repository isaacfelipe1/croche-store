import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  onLoginRequired: () => void; 
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onClick }) => {
  return (
    <button
      className="absolute top-2 right-2 text-[#E56446] hover:text-[#432721] transition-colors duration-200"
      onClick={onClick}
    >
      {isFavorite ? <FaHeart size={30} /> : <FaRegHeart size={30} />}
    </button>
  );
};

export default FavoriteButton;
