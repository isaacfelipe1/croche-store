// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg max-w-xl w-full">
        {/* Botão de Fechar maior e reposicionado */}
        <button
          onClick={onClose}
          className="absolute right-3 text-gray-500 hover:text-gray-700"
          style={{ top: '-1.0rem', right: '1rem', fontSize: '2.5rem' }} // Aumenta o tamanho do botão
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
