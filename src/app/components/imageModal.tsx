import React from 'react';
import Modal from './modal';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText }) => {
  // Adiciona o domínio completo ao URL da imagem
  const fullImageUrl = `http://localhost:5207${imageUrl}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-center items-center animate-fadeIn">
        <img
          src={fullImageUrl}
          alt={altText}
          className="max-w-full max-h-[80vh] object-contain"
          loading="lazy"
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
