'use client';
import React from 'react';

interface AlertProps {
  message: string;
  onClose: () => void;
}
const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full p-4 bg-[#E56446] text-white text-center z-50 shadow-md">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-2 text-sm underline hover:text-[#432721] transition"
      >
        Fechar
      </button>
    </div>
  );
};

export default Alert;
