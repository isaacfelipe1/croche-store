import React, { memo } from 'react';
import Modal from './modal';

interface ContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContatoModal: React.FC<ContatoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-[#734230]">Fale Conosco</h2>
      <p className="text-gray-700 mb-4">
        Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de mais informações, entre em contato conosco através dos seguintes meios:
      </p>
      <ul className="text-gray-700 mb-4">
        <li>
          <strong>Email:</strong> <a href="mailto:amorcroche5252@gmail.com" className="text-blue-500 underline">amorcroche5252@gmail.com</a>
        </li>
        <li><strong>Whatsapp:</strong> (92) 99192-8559</li>
        <li><strong>Endereço:</strong>Itacoatiara-Amazonas.</li>
      </ul>
      <p className="text-gray-700">
        Ou envie-nos uma mensagem diretamente no nosso WhatsApp.
      </p>
    </Modal>
  );
};

export default memo(ContatoModal);
