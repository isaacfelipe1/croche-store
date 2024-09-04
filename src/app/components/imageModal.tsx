// src/components/ImageModal.tsx
import React from 'react';
import Modal from './modal';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-center items-center animate-fadeIn"> {/* Classe de animação adicionada */}
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-[80vh] object-contain"
          loading="lazy"
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
