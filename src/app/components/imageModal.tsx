import React from 'react';
import Modal from './modal';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

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
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="flex justify-between w-full mb-2 space-x-4">
                {/* Botões de controle de zoom */}
                <button
                  onClick={() => zoomIn()}  
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <FaSearchPlus size={20} />
                </button>
                <button
                  onClick={() => zoomOut()}  
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <FaSearchMinus size={20} />
                </button>
                <button
                  onClick={() => resetTransform()}  
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
              <TransformComponent>
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={1000}
                  height={1000}
                  className="max-w-full max-h-[80vh] object-contain"
                  loading="lazy"
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </Modal>
  );
};

export default ImageModal;
