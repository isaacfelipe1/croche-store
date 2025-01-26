import React from 'react';
import Modal from './modal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { FaSearchPlus } from 'react-icons/fa';
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
      <div className="flex flex-col items-center justify-center animate-fadeIn">
        <div className="overflow-hidden flex justify-center items-center max-w-full max-h-screen">
          <Zoom>
            <Image
              src={imageUrl}
              alt={altText}
              className="max-w-full max-h-[80vh] object-contain"  
              style={{ width: 'auto', height: 'auto' }}  
              width={500}
              height={500}
            />
          </Zoom>
        </div>
        
main
      </div>
    </Modal>
  );
};

export default ImageModal;
