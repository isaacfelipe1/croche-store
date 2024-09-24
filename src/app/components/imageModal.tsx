import React from 'react';
import Modal from './modal';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-center items-center animate-fadeIn">
        <TransformWrapper>
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
        </TransformWrapper>
      </div>
    </Modal>
  );
};

export default ImageModal;
