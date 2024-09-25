import React from 'react';
import Modal from './modal';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

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
          <InnerImageZoom
            src={imageUrl}
            zoomSrc={imageUrl} // Imagem de alta resolução para o zoom
            alt={altText}
            className="max-w-full max-h-[80vh] object-contain"  // Limita o tamanho da imagem
            zoomType="hover"  // Ou "click" para ampliar ao clicar
          />
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
