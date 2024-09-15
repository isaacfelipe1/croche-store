import React from 'react';
import Modal from './modal';
import Image from 'next/image';

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
        <Image
          src={imageUrl} 
          alt={altText}
          width={1000}
          height={1000}
          className="max-w-full max-h-[80vh] object-contain"
          loading="lazy"
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
