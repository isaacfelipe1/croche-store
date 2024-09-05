"use client";
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsappButtonProps {
  phoneNumber: string;
  message: string;
  isLoggedIn: boolean; 
}

const WhatsappButton: React.FC<WhatsappButtonProps> = ({ phoneNumber, message, isLoggedIn }) => {
  const handleClick = () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para realizar a compra.');
      return;
    }

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
    >
      <FaWhatsapp className="mr-2 text-xl" /> Comprar via WhatsApp
    </button>
  );
};

export default WhatsappButton;
