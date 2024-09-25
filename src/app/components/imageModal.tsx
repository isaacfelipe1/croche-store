import React from 'react';
import Modal from './modal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { FaSearchPlus } from 'react-icons/fa';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center animate-fadeIn">
        <div className="overflow-hidden flex justify-center items-center max-w-full max-h-screen">
          <Zoom>
            <img
              src={imageUrl}
              alt={altText}
              className="max-w-full max-h-[80vh] object-contain"  // Limita o tamanho da imagem e mantém a proporção
              style={{ width: 'auto', height: 'auto' }}  // Garante que a imagem se ajuste corretamente
            />
          </Zoom>
        </div>

        {/* Botão de zoom */}
        <button
          className="mt-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center"
        >
          <FaSearchPlus size={20} />
          <span className="ml-2">Ampliar Imagem</span>
        </button>
      </div>
    </Modal>
  );
};

export default ImageModal;
